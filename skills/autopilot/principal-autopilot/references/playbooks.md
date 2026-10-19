# Playbooks

> **Origin.** Five playbooks (Investigation, Bug fix, Feature, Refactoring, Autonomous run) are adapted from Lauren Tan's [poteto-mode](https://github.com/cursor/plugins/tree/d457567332aa6989e753ea289f30ea2bfbc80bc0/pstack/skills/poteto-mode/playbooks) (MIT), which has 23. They are rewritten as changes to the ten-step loop. Docs and prose is ours, loosely based on poteto's Authoring a skill. The "You own" lines are poteto's.

Pick one at step 1. Each playbook changes what some loop steps mean. Steps it does not mention run as written in `SKILL.md`.

## Investigation

**You own the answer.**

A read-only question: how does X work, why is Y like this, should we do A or B.

- Steps 4 and 7: `skip: read-only`. Step 8 still runs: investigations start browsers and write scratch scripts.
- Step 5: proof is citations. Every claim points to a file and line, a command output, or a doc you read.
- Reply: overview, how it works, where things live, gotchas. For A-or-B questions, a tradeoffs table and your real recommendation. Push back if the premise is wrong.

## Bug fix

**You own the root cause, not the patch.**

A defect to reproduce, root-cause, and fix.

- Step 2: load `diagnosing-bugs`. Reproduce it yourself before asking the user to. Build a loop that goes red on this bug.
- Step 3: list candidate causes, then rule them out with runtime evidence. Instrument when state is unclear. Do not guess.
- Step 4: the smallest change the evidence justifies. Belt-and-suspenders that "might help" is a hypothesis, not a fix. Revert anything a refuted hypothesis motivated.
- Step 5: the same check red before, green after. If cheap, commit the failing test before the fix.
- Reply: what broke, the root cause, the fix, red and green output pasted verbatim.

## Feature

**You own the design.**

New or changed behavior.

- Step 2: name the data shape and the structure that organizes it before writing logic.
- Step 3: if the change crosses a module boundary and the shape is not obvious, sketch two or three designs and compare them before choosing.
- Step 5: verify on the surface the user touches (UI, CLI, API), not only unit tests.
- Reply: what you built, what you chose and why, alternatives as a table, open decisions.

## Refactoring

**You own the contract. The structure changes, the behavior does not.**

Structure changes, behavior does not.

- Step 2: pin current behavior first with a characterization test, snapshot, or output diff. A typecheck is not a pin.
- Step 4: move in small steps that each keep the pin green. Migrate every caller and delete the old API in the same change.
- Step 7: keep the change only if it lowers reader load somewhere. Otherwise revert it.
- Reply: what moved, the pin, the equivalence proof, what got simpler.

## Docs and prose

**You own every claim on the page.**

READMEs, design docs, pages, PR descriptions, skills.

- Step 2: read what exists. Update instead of duplicating.
- Step 4: for agent-facing text (skills, `AGENTS.md`) load `writing-for-agents`. For human-facing text, follow section 5 of `SKILL.md`.
- Step 5: proof is that every technical claim traces to something read or run, and `scripts/stopslop.mjs` shows zero hard hits on the exact payload.
- Before overwriting a published page, fetch its current version. The user may have edited it.

## Autonomous run

**You own the exit condition.**

A long task the user steps away from ("run until done", "I'm going to bed").

- Step 1: state the exit condition as a checkable predicate (tests green, N items done, metric at target).
- Each iteration: the smallest change the evidence supports, verified against the predicate, kept if it moved the predicate, reverted if not.
- Keep a decision log as you go: one line per decision with what, why, evidence, and result. The user reviews it on return.
- Stop when the predicate is met or at a genuine dead end. A plateau is not a stop: change approach. Never loosen the predicate.
- Pause-list actions (see Autonomy) wait in a queue for the user.
- Reply: the predicate, iterations run, what landed, what was reverted, final state.
