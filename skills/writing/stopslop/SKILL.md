---
name: stopslop
description: Write and edit prose as clean, technical, professional text with no AI tells, and gate it with a linter on the exact text that ships. Use for READMEs, docs, PR descriptions, commit messages, release notes, tickets, published pages, and replies, or when the user says stop slop or "this sounds like AI".
license: MIT
metadata:
  author: Marcin Jeziorek
  version: "2.0.0"
  inspired-by: "humanizer by Siqi Chen (blader, MIT); unslop by Lauren Tan (pstack, MIT); Wikipedia: Signs of AI writing"
  inspired-by-license: licenses/humanizer.MIT.txt licenses/pstack.MIT.txt
---

# stopslop

> **Origin.** Written by Marcin Jeziorek. The pattern groups follow Siqi Chen's [humanizer](https://github.com/blader/humanizer) (MIT). Some rules come from Lauren Tan's `unslop` in [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT). Both draw on Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). New here: a linter that gates shipped text, an engineering writing standard, and a workflow built from 36 logged sessions.

## The standard

Every piece of text meets all six rules. They have no exceptions.

1. No em dashes or en dashes, ever. Use a period, a comma, or parentheses. A writing sample that uses dashes does not change this.
2. No emojis, ever.
3. Each sentence states one technical fact, instruction, or decision in plain professional language.
4. Use the fewest words that keep the meaning. Cut every word that does not change what the reader knows or does.
5. Bold at most once per paragraph, and only for the one thing a skimming reader must not miss.
6. The text is one complete structure. It opens with the conclusion or the purpose. Sections follow in the order the reader needs them. Nothing is repeated, nothing is left dangling, and no closing summary restates the body.

## Why a linter

Rules alone fail at the last step. In logged sessions (method in [docs/field-data.md](../../../docs/field-data.md)), a page shipped with 13 em dashes while a skill banning them was loaded. [scripts/stopslop.mjs](scripts/stopslop.mjs) checks the mechanical rules on the exact bytes that ship. Rules 3, 4, and 6 also need your judgment.

## Steps

1. Get the current text. For a published page or shared doc, fetch the live version now. The user may have edited it since your last read.
2. Lint it with `node scripts/stopslop.mjs <file>`, or pipe the text in.
3. Read it against [references/patterns.md](references/patterns.md) for the tells a script cannot see.
4. Rewrite whole sentences around their point. Keep every supported fact, name, number, and link. Add no fact the source or the user did not give you. Leave sentences the user wrote unchanged unless they asked.
5. Lint the exact payload you will publish, commit, or send. The bar is zero `hard` hits. Fix each `strong` hit or state why it stays.
6. Report in one line: `stopslop: <n> hard and <n> strong fixed, <n> kept (reason).`

## Modes

| Surface | Output |
|---|---|
| Chat reply | The clean reply. No report line unless asked. |
| Commit message, PR description | The final text only. |
| File | Edit prose only. Code, commands, paths, YAML, and link targets stay byte-identical. Then the report line. |
| Published page | Fetch live, edit, lint the payload, publish, report. |
| Review only | Lint output and a ranked list of judgment tells. No rewrite. |

## Engineering writing

| Write | Not |
|---|---|
| `p95 fell from 120 ms to 40 ms on 10k requests` | `significantly faster` |
| `test_retry covers the timeout path` | `this ensures reliability` |
| PR description that opens with the effect on the caller, then how it was verified | PR description that opens with implementation history |
| `Fix row drop when batch exceeds 1000` | `Improve export robustness` |
| A comment that explains why | A comment that narrates what changed |
| `Config missing port. Add port: 8080 to app.yaml.` | `Something went wrong.` |
| The behavior, stated | `seamless`, `robust`, `blazing fast` |

## When a tell is not a tell

Leave a flagged phrase alone inside a quotation, a proper name, or a passage about the phrase itself. Put such phrases in inline code so the linter skips them. One weak tell alone does not justify an edit. Several together do. Rules 1 and 2 have no such exception.

## The linter

```bash
node scripts/stopslop.mjs README.md docs/*.md     # files
pbpaste | node scripts/stopslop.mjs               # stdin
node scripts/stopslop.mjs --json page.md          # for tools
```

| Tier | Effect | Rules |
|---|---|---|
| hard | exit 1 | dash, emoji, chatbot, staged-opener |
| strong | fix on one sighting | not-x-but-y, closer, unbacked-claim, guarantee, copula-dodge, bold-label, bold-density, filler, long-sentence (over 30 words) |
| weak | fix when several appear | ai-word, hype, curly-quote, title-case |

It skips code fences, inline code, link targets, and URLs. Node 18 or later, no dependencies. The repo test `scripts/stopslop.test.mjs` pins its behavior. As a docs gate: `node skills/writing/stopslop/scripts/stopslop.mjs $(git ls-files '*.md')`.
