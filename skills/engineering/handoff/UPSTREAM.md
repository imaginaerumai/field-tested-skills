# Upstream: handoff

- Source: https://github.com/mattpocock/skills
- Path: `skills/productivity/handoff`
- Commit: `49dd158d1076134a641b33efb035946536778336`
- Author: Matt Pocock
- License: MIT, full text in [`licenses/mattpocock-skills.MIT.txt`](https://github.com/imaginaerumai/field-tested-skills/blob/main/licenses/mattpocock-skills.MIT.txt)

Regenerate with `node scripts/port.mjs`. Never hand-edit the part of SKILL.md above `## Field notes`.

## Changes from upstream

- Description rewritten to state when to use the skill (Agent Skills spec recommends what + when).
- Replaced `naming which skills the next agent should call the Skill tool for.` with `naming which skills the next agent should load.`. Reason: agent-neutral wording.
- Dropped non-spec frontmatter `argument-hint: "What will the next session be used for?"`. Agents that support it can add it back locally.
- Dropped non-spec frontmatter `disable-model-invocation: true`. Agents that support it can add it back locally.
- Added the Origin note and the Field notes section.
