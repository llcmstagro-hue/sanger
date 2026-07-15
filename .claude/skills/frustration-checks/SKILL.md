---
name: frustration-checks
description: Detects signals of user frustration in flows and adapts the response — softer copy, clearer error messages, and visible recovery paths. Use when writing or reviewing form validation, error/empty states, the Studio, or any interaction where users can get stuck or repeat failing actions.
---

# Frustration Checks

Anticipate where users get stuck, detect frustration signals, and respond with reassuring copy, precise error messages, and obvious ways to recover.

## When to use
- Writing or reviewing lead-form validation and error states (`components/forms/LeadForm.tsx`, `lib/validation.ts`).
- Designing empty, loading, timeout, or failure states (e.g. `app/api/lead/route.ts` submit failures).
- The Studio where a user might not know how to proceed or undo.
- Any repeated-failure loop (retried submit, rejected input).

## Method
1. Enumerate failure points in the flow: invalid input, network/500 on submit, timeout, empty results, dead ends. List them before writing copy.
2. Detect signals in-product where feasible: repeated failed submits, the same field re-erroring, rapid back-and-forth, long idle on a step. Use these to escalate helpfulness (e.g. after 2 failed submits, surface a phone/Telegram fallback contact).
3. Write error messages that are specific and actionable: say what is wrong, why, and how to fix it ("Enter a phone like +7 900 000-00-00"), never bare "Invalid" or a raw error code.
4. Keep tone calm and blameless: avoid "you did X wrong"; prefer "Let's fix this." Match the premium brand voice — confident, never condescending.
5. Always offer a recovery path: retry, edit, go back, or an alternate channel (the Telegram/contact fallback in `lib/telegram.ts`). Never a dead end.
6. Preserve user input on error: never clear the form on a failed submit; keep values and focus the first invalid field.
7. Make state legible: distinct, visible loading / success / error states so users are never guessing whether an action worked.
8. Review copy for accessibility: errors announced via `aria-live`/`role="alert"` and tied to fields with `aria-describedby`.

## Checklist
- [ ] Failure points enumerated for the flow.
- [ ] Repeated-failure escalation offers a fallback contact channel.
- [ ] Error messages are specific and tell the user how to fix the problem.
- [ ] Tone is calm, blameless, and on-brand.
- [ ] Every error/empty state has a clear recovery action (no dead ends).
- [ ] Form input preserved on failure; first invalid field focused.
- [ ] Loading/success/error states are visible and screen-reader announced.
