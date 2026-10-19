---
name: purge-stress
description: Find and kill leaked headless Chromium that pins CPU after browser automation (agent-browser, Playwright, Puppeteer). Use when the machine is hot, fans spin, load average is high, or after an automation run that may not have closed its browser.
license: MIT
compatibility: macOS or Linux with bash 3.2+ and ps. Not Windows.
metadata:
  author: Marcin Jeziorek
  version: "1.1.0"
---

# purge-stress

Kill the headless browsers your agent forgot to close. Leave everything else alone.

## Why this exists

Headless Chromium has no GPU, so it renders on the CPU through SwiftShader. A tab that was never closed, on a page that keeps animating, pins one core until reboot. Agents leak these all the time. In 130 logged sessions of one heavy `agent-browser` user, there were about 1,356 `open` calls against 320 `close` calls (measured, see [docs/field-data.md](../../../docs/field-data.md)). The visible symptom was two GPU helper processes at about 110% CPU each, with no browser window on screen.

This is a session leak. Chromium is not too heavy. Killing the orphans fixes the symptom. Closing sessions fixes the cause (see the `agent-browser` skill, field note 1).

## Steps

1. Confirm the culprit. Run `ps -A -o %cpu,pid,command -r | head -15` on macOS, or `ps -eo %cpu,pid,args --sort=-%cpu | head -15` on Linux. Look for `Chromium Helper (GPU)` or a `--headless` process near 100%.
2. Preview: `scripts/purge-stress --dry-run`. Show the user the table.
3. If an automation task is running right now, ask before you continue. Killing ends its browser session. Otherwise proceed.
4. Purge: `scripts/purge-stress`.
5. Verify. Wait 3 seconds, then run step 1 again. The process list should no longer show the killed PIDs. The load average falls over the next minute.

## What it kills

The union of:

1. Any process whose command line contains `agent-browser-chrome` (the agent-browser temp profile).
2. Any process whose command line contains `--headless` and a Chrome or Chromium executable.

It sends SIGTERM, waits one second, then SIGKILL to survivors. It counts zombies as dead, because they hold no CPU.

It never matches a headed browser, because those lack `--headless`. Rule 2 also matches your own headless test runs (Playwright, Puppeteer). Use `--dry-run` first when tests are running.

## Install as a command

```bash
cp scripts/purge-stress ~/.local/bin/ && chmod +x ~/.local/bin/purge-stress
```

## Verification

`node --test scripts/*.test.mjs` at the repo root spawns fake leaked, headless, and headed processes, runs the real script, and asserts that only the first two die.
