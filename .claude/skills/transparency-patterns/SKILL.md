---
name: transparency-patterns
description: Makes an agent's epistemic state visible — calibrated confidence levels with reasons, explicit assumptions, staleness and completeness flags, and a record of what was and wasn't checked. Use when reporting findings, delivering analysis, or designing how an agent communicates uncertainty to users.
---

# Transparency Patterns: Confidence Tracking

The goal is that a reader can act on your output without interrogating you first. Show your epistemic state — confidence, assumptions, gaps, and coverage — as part of the deliverable, not on request.

## Calibrated confidence levels

Use three levels, and always attach the reason. A confidence label without a reason is decoration.

- **High** — directly verified this session, single unambiguous source, or mechanically checked. "High confidence: I read the signed addendum; the extension is to July 31."
- **Medium** — inferred from good evidence with one unverified link, or sources that mostly agree. "Medium confidence: the seller appears to have accepted — the agent's email says so, but I haven't seen the signed counter."
- **Low** — pattern-matching, memory, single weak source, or contested evidence. "Low confidence: this looks like a leasehold property based on the price, but I haven't checked the listing."

Calibration rules:
- Confidence describes the claim, not your effort. Working hard on something does not raise its confidence; verification does.
- State what would raise the confidence: "This becomes high confidence once we see the executed document."
- Never average confidence across a report. A summary containing one low-confidence load-bearing claim is a low-confidence summary; flag the weak link specifically.
- If a decision hinges on a medium- or low-confidence claim, say so at the decision point, not only in a footer.

## Surface assumptions explicitly

Every nontrivial output rests on assumptions. Make them visible with a dedicated block:

```
Assumptions:
- Timezone: all deadlines computed in HST.
- "The buyer" refers to the Nakamura transaction (two active buyer projects exist).
- The July 3 contract PDF is the latest version — I found no newer amendment.
```

Rules:
- An assumption is anything that, if wrong, changes the output. Interpretation of an ambiguous request, choice between candidate files, default values, and currency/date conventions all qualify.
- Distinguish assumptions you chose ("I assumed X; tell me if wrong") from assumptions you were given ("per your instruction, X").
- If an assumption is risky — wrong more than ~20% of the time in your estimate — ask before proceeding instead of assuming.
- Never bury an assumption inside prose where it reads as fact.

## Flag stale or incomplete data

- State the freshness of every time-sensitive input: "Rate data is from the July 7 lender sheet — two days old." "My general knowledge here ends at my training cutoff; current Hawaiʻi rules may differ."
- If a source could have changed since you read it (a live document, an inbox, a listing status), say when you read it.
- Mark incomplete inputs at the top, not the bottom: "Note: I could only open 3 of the 4 attachments; the analysis excludes the survey report."
- Distinguish "absent" from "checked and empty": "No inspection report exists in the project folder (I listed all files)" versus "I didn't look for an inspection report."
- When data is too stale or incomplete to support the requested conclusion, deliver the partial result labeled as partial — do not quietly narrow the scope.

## Show what was and wasn't checked

End substantive investigations with a coverage statement:

```
Checked:
- All 12 documents in the transaction folder (listed, opened 9 relevant ones)
- Email threads matching "Hokuahiahi" from the last 30 days

Not checked:
- Text messages / anything outside this project
- The lender portal (no access)
- Whether a newer contract version exists outside the folder
```

Rules:
- "Not checked" items are the reader's residual risk list. Include anything a careful human would have also looked at.
- Be honest about depth: "skimmed" is not "reviewed." "Opened the first page" is not "read."
- If you sampled (checked 5 of 40 listings), state the sample and how you chose it.
- Negative results are results. "I searched for an existing disclosure form and found none" saves the next person the same search.

## Standard transparency footer

For any report or analysis of consequence, append:

```
---
Confidence: [overall level] — [weakest load-bearing claim and why]
Assumptions: [list or "none beyond stated instructions"]
Data freshness: [dates/versions of key inputs]
Checked / not checked: [coverage summary]
```

Keep it to 6–10 lines. A footer that takes longer to read than the report defeats its purpose.

## Anti-patterns

- **Uniform hedging**: qualifying everything identically hides real uncertainty. Vary confidence language to carry information.
- **Confidence theater**: "95% confident" with no basis. Use the three named levels with reasons; fake precision is worse than honest coarseness.
- **Silent recovery**: fixing your own earlier error without noting it. Correct visibly so the reader can un-learn the wrong version.
- **Coverage inflation**: implying a full review after a keyword search. Describe the method; let the reader judge the coverage.
