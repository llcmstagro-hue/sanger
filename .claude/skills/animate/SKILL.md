---
name: animate
description: Defines micro-interaction timing — easing curves, spring configs, durations — for buttons, hovers, focus, and small reveals using Framer Motion. Trigger when adding or tuning hover/press/entrance animations, when motion feels stiff/janky/too bouncy, or when choosing an easing or transition for a component.
---

# Animate

Give small interactions the right curve and timing so they feel responsive and intentional, not robotic or gratuitous.

## When to use
- Adding hover, press, focus, or entrance animation to a component.
- Motion feels linear/stiff, too slow, or bounces without purpose.
- Choosing easing, duration, or a spring config in Framer Motion.

## Method
1. Match duration to distance and importance: micro-feedback (hover, press, color) 120–200ms; small reveals/dropdowns 200–300ms; larger section entrances 300–500ms. Anything over ~600ms for UI feels sluggish.
2. Never use `linear` for UI (only for continuous loops like a spinner). Default to an ease-out for entrances (fast start, soft landing): `transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}`.
3. Use ease-in-out for state toggles that both appear and disappear; use a custom cubic-bezier over named easings when you want a signature feel.
4. Prefer springs for anything that should feel physical (press, drag, playful reveals): `transition={{ type: "spring", stiffness: 400, damping: 30 }}`. Higher stiffness = snappier; higher damping = less bounce. For UI, keep damping high enough to avoid visible overshoot unless overshoot is the point.
5. Buttons: `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.97 }}` with a fast spring feel alive without being cartoonish. Pair with a color/shadow transition on the same timing.
6. Reveals: animate `opacity` + a small `y` (12–24px), not scale-from-zero. Use `whileInView` with `viewport={{ once: true, margin: "-10%" }}` and stagger children ~0.06–0.1s via `staggerChildren`.
7. Always animate GPU-friendly properties (`transform`, `opacity`). Avoid animating `width`/`height`/`top`/`left`/`box-shadow` directly; animate transforms or use `layout`.
8. Respect `prefers-reduced-motion`: gate non-essential motion (Framer's `useReducedMotion`) and fall back to instant opacity.

## Checklist
- [ ] Durations match scale: micro 120–200ms, reveals 200–300ms, sections 300–500ms.
- [ ] No `linear` on discrete UI transitions.
- [ ] Springs tuned so overshoot is intentional, not accidental jitter.
- [ ] Buttons have distinct hover + tap states on matched timing.
- [ ] Reveals use opacity+y with stagger and `once: true`.
- [ ] Only `transform`/`opacity` animated for performance.
- [ ] `prefers-reduced-motion` honored.
