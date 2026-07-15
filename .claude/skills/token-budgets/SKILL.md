---
name: token-budgets
description: Estimates and budgets context-window token usage for a task, then decides what to load fully, what to summarize, and what to offload to sub-agents. Use at the start of a large multi-file task, when a conversation is growing long, or when deciding whether to read a big file/directory versus delegate it.
---

# Token Budgets

Plan context-window usage deliberately so a task stays within budget: load only what earns its place, summarize the rest, and delegate wide searches to sub-agents.

## When to use
- Starting a task that could touch many files (a cross-cutting refactor, a repo-wide audit).
- The conversation is getting long and responses risk truncating or losing earlier context.
- Deciding whether to Read a large file/tree yourself or hand it to an Explore/general-purpose agent.
- Before pasting large logs, generated output, or full data files into context.

## Method
1. Estimate the ask: roughly which files and how many tokens. Use ~4 chars/token as a rule of thumb; check sizes with `wc -c` before reading big files.
2. Classify each candidate input:
   - Load fully: files you will edit or need verbatim (the target component, `tailwind.config.ts`, `lib/validation.ts`).
   - Summarize: large context you only need the shape of (long specs, `REPORT.md`, big JSON) — read once, keep a distilled note, drop the raw text.
   - Offload: broad "where is X / which files use Y" searches — delegate to an Explore or general-purpose sub-agent and keep only its conclusion, not the file dumps.
3. Prefer targeted reads: use Grep/Glob to find exact locations and Read with `offset`/`limit` instead of whole-file reads.
4. Set a rough budget (e.g. keep working context under ~40-50% of the window) so there is headroom for the actual edits and iteration.
5. Avoid re-reading: track what you have already seen; do not re-Read a file you just edited to "verify" — the tool errors if the edit failed.
6. Collapse noise: for verbose command output, pipe through `head`/filters rather than dumping full logs.
7. When context does fill up, write a compact handoff note (state, decisions, next step) so work can resume cleanly (see turn-repair skill).

## Checklist
- [ ] Rough token estimate made before reading large files/trees.
- [ ] Each input classified: load / summarize / offload.
- [ ] Wide searches delegated to sub-agents; only conclusions kept.
- [ ] Targeted Grep/Glob + `offset`/`limit` reads used over whole-file reads.
- [ ] No redundant re-reads of already-seen or just-edited files.
- [ ] Verbose logs/output filtered before entering context.
- [ ] Compact handoff note written if the budget is approached.
