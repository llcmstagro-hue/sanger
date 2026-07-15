---
name: turn-repair
description: Recovers gracefully from interrupted or failed conversation turns by detecting partial state, reconciling the working tree, and resuming without losing or duplicating work. Use after a crash, timeout, cancelled tool call, or when picking up a task whose previous turn ended mid-edit.
---

# Turn Repair

Detect and reconcile the partial state left by an interrupted turn, then resume the task safely — no lost edits, no duplicated work, no half-applied changes shipped.

## When to use
- A previous turn was cancelled, timed out, or errored mid-way.
- Resuming a task and unsure what the last turn actually completed.
- A multi-file edit may have applied to some files but not others.
- A long-running command (build, test, dev server) was interrupted.

## Method
1. Take a state snapshot first: `git status` and `git diff --stat` to see exactly which files changed, plus `git stash list` in case work was parked.
2. Distinguish intended vs partial changes: for each modified file, read the diff and decide if it is a complete, coherent change or a half-applied one (dangling import, unclosed JSX, a token added to `tailwind.config.ts` but not yet referenced).
3. Check for duplication: interrupted edits sometimes leave a block written twice. Grep for suspicious repeated function/component names or duplicate JSX blocks in the touched files.
4. Verify the tree compiles: run `tsc --noEmit` (or the project typecheck) and the linter to surface breakage from a partial edit before doing anything else.
5. Reconcile:
   - Complete + correct changes: keep.
   - Half-applied: either finish the change deliberately or `git checkout --` the file to revert to a clean base, then redo cleanly.
   - Orphaned files created but unused: remove them.
6. Confirm background processes: check for a stray dev server / watcher from the interrupted turn (`lsof -i` on the dev port) and stop duplicates before restarting.
7. Re-establish the plan: restate what was done and the next concrete step, then continue. If a handoff note exists from token-budgets, use it as the anchor.
8. Verify the resumed work end-to-end (build + drive the affected flow) before declaring done.

## Checklist
- [ ] `git status`/`diff` snapshot reviewed before any new edits.
- [ ] Each touched file judged complete vs half-applied.
- [ ] No duplicated blocks/definitions left behind.
- [ ] Typecheck and lint pass on the reconciled tree.
- [ ] Half-applied files either finished or reverted cleanly.
- [ ] Stray background processes from the prior turn stopped.
- [ ] Next step restated and the resumed work verified end-to-end.
