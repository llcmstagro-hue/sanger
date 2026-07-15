---
name: taste-skill
description: Applies high-level artistic judgment to visual and motion polish, separating refined craft from mediocre defaults. Trigger when a design is "technically fine but feels off," when finalizing a component before shipping, or when asked to make something feel more considered, elegant, or expensive.
---

# Taste Skill

A discernment pass: catch the small tells that make work read as amateur, and push toward the refined choice.

## When to use
- A screen "works" but feels flat, cheap, or slightly off.
- Final polish before merging a visible component.
- Deciding between two options that are both "acceptable."

## Method
1. Interrogate type first — it's where taste shows. Check optical alignment (not just metric), tracking on large Montserrat headings (tighten to ~-0.02em), comfortable line-height on Manrope body (~1.5–1.6), and measure (45–75 chars). Kill orphans and widows in headlines.
2. Audit rhythm and spacing relationships, not absolute values: is vertical spacing proportional to hierarchy? Related items closer than unrelated ones (proximity). Consistent optical gaps beat consistent numeric gaps.
3. Pressure-test color restraint. Premium reads as near-monochrome plus one decisive accent. If more than the SANGER `#E4141C` red is fighting for attention, remove it. Pure black `#000` is usually a tell — use the `#111111` ink.
4. Check contrast and weight distribution: is the page balanced, or does one heavy block tip it? Squint at the screen — the blur reveals whether hierarchy survives.
5. Examine the details that separate craft from default: border-radius consistency, shadow softness (real shadows are large, low-opacity, single-direction — never harsh dark drops), hairline borders at 1px, hover/focus states that actually exist.
6. Evaluate motion for restraint: easing that decelerates naturally, nothing that bounces gratuitously, durations that feel invisible (~150–300ms for UI). Overshoot only where it means something.
7. Ask the taste question: "Would a top studio ship this?" If a specific detail would embarrass, name it and fix it. Prefer removing over adding.

## Checklist
- [ ] Type: optical alignment, tuned tracking/leading, sane measure, no widows.
- [ ] Spacing communicates grouping via proximity, not uniform gaps.
- [ ] Near-monochrome palette; the one accent is decisive; ink is `#111`, not `#000`.
- [ ] Shadows soft/low-opacity; radii and borders consistent.
- [ ] Real hover/focus/active states on interactive elements.
- [ ] Motion restrained; durations feel invisible.
- [ ] Nothing on screen a top studio would flag as amateur.
