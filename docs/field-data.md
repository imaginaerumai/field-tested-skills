# Field data

How the field notes in this repo were found.

## Source

My own local coding-agent history: about 600 sessions from 2026-02-27 to 2026-10-19, stored by OpenCode in a SQLite file (`~/.local/share/opencode/opencode.db`, tables `session`, `message`, `part`). Raw logs never leave my machine. This repo publishes only counts and short quotes with names, companies, URLs, and data removed.

## Method

1. **Usage.** Count skill loads per skill and per session from tool calls where the tool is `skill`. This picked which skills made the cut.
2. **Friction.** For each skill, read the user messages that follow a load and look for corrections ("no", "again", "you didn't", "still"), repeated requests, and complaints.
3. **Tool errors.** For CLI-backed skills, group tool outputs by error text and count sessions. Example: `Unknown ref` appeared 19 times in 12 `agent-browser` sessions.
4. **Ratios.** Compare paired actions. Example: 1,356 `agent-browser open` calls against 320 `close` calls.

Counts come from SQL `LIKE` matching, so treat them as approximate. A field note cites its count and labels anything inferred.

## Usage that set the lineup

| Skill (as installed then) | Loads | Sessions |
|---|---|---|
| agent-browser | 141 | 126 |
| humanizer | 40 | 36 |
| grill-me | 32 | 26 |
| write-a-skill (now `writing-for-agents`) | 9 | 9 |
| diagnose (now `diagnosing-bugs`) | 6 | 6 |

Domain skills tied to one employer's systems were left out. `retro`, `unslop`, `handoff`, and `purge-stress` are in because `principal-autopilot` depends on them, not because of load counts.

## Rule for new field notes

A field note states what it changes and the evidence behind it: a failure seen in real use, a cross-agent portability gap, or a measured number. No evidence, no note.
