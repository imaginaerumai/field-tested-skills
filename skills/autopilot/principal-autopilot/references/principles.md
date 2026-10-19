# Principles

> **Origin.** Condensed from the `principle-*` skills in Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/d457567332aa6989e753ea289f30ea2bfbc80bc0/pstack/skills) (MIT, full text in [`licenses/pstack.MIT.txt`](../../../../licenses/pstack.MIT.txt)). These are summaries in our words, not the originals. The originals at that link carry the full reasoning and examples.

## Core

**Foundational thinking.** Get the data shape right before writing logic. Define the core types, trace every access pattern, pick structures that match the main paths. Scaffold that helps every later phase (CI, tests, shared types) goes first.

**Model the domain.** When logic branches a lot or repeats a shape assumption across files, encode the domain in one structure. Use a state machine instead of scattered booleans, a table instead of a branch per case, and a typed model instead of repeated checks.

**Laziness protocol.** The smallest change that solves the problem. Put each decision in one place. Fewer lines beat elegant boilerplate.

**Subtract before you add.** Remove dead code, redundant validators, and stale references first, then build on the simpler base. Design for observed use, not imagined edge cases.

**Redesign from first principles.** When a new requirement arrives, design as if it had been there from day one, instead of bolting it on.

**Migrate callers, then delete legacy APIs.** A new internal API replaces the old one in the same change. No compatibility shims that live forever.

**Experience first.** On product and UX tradeoffs, choose what the user will notice over what is convenient to build. Fewer polished features beat more rough ones.

## Architecture

**Boundary discipline.** Validate and handle errors at system edges: CLI args, config, network, external APIs. Inside, trust the types. Business logic lives in pure functions.

**Type system discipline.** Make illegal states unrepresentable. Parse external data into domain types at the boundary. Do not lie to the compiler.

**Make operations idempotent.** Commands and lifecycle steps that run amid crashes and retries reach the same end state however many times they run.

**Separate before serializing shared state.** If two actors might write the same file, key, or branch, remove the sharing first. Add locks only for a real single-writer invariant.

**Minimize reader load.** Count layers between the question and the answer, and hidden state the reader must hold. Collapse one-caller wrappers. Shrink mutable scope. Test: can a new reader find where X comes from in 30 seconds?

## Verification

**Prove it works.** Check the real artifact (run it, read the actual value, inspect the diff), never a proxy or a self-report. When a check fails, suspect the observation method before the system.

**Fix root causes.** Reproduce first. Ask why until the answer is a wrong decision in code. Guards, retries, and swallowed errors hide bugs. Fix every instance of the pattern.

**Attack the premise.** When two fixes on one premise fail the same check, write the premise down and test it before writing a third fix.

**Explain the number.** Before reporting a measurement, name what limits it and rule out what else it could be measuring: errors, cached or skipped work, noise.

**Test behavior, not implementation.** Call the code the way its users do and assert an exact expected result. A test that passes when every function returns undefined is not a test.

**Sequence verifiable units.** Break multi-step work into small units that each end in a check. Verify each before starting the next.

## Delegation and meta

**Guard the context window.** Send bulk reading to subagents or files. Keep summaries in the main thread.

**Never block on the human.** On reversible work, decide, act, and report. Pause only for irreversible actions.

**Build the lever.** For any non-trivial work, write the tool that does or proves it (codemod, script, generator). The tool is what a reviewer reruns.

**Encode lessons in structure.** When you write the same instruction twice, turn it into a lint, test, or script instead.
