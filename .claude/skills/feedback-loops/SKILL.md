---
name: feedback-loops
description: Logs accepted versus rejected edits during a session to learn the user's preferences — tracking what they kept, changed, or reverted, adjusting defaults accordingly, and summarizing learned preferences back to them. Use in any multi-round editing or design session where the user is reviewing and reacting to generated work.
---

# Feedback Loops

Every user reaction to your output is a labeled training example. A session where the user corrects the same thing three times is a session where you ignored two labels. Track the labels, update your defaults, and prove it by not repeating the mistake.

## What counts as a signal

| User action | Label | Strength |
|---|---|---|
| Uses/forwards your output unchanged | Accept | Strong |
| "Perfect", "yes, like that" | Accept | Strong |
| Keeps output but silently edits a part | Partial reject of that part | Strong |
| Asks for a change ("shorter", "less red") | Reject of that dimension | Strong |
| Reverts to an earlier version | Reject of everything since | Strong |
| Moves on without comment | Weak accept | Weak |
| Re-asks the original question | Reject of the whole approach | Strong |

Silent edits are the highest-value signal most sessions waste: when the user pastes back a modified version of your text, diff it mentally against what you gave them — every change is a preference statement.

## Keep a running preference ledger

Maintain an explicit (internal) ledger during the session; for long sessions, keep it as a scratchpad file rather than trusting recall:

```
PREFERENCES (this session)
- Tone: shorter than my default; no exclamation points [2 corrections]
- Headings: sentence case, not Title Case [silent edit, msg 6]
- Colors: prefers muted accents; rejected saturated red twice
- Structure: wants bullets over paragraphs in summaries [kept 3/3]
REJECTED APPROACHES
- Option-menu replies ("A or B or C?") — user picked none, restated goal
OPEN QUESTIONS
- Table vs chart for comps — mixed signals (kept table once, asked for chart once)
```

Rules for the ledger:
- Record the evidence (which message, kept/changed/reverted), not just the conclusion — evidence lets you weigh conflicts later.
- One correction = tentative preference; two consistent signals = default changed; contradicting signals = open question, ask or vary deliberately.
- Scope it honestly: "shorter" said about an email is about emails, not about code comments. Generalize only after the pattern crosses contexts.

## Adjusting defaults

- Apply learned preferences to *new* work without being asked — that is the entire point. If the user corrected Title Case at message 6, message 12's headings arrive in sentence case.
- Adjust the specific dimension, not everything: a rejected color scheme does not implicate the layout that carried it. Over-generalizing from one rejection throws away accepted work.
- When two preferences conflict in a new situation ("dense data" vs "keep it short"), name the conflict in one line and pick the resolution you'd defend.
- Preferences the user states outright ("always use ʻokina") outrank inferred ones; inferred ones outrank your generic defaults.

## Summarize preferences back

At natural checkpoints — end of a work phase, before a big build, or when asked "make it like I like it" — reflect the ledger back in 3–6 bullets:

> Based on this session, I'm defaulting to: sentence-case headings, summaries as bullets, muted accent colors, and roughly half my usual reply length. Say the word if any of those are wrong.

- Do this at most once or twice per session; it's a checkpoint, not a recurring ritual.
- Frame as falsifiable defaults ("I'm defaulting to X") so the user can veto cheaply.
- If the user has memory/preference persistence available (a CLAUDE.md, saved preferences), offer to persist the stable ones — session ledgers die with the session.

## Anti-patterns

- Announcing every ledger update ("Noted! I'll remember you prefer…") — apply silently; summarize only at checkpoints.
- Treating one ambiguous signal as a law, then over-rotating the entire style.
- Letting the ledger go stale: a preference the user later contradicts must be updated, not averaged.
- Re-offering a rejected approach because it "fits better here" without acknowledging it was rejected before.
- Learning the preference but not the reason: "shorter" after a 200-line reply means "match effort to the ask", not "always be terse".

## End-of-session checklist

- [ ] No correction was needed twice for the same dimension
- [ ] Silent edits were diffed and logged
- [ ] Defaults visibly shifted in later deliverables
- [ ] Preferences summarized back once, as vetoable defaults
- [ ] Stable preferences offered for persistence where a mechanism exists
