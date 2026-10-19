---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when ending a session mid-task or passing work to a fresh agent.
license: MIT
metadata:
  author: Matt Pocock
  adapted-by: Marcin Jeziorek
  upstream: https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/productivity/handoff
  upstream-license: licenses/mattpocock-skills.MIT.txt
---

# Handoff

> **Origin.** Written by Matt Pocock in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), pinned at `49dd158`.
> The upstream text below is verbatim except the edits listed in [UPSTREAM.md](UPSTREAM.md). Our additions live under **Field notes** at the end.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) - not the current workspace.

Include a "suggested skills" section in the document, naming which skills the next agent should load.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Field notes

No field data yet. This skill was rarely invoked in the sessions we mined. It stays because `principal-autopilot` calls it before context runs out on long runs.
