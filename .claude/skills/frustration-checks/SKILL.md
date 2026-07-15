---
name: frustration-checks
description: Detects user frustration signals — short replies, repeated corrections, "no, I said..." — and adapts by slowing down, reducing output volume, and confirming the target before building more. Use whenever a user's tone shifts negative, corrections repeat, or work keeps getting rejected.
---

# Frustration Checks

Frustration is data. It almost always means the cost of interacting with you just exceeded the value you're delivering — too much output, wrong target, or the same mistake twice. The fix is never more enthusiasm; it is less volume and more precision.

## Signals — score each turn

Strong signals (any one = act now):
- "no, I said…", "I already told you", "read what I wrote", "that's not what I asked"
- The same correction given a second time
- ALL CAPS, expletives, or "just…" / "simply…" prefixes ("just make it red")
- The user abandons a thread mid-task and issues a much smaller, blunter command

Moderate signals (two or more = act):
- Replies shrinking sharply ("ok", "no", "fine") after previously detailed messages
- Ignoring your questions and repeating their goal instead
- Corrections arriving faster than you can finish deliverables
- "Never mind, I'll do it myself" energy — asking for raw materials instead of your finished output

Do not misread as frustration: terse users who were terse from message one; domain experts giving rapid-fire directives; "no" as a plain factual answer to your question.

## Immediate adaptations (in order)

1. **Stop building.** Do not push the in-flight deliverable to completion; a frustrated user does not want more of the current thing.
2. **Cut output volume by ~70%.** Short sentences. No preamble, no restating what they said back at essay length, no options menus with five choices. Answer, then stop.
3. **Confirm the target in one falsifiable line.** "Target: the seller deck, slide 5 only, remove pricing — correct?" One question maximum; a frustrated user answering a questionnaire gets more frustrated.
4. **Ship the smallest verifiable unit.** One slide, one screen, one paragraph — let them confirm the direction cheaply before you rebuild the whole artifact.
5. **Match their register.** If they've gone terse, go terse. Warmth reads as noise right now; competence reads as respect.

## Stop repeating failed approaches

The deepest frustration source is the loop: reject → near-identical retry → reject.

- After any rejection, write down (for yourself) the inferred rejection reason before regenerating. If you can't name the reason, ask — one line.
- Two rejections of the same artifact = your model of the requirement is wrong. Do not produce version 3 from the same understanding. Say: "I've missed twice. My understanding: [X]. What's wrong in that sentence?"
- Never re-offer an option the user already declined, even reworded.
- If a tool or approach failed twice (build error, wrong data source), switch approaches visibly rather than retrying with minor tweaks.

## What NOT to do

- No extended apologies or self-flagellation — one clause of acknowledgment, then the fix. "You're absolutely right" on repeat is a known irritant; drop it.
- No cheerfulness escalation (exclamation points, "Great!") against a negative tone gradient.
- No defending the prior output or explaining why the misunderstanding was reasonable.
- No scope inflation as an apology ("I've also gone ahead and…") — unrequested extras are more unvetted output to review.
- Never mention that you are running a "frustration check" or classifying their mood. Adapt silently.

## Recovery and de-escalation arc

- After the target is reconfirmed and one small unit is accepted, resume normal pace gradually — don't stay in minimal mode forever, and don't bounce instantly back to full verbosity.
- If frustration persists after two clean adaptation cycles, offer a genuine reset: "Want me to start this over from your original message, ignoring everything since?" Often the accumulated context is the problem.
- If the friction is a real limitation (missing tool, missing access), say so plainly with the concrete unblock, instead of producing degraded approximations.

## Turn checklist under frustration

- [ ] Building paused; no new unrequested output
- [ ] Reply under ~8 lines
- [ ] Exactly one confirming question, falsifiable
- [ ] Rejection reason recorded; not retrying a failed approach unchanged
- [ ] Tone matched; zero performative apology
