---
name: purge-stress
description: Kill leaked headless Chromium that pins the CPU after browser automation. Use when the machine runs hot, fans spin, or an automation run may have left a browser open.
license: MIT
compatibility: macOS or Linux with bash 3.2+ and ps. Not Windows.
metadata:
  author: Marcin Jeziorek
  version: "1.1.0"
---

# purge-stress

Kill the headless browsers your agent forgot to close. Leave everything else alone.

## Why this exists

Headless Chromium renders on the CPU. A tab left open on an animating page pins one core until reboot. Killing the orphans fixes the symptom. Closing sessions fixes the cause (see the `agent-browser` skill, field note 1). Field data: [docs/field-data.md](https://github.com/imaginaerumai/field-tested-skills/blob/main/docs/field-data.md).

## Steps

1. Confirm the culprit. Run `ps -A -o %cpu,pid,command -r | head -15` on macOS, or `ps -eo %cpu,pid,args --sort=-%cpu | head -15` on Linux. Look for `Chromium Helper (GPU)` or a `--headless` process near 100%. If none appears, stop and report the top process. This skill does not fix that heat.
2. Preview: `scripts/purge-stress --dry-run`. Show the user the table.
3. If an automation task is running right now, ask before you continue. Killing ends its browser session. Otherwise proceed.
4. Purge: `scripts/purge-stress`.
5. Verify. Wait 3 seconds, then run step 1 again. Done when no PID that step 4 killed appears. Report any survivor with its command line.

## Scope

`scripts/purge-stress --help` lists exactly what it matches. It never matches a headed browser. It does match your own headless test runs (Playwright, Puppeteer), so check step 3 when tests are running.

## Install as a command

```bash
cp scripts/purge-stress ~/.local/bin/ && chmod +x ~/.local/bin/purge-stress
```

## Verification

`node --test scripts/*.test.mjs` at the repo root spawns fake leaked, headless, and headed processes, runs the real script, and asserts that only the first two die.
