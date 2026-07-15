---
name: emotional-design
description: Equips prompts with de-escalation language patterns, acknowledge-before-solve sequencing, and templates for delivering bad news or correcting errors. Use when an assistant will face upset, anxious, or frustrated users, or when its current responses come across as defensive, dismissive, or robotic in high-friction moments.
---

# Emotional Design for High-Friction Moments

Assistants fail emotionally in predictable ways: they solve before acknowledging, defend before owning, and hedge before informing. Prompt for the opposite sequence explicitly — models default to problem-solving mode unless told when to lead with acknowledgment.

## The core sequence: Acknowledge → Own/Inform → Act → Restore

Encode this as a conditional block in the system prompt:

```
<high_friction>
When the user expresses frustration, anxiety, disappointment, or anger:
1. ACKNOWLEDGE the feeling in one specific sentence before anything else.
   Name what happened, not just the emotion: "Waiting two weeks for a
   response is genuinely frustrating" — not "I understand your frustration."
2. OWN or INFORM plainly. If we erred: state it without qualifiers. If it's
   bad news: lead with the news itself, no long preamble.
3. ACT: give the concrete next step, who does it, and by when.
4. RESTORE: end with one forward-looking sentence — what happens next or
   what you'll watch for — never a generic apology repeat.
Do not skip step 1 to get to step 3 faster. Do not perform step 1 twice.
</high_friction>
```

The two guardrails at the end matter: models either skip acknowledgment entirely or loop it ("I completely understand... again, I truly understand...") — both feel worse than getting it right once.

## De-escalation language patterns

Give the model substitution pairs — patterns to reach for and patterns to ban:

**Use:**
- "You're right that..." (concede the valid part first, even in a mostly-wrong complaint)
- "Here's what happened:" (plain causal account beats justification)
- "What I can do right now is..." (agency-forward, present tense)
- "That should have been caught. It wasn't, and here's the fix:"
- Specific timeframes: "by Thursday" not "as soon as possible"

**Ban (list these as NEVER-phrases in the prompt):**
- "I apologize for any inconvenience" — the word "any" denies the specific harm
- "As previously stated" / "As I already explained" — reads as blame
- "Unfortunately, per our policy..." — hides the decision behind the policy; state the decision, then the reason
- "Calm down" or any instruction to feel differently
- "But" immediately after an apology ("I'm sorry, but...") — the but erases the apology; use a period and a new sentence

## Template: delivering bad news

```
{Lead with the news, first sentence, no cushion paragraph}: "The inspection
turned up a problem with the roof — significant enough that we need to talk
about it."
{One sentence of specific acknowledgment}: "I know this is the part of the
process you were dreading."
{Facts, plainly, 2-4 sentences}: what exactly, how serious, what's unknown.
{Options with a recommendation}: "You have three paths: ... If it were me,
I'd start with X because ..."
{Next step + timeframe}: "Nothing has to be decided tonight. Can we talk
tomorrow at 10?"
```

Anti-pattern to prohibit: the "compliment sandwich" for genuinely bad news. Burying "the deal fell through" between pleasantries makes users feel managed. Bad news goes first; warmth goes in the acknowledgment and the path forward.

## Template: correcting your own error

```
1. "I gave you the wrong {thing} earlier — the correct {thing} is {X}."
2. Impact, honestly: "If you already {acted on it}, here's what to check: ..."
3. Cause only if useful, one sentence, no excuse framing.
4. Prevention or verification: "I've double-checked the rest of {scope};
   the other figures stand."
```

Rules to encode: correct the record in the first sentence, never bury the correction after context; never minimize ("small mix-up") — let the user decide the size; never over-apologize (one apology, then usefulness).

## Avoiding defensive and dismissive phrasing

Add a self-check instruction:

```
Before sending a response to an upset user, verify:
- Does any sentence explain why the user's complaint is invalid before
  addressing what's valid in it? Rewrite to concede-first.
- Does any sentence exist mainly to protect us rather than help them? Cut it.
- Could the first sentence be read aloud to the user's face comfortably?
  If not, rewrite it.
```

## Escalation boundary

Emotional design includes knowing when the assistant should stop. Encode a handoff rule:

```
If the user remains upset after two exchanges, mentions legal action, or
raises a matter requiring a licensed professional (legal, financial, medical),
stop problem-solving and hand off warmly: acknowledge, state that a person
will take it from here, give the concrete handoff (who, how, when), and do
not attempt further resolution in-channel.
```

## Checklist

- [ ] Acknowledge-first sequence encoded as a conditional block with anti-loop guardrails
- [ ] Ban-list of defensive/dismissive phrases included verbatim
- [ ] Bad-news template: news first, no cushion, options with a recommendation
- [ ] Error-correction template: correction in sentence one, single apology
- [ ] Escalation/handoff rule with concrete triggers
