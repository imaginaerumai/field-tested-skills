import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { lint } from "../skills/writing/stopslop/scripts/stopslop.mjs";

const CLI = fileURLToPath(new URL("../skills/writing/stopslop/scripts/stopslop.mjs", import.meta.url));
const rules = (text) => lint(text).map((h) => `${h.line}:${h.rule}`);

test("flags the tells that shipped in real sessions", () => {
  const text = [
    "# 🚀 Our Amazing Product Release Notes",
    "Let's dive in. The cache is not just faster but safer.",
    "It is significantly faster and this ensures correctness.",
    "The tool serves as a bridge — a seamless one.",
    "- **Speed:** much better",
    "I hope this helps!",
  ].join("\n");
  assert.deepEqual(rules(text), [
    "1:title-case", "1:emoji",
    "2:staged-opener", "2:not-x-but-y",
    "3:unbacked-claim", "3:guarantee",
    "4:copula-dodge", "4:dash", "4:hype",
    "5:bold-label",
    "6:chatbot",
  ]);
});

test("dashes and emojis are hard errors with no override", () => {
  assert.deepEqual(rules("Ship it – now. Done ✅"), ["1:dash", "1:emoji"]);
  assert.throws(() => execFileSync("node", [CLI, "--allow-dashes"], { input: "a — b" }), (e) => e.status === 2);
});

test("filler, long sentences, and repeated bold in one paragraph", () => {
  const long = Array.from({ length: 31 }, (_, i) => `w${i}`).join(" ") + ".";
  const text = ["In order to ship, run it.", "", long, "", "**One** bold is fine.", "", "**Two** bold **spans** are not.", "line two of the same paragraph"].join("\n");
  assert.deepEqual(rules(text), ["1:filler", "3:long-sentence", "7:bold-density"]);
});

test("ignores code fences, inline code, link targets, and URLs", () => {
  const text = [
    "Run `a -- b` first.",
    "```",
    "x = y — z // I hope this helps 🚀",
    "```",
    "See [docs](https://example.com/a--b—c) or https://example.com/delve.",
  ].join("\n");
  assert.deepEqual(rules(text), []);
});

test("CLI exits 1 on a hard hit, 0 on clean text, 2 on a bad flag", () => {
  const run = (input, ...args) => {
    try { execFileSync("node", [CLI, ...args], { input }); return 0; } catch (e) { return e.status; }
  };
  assert.equal(run("Ship it — now."), 1);
  assert.equal(run("The cache cut p95 latency from 120 ms to 40 ms."), 0);
  assert.equal(run("x", "--bogus"), 2);
});
