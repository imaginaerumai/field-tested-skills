# Maintenance

## After a substantial session: retro

This repo improves itself with Matt Pocock's [`retro`](../skills/engineering/retro/SKILL.md) skill.

1. Run `retro` on the session.
2. For each finding, try in order: a check in `scripts/validate.mjs`, a test, a navigation pointer in `AGENTS.md`, and only then prose.
3. Prove the new check fails on the real mistake before you commit it. Plant the mistake, run `node scripts/validate.mjs`, see it fail, remove the plant.

Example from the first session: a denylist of private terms was itself sitting in a public script, which leaked what it was meant to protect. The fix was structural. The terms moved to a gitignored `.private-terms` file that the validator reads when present.

## Syncing upstream skills

1. Bump `commit` for a source in `upstream.json`.
2. Run `node scripts/port.mjs`. It fails loudly if an edit no longer matches upstream text exactly once.
3. Reread the field notes against the new upstream. Delete any that upstream now covers.
4. Run `node scripts/validate.mjs` and `node --test scripts/*.test.mjs`.

`node scripts/port.mjs --check` exits non-zero if the generated half of any skill drifted from its pinned upstream.

## Before every push

```bash
node scripts/validate.mjs     # spec, attribution, links, secrets, private terms (local only)
node --test scripts/*.test.mjs          # behavior tests
```

## Releases

Tag `vMAJOR.MINOR.PATCH`. `principal-autopilot` installs companions from a pinned tag, so bump that tag in its `SKILL.md` when a companion changes in a way it depends on.
