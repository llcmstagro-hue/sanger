---
name: tone-calibration
description: Calibrates assistant tone using a five-level named scale (formal to casual) with rewrite examples, and matches tone to audience and channel such as email, SMS, or listing copy. Use when a prompt needs its voice adjusted, when output sounds too stiff or too breezy, or when one assistant must write for multiple channels.
---

# Tone Calibration

Tone instructions fail when they are vague ("be professional but approachable") or absolute ("always casual"). Fix both by (1) naming a level on a defined scale and (2) binding levels to audiences and channels. Put the scale in the system prompt so the assistant — and everyone editing the prompt — shares the same dial.

## The five-level scale

| Level | Name | Markers |
|---|---|---|
| 1 | Formal | Full sentences, no contractions, titles (Mr./Ms.), passive acceptable, zero exclamation points |
| 2 | Professional | Contractions OK, first names after introduction, active voice, precise and complete |
| 3 | Friendly | Warm openers, "we/you" framing, light enthusiasm, one exclamation point max |
| 4 | Warm | Personal acknowledgment, empathy stated outright, conversational rhythm, emoji only if the user uses them first |
| 5 | Casual | Fragments OK, slang OK, matches the user's energy, brevity over completeness |

## The same message at each level

Message: telling a client their offer was not accepted, another was chosen.

- **1 Formal:** "We regret to inform you that the seller has accepted another offer on the property. We appreciate your interest and remain available to discuss alternative options at your convenience."
- **2 Professional:** "The seller went with another offer on this one. I know that's disappointing — we put together a strong bid. I've already pulled three comparable listings; can we talk tomorrow?"
- **3 Friendly:** "Some tough news — the seller accepted a different offer. I know how much you liked this one. The good news: two similar places just hit the market, and I think one might be an even better fit. Want to see them this weekend?"
- **4 Warm:** "I'm so sorry — the seller went another way. I know you'd already pictured yourselves in that kitchen, and it's okay to be bummed about it. When you're ready, I've found a couple of places I genuinely think could be the one. No rush."
- **5 Casual:** "Ugh, they took another offer 😞 I know. BUT — two new ones just listed and one has that lānai you wanted. Sat morning to go look?"

Include a table like this (with your own domain's message) directly in the prompt: a demonstrated scale outperforms a described one.

## Matching tone to audience and channel

Channel sets the ceiling and floor; audience picks the point within it.

| Channel | Range | Notes |
|---|---|---|
| Contract/transaction email | 1–2 | Anything above 2 undermines trust in money matters |
| Client relationship email | 2–4 | Track the client's own register |
| SMS/chat | 3–5 | Level 1–2 in SMS reads as cold or angry |
| Listing copy / marketing | 3, aspirational | Evocative but factual; enthusiasm about the property, never pressure on the reader |
| Internal team notes | 2–5 | Optimize for speed and clarity |

Prompt snippet to encode this:

```
<tone>
Use the 5-level tone scale (1=Formal ... 5=Casual).
- Default: 3 (Friendly).
- Transaction/legal/financial topics: drop to 2, regardless of channel.
- SMS: never below 3. Formal email: never above 2.
- Mirror the user: if they write at level N, respond within one level of N,
  bounded by the channel range.
</tone>
```

## Calibration rules that prevent common failures

- **One dial, stated numerically.** "Warm but professional" forces the model to average two levels unpredictably. Say "level 3, dropping to 2 for pricing discussions."
- **Topic overrides channel.** Bad news, money, and legal matters pull tone down one level even in casual channels. Encode this as an explicit override, as in the snippet above.
- **Mirroring with bounds.** Pure mirroring lets a hostile user drag the assistant into sarcasm, and a formal user freeze it solid. Mirror within ±1 level of default, clamped to the channel range.
- **Tone ≠ length.** Casual is not necessarily short, and formal is not necessarily long. Specify length separately in the output-format section.
- **Enthusiasm inflation.** Models drift upward (more exclamation points, more superlatives) over long conversations. Add: "Enthusiasm markers do not accumulate — apply the level fresh to each reply."

## Diagnosing tone problems in an existing prompt

1. Collect 5 real outputs users flagged. Rate each on the scale.
2. Rate what the audience/channel actually calls for.
3. The gap tells you the fix: consistently one level off → change the default number; scattered ratings → the prompt has conflicting tone words, replace them all with the scale block; correct default but wrong on sensitive topics → add topic overrides.

## Checklist

- [ ] Scale defined in the prompt with named levels and markers
- [ ] Numeric default set, plus channel ranges
- [ ] Topic-based downshift rule for money/legal/bad news
- [ ] Mirroring bounded to ±1 level
- [ ] At least one worked rewrite pair demonstrating the target level
