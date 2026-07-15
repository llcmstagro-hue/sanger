---
name: frontend-design
description: Pushes UI work away from safe, templated Bootstrap-grade layouts toward a bold, distinctive visual point of view. Trigger when building or restyling a page/section/component, when a design "feels generic," or when asked to make something look premium, editorial, or high-end for the SANGER site.
---

# Frontend Design

Force a strong, committed visual identity instead of the default centered-card-with-shadow layout that AI tends to produce.

## When to use
- Building a new page, hero, section, or landing component.
- A layout "looks generic," "feels like a template," or "needs to feel premium."
- Reworking something that reads as safe/corporate boilerplate.

## Method
1. Pick one organizing idea before coding: an editorial grid, a broken/asymmetric grid, oversized type, or a single dramatic focal image. Write it down in one sentence and design everything to serve it.
2. Commit to hierarchy. One dominant element per viewport (a headline set in Montserrat at clamp(2.5rem, 6vw, 5rem), or one image), then a clear second and third tier. Avoid three equal-weight columns.
3. Use the SANGER system as a constraint, not a crutch: background `#FAFAF8`, ink `#111111`, one red accent `#E4141C`. Red is a scalpel — one deliberate use per view (a CTA, an underline, a number), never as filler.
4. Break the symmetry deliberately: offset content from the container center, let one element bleed to the edge, overlap two blocks, or run text over the baseline grid intentionally.
5. Exploit whitespace and scale contrast. Generous negative space around a big statement beats dense uniform padding. Aim for large jumps between type sizes (ratio ~1.5–2x), not timid 1.2x steps.
6. Choose real composition over decoration: no gratuitous gradients, glows, or emoji. If it's not carrying hierarchy or brand, cut it.
7. Anchor motion to the composition (see `animate`/`design-motion`): a single considered reveal on the focal element, not a wall of fade-ins.
8. Verify against reference-quality sites in the same premium/sports category — would this hold up next to them, or does it look like a starter template?

## Checklist
- [ ] One clear organizing concept, stated in a sentence.
- [ ] A single dominant focal element per viewport, with real size contrast.
- [ ] Red accent used exactly where it earns attention, not sprinkled.
- [ ] At least one intentional asymmetry, overlap, or edge bleed.
- [ ] No default centered card / three-equal-columns fallback.
- [ ] Whitespace used as a design element, not just leftover padding.
- [ ] Nothing decorative that isn't carrying hierarchy or brand.
