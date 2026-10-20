#!/usr/bin/env node
// Regenerates derived skills from their pinned upstream commits (upstream.json).
// The part of each SKILL.md above "## Field notes" is generated; everything from that heading down is ours and is preserved.
//
//   node scripts/port.mjs            write skills
//   node scripts/port.mjs --check    exit 1 if any generated half drifted from upstream
//   PORT_CACHE=/tmp/x node scripts/port.mjs   reuse clones
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const CHECK = process.argv.includes("--check");
const CACHE = process.env.PORT_CACHE ?? join(tmpdir(), "field-tested-skills-port");
const manifest = JSON.parse(readFileSync(join(ROOT, "upstream.json"), "utf8"));
const FIELD_NOTES = "\n## Field notes\n";
// Absolute, so links still work after a skill folder is copied out of this repo.
const REPO_URL = "https://github.com/imaginaerumai/field-tested-skills/blob/main/";
const SPEC_KEEP = new Set(["name", "description", "license", "compatibility", "allowed-tools"]);

const git = (cwd, ...args) => execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString();

function checkout(source, paths) {
  const dir = join(CACHE, source.repo.replace("/", "__"));
  if (!existsSync(join(dir, ".git"))) {
    mkdirSync(dir, { recursive: true });
    git(dir, "init", "-q");
    git(dir, "remote", "add", "origin", `https://github.com/${source.repo}.git`);
  }
  git(dir, "sparse-checkout", "set", "--no-cone", ...paths.map((p) => (p === "." ? "/*" : `/${p}/`)));
  git(dir, "fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", source.commit);
  git(dir, "checkout", "-q", "FETCH_HEAD");
  return dir;
}

function splitFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error("upstream SKILL.md has no frontmatter");
  const fields = [];
  for (const line of m[1].split("\n")) {
    if (/^\S/.test(line)) fields.push({ key: line.split(":")[0], lines: [line] });
    else fields.at(-1).lines.push(line);
  }
  return { fields, body: text.slice(m[0].length) };
}

const code = (s) => (s.includes("`") ? `\`\` ${s} \`\``: `\`${s}\``);
const yamlStr = (s) => (/[:#'"\n]|^\s|\s$/.test(s) ? JSON.stringify(s) : s);
const heading = (name) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

function build(skill, upstreamDir) {
  const source = manifest.sources[skill.source];
  const srcDir = join(upstreamDir, skill.path);
  let text = readFileSync(join(srcDir, "SKILL.md"), "utf8");
  for (const e of skill.edits) {
    const n = text.split(e.find).length - 1;
    if (n !== 1) throw new Error(`${skill.name}: edit must match exactly once, matched ${n}: ${e.find}`);
    text = text.replace(e.find, e.replace);
  }
  const { fields, body } = splitFrontmatter(text);
  const dropped = fields.filter((f) => !SPEC_KEEP.has(f.key) && f.key !== "metadata").map((f) => f.lines.join("\n"));
  const upstreamVersion = fields.find((f) => f.key === "metadata")?.lines.join("\n").match(/version:\s*"?([^"\n]+)"?/)?.[1];

  const fm = ["---"];
  for (const f of fields.filter((f) => SPEC_KEEP.has(f.key))) {
    if (f.key === "description" && skill.description) fm.push(`description: ${yamlStr(skill.description)}`);
    else if (f.key === "license") fm.push(`license: ${source.license}`);
    else fm.push(...f.lines);
  }
  if (!fields.some((f) => f.key === "license")) fm.splice(3, 0, `license: ${source.license}`);
  const tree = `https://github.com/${source.repo}/tree/${source.commit}/${skill.path === "." ? "" : skill.path}`.replace(/\/$/, "/");
  fm.push("metadata:", `  author: ${yamlStr(source.author)}`, "  adapted-by: Marcin Jeziorek",
    `  upstream: ${tree}`, `  upstream-license: ${source.licenseFile}`);
  if (upstreamVersion) fm.push(`  upstream-version: "${upstreamVersion}"`);
  fm.push("---", "", "");

  const origin = [
    `> **Origin.** Written by ${source.author} in [${source.repo}](https://github.com/${source.repo}) (${source.license}), pinned at \`${source.commit.slice(0, 7)}\`.`,
    "> The upstream text below is verbatim except the edits listed in [UPSTREAM.md](UPSTREAM.md). Our additions live under **Field notes** at the end.",
  ].join("\n");
  const trimmed = body.replace(/^\n+/, "");
  const h1 = trimmed.match(/^# .+\n/);
  const upstreamHalf = h1
    ? `${h1[0]}\n${origin}\n\n${trimmed.slice(h1[0].length).replace(/^\n+/, "")}`
    : `# ${heading(skill.name)}\n\n${origin}\n\n${trimmed}`;

  const upstreamMd = [
    `# Upstream: ${skill.name}`, "",
    `- Source: https://github.com/${source.repo}`,
    `- Path: \`${skill.path}\``,
    `- Commit: \`${source.commit}\``,
    `- Author: ${source.author}`,
    `- License: ${source.license}, full text in [\`${source.licenseFile}\`](${REPO_URL}${source.licenseFile})`,
    "", "Regenerate with `node scripts/port.mjs`. Never hand-edit the part of SKILL.md above `## Field notes`.", "",
    "## Changes from upstream", "",
    ...(skill.description ? ["- Description rewritten to state when to use the skill (Agent Skills spec recommends what + when)."] : []),
    ...skill.edits.map((e) => `- Replaced ${code(e.find)} with ${code(e.replace)}. Reason: ${e.reason}.`),
    ...dropped.map((d) => `- Dropped non-spec frontmatter ${code(d.split("\n")[0])}. Agents that support it can add it back locally.`),
    "- Added the Origin note and the Field notes section.",
    "",
  ].join("\n");

  return { srcDir, frontmatter: fm.join("\n"), upstreamHalf, upstreamMd };
}

let drift = 0;
const bySource = Object.groupBy(manifest.skills, (s) => s.source);
for (const [sourceKey, skills] of Object.entries(bySource)) {
  const upstreamDir = checkout(manifest.sources[sourceKey], skills.map((s) => s.path));
  for (const skill of skills) {
    const out = join(ROOT, "skills", skill.category, skill.name);
    const target = join(out, "SKILL.md");
    const { srcDir, frontmatter, upstreamHalf, upstreamMd } = build(skill, upstreamDir);
    const existing = existsSync(target) ? readFileSync(target, "utf8") : "";
    const notesAt = existing.indexOf(FIELD_NOTES);
    const notes = notesAt >= 0 ? existing.slice(notesAt) : `${FIELD_NOTES}\nNone yet.\n`;
    const next = `${frontmatter}${upstreamHalf.replace(/\n+$/, "\n")}${notes}`;
    if (CHECK) {
      if (next !== existing) { drift++; console.error(`✗ drift: ${relative(ROOT, target)}`); }
      continue;
    }
    mkdirSync(out, { recursive: true });
    for (const entry of readdirSync(srcDir)) {
      if (entry === "SKILL.md" || (skill.include && !skill.include.includes(entry))) continue;
      cpSync(join(srcDir, entry), join(out, entry), { recursive: statSync(join(srcDir, entry)).isDirectory() });
    }
    writeFileSync(target, next);
    writeFileSync(join(out, "UPSTREAM.md"), upstreamMd);
    console.log(`✓ ${relative(ROOT, target)}`);
  }
}
if (drift) process.exit(1);
