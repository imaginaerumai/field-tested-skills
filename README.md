# field-tested-skills

Agent skills I use every day, kept only where real session logs show they earn their place.

I mined about 600 of my own coding-agent sessions (February to October 2026) for the moments a skill failed: a user correction, a repeated tool error, a leaked process. Each fix lives in the skill as a field note with its evidence. The method is in [docs/field-data.md](docs/field-data.md).

The skills follow the open [Agent Skills spec](https://agentskills.io/specification). They work in any agent that reads `SKILL.md` files, including Claude Code, Codex, GitHub Copilot, Cursor, and OpenCode. No skill depends on one vendor's tools or models.

## Install

```bash
npx skills add imaginaerumai/field-tested-skills                                    # choose skills and agents
npx skills add imaginaerumai/field-tested-skills#v1.3.0 -s principal-autopilot -y   # main skill, pinned
```

You can also copy a folder from `skills/` into your agent's skills directory.

## Start with principal-autopilot

It runs work through a ten-step loop: frame, read, self-grill, build small, prove, challenge, simplify, clean up, report, retro. Each step ends on a done-when line the agent can check. Small tasks take a four-step path. It carries `stopslop` built in, so its writing standard and prose linter work with nothing installed. It uses its companion skills when they are installed. When they are missing, it suggests the install command and waits for your yes.

```
/principal-autopilot the export job drops rows when the batch is over 1000. fix it.
```

I wrote it from the idea behind Lauren Tan's poteto-mode and made it stricter for software engineering. Matt Pocock's grilling, diagnosis, and retro skills run inside the loop. [lineage.md](skills/autopilot/principal-autopilot/references/lineage.md) lists every borrowed part and every change.

## The skills

| Category | Skill | What it does | Author |
|---|---|---|---|
| autopilot | [principal-autopilot](skills/autopilot/principal-autopilot/SKILL.md) | Strict engineering loop with `stopslop` built in and companion bootstrap | Marcin Jeziorek, from Lauren Tan's poteto-mode idea |
| engineering | [grilling](skills/engineering/grilling/SKILL.md) | Interview the user, or yourself, down a design tree until nothing is assumed | Matt Pocock |
| engineering | [grill-me](skills/engineering/grill-me/SKILL.md) | Trigger that loads `grilling` | Matt Pocock |
| engineering | [diagnosing-bugs](skills/engineering/diagnosing-bugs/SKILL.md) | Build a failing feedback loop first, then bisect, instrument, and fix | Matt Pocock |
| engineering | [retro](skills/engineering/retro/SKILL.md) | Turn a session's mistakes into checks and leaner steering files | Matt Pocock |
| engineering | [handoff](skills/engineering/handoff/SKILL.md) | Compact a session into a doc the next agent can continue from | Matt Pocock |
| writing | [stopslop](skills/writing/stopslop/SKILL.md) | Clean technical prose, gated by a linter on the exact text that ships | Marcin Jeziorek, from humanizer and unslop |
| writing | [writing-for-agents](skills/writing/writing-for-agents/SKILL.md) | Write skills and `AGENTS.md` files that agents follow reliably | Matt Pocock |
| writing | [unslop](skills/writing/unslop/SKILL.md) | Short rule list against AI tells | Lauren Tan |
| browser | [agent-browser](skills/browser/agent-browser/SKILL.md) | Browser automation CLI, plus six fixes from 3,492 logged calls | Vercel Labs |
| ops | [purge-stress](skills/ops/purge-stress/SKILL.md) | Kill leaked headless Chromium that pins the CPU after automation | Marcin Jeziorek |

## Credits

Most of this repo builds on other people's work, and every page says so.

- Matt Pocock, [mattpocock/skills](https://github.com/mattpocock/skills): `grilling`, `grill-me`, `diagnosing-bugs`, `retro`, `handoff`, `writing-for-agents`. His `retro` also drives this repo's maintenance.
- Lauren Tan (poteto), [pstack](https://github.com/cursor/plugins/tree/main/pstack): `unslop`, part of `stopslop`, and the idea behind `principal-autopilot`.
- Siqi Chen (blader), [humanizer](https://github.com/blader/humanizer): the pattern groups in `stopslop`.
- Vercel Labs, [agent-browser](https://github.com/vercel-labs/agent-browser).

Each derived skill opens with an Origin note and keeps the upstream text verbatim. Our additions sit under Field notes at the end. Its `UPSTREAM.md` pins the source commit and lists every edit. License texts are in [licenses/](licenses/).

## Quality gates

CI runs all of these on every push.

| Check | What it enforces |
|---|---|
| [scripts/validate.mjs](scripts/validate.mjs) | Agent Skills spec, Origin notes, pinned upstream commits, links that survive install, no credentials. Locally it also blocks a private list of employer terms. |
| [scripts/port.mjs](scripts/port.mjs) `--check` | Upstream text in derived skills matches the pinned commit. Run locally, since it needs the network. |
| [scripts/stopslop.test.mjs](scripts/stopslop.test.mjs) | The prose linter flags what it should and skips code and links. |
| stopslop gate (in validate.mjs) | Our own text has zero hard and strong hits. Borrowed text has zero dashes and emojis, fixed through recorded upstream edits. The standard and linter bundled in `principal-autopilot` match `stopslop` exactly. |
| [scripts/purge-stress.test.mjs](scripts/purge-stress.test.mjs) | Only leaked and headless browser processes die. Headed browsers survive. |

After a substantial session I run Matt Pocock's `retro` and turn each finding into a check before writing any prose rule. See [docs/maintenance.md](docs/maintenance.md).

## Layout

```
skills/<category>/<name>/SKILL.md   the skill
skills/.../references/              loaded on demand
skills/.../scripts/                 runnable, tested
skills/.../UPSTREAM.md              provenance for derived skills
upstream.json                       pinned sources for port.mjs
licenses/                           third-party license texts
docs/                               conventions, field data method, maintenance
```

## About the author

I'm Marcin Jeziorek. I build software with coding agents every day, on enterprise platforms and on my own apps. This repo shows how I work: measure what the agent does, fix the cause, encode the fix so it cannot regress, and credit the people whose ideas I build on.

Issues and pull requests are welcome. A new field note needs evidence from real use.

## License

Original work is [MIT](LICENSE). Derived skills keep their upstream license (MIT or Apache-2.0), named in each skill's frontmatter.
