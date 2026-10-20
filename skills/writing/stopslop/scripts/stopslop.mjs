#!/usr/bin/env node
// stopslop lint: flags the mechanical AI-writing tells in prose. Zero dependencies.
//
//   stopslop.mjs README.md docs/*.md     lint files
//   pbpaste | stopslop.mjs               lint stdin
//   stopslop.mjs --json page.md          machine-readable
//
// Exit 0: no hard hits. Exit 1: at least one hard hit. Exit 2: bad usage.
// Code fences, inline code, URLs, and HTML comments are ignored.
import { readFileSync } from "node:fs";

const AI_WORDS = ["additionally", "bolstered", "crucial", "delve", "delves", "delving", "enduring", "garner", "interplay", "intricate", "intricacies", "meticulous", "meticulously", "pivotal", "showcase", "showcases", "showcasing", "tapestry", "testament", "underscore", "underscores", "vibrant", "embark", "unleash", "elevate", "empower", "holistic", "synergy", "paradigm", "landscape"];
const FILLER = ["in order to", "due to the fact that", "it is important to note that", "it's worth noting that", "it is worth noting that", "please note that", "note that", "at the end of the day", "in terms of", "for all intents and purposes", "as a matter of fact", "the fact that", "in the event that", "at this point in time", "a number of", "is able to", "are able to", "basically", "essentially", "actually", "really", "very"];
const MAX_SENTENCE_WORDS = 30;
const HYPE = ["seamless", "seamlessly", "effortless", "effortlessly", "cutting-edge", "game-changer", "game-changing", "blazing fast", "blazingly fast", "best-in-class", "world-class", "next-generation", "revolutionary", "supercharge", "battle-tested"];

// tier: hard fails the run. strong: act on one sighting. weak: act only with company.
const RULES = [
  { id: "dash", tier: "hard", re: /\u2014|\u2013| -- /g, msg: "dash; never allowed. Use a period, a comma, or parentheses" },
  { id: "chatbot", tier: "hard", re: /\b(I hope this helps|Great question|You'?re absolutely right|Certainly!|Of course!|Happy to help|Feel free to|Let me know if (you|that|this)|I'd be happy to)\b/gi, msg: "chatbot residue; delete the wrapper, keep the content" },
  { id: "staged-opener", tier: "hard", re: /(^|[.!?]\s+)(Let'?s (dive|explore|break (this|it) down|unpack)|Here'?s the thing|Here'?s what you need to know|Without further ado|Real talk|Honestly\?)/gim, msg: "staged run-up; start with the point" },
  { id: "emoji", tier: "hard", re: /\p{Extended_Pictographic}/gu, msg: "emoji; never allowed" },
  { id: "not-x-but-y", tier: "strong", re: /\bnot (just|only|merely|simply)\b[^.\n]{1,80}\bbut\b|\bit'?s not [^.,\n]{1,60}[,;] it'?s\b|\bisn'?t (about|just) [^.\n]{1,60}\. It'?s\b/gi, msg: "not-X-but-Y contrast; state the point directly" },
  { id: "closer", tier: "strong", re: /^(That'?s the (real )?(win|point|key)|That distinction matters|Read that again|Let that sink in|And that'?s (the|what) [a-z ]+)\.?$/gim, msg: "one-line closer that restates; cut it or add a fact" },
  { id: "unbacked-claim", tier: "strong", re: /\b(significantly|dramatically|massively|vastly|greatly|substantially) (faster|slower|better|smaller|larger|improv\w*|reduc\w*|increas\w*)\b/gi, msg: "comparative with no number; give the measured delta" },
  { id: "guarantee", tier: "strong", re: /\b(this|which|that) (ensures|guarantees|eliminates|prevents all)\b/gi, msg: "absolute claim; name the check that proves it or soften it" },
  { id: "copula-dodge", tier: "strong", re: /\b(serves as|stands as|acts as a testament|boasts)\b/gi, msg: "say is or has" },
  { id: "bold-label", tier: "strong", re: /^\s*[-*] \*\*[^*\n]{1,40}:\*\*/gm, msg: "bold-label list item; use prose or a plain list" },
  { id: "filler", tier: "strong", re: new RegExp(`\\b(${FILLER.join("|")})\\b`, "gi"), msg: "filler; cut it or use the short form" },
  { id: "ai-word", tier: "weak", re: new RegExp(`\\b(${AI_WORDS.join("|")})\\b`, "gi"), msg: "stock AI word; use the plain one" },
  { id: "hype", tier: "weak", re: new RegExp(`\\b(${HYPE.map((w) => w.replace("-", "[- ]")).join("|")})\\b`, "gi"), msg: "marketing word in technical text; state what it does" },
  { id: "curly-quote", tier: "weak", re: /[\u201C\u201D]/g, msg: "curly double quote; use straight quotes" },
];

function mask(text) {
  // Replace ignored regions with spaces of equal length so line and column numbers survive.
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text
    .replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/`[^`\n]+`/g, blank)
    .replace(/\]\([^)\n]*\)/g, blank)
    .replace(/https?:\/\/\S+/g, blank);
}

// Bold earns its place once per paragraph at most. A list or table block counts as one paragraph.
function boldDensity(masked) {
  const hits = [];
  let start = -1, count = 0;
  const flush = () => {
    if (count > 1) hits.push({ rule: "bold-density", tier: "strong", line: start + 1, col: 1, match: `${count} bold spans`, msg: "bold at most once per paragraph" });
    start = -1; count = 0;
  };
  masked.split("\n").forEach((line, i) => {
    if (!line.trim()) { flush(); return; }
    if (start < 0) start = i;
    count += (line.match(/\*\*[^*\n]+\*\*/g) ?? []).length;
  });
  flush();
  return hits;
}

// Prose sentences only: skip headings, table rows, and code (already masked).
function longSentences(masked) {
  const hits = [];
  masked.split("\n").forEach((raw, i) => {
    if (/^\s*(#|\||>?\s*$)/.test(raw)) return;
    const text = raw.replace(/^\s*([-*]|\d+\.)\s+/, "").replace(/\*\*|__/g, "");
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const words = sentence.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
      if (words > MAX_SENTENCE_WORDS) hits.push({ rule: "long-sentence", tier: "strong", line: i + 1, col: raw.indexOf(sentence.trim().slice(0, 12)) + 1, match: `${words} words`, msg: `over ${MAX_SENTENCE_WORDS} words; split it or cut words` });
    }
  });
  return hits;
}

function titleCaseHeadings(masked) {
  const hits = [];
  masked.split("\n").forEach((line, i) => {
    const m = line.match(/^#{1,6} (.+)$/);
    if (!m) return;
    const words = m[1].split(/\s+/).filter((w) => /^[A-Za-z]{4,}$/.test(w));
    if (words.length >= 3 && words.slice(1).every((w) => /^[A-Z]/.test(w))) {
      hits.push({ rule: "title-case", tier: "weak", line: i + 1, col: 1, match: m[1], msg: "title case heading; use sentence case" });
    }
  });
  return hits;
}

export function lint(text, { rules } = {}) {
  const masked = mask(text);
  const starts = [0];
  for (let i = 0; i < masked.length; i++) if (masked[i] === "\n") starts.push(i + 1);
  const pos = (idx) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= idx) lo = mid; else hi = mid - 1; }
    return { line: lo + 1, col: idx - starts[lo] + 1 };
  };
  const hits = [];
  for (const r of RULES) {
    for (const m of masked.matchAll(r.re)) {
      const offset = m[0].length - m[0].trimStart().length;
      hits.push({ rule: r.id, tier: r.tier, ...pos(m.index + offset), match: m[0].trim(), msg: r.msg });
    }
  }
  hits.push(...titleCaseHeadings(masked), ...boldDensity(masked), ...longSentences(masked));
  return hits.filter((h) => !rules || rules.includes(h.rule)).sort((a, b) => a.line - b.line || a.col - b.col);
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const files = argv.filter((a) => !a.startsWith("--"));
  for (const f of flags) if (!["--json", "--help"].includes(f)) {
    console.error(`stopslop: unknown option ${f}`); return 2;
  }
  if (flags.has("--help")) { console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 10).join("\n").replace(/^\/\/ ?/gm, "")); return 0; }
  let inputs;
  try {
    inputs = files.length ? files.map((f) => [f, readFileSync(f, "utf8")]) : [["<stdin>", readFileSync(0, "utf8")]];
  } catch (e) {
    console.error(`stopslop: cannot read ${e.path ?? "stdin"} (${e.code}). Pass existing files, or pipe text in.`);
    return 2;
  }
  const all = inputs.flatMap(([name, text]) => lint(text).map((h) => ({ file: name, ...h })));
  const hard = all.filter((h) => h.tier === "hard").length;
  if (flags.has("--json")) console.log(JSON.stringify(all, null, 2));
  else {
    for (const h of all) console.log(`${h.file}:${h.line}:${h.col}  ${h.tier.padEnd(6)} ${h.rule.padEnd(14)} "${h.match}"  ${h.msg}`);
    const by = (t) => all.filter((h) => h.tier === t).length;
    console.log(`stopslop: ${by("hard")} hard, ${by("strong")} strong, ${by("weak")} weak`);
  }
  return hard ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("/stopslop.mjs")) process.exitCode = main(process.argv.slice(2));
