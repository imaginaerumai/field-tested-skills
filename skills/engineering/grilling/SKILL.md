---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
license: MIT
metadata:
  author: Matt Pocock
  adapted-by: Marcin Jeziorek
  upstream: https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/productivity/grilling
  upstream-license: licenses/mattpocock-skills.MIT.txt
---

# Grilling

> **Origin.** Written by Matt Pocock in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), pinned at `49dd158`.
> The upstream text below is verbatim except the edits listed in [UPSTREAM.md](UPSTREAM.md). Our additions live under **Field notes** at the end.

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

## Field notes

Evidence: 26 real sessions where grilling was loaded (method in [docs/field-data.md](../../../docs/field-data.md)).

1. **Keep a decision log the user can rewind.** Users went back on an earlier answer 3 times ("bring back decisions, i took a wrong one"). After each round, print a numbered list of settled decisions. A reversal reopens only the branches downstream of that decision.
2. **Letter the options.** Users answered with a bare letter or a numbered list in 16 short replies. Give every multiple-choice question lettered options so `Q2: b` is a complete answer.
3. **Self-grill mode.** About 19 requests asked the agent to grill *itself* ("do the grill-me session yourself for the security"). When asked, run the same design tree with the agent as the interviewee. Settle each fact question from evidence you gather. In this mode the wait and confirm rules above apply only to preference calls, which go to the user as one batch with recommended answers. `principal-autopilot` runs this mode at its step 3, before any code.
