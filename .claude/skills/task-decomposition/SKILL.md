---
name: task-decomposition
description: Splits a large goal into bounded agent subtasks with defined roles — each with explicit inputs, outputs, and done-criteria — plus sequential vs parallel structuring and integration/verification steps. Use when planning multi-agent work, delegating to subagents, or scoping a goal too large for one pass.
---

# Task Decomposition: Splitting Goals into Agent Roles

A goal is decomposable when you can state what "done" looks like. Decompose before executing; a plan discovered mid-flight is a plan with missing steps.

## Decompose into bounded subtasks

- Start from the goal's acceptance criteria, not from activities. Work backward: what artifacts must exist for the goal to be done? Each artifact suggests a subtask.
- Each subtask must be **bounded**: a worker (agent or human) could complete it without asking what the rest of the plan is. If a subtask needs the whole plan as context, it is not yet decomposed.
- Size subtasks so failure is cheap: one subtask failing should cost redoing that subtask, not the project. If a subtask's failure would cascade, split it or add a verification gate after it.
- Prefer 3–7 subtasks per level. More than that, introduce a grouping level; fewer than 3, question whether decomposition is worth the coordination cost.
- Separate **research** subtasks (produce knowledge) from **production** subtasks (produce artifacts) from **verification** subtasks (produce pass/fail judgments). Mixing them in one role invites an agent that verifies its own work with its own assumptions.

Example — goal: "Launch the new listing at 94-xxx Example St."

1. Gather and verify property facts (research)
2. Draft listing description + photo captions (production)
3. Compliance and PII review of all public-facing text (verification)
4. Build the flyer and social posts in brand style (production)
5. Assemble the MLS entry, plain-text fields converted (production)
6. Final cross-check: every published fact traces to step 1's fact sheet (verification/integration)

## Define each role: inputs, outputs, done-criteria

Write a role card for every subtask before launching it:

```
Role: Compliance reviewer
Inputs: listing description draft, flyer text, fact sheet (v2), team compliance rules
Outputs: pass/fail matrix per document; edited text where fixes are mechanical
Done when: every blocking criterion passes, or failures are listed with reasons
Must not: rewrite voice/style, add new claims, approve its own edits
Escalate if: a compliance question has no rule covering it
```

Rules for role cards:
- **Inputs** are enumerated, versioned, and sufficient. If the role would need to go hunt for context, the inputs are incomplete — fix the card, not the worker.
- **Outputs** name concrete artifacts with format and location ("a fact sheet at /path, one row per claim, with source column"), not vibes ("research the property").
- **Done-criteria** are checkable by someone other than the role. "Done when the description is good" fails; "done when all 8 rubric rows pass" works.
- Include a **must-not** line. Scope creep between roles is the top source of duplicated and conflicting work.
- Include an **escalate-if** line so the role knows the difference between "figure it out" and "stop and ask."

## Sequential vs parallel structure

Decide the structure from the data dependencies, not from impatience:

- **Sequential** when one subtask's output is another's input (facts → draft → review). Never parallelize across a data dependency; you will integrate stale inputs.
- **Parallel** when subtasks share inputs but not outputs (flyer and MLS entry both consume the approved description). Parallel workers must write to disjoint artifacts — two agents editing one document is a merge conflict wearing a productivity costume.
- **Fan-out/fan-in** for uniform work over many items (verify 20 comparables): identical role card, one item each, single integrator collecting results in a fixed format.
- Put verification gates at the joints: after any subtask whose output feeds multiple downstream tasks, verify it once there rather than three times downstream.
- If two subtasks might conflict (both touch pricing language), either sequence them or assign one owner for the shared decision.

## Integration and verification steps

Integration is a subtask, not an afterthought. Plan it at decomposition time:

1. **Collection**: define, up front, the exact format each parallel worker returns (fields, file paths, matrix layout). Free-form returns make integration a translation project.
2. **Consistency check**: the same fact must appear identically everywhere (price on flyer = price in MLS = price in email). Build a single source-of-truth artifact early (the fact sheet) and diff every output against it.
3. **Gap check**: compare delivered artifacts against the original acceptance criteria list. Decomposition loses requirements at the seams; this is where you find them.
4. **End-to-end verification**: exercise the final assembled result as its consumer would (read the listing as a buyer, open the email as the client), not just the parts.
5. **Residual list**: anything not done, not checked, or assumed — handed forward explicitly (see the handoff-protocols skill).

## Failure handling

- If a subtask fails its done-criteria twice, do not re-run it a third time unchanged. Either the role card is wrong (fix inputs/criteria) or the subtask is too big (split it).
- If integration reveals contradictions between workers, resolve them at the source-of-truth artifact and re-derive, rather than patching each output by hand.
- Record which subtasks were re-scoped mid-flight; those are the seams to design better next time.
