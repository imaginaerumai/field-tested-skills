# Patterns

Rule ids in `code` are checked by the linter. The rest need judgment. Ordered strongest first within each group.

The grouping (staging, rhythm, inflation, formatting, leftovers, wrong reader) follows Siqi Chen's [humanizer](https://github.com/blader/humanizer) (MIT). The wording and the engineering group are ours.

## Staging instead of stating

The sentence signals importance instead of adding a fact.

- `not-x-but-y`. "Not just fast, but safe." The negative half names something nobody claimed. State the positive. Keep a contrast only when it corrects a belief the reader actually holds.
- `closer`. A one-line paragraph that restates the one above it ("That's the real win."). Cut it, or replace it with a consequence the reader did not have.
- `staged-opener`. "Let's dive in", "Here's the thing", "Honestly?". Delete the run-up and start with the point.
- **Aphorism for a claim.** "Symmetry is the language of trust." Replace with the specific, checkable claim underneath.
- **Arguing with no one.** "To be clear, this isn't about X." Remove defenses against objections nobody raised.

## Rhythm by rule

Shapes applied everywhere, whether the meaning asks for them or not.

- `dash`. Em dash, en dash, or ` -- ` as a connector. Use a period, a comma, or parentheses. Allowed when the writer's own sample uses them.
- **Forced triads.** Three items because three sounds complete. Keep the real number of items.
- **Same opening.** Several sentences in a row starting with the same subject. Merge or vary them.
- **Stacked qualifiers.** "Could potentially possibly." One hedge, only if the doubt is real.
- **Synonym cycling.** "The service, the system, the platform" for one thing. Pick one name and keep it.

## Inflation

The fact underneath is usually fine. Remove the dressing.

- `ai-word`. Delve, crucial, pivotal, tapestry, testament, underscore, showcase, and the rest of the list in the script. Use the plain word.
- `copula-dodge`. "Serves as", "stands as", "boasts". Say is or has.
- **Inflated significance.** "Marks a pivotal moment", "the future looks bright". Keep the fact, drop the significance, end on the last concrete fact.
- **Shallow -ing riders.** "..., highlighting its commitment to quality." Cut it unless a source supports it.
- **Borrowed authority.** "Experts agree." Name the source and what it said, or cut the claim.
- **Vague association.** "Associated with the project." Say what the relationship is, if the source says.

## Engineering claims

- `unbacked-claim`. "Significantly faster" with no number. Give the measured delta, or drop the comparative.
- `guarantee`. "This ensures", "this eliminates". Name the check that proves it, or state the condition it holds under.
- `hype`. Seamless, robust, blazing fast, battle-tested, world-class. State the behavior instead.
- **"Should work".** Either it was run and you paste the output, or it is labelled untested.
- **Narrated history in code comments.** "Changed to use a map instead of a loop." The commit holds history. The comment holds why.
- **Vague error text.** "Something went wrong." Say what failed and what the user does next.

## Formatting by rule

- `bold-label`. List items that open with a bold label and colon. Use plain items or prose.
- `heading-emoji`, `title-case`. Sentence case headings, no decoration.
- `curly-quote`. Straight quotes, unless the target format wants curly ones.
- **Bold everywhere.** Bold at most the one thing a skimming reader must not miss.
- **A heading echoed by the first sentence.** Delete the echo.

## Leftovers

Delete outright.

- `chatbot`. "I hope this helps", "Great question", "Let me know if". Keep the content inside the wrapper.
- **Knowledge-limit disclaimers.** "As of my last update." State what the source does not show, or cut.
- **Writing about the document.** "This section explains", "the table below compares". Let the section and the table speak.

## Wrong reader

- **Re-explaining what the reader knows.** A reply that rebuilds context the other person wrote, then gives the decision last. Lead with the decision. Keep the one fact they lack.
- **Over-compression.** The opposite failure: dropped articles, arrows, symbol-speak. "Parser rejects date → exit 2" becomes "The parser rejects the date and exits with code 2."
