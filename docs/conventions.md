# Conventions

## Layout

```
skills/<category>/<name>/
  SKILL.md        required, under 500 lines
  references/     optional, loaded on demand, one level deep
  scripts/        optional, self-contained, explicit error messages
  UPSTREAM.md     required for derived skills
```

Categories: `autopilot`, `engineering`, `writing`, `browser`, `ops`.

## Frontmatter

Only fields from the Agent Skills spec. Agent-specific keys (`disable-model-invocation`, `argument-hint`, `hidden`, `mode`) are dropped, because agents that do not know them either ignore them or reject the file. Note any dropped behavior in the body instead.

`metadata` values are strings.

Original skill:

```yaml
---
name: purge-stress
description: What it does. Use when ...
license: MIT
metadata:
  author: Marcin Jeziorek
  version: "1.0.0"
---
```

Derived skill:

```yaml
---
name: retro
description: ...
license: MIT
metadata:
  author: Matt Pocock
  adapted-by: Marcin Jeziorek
  upstream: https://github.com/mattpocock/skills/tree/<commit>/skills/engineering/retro
  upstream-license: licenses/mattpocock-skills.MIT.txt
  version: "1.0.0"
---
```

Inspired skill (original text, borrowed ideas):

```yaml
metadata:
  author: Marcin Jeziorek
  inspired-by: "poteto-mode by Lauren Tan (pstack, MIT)"
  inspired-by-license: licenses/pstack.MIT.txt
```

It must still open with an Origin note naming every source, and keep a `references/lineage.md` table of what was borrowed and what changed.

## Attribution (derived skills)

The first block after the H1 is the origin note. The validator checks for the literal `> **Origin.**` prefix.

```markdown
# Retro

> **Origin.** Written by Matt Pocock in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).
> Upstream text is kept verbatim below except where marked. Additions live under **Field notes**.
```

Rules:

1. Keep the upstream body verbatim. Do not rewrite the author's voice.
2. Put every addition in one `## Field notes` section at the end. Each note states what it changes and the evidence behind it: a failure seen in real use, a cross-agent portability gap, or a measured number. No evidence, no note.
3. If you must edit upstream text (for example a hard dependency on one vendor's tool name), wrap the change in `<!-- changed: reason -->` and list it in `UPSTREAM.md`.
4. `UPSTREAM.md` records the source URL, the pinned commit, the license, and a bullet list of every change.

## Agent neutrality

Write for any agent. Say "load the `x` skill" or "read `skills/.../SKILL.md`", not "call the Skill tool". Say "spawn a subagent if your agent supports it; otherwise do the steps in sequence". Never name one vendor's model as a requirement.

## Prose

Short declarative sentences. No filler, no hype, no em dashes. Every claim carries its evidence or a label (measured, inferred, guess).
