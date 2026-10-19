#!/usr/bin/env node
// Validates every skill against the Agent Skills spec plus this repo's conventions.
// Zero dependencies. Exit code 1 on any failure.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const SKILLS = join(ROOT, "skills");
const SPEC_FIELDS = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_LINES = 500;
// Employer and internal identifiers that must never ship. The list itself is private: one regex
// alternative per line in .private-terms (gitignored). CI runs without it; run locally before pushing.
const termsFile = join(ROOT, ".private-terms");
const terms = existsSync(termsFile) ? readFileSync(termsFile, "utf8").split("\n").map((t) => t.trim()).filter(Boolean) : [];
const PRIVATE = terms.length ? new RegExp(terms.join("|"), "i") : null;
// Credential shapes: GitHub, OpenAI-style, AWS, Slack tokens, private keys, inline secret assignments.
const SECRET = /gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[abpr]-[A-Za-z0-9-]+|-----BEGIN [A-Z ]*PRIVATE KEY|(api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"\s]{12,}['"]/i;
// Hidden or covert instructions aimed at third-party agents. This repo does not do that.
const INJECTION = /if you('| a)re an ai|ignore (all )?previous instructions|recruit(er|ment) (agent|ai)/i;

const errors = [];
const fail = (file, msg) => errors.push(`${relative(ROOT, file)}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function parseFrontmatter(text, file) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return fail(file, "missing YAML frontmatter"), null;
  const out = {};
  const lines = m[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith(" ")) continue;
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (!kv) { fail(file, `unparseable frontmatter line: ${line}`); continue; }
    const [, key, raw] = kv;
    const block = [];
    while (i + 1 < lines.length && lines[i + 1].startsWith("  ")) block.push(lines[++i]);
    if (key === "metadata") {
      out.metadata = {};
      for (const b of block) {
        const mk = b.trim().match(/^([a-zA-Z0-9-]+):\s*(.*)$/);
        if (!mk) { fail(file, `bad metadata line: ${b}`); continue; }
        if (!/^".*"$/.test(mk[2]) && /^\d/.test(mk[2])) fail(file, `metadata.${mk[1]} must be a quoted string`);
        out.metadata[mk[1]] = mk[2].replace(/^"|"$/g, "");
      }
    } else if (raw === ">-" || raw === ">" || raw === "|") {
      out[key] = block.map((b) => b.trim()).join(" ");
    } else {
      out[key] = raw.replace(/^"|"$/g, "");
    }
  }
  return { fm: out, body: text.slice(m[0].length) };
}

const skillFiles = walk(SKILLS).filter((f) => f.endsWith("/SKILL.md"));
const names = new Map();

for (const file of skillFiles) {
  const dir = dirname(file);
  const text = readFileSync(file, "utf8");
  const parsed = parseFrontmatter(text, file);
  if (!parsed) continue;
  const { fm, body } = parsed;

  for (const k of Object.keys(fm)) if (!SPEC_FIELDS.has(k)) fail(file, `non-spec frontmatter field "${k}" (see docs/conventions.md)`);
  if (!fm.name || !NAME_RE.test(fm.name) || fm.name.length > 64) fail(file, `invalid name "${fm.name}"`);
  if (fm.name !== dir.split("/").pop()) fail(file, `name "${fm.name}" must equal folder name`);
  if (names.has(fm.name)) fail(file, `duplicate skill name, also in ${names.get(fm.name)}`);
  names.set(fm.name, relative(ROOT, file));
  if (!fm.description || fm.description.length > 1024) fail(file, `description must be 1-1024 chars (got ${fm.description?.length ?? 0})`);
  if (fm.description && !/\buse (when|for|this|after|before|at)\b/i.test(fm.description)) fail(file, "description must say when to use the skill");
  if (!fm.license) fail(file, "missing license");
  if (text.split("\n").length > MAX_LINES) fail(file, `over ${MAX_LINES} lines; move detail to references/`);

  const md = fm.metadata ?? {};
  if (!md.author) fail(file, "metadata.author required");
  if (md.upstream) {
    if (!/^https:\/\/github\.com\/.+\/tree\/[0-9a-f]{7,40}\//.test(md.upstream)) fail(file, "metadata.upstream must pin a commit: https://github.com/<o>/<r>/tree/<sha>/<path>");
    if (!md["upstream-license"] || !existsSync(join(ROOT, md["upstream-license"]))) fail(file, "metadata.upstream-license must point to a file in licenses/");
    if (!/^#[^\n]+\n+> \*\*Origin\.\*\*/.test(body.trimStart())) fail(file, "derived skill must open with a '> **Origin.**' note right after the H1");
    if (!existsSync(join(dir, "UPSTREAM.md"))) fail(file, "derived skill needs UPSTREAM.md");
  } else if (md["inspired-by"]) {
    if (!/^#[^\n]+\n+> \*\*Origin\.\*\*/.test(body.trimStart())) fail(file, "skill with metadata.inspired-by must open with a '> **Origin.**' note crediting the source");
    for (const lic of (md["inspired-by-license"] ?? "").split(/\s+/).filter(Boolean)) if (!existsSync(join(ROOT, lic))) fail(file, `inspired-by-license not found: ${lic}`);
    if (/—/.test(body)) fail(file, "original skills use no em dashes (docs/conventions.md#prose)");
  } else if (/—/.test(body)) {
    fail(file, "original skills use no em dashes (docs/conventions.md#prose)");
  }
}

// Repo-wide content checks on every tracked text file.
for (const file of walk(ROOT).filter((f) => !/\/(\.git|node_modules|licenses)\//.test(f) && /\.(md|mjs|sh|json|ya?ml|txt|env)$|\/scripts\/[^.]+$/.test(f))) {
    const text = readFileSync(file, "utf8");
  if (PRIVATE?.test(text)) fail(file, "private identifier from .private-terms");
  if (SECRET.test(text)) fail(file, "looks like a credential; remove it and rotate it");
  if (INJECTION.test(text)) fail(file, "covert instruction aimed at third-party agents");
  if (file.endsWith(".md")) for (const [, link] of text.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)/g)) {
    if (!existsSync(resolve(dirname(file), link))) fail(file, `broken relative link: ${link}`);
  }
}

// Bundled copies: principal-autopilot ships stopslop so it works with no install. The copies must not drift.
const BUNDLED = [
  ["skills/writing/stopslop/scripts/stopslop.mjs", "skills/autopilot/principal-autopilot/scripts/stopslop.mjs"],
  ["skills/writing/stopslop/references/patterns.md", "skills/autopilot/principal-autopilot/references/stopslop-patterns.md"],
];
for (const [src, copy] of BUNDLED) {
  const a = join(ROOT, src), b = join(ROOT, copy);
  if (!existsSync(b) || readFileSync(a, "utf8") !== readFileSync(b, "utf8")) fail(b, `must be a byte-identical copy of ${src}. Run: cp ${src} ${copy}`);
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\n${errors.length} problem(s) in ${skillFiles.length} skills.`);
  process.exit(1);
}
console.log(`✓ ${skillFiles.length} skills valid.${PRIVATE ? "" : " (no .private-terms: private-identifier scan skipped)"}`);
