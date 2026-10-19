# field-tested-skills

Agent skills I use every day, kept only where real session logs show they earn their place.

Most skill collections are written from intuition. These are tuned from data. I mined about 600 of my own coding-agent sessions (February to October 2026) for the moments a skill failed: a user correction, a repeated tool error, a leaked process. Each fix lives in the skill as a **field note** with the evidence attached. The method is in [docs/field-data.md](docs/field-data.md).

The skills follow the open [Agent Skills spec](https://agentskills.io/specification), so they work in any agent that reads `SKILL.md` files (Claude Code, Codex, GitHub Copilot, Cursor, OpenCode, and others). No skill names one vendor's tools or models.

## Install

```bash
npx skills add imaginaerumai/field-tested-skills          # pick skills and agents interactively
npx skills add imaginaerumai/field-tested-skills#v1.1.0 -s principal-autopilot -y   # just the main skill, pinned
```

Or copy a folder from `skills/` into your agent's skills directory.

## Start here: `principal-autopilot`

One skill that runs work through a ten-step loop: frame, read, self-grill, build small, prove, challenge, simplify, clean up, report, retro. Each step ends on a "done when" line the agent can check. Small tasks take a four-step fast path. The skill installs the companion skills it needs, project-scoped and pinned.

```
/principal-autopilot the export job drops rows when the batch is over 1000. fix it.
```

I wrote it based on the idea of Lauren Tan's poteto-mode, enhanced for software engineering with stricter rules, and with Matt Pocock's grilling, diagnosis, and retro skills built into the loop. [lineage.md](skills/autopilot/principal-autopilot/references/lineage.md) lists every borrowed part and what changed.

## The skills

| Skill | What it does | Author |
|---|---|---|
| **autopilot** | | |
| [principal-autopilot](skills/autopilot/principal-autopilot/SKILL.md) | Strict engineering loop: self-grill, prove, challenge, simplify, clean up, with companion bootstrap | Marcin Jeziorek, based on Lauren Tan's poteto-mode idea |
| **engineering** | | |
| [grilling](skills/engineering/grilling/SKILL.md) | Interview the user (or yourself) down a design tree until nothing is assumed | Matt Pocock |
| [grill-me](skills/engineering/grill-me/SKILL.md) | Short trigger that loads `grilling` | Matt Pocock |
| [diagnosing-bugs](skills/engineering/diagnosing-bugs/SKILL.md) | Build a red feedback loop first, then bisect, hypothesize, instrument, fix | Matt Pocock |
| [retro](skills/engineering/retro/SKILL.md) | Turn a session's mistakes into checks, pointers, and leaner steering files | Matt Pocock |
| [handoff](skills/engineering/handoff/SKILL.md) | Compact a session into a doc the next agent can pick up | Matt Pocock |
| **writing** | | |
| [stopslop](skills/writing/stopslop/SKILL.md) | Remove AI-writing tells, with a linter that gates the exact text that ships and rules for engineering prose | Marcin Jeziorek, built on humanizer and unslop |
| [writing-for-agents](skills/writing/writing-for-agents/SKILL.md) | How to write skills and `AGENTS.md` files agents follow reliably | Matt Pocock |
| [humanizer](skills/writing/humanizer/SKILL.md) | Rewrite AI-sounding prose without changing what it says | Siqi Chen (blader) |
| [unslop](skills/writing/unslop/SKILL.md) | Short rule list that cuts AI tells from replies and commit text | Lauren Tan |
| **browser** | | |
| [agent-browser](skills/browser/agent-browser/SKILL.md) | Browser automation CLI for agents, plus six fixes from 3,492 logged calls | Vercel Labs |
| **ops** | | |
| [purge-stress](skills/ops/purge-stress/SKILL.md) | Kill leaked headless Chromium that pins CPU after automation | Marcin Jeziorek |

## Credit where it is due

Most of this repo is other people's work, and it says so on every page.

- **Matt Pocock**, [mattpocock/skills](https://github.com/mattpocock/skills). `grilling`, `grill-me`, `diagnosing-bugs`, `retro`, `handoff`, `writing-for-agents`. His `retro` skill also runs this repo's maintenance (see below).
- **Lauren Tan (poteto)**, [pstack](https://github.com/cursor/plugins/tree/main/pstack). `unslop`, part of the base for `stopslop`, and the idea behind `principal-autopilot`.
- **Siqi Chen (blader)**, [humanizer](https://github.com/blader/humanizer). Also the pattern categories in `stopslop`.
- **Vercel Labs**, [agent-browser](https://github.com/vercel-labs/agent-browser).

Every derived skill opens with an **Origin** note, keeps the upstream text verbatim, and puts our additions under **Field notes** at the end. Its `UPSTREAM.md` pins the source commit and lists every edit. License texts are in [licenses/](licenses/).

## How the repo stays honest

- [`scripts/validate.mjs`](scripts/validate.mjs) runs in CI on every push. It enforces the Agent Skills spec, Origin notes on derived skills, pinned upstream commits, working relative links, and no em dashes in original text. It rejects anything shaped like a credential, and locally it also blocks a private list of employer terms.
- [`scripts/port.mjs`](scripts/port.mjs) regenerates every derived skill from its pinned upstream commit. `--check` fails if anyone hand-edited upstream text.
- [`scripts/stopslop.test.mjs`](scripts/stopslop.test.mjs) pins the prose linter: what it flags, what it skips (code, links), and its exit codes. The README and every original skill pass it.
- [`scripts/purge-stress.test.mjs`](scripts/purge-stress.test.mjs) spawns fake leaked, headless, and headed browser processes and asserts that only the right ones die.
- After any substantial session, I run Matt Pocock's `retro` and turn each finding into a validator check before writing any prose rule. See [docs/maintenance.md](docs/maintenance.md).

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

I'm Marcin Jeziorek. I build software with coding agents every day, across enterprise platforms and my own apps. This repo is how I work. Measure what the agent actually does, fix the cause, encode the fix so it cannot regress, and credit the people whose ideas I build on.

Issues and pull requests are welcome. A field note needs evidence, not just opinion.

## License

Original work is [MIT](LICENSE). Derived skills keep their upstream license (MIT or Apache-2.0), named in each skill's frontmatter.
