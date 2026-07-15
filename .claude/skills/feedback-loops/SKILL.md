---
name: feedback-loops
description: Keeps an in-code trail of accepted decisions and notable edits (a DECISIONS log / CHANGELOG) so intent and rationale are preserved for future turns and contributors. Use after making a non-obvious design/architecture choice, resolving a tradeoff, or completing a meaningful change worth remembering.
---

# Feedback Loops

Preserve the "why" behind changes in a durable, in-repo trail, so decisions are not re-litigated and future work inherits the rationale, not just the code.

## When to use
- A non-obvious architecture/design decision was made (state shape, token change, API contract for `app/api/lead/route.ts`).
- A tradeoff was resolved (e.g. chose Zustand slice over prop drilling; chose SSR over client fetch).
- A meaningful feature/section shipped or a convention was established.
- Reversing or superseding an earlier decision.

## Method
1. Maintain a single durable log. Prefer a `DECISIONS.md` at the repo root (lightweight ADR style); use `REPORT.md`/`README.md` only if the team already tracks decisions there. Do not scatter rationale across code comments alone.
2. Record entries in a consistent shape: date, short title, context (what prompted it), decision (what was chosen), rationale (why, alternatives rejected), and impact (files/areas touched). Keep each entry short — a few lines.
3. Log outcomes, not just intentions: capture what was actually accepted/merged, so the trail reflects reality.
4. Cross-reference code: when a decision constrains a file (e.g. "all brand colors live in `tailwind.config.ts`"), name that file so future edits find the rule.
5. Supersede, don't delete: when a decision changes, add a new entry marking the old one superseded and why, preserving history.
6. Keep it skimmable: newest first, one screen per entry max; link to a PR/commit for full detail rather than pasting diffs.
7. Tie into other skills: brandkit-sync token changes, turn-repair reconciliations, and figma-mcp divergences should each leave an entry here.
8. Review the log at the start of related work to inherit prior rationale before making a conflicting choice.

## Checklist
- [ ] A single durable decisions log exists and is used (not scattered comments).
- [ ] Entry captures context, decision, rationale, and impact concisely.
- [ ] Accepted/merged outcome recorded, not just the plan.
- [ ] Affected files named so the rule is discoverable from code.
- [ ] Superseded decisions marked, not deleted.
- [ ] Newest-first, skimmable, links out for detail.
- [ ] Existing log reviewed before making related decisions.
