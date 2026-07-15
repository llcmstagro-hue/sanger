---
name: design-motion
description: Audits existing motion in a UI through three lenses — purpose, continuity, and personality — and prescribes fixes for jank, missing choreography, and incoherent staggering. Use when reviewing or improving animation already present in an interface, not when writing transitions from scratch.
---

# Design Motion

Audit motion in an existing UI with three lenses, in order. Each lens has a question, symptoms to look for, and fixes. Run the whole audit before changing anything — motion problems are usually systemic, not local.

## Lens 1: Purpose — does each animation do a job?

Every animation must do at least one of: show where something came from or went, communicate state change, direct attention, or mask latency. If it does none, delete it.

Symptoms of purposeless motion:
- Idle animations (floating icons, pulsing cards, auto-playing loops) on content that isn't loading.
- Elements that fade-and-slide in on scroll for no reason — scroll reveals are only purposeful when they pace reading of sequential content.
- Attention-directing motion pointing at things that aren't important (animated badges on every menu item).
- Hover effects so elaborate they delay reading the label (flips, wipes, letter-by-letter scrambles on nav links).

Fixes: delete first. If the element needs feedback, replace with the smallest sufficient signal (a 150ms color shift beats a 600ms shimmer).

## Lens 2: Continuity — does the interface feel physically coherent?

Objects should appear to persist. Things that pop in/out of existence, teleport, or reflow abruptly break the spatial model.

Symptoms:
- Modals/menus that appear instantly with no origin (should grow from their trigger or fade up from below).
- List items that jump when one is added/removed instead of making room (use FLIP or `view-transition`).
- A panel that slides in from the left but exits by fading — enter and exit must be inverses.
- Navigation where page A slides left but going "back" also slides left (back must reverse the spatial direction).
- Layout shift during load: skeletons that don't match final content dimensions.

Fixes:
- Give every appearing element an origin: `transform-origin` at its trigger, or a directional slide from the edge it belongs to.
- Enter/exit symmetry: same axis, reversed direction, exit ~75% of enter duration.
- For reordering/insertion, animate siblings' positions (FLIP technique or the View Transitions API), never let them snap.
- Shared-element continuity for master→detail: the thumbnail should move/scale into the detail view's hero if the stack supports it.

## Lens 3: Personality — does the motion match the brand's temperament?

Motion has a voice. Choose one adjective set and enforce it everywhere:

- Calm/premium: long durations (400–700ms), strong ease-out, small distances, no overshoot.
- Crisp/productive: short durations (120–250ms), tight easings, minimal choreography.
- Playful: springs and overshoot, slightly larger scales — small elements only.

Symptoms of personality incoherence: a springy bounce on buttons next to a slow elegant hero fade; five different easing curves across components; durations ranging 100ms–1s with no system.

Fix: pick the temperament, define 2–3 easing tokens and 3 duration tokens, and normalize every animation onto them.

## Jank hunt (run alongside the lenses)

- Open DevTools Performance panel, record while triggering each animation, look for frames over 16ms.
- Common causes: animating `height/width/top/left/margin`, `box-shadow`, or `filter: blur()`; layout thrash from reading `offsetHeight` inside animation frames; unthrottled scroll handlers.
- Fixes: move to `transform`/`opacity`; `will-change: transform` on elements about to animate (remove after); replace scroll handlers with IntersectionObserver or CSS scroll-driven animations.
- Check low-power conditions: 4x CPU throttle in DevTools. If it stutters there, simplify.

## Choreography and stagger rules

When multiple elements animate together:

- Stagger siblings by 30–60ms per item; total stagger window under 400ms. Cap staggered items at ~8 — beyond that, batch the rest into one group.
- Order must follow meaning: reading order for content, hierarchy for emphasis (headline → subline → CTA), spatial order for grids (row by row, or radiating from the interaction point).
- Parent before children: a card animates in, then its contents; never contents floating in before their container.
- One conductor: simultaneous unrelated animations in different screen regions compete — sequence them or cut one.
- Stagger delays go on enter only; exits leave together (staggered exits feel slow).

## Audit report format

For each finding, report: location → lens violated → symptom → prescribed fix → priority (P1 breaks comprehension or causes jank; P2 incoherence; P3 polish). Lead with P1 jank and continuity breaks; personality tuning comes last.
