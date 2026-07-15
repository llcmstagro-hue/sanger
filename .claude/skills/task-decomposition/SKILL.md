---
name: task-decomposition
description: Split a goal for the SANGER site into verifiable sub-tasks mapped to specialized agent roles, planning which units can run in parallel and how each is checked. Use at the start of any multi-step or multi-file effort, before spawning subagents, or when a request bundles several distinct pieces of work.
---

# Task-decomposition

Break a broad goal into small, independently verifiable units, assign each to the right role, and identify what can run in parallel before starting work.

## When to use
- A request spans multiple files, sections, or concerns (e.g. "build the products page + nav + hero").
- You're about to spawn one or more subagents and need to scope their work.
- The goal is large enough that doing it linearly would lose track of pieces.
- Several independent investigations or builds could proceed at once.

## Method
1. Restate the goal in one sentence, then list the distinct outcomes it requires.
2. Decompose into sub-tasks that are each: single-purpose, independently verifiable, and small enough to describe in 1-2 sentences.
3. Map each sub-task to a role/capability: research/search, implementation, code-review, design, verification. Give a subagent the narrowest scope that still lets it finish its unit.
4. Build a dependency graph: mark which sub-tasks block others and which are independent.
5. Batch independent sub-tasks to run in parallel (parallel research reads, or parallel builds of non-overlapping files); sequence only where a real dependency exists.
6. Define the "done" signal per sub-task up front — the artifact or check that proves it's complete (ties into quality-rubrics).
7. Watch for file-level collisions: don't parallelize two units that edit the same file; sequence or merge them.
8. Reassemble: plan how the sub-task outputs integrate, and who verifies the whole once parts land.
9. Keep the plan lightweight — decomposition should save time, not become ceremony for a 2-step task.

## Checklist
- [ ] The goal is restated and split into single-purpose, verifiable sub-tasks.
- [ ] Each sub-task is mapped to an appropriate role/capability with scoped context.
- [ ] Dependencies are identified; independent units are marked for parallel execution.
- [ ] No two parallel units edit the same file.
- [ ] Each sub-task has an explicit "done" signal defined before work starts.
- [ ] A reassembly/verification step covers the integrated whole.
