# Lineage

Author: Marcin Jeziorek. Based on the idea of Lauren Tan's poteto-mode, enhanced for software engineering with stricter rules. This table lists what it borrows, from whom, and what it changes. Sources pinned at pstack `d457567` and mattpocock/skills `49dd158`.

| Part | Source | What we changed |
|---|---|---|
| Autonomy rules and session overrides | poteto-mode, Lauren Tan, [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT) | Removed Cursor-specific tools (Task parameters, model slugs, bugbot, `/loop`). Widened the pause list to all outward messages and publishing. poteto lets team chat and ticket updates proceed. |
| Candor rule, evidence labels, "never hand the human a check you could run" | poteto-mode | Kept. Labels are `measured`, `inferred`, `guess`. |
| Reply style, write clean as you draft | poteto-mode "Writing the reply" and `unslop` | Shortened. Dropped the bold-header-sentence rule. Prose rules now come from our `stopslop`, which adds a linter that gates shipped text. Principle citations must quote the line that drove the decision, because the agent reads our summary, not poteto's leaf skills. |
| Comment rules | poteto-mode "Comments" | Folded into step 8. |
| Empirical forks settled by a sketch | poteto-mode non-negotiables and Prototype playbook | Folded into step 3. Sketches are deleted at step 8. |
| Subagent rules | poteto-mode "Subagents" | Made optional. Removed model routing. |
| Principles | pstack `principle-*` skills | Condensed into [principles.md](principles.md) in our words. |
| Playbooks | poteto-mode playbooks | Five of 23 kept and rewritten as changes to one loop. Docs and prose added. See [playbooks.md](playbooks.md). |
| Self-grill | `grilling` by Matt Pocock, [mattpocock/skills](https://github.com/mattpocock/skills) (MIT) | Applied to the agent's own plan. Wait and confirm rules apply only to preference calls. Documented in our `grilling` field note 3. |
| Diagnosis | `diagnosing-bugs` by Matt Pocock | Loaded unchanged at step 2. |
| Retro | `retro` by Matt Pocock | Loaded unchanged at step 10. Findings go to checks before prose. |
| Bootstrap, size gate, loop with done-when lines, mandatory self-grill, simplify, and clean-up steps, prose lint gate | Original | Done-when lines apply the completion-criterion idea from Matt Pocock's `writing-for-agents`. |

Licenses: [`licenses/pstack.MIT.txt`](../../../../licenses/pstack.MIT.txt), [`licenses/mattpocock-skills.MIT.txt`](../../../../licenses/mattpocock-skills.MIT.txt).
