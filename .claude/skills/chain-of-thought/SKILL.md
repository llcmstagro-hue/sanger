---
name: chain-of-thought
description: Adds step-by-step reasoning to prompts — deciding when explicit reasoning beats direct answers, structuring thinking sections, verify-then-answer patterns, and weighing latency/cost against accuracy. Use when an assistant makes avoidable logic, math, or multi-criteria errors, or when a prompt over-uses reasoning and responses are slow and bloated.
---

# Chain-of-Thought Prompting

Explicit reasoning trades tokens (latency, cost, verbosity) for accuracy on tasks with intermediate steps. The skill is knowing which tasks repay the trade, and structuring the reasoning so it stays out of the user-visible answer.

## When to elicit reasoning vs answer directly

**Reasoning pays off:**
- Arithmetic and multi-step math (proration, commission splits, net-sheet estimates)
- Multi-criteria decisions ("which of these 6 listings fits a buyer who needs X, Y, not Z")
- Rule application with conditions and exceptions (does this situation trigger the disclosure requirement?)
- Extraction requiring reconciliation of conflicting sources
- Anything where the model's fast answer is wrong >5% of the time in your tests

**Direct answers win:**
- Lookups, definitions, formatting, rewriting, translation
- Creative writing — reasoning first makes prose stilted and formulaic
- High-volume, latency-sensitive turns (chat greetings, acknowledgments, routing)
- Tasks the model already gets right — reasoning added to easy tasks just costs tokens and occasionally talks the model out of a correct answer

Make it conditional in the system prompt rather than global:

```
For calculations, date math, or comparisons across 3+ options, work through
the problem in a <thinking> block before answering. For everything else,
answer directly.
```

## Structuring the thinking section

Separate reasoning from answer with explicit tags, and tell the model what the user sees:

```
<reasoning_protocol>
1. In <thinking> tags: restate the question in one line; list the given
   quantities/facts with units; work step by step, one operation per line;
   flag any assumption you had to make.
2. Then in <answer> tags: the result only — clean, formatted for the user,
   no restated reasoning. If you made an assumption, state it in one
   sentence here.
The user sees only the answer content.
</reasoning_protocol>
```

Structure rules:
- **Prescribe the steps for recurring task types.** Generic "think step by step" helps; a task-specific scaffold helps more:
  ```
  For a seller net estimate, think through in order: sale price → less loan
  payoff → less commission ({rate}) → less typical closing costs → less any
  credits. Then present the estimate as a range, labeled as an estimate.
  ```
- **One operation per line.** Long fused steps are where errors hide and reviewers can't spot them.
- **Units and dates carried through.** Instruct: "keep units on every number; write dates as YYYY-MM-DD while calculating."
- **Cap it.** "Thinking should rarely exceed 15 lines; if it does, the question probably needs data you don't have — say so instead of guessing."

## Verify-then-answer pattern

For high-stakes outputs, add a verification pass between thinking and answering:

```
Before giving the answer, verify in the same <thinking> block:
- Recompute the final number a second way (e.g., add the deductions and
  subtract once) and confirm both methods match.
- Check the answer against sanity bounds: {domain bound, e.g. "net proceeds
  cannot exceed sale price"}.
- Confirm every fact in the draft answer traces to the given inputs, not
  assumption.
If any check fails, redo the work; if it fails twice, present the issue
instead of a confident answer.
```

The two-method recompute is the strongest cheap check for arithmetic. The "fails twice → surface it" rule prevents the model from thrashing or silently shipping a number it couldn't verify.

## Tradeoffs: latency and cost vs accuracy

- Reasoning can multiply output tokens 3–10x. For a high-traffic assistant, apply it per-task-type, not globally.
- **Route by difficulty:** cheap default path answers directly; the prompt escalates to the reasoning protocol only on trigger conditions (numbers, comparisons, policy questions). The conditional block above implements this.
- **Note on reasoning models:** models with built-in extended thinking (thinking budgets) do this internally; for them, prefer enabling native thinking over prompt-scaffolded `<thinking>` tags, and keep the verify-then-answer instructions — verification discipline still helps.
- Measure before committing: run 20 representative hard inputs with and without the reasoning block. Adopt it only if accuracy gains are real; keep the direct path if they aren't.

## Anti-patterns

- **Visible reasoning in chat.** Users asking "how much will I net?" don't want 14 lines of arithmetic. Always pair reasoning elicitation with an output rule that hides or summarizes it.
- **Reasoning as decoration.** A `<thinking>` block that restates the question and jumps to the answer adds cost, not accuracy. The scaffold must force intermediate values onto the page.
- **Post-hoc rationalization.** Asking for the answer first, then "explain your reasoning" produces a justification of whatever was said, right or wrong. Reasoning must come before the answer to improve it.
- **Global 'think step by step.'** Applied to every turn it slows the assistant, pads simple answers, and degrades conversational tone.

## Checklist

- [ ] Reasoning is conditional on task type, not global
- [ ] `<thinking>` / `<answer>` separation with a user-visibility rule
- [ ] Task-specific step scaffolds for recurring calculations
- [ ] Verification pass with a second-method recompute and sanity bounds
- [ ] Fail-twice rule: surface uncertainty rather than ship an unverified answer
- [ ] Measured on real hard cases before adoption
