---
name: handoff-protocols
description: Produce a structured handoff when passing SANGER work back to a human or another agent — summarizing what was done, flagging risks, and listing pending decisions. Use when finishing a task, returning from a subagent, blocked and needing input, or transferring context across a boundary where the recipient lacks your history.
---

# Handoff-protocols

Package the context a recipient needs to continue without re-deriving your work: what changed, what's uncertain, and what decisions are still open.

## When to use
- Finishing a task and reporting back to the user or parent agent.
- A subagent returning results to the agent that spawned it.
- Blocked and handing the problem to a human for a decision.
- Transferring work across a session or role boundary where the recipient lacks your history.

## Method
1. Lead with outcome: state in 1-2 sentences what was accomplished and the current status (done / partial / blocked).
2. Summarize what changed: the files touched (absolute paths), what each change does, and why. Keep it to essentials, not a diff replay.
3. Flag risks and gaps explicitly: known bugs, untested paths, assumptions made, anything that could bite the recipient. Label unverified claims (see trust-calibration).
4. List pending decisions: each open question, the options, your recommendation, and what's blocked until it's answered. Make it easy to say yes/no.
5. State how to verify: the command to run, the route to open, or the check that confirms the work — so the recipient can trust it independently.
6. Give the next step: the single most useful action the recipient should take next.
7. Match depth to the boundary: a subagent-to-parent handoff shares file paths and findings tersely; a human decision handoff foregrounds the choice and its stakes.
8. Never bury a blocker or a risk at the end — surface anything that changes what the recipient should do at the top.

## Checklist
- [ ] Outcome and status (done/partial/blocked) stated up front.
- [ ] Files changed are listed with absolute paths and a one-line why each.
- [ ] Risks, assumptions, and untested areas are flagged, with unverified claims labeled.
- [ ] Pending decisions are listed with options and a recommendation.
- [ ] A concrete verification step is included so the recipient can confirm the work.
- [ ] The single most useful next action is named.
