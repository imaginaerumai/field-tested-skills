# Upstream: retro

- Source: https://github.com/mattpocock/skills
- Path: `skills/engineering/retro`
- Commit: `49dd158d1076134a641b33efb035946536778336`
- Author: Matt Pocock
- License: MIT, full text in [`licenses/mattpocock-skills.MIT.txt`](https://github.com/imaginaerumai/field-tested-skills/blob/main/licenses/mattpocock-skills.MIT.txt)

Regenerate with `node scripts/port.mjs`. Never hand-edit the part of SKILL.md above `## Field notes`.

## Changes from upstream

- Description rewritten to state when to use the skill (Agent Skills spec recommends what + when).
- Replaced `` Call the Skill tool with `writing-for-agents` for the writing style guide. `` with `` Load the `writing-for-agents` skill for the writing style guide. ``. Reason: agent-neutral: not every agent has a tool named Skill.
- Dropped non-spec frontmatter `disable-model-invocation: true`. Agents that support it can add it back locally.
- Added the Origin note and the Field notes section.
