---
name: stopslop
description: Find and remove AI-writing tells from prose before it ships, with a linter that checks the exact final text. Use for READMEs, docs, PR descriptions, commit messages, release notes, tickets, published pages, and replies, or when the user says stop slop, humanize, or "this sounds like AI".
license: MIT
metadata:
  author: Marcin Jeziorek
  version: "1.0.0"
  inspired-by: "humanizer by Siqi Chen (blader, MIT); unslop by Lauren Tan (pstack, MIT); Wikipedia: Signs of AI writing"
  inspired-by-license: licenses/humanizer.MIT.txt licenses/pstack.MIT.txt
---

# stopslop

> **Origin.** Written by Marcin Jeziorek. Built on two skills that are both in this repo: Siqi Chen's [humanizer](https://github.com/blader/humanizer) (MIT), whose pattern categories this skill follows, and Lauren Tan's `unslop` from [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT). Both trace back to Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). New here: a linter that checks the bytes that ship, rules for software engineering writing, and a workflow built from 36 logged sessions where a rewrite skill still let slop through.

Remove what makes text read as machine-written. Keep every fact. Add none.

## Why a linter

Rule lists alone fail at the last step. In logged sessions (method in [docs/field-data.md](../../../docs/field-data.md)), a page shipped with 13 em dashes while a skill banning em dashes was loaded. Users also lost their own edits and their own sentences to rewrites, and had to ask whether the skill had run at all. The steps below close each of those gaps. The mechanical tells go to [scripts/stopslop.mjs](scripts/stopslop.mjs). Judgment stays with you.

## Steps

1. **Get the current text.** For a published page or a shared doc, fetch the live version now, even if you fetched it earlier. The user may have edited it since.
2. **Lint it.** Run `node scripts/stopslop.mjs <file>`, or pipe the text in. Note every `hard` and `strong` hit.
3. **Read for judgment tells.** Go through [references/patterns.md](references/patterns.md) top to bottom. The linter cannot see forced triads, a reply that re-explains what the reader knows, or an aphorism standing in for a claim.
4. **Rewrite.** Rewrite whole sentences around their point rather than swapping single words. Keep every supported fact, name, number, and link. Add no fact the source or the user did not give you. Leave sentences the user wrote unchanged unless they asked you to change them. If the user gave a writing sample, match it, including its dashes (`--allow-dashes`).
5. **Lint the exact payload.** Run the linter again on the text you are about to publish, commit, or send, not on your draft. Zero `hard` hits is the bar. Each `strong` hit is fixed or kept for a reason you can state.
6. **Report in one line.** `stopslop: <n> hard and <n> strong fixed, <n> kept (reason).` The user should never have to ask whether it ran.

## Modes

| Surface | What to return |
|---|---|
| Reply in chat | The clean reply. No report line unless asked. |
| Commit message, PR description | The final text only. |
| File | Edit prose only. Code, commands, paths, YAML, and link targets stay byte-identical. Then the report line. |
| Published page | Fetch live (step 1), edit, lint the payload, publish, report. |
| Review only | The lint output and a ranked list of judgment tells. No rewrite. |

## Engineering writing rules

Technical text has its own tells. These sit beside the general patterns.

- **Numbers, not adjectives.** "Faster" needs the measurement: "p95 from 120 ms to 40 ms on 10k requests". Without a number, say what changed and drop the comparative.
- **Name the check.** `This ensures X` becomes "the `test_x` case covers X" or "X holds as long as Y". Absolute claims need the proof next to them.
- **What changed for whom, first.** A PR description opens with the effect on the user or caller. Then how it was verified. Implementation detail last, if at all.
- **Commit subjects are imperative and specific.** "Fix row drop when batch exceeds 1000", not "Improve export robustness".
- **Comments say why.** Not what the code does and not what it replaced. History belongs in the commit.
- **Error messages state what happened and what to do.** "Config missing `port`. Add `port: 8080` to app.yaml." Never "Something went wrong."
- **No marketing in docs.** `Seamless`, `robust`, `blazing fast`, and `battle-tested` say nothing a reader can check. State the behavior.

## When not to act

Leave a flagged phrase alone inside a quotation, a title, a proper name, or a passage about the phrase itself. One weak tell alone is not slop. Writers use dashes, triads, and the word `crucial` on purpose. Text from before late 2022 was not written by a model. Several tells together justify an edit.

## The linter

```bash
node scripts/stopslop.mjs README.md docs/*.md     # files
pbpaste | node scripts/stopslop.mjs               # stdin
node scripts/stopslop.mjs --json page.md          # for tools
```

Tiers: `hard` fails the run (exit 1), `strong` justifies an edit on one sighting, `weak` needs company. It skips code fences, inline code, link targets, and URLs. Node 18 or later, no dependencies. `scripts/stopslop.test.mjs` at the repo root pins its behavior.

Use it as a pre-commit or CI gate on docs: `node skills/writing/stopslop/scripts/stopslop.mjs $(git ls-files '*.md')`.
