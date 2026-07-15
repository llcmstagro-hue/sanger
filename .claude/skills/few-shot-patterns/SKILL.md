---
name: few-shot-patterns
description: Selects and structures few-shot examples for prompts — edge-case coverage, 3-5 example budgets, format consistency, simple-to-complex ordering, and when negative examples help versus hurt. Use when adding examples to a prompt, when outputs mimic example content instead of pattern, or when behavior is right on easy inputs but wrong on edge cases.
---

# Few-Shot Example Patterns

Examples are the highest-leverage part of most prompts: the model imitates what it sees more reliably than what it is told. That cuts both ways — every accidental property of your examples (length, format, topic, even punctuation) gets imitated too. Choose examples as deliberately as you write rules.

## Budget: 3–5 examples

- 1–2 examples teach format but not variation — the model overfits to the single case.
- 3–5 is the working range: enough to show the pattern varying across inputs.
- Beyond 5, returns diminish and cost/latency grow; more examples also crowd out instructions. If you feel you need 8+, your task is really 2–3 tasks — split the prompt or route first.

## Cover edge cases, not just happy paths

Allocate the budget deliberately. For a 4-example set:

1. **One canonical case** — the median input, handled perfectly.
2. **One hard-but-valid case** — messy input that still deserves a full answer (typos, mixed languages, buried question).
3. **One boundary case** — input at the edge of scope, showing the redirect/decline behavior.
4. **One "trap" case** — the input where the model most often errs today. Pick this from real failure logs, not imagination.

Anti-pattern: five variations of the easy case. That teaches the model nothing it wouldn't do anyway and leaves the failures unaddressed. If you can only include one example, include the trap case.

## Format consistency is non-negotiable

Every example must share exactly the same structure — same labels, same delimiters, same field order:

```
<examples>
<example>
<input>User: Can you lower the price on the Makakilo listing?</input>
<output>Pricing decisions come from the sellers with their agent's guidance —
I can't change a price, but I can pass your interest along. Want me to?</output>
</example>
<example>
<input>User: whats the sqft on the kanehoa one again</input>
<output>The Kanehoa Loop listing is 1,240 sq ft interior. Anything else you
want me to pull up on it?</output>
</example>
</examples>
```

Consistency rules:
- If one example's output is a JSON object, every example's output is a JSON object — the model will average formats otherwise.
- Match example output **length** to the length you want. Three 200-word examples silently override "be concise."
- Wrap examples in tags (`<example>`, `<input>`, `<output>`) so dialogue is never mistaken for live instruction.
- Realistic inputs beat sanitized ones: include the lowercase, the typo, the missing question mark users actually send.

## Ordering: simple → complex

Order examples from canonical to hard: the first example anchors the basic pattern; later examples layer in exception handling. Put the boundary/decline example last but one, and end with a strong positive example — models weight the final example heavily, and you want the last impression to be "full, correct answer," not "decline."

## Negative examples: when they help and when they hurt

A negative example shows output NOT to produce:

```
<example type="bad">
<input>Tell me about the Kapolei house</input>
<output_do_not_write>This STUNNING, BREATHTAKING masterpiece is an
UNBELIEVABLE opportunity!!!</output_do_not_write>
<why>Superlative stacking and shouting caps. Rewrite: one concrete feature,
one measured adjective.</why>
</example>
```

**Help when:**
- The failure is stylistic and hard to describe in rules (over-hyping, hedging, corporate filler) — showing the smell is clearer than naming it.
- Paired with a corrected version. Bad + good + one-line "why" is the strongest pattern.

**Hurt when:**
- Unlabeled or weakly labeled — the model may imitate the bad output. Always tag them (`type="bad"`, `DO NOT WRITE`) and never place a negative example last.
- Used for content rather than style: showing a wrong fact plants the fact. Constrain facts with rules, not negative examples.
- They outnumber positives. Keep at most 1 negative per 3 positives.

## Maintenance loop

1. Ship with your best 3–5.
2. Collect real failures for two weeks.
3. Replace the least-informative example (usually a redundant happy path) with the most common real failure, worked correctly.
4. Re-test the previously-passing cases — swapping examples can shift behavior elsewhere.

## Checklist

- [ ] 3–5 examples: canonical, hard-valid, boundary, trap
- [ ] Identical structure, labels, and delimiter scheme across all examples
- [ ] Example output length matches desired response length
- [ ] Ordered simple → complex, ends on a positive example
- [ ] Negative examples labeled, paired with corrections, ≤1 per 3 positives
- [ ] Trap example sourced from real failures
