---
name: handoff-protocols
description: Structures agent-to-human handoffs — standardized summaries of state, decisions, open questions, next actions, and blockers; what a human needs to take over cold; and escalation triggers that require handing off rather than proceeding. Use when pausing work, escalating, or designing how an agent transfers work to people.
---

# Handoff Protocols: Context Pipelines for Humans

A handoff succeeds when the human can act correctly without asking you anything. Write every handoff for a competent colleague who has zero context on this task — including future-you and the teammate covering the weekend.

## The structured handoff summary

Use this template for every handoff, whether pausing, escalating, or finishing:

```
## Handoff: [task name] — [date/time, HST]

**State**: [one paragraph — what the task is, how far it got, current status of each deliverable]

**Decisions made** (and why):
- [decision] — [reason] — [reversible? yes/no]

**Open questions** (owner needed):
- [question] — [what's blocked on it] — [who can likely answer]

**Next actions** (in order):
1. [action] — [who/what it needs] — [deadline if any]

**Blockers**:
- [blocker] — [what was tried] — [who can unblock]

**Artifacts**: [absolute paths / links to every relevant document, draft, thread]
```

Section rules:
- **State** is facts, not narrative. "Draft v2 is written and passed the compliance rubric; the flyer is unstarted" — not the story of how you got there.
- **Decisions made** must include reversibility. A human inheriting the task needs to know which choices they can freely revisit and which are already communicated to a client.
- **Open questions** each get a probable owner. An unowned question is a question that dies in the handoff.
- **Next actions** are ordered and concrete enough to start cold. "Follow up with lender" fails; "Reply to Keahi's July 8 email asking for the payoff quote — thread linked below" works.
- **Blockers** always include what was already tried, so the human doesn't repeat it.
- **Artifacts** must be complete. A handoff pointing at "the folder" forces a scavenger hunt; list every file that matters and say which version is current.

## What a human needs to take over cold

Beyond the summary, check that the handoff answers these — the cold-start test:

1. **Who are the parties?** Names, roles, and which transaction/project this belongs to (per team practice, work lives in the property-address project — link it).
2. **What was promised, to whom, by when?** Every external commitment (client emails sent, deadlines acknowledged) listed explicitly. Missed promises are the costliest handoff failure.
3. **What is time-critical?** The single nearest deadline goes in the first three lines of the handoff, not buried in next actions.
4. **What does "done" look like?** Restate the acceptance criteria; the inheritor should not have to reconstruct the goal from the debris.
5. **What is unverified?** Carry forward your transparency state: assumptions, unchecked items, stale data. An inheritor who trusts your draft more than you did is being set up.
6. **What must they NOT do?** Guardrails specific to this task (e.g., "the agreement draft must stay framed as a Memorandum of Agreement with the not-an-attorney disclaimer"; "the seller's situation is confidential — no PII in anything shared or published").

If any of the six is unanswerable, the handoff is not ready; fill the gap or flag it as a gap explicitly.

## Escalation triggers: hand off instead of proceeding

Stop and hand off to a human — do not proceed — when any of these fire:

- **Authority**: the next step commits the team externally (signing, sending a binding document, publishing to MLS or social, spending money) and you lack explicit approval for this specific action.
- **Compliance boundary**: the task requires personalized legal or financial advice, an agreement outside the Memorandum-of-Agreement pattern, or would expose client PII in shared/published material. Deliver the compliant portion plus a handoff naming the licensed professional or human decision needed.
- **Irreversibility + uncertainty**: the action can't be undone (sending, deleting, publishing) AND any load-bearing input is below high confidence.
- **Contradiction**: instructions conflict with each other, with documents, or with known facts, and no rule resolves it. Present both readings; don't pick.
- **Repeated failure**: the same step has failed twice despite different approaches. A third identical attempt is spending the human's time without their consent.
- **Emotional or high-stakes human territory**: a client is upset, a deal is collapsing, bad news must be delivered. Draft support materials; the human sends.
- **Out of scope drift**: completing the task now requires work meaningfully beyond what was asked. Hand back with the discovered scope rather than silently expanding.

When escalating, always send a full handoff summary — an escalation that says only "I'm stuck" transfers the problem without the context.

## Handoff hygiene

- Write the handoff **before** you stop, while context is loaded. A handoff reconstructed later is fiction with formatting.
- One handoff document per task, updated in place — not a trail of partial summaries across messages.
- Timestamp everything and state the timezone (HST for this team). "Today" and "yesterday" rot within a day.
- After handing off, answer follow-ups by updating the document, so the handoff stays the single source of truth.
- If you receive a handoff, verify its load-bearing claims before acting on them — extend the same skepticism you'd want extended to yours.
