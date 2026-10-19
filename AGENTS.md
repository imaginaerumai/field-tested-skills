# AGENTS.md

Navigation pointers for any agent working in this repo. Keep this file short.

- Skills live at `skills/<category>/<name>/SKILL.md`. The folder name must equal the `name` field.
- Format follows the open Agent Skills spec: https://agentskills.io/specification
- Run `node scripts/validate.mjs` before every commit. CI runs the same command.
- Conventions for derived skills (attribution, field notes) are in `docs/conventions.md`. Read it before editing any skill with `metadata.upstream`.
- Third-party license texts live in `licenses/`. Never delete one while a skill still cites it.
- Run `retro` (Matt Pocock) after any substantial session in this repo, and route its findings into a check in `scripts/validate.mjs` before adding prose. See `docs/maintenance.md`.
