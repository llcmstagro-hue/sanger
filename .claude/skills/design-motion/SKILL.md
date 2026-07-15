---
name: design-motion
description: Runs a structured three-stage motion audit — intent, choreography, performance — to review and improve animation across a UI. Trigger when reviewing a page's overall motion, when animations feel chaotic/excessive/inconsistent, or when asked to critique or systematize the motion design of a flow.
---

# Design Motion

A repeatable audit for the whole motion layer of a screen or flow, not a single component. Use it to find what to add, cut, and fix.

## When to use
- Reviewing or critiquing the animation of a full page or flow.
- Motion feels busy, inconsistent, or laggy across a screen.
- Establishing motion consistency for the SANGER site.

## Method
Work the three stages in order; don't optimize performance before intent is right.

### Stage 1 — Intent (why does it move?)
1. List every animation on the screen and assign each a job: orient (guide attention), give feedback (confirm an action), express brand, or none. Anything scoring "none" is a candidate to cut.
2. Enforce a motion budget: typically one hero/focal moment per view plus supporting micro-feedback. Simultaneous competing animations dilute all of them.
3. Confirm motion reinforces hierarchy — the most important element gets the most distinctive movement, not the least.

### Stage 2 — Choreography (how do things move together?)
4. Establish a shared vocabulary: consistent easing (one ease-out curve, e.g. `[0.22, 1, 0.36, 1]`), a small duration set (e.g. 150 / 300 / 450ms), and consistent direction (reveals rise on +y).
5. Sequence, don't dump: stagger related entrances (`staggerChildren` ~0.06–0.1s) so the eye reads order. Cut anything that fires all at once.
6. Check enter/exit symmetry via `AnimatePresence` — elements should leave the way they arrived, not pop out.
7. Verify transitions between states/routes feel continuous (shared `layoutId` where an element persists).

### Stage 3 — Performance (does it hold 60fps?)
8. Confirm only `transform`/`opacity` animate; flag animated `width`/`height`/`top`/`box-shadow`.
9. Check scroll-linked and `whileInView` animations use `once: true` and reasonable viewport margins so they don't thrash.
10. Test on a throttled CPU (DevTools 4–6x) and with `prefers-reduced-motion` on; ensure essential content is never gated behind motion.

## Checklist
- [ ] Every animation has an assigned job; "none" ones removed.
- [ ] Motion budget respected — one focal moment per view.
- [ ] Shared easing + limited duration set applied consistently.
- [ ] Related entrances staggered; nothing fires all at once.
- [ ] Enter/exit symmetric via AnimatePresence.
- [ ] Only transform/opacity animated; verified ~60fps under CPU throttle.
- [ ] `prefers-reduced-motion` path leaves content fully usable.
