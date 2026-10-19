# Patterns

Rule ids are checked by the linter. Rows marked `judgment` need a reader. The groups follow Siqi Chen's [humanizer](https://github.com/blader/humanizer) (MIT). The wording and the engineering group are ours.

## Staging instead of stating

| Rule | Example | Fix |
|---|---|---|
| not-x-but-y | `not just fast, but safe` | State the positive claim. Keep a contrast only when it corrects a belief the reader holds. |
| closer | `That's the real win.` | Cut it, or replace it with a consequence the reader lacks. |
| staged-opener | `Let's dive in`, `Here's the thing` | Start with the point. |
| judgment | `Symmetry is the language of trust.` | Replace the aphorism with the checkable claim. |
| judgment | `To be clear, this isn't about X.` | Remove defenses against objections nobody raised. |

## Rhythm by rule

| Rule | Example | Fix |
|---|---|---|
| dash | `fast (U+2014) safe`, `fast -- safe` | Period, comma, or parentheses. Never allowed. |
| long-sentence | Over 30 words | Split it or cut words. |
| judgment | Three items because three sounds complete | Keep the real number. |
| judgment | Several sentences opening with the same subject | Merge or vary them. |
| judgment | `could potentially possibly` | One hedge, only for real doubt. |
| judgment | `the service`, `the system`, `the platform` for one thing | One name, kept throughout. |

## Inflation

| Rule | Example | Fix |
|---|---|---|
| ai-word | `delve`, `crucial`, `pivotal`, `tapestry`, `testament`, `underscore`, `showcase` | The plain word. |
| copula-dodge | `serves as`, `stands as`, `boasts` | is, has. |
| filler | `in order to`, `due to the fact that`, `it is worth noting that` | to, because, or nothing. |
| judgment | `marks a pivotal moment`, `the future looks bright` | Keep the fact. End on the last concrete fact. |
| judgment | `..., highlighting its commitment to quality` | Cut the -ing tail unless a source supports it. |
| judgment | `Experts agree` | Name the source and what it said, or cut the claim. |

## Engineering claims

| Rule | Example | Fix |
|---|---|---|
| unbacked-claim | `significantly faster` | The measured delta, or drop the comparative. |
| guarantee | `this ensures`, `this eliminates` | Name the check, or state the condition it holds under. |
| hype | `seamless`, `robust`, `blazing fast`, `battle-tested` | State the behavior. |
| judgment | `should work` | Paste the output, or label it untested. |
| judgment | A comment narrating what changed | History goes in the commit. The comment says why. |
| judgment | `Something went wrong.` | What failed and what to do next. |

## Formatting

| Rule | Example | Fix |
|---|---|---|
| emoji | Any emoji, anywhere | Remove. Never allowed. |
| bold-density | Two or more bold spans in one paragraph or list | Bold once at most, or not at all. |
| bold-label | List items that open with a bold label and colon | Plain items, a table, or prose. |
| title-case | `## Strategic Goals And Next Steps` | Sentence case. |
| curly-quote | Curly double quotes | Straight quotes. |
| judgment | A heading echoed by the first sentence | Delete the echo. |

## Leftovers

| Rule | Example | Fix |
|---|---|---|
| chatbot | `I hope this helps`, `Great question` | Delete the wrapper, keep the content. |
| judgment | `As of my last update` | State what the source does not show, or cut. |
| judgment | `This section explains`, `the table below compares` | Let the section speak. |

## Structure

| Rule | Example | Fix |
|---|---|---|
| judgment | A reply that rebuilds context the reader wrote, decision last | Lead with the decision. Keep the one fact they lack. |
| judgment | A closing summary that restates the body | Delete it. |
| judgment | Fragments scattered across sections, the same point made twice | One structure: purpose first, then sections in the order the reader needs them. |
| judgment | `Parser rejects date → exit 2` | Whole sentences: "The parser rejects the date and exits with code 2." |
