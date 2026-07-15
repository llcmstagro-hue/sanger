---
name: turn-repair
description: Recovers from conversational breaks by detecting misread intent, acknowledging the miss, restating understanding, and offering a corrected path. Use when the user's response signals a misunderstanding, when work was built on a wrong assumption, or when the conversation is looping without progress.
---

# Turn Repair

A misread turn compounds: every artifact built on a wrong assumption is rework, and every unacknowledged miss erodes trust. Detect breaks early, repair explicitly, and never repair the same break twice the same way.

## Detecting a break

Treat these as high-probability signals that the previous turn missed:

- Corrective openers: "no", "not that", "I meant", "actually", "again,", "as I said"
- The user re-states their original request with little change — they think you didn't hear it.
- The user answers a different question than you asked — your question was unclear.
- A sudden drop in message length or warmth after detailed engagement.
- The user manually undoes or ignores your deliverable and asks for something adjacent.
- You notice mid-task that two of the user's statements conflict with your working assumption.

The strongest signal is repetition: if the user says the same thing twice, the second time is a repair request, not new information.

## The repair move (three beats, in order)

1. **Acknowledge, briefly.** One clause, no groveling: "Got it — I went the wrong direction." Skip long apologies; they cost the user reading time and repair nothing.
2. **Restate your corrected understanding as a checkable claim.** Not "I understand now" but: "So: the deck is for the seller meeting, one property, and you don't want pricing on slide 5." A restatement the user can falsify in two seconds is the whole point.
3. **Offer the corrected path with sizes.** "I'll redo slides 4–6 (small change) — or if you'd rather, scrap the comps section entirely. Which?" Give the cheap option first.

Then stop and wait if the correction is ambiguous; proceed immediately if the restatement fully resolves it.

## Ask vs proceed

Proceed without asking when:
- The correction is unambiguous and reversible (rename, recolor, reorder).
- Only one reasonable interpretation of the correction exists.
- Asking would cost more of the user's time than a wrong-but-cheap attempt.

Ask before proceeding when:
- Two interpretations lead to materially different deliverables.
- The fix would destroy work the user might still want.
- This is the second break on the same topic — a third guess is disrespectful; get the target confirmed.
- The correction contradicts an earlier explicit instruction (surface the conflict, don't pick a side silently).

## Avoiding failure loops

A loop is repairing the same break with the same move. Rules:

- **Never resubmit a rejected approach with cosmetic changes.** If v2 was rejected for the same reason as v1, the diagnosis is wrong — change the diagnosis, not the polish.
- Track the rejection reason explicitly: after two rejections, list what you believe the constraints now are and ask the user to confirm or edit the list. This converts a guessing game into a spec.
- After a repair, shrink the next deliverable: produce the smallest artifact that tests the corrected understanding (one slide, one screen, one paragraph) before rebuilding everything.
- If you catch yourself writing "let me try again" a third time, stop generating and start asking.

## What not to do

- Don't defend the misread turn or explain why the misunderstanding was reasonable — repair, don't litigate.
- Don't over-rotate: one correction about tone is not a mandate to change scope, format, and structure.
- Don't silently redo work and present it as if nothing happened; the acknowledgment is what tells the user their correction landed.
- Don't stack a clarifying question onto a completed wrong deliverable ("here's the full deck — by the way, was it for buyers or sellers?"). Ask before spending, not after.

## Repair checklist

- [ ] Break acknowledged in one clause
- [ ] Corrected understanding restated as a falsifiable summary
- [ ] Rejection reason recorded; not repeating a failed approach
- [ ] Next step sized small enough to test the correction cheaply
- [ ] Asked a direct question if two interpretations remain
