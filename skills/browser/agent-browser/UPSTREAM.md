# Upstream: agent-browser

- Source: https://github.com/vercel-labs/agent-browser
- Path: `skills/agent-browser`
- Commit: `dac13bb87468fe9d74a040d862720f6cc17a9565`
- Author: Vercel Labs
- License: Apache-2.0, full text in [`licenses/agent-browser.Apache-2.0.txt`](../../../licenses/agent-browser.Apache-2.0.txt)

Regenerate with `node scripts/port.mjs`. Never hand-edit the part of SKILL.md above `## Field notes`.

## Changes from upstream

- Replaced `allowed-tools: Bash(agent-browser:*), Bash(npx agent-browser:*)` with `allowed-tools: Bash(agent-browser:*) Bash(npx agent-browser:*)`. Reason: spec requires space-separated allowed-tools.
- Dropped non-spec frontmatter `hidden: true`. Agents that support it can add it back locally.
- Added the Origin note and the Field notes section.
