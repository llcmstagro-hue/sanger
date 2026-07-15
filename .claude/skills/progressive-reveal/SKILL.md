---
name: progressive-reveal
description: Reveals content progressively — scroll-triggered entrances and step-by-step disclosure — to reduce overwhelm and improve perceived performance. Use when building long marketing sections, multi-step flows like the Studio or lead form, or when a dense screen should be broken into staged reveals.
---

# Progressive Reveal

Stage how content appears — on scroll and by step — so pages feel lighter, guide attention, and load perceptibly faster.

## When to use
- Building or polishing a long landing/sport page with many stacked sections.
- A multi-step flow: Studio configuration steps, or a lead form split into stages.
- A dense section that overwhelms users when shown all at once.
- Improving perceived performance where actual load is already reasonable.

## Method
1. Prefer the existing `components/motion/Reveal.tsx` (Framer Motion) for scroll entrances. Wrap section blocks rather than reinventing intersection logic.
2. Trigger on viewport entry with `once: true` so content does not re-animate on scroll-back; keep it subtle (short distance, ~200-400ms, ease-out).
3. Stagger children for lists/grids (sports grid, works gallery) with a small per-item delay (~50-80ms) so items cascade, not pop simultaneously.
4. For step-by-step disclosure (Studio, multi-stage form): show one meaningful step at a time, with clear progress (step N of M) and forward/back controls; keep prior answers visible or summarized.
5. Reveal validation and help text contextually: show a field's hint/error when it becomes relevant, not all upfront (pairs with frustration-checks).
6. Respect `prefers-reduced-motion`: gate entrance animations so reduced-motion users get instant, non-animated content (check `Reveal` honors this; add a guard if not).
7. Protect real performance: reveal-on-scroll must not block content for users or crawlers — content should exist in the DOM/SSR and animate in via opacity/transform, never mount late or hide from SEO.
8. Verify: scroll the page and confirm no layout shift (CLS) from reveals and that keyboard/tab order reaches revealed content.

## Checklist
- [ ] Uses existing `Reveal` component; entrances are `once` and subtle.
- [ ] Lists/grids stagger with a small per-item delay.
- [ ] Multi-step flows show clear progress and preserve prior input.
- [ ] `prefers-reduced-motion` disables entrance animation.
- [ ] Content is SSR/DOM-present (animated via opacity/transform), not withheld from crawlers.
- [ ] No layout shift introduced; keyboard order reaches revealed content.
