---
name: taste-skill
description: Applies high-end aesthetic judgment — restraint, editorial typography, sophisticated motion, and deliberate grid-breaking — to evaluate and elevate a design. Use when a design works but feels ordinary, when aiming for award-site-level polish, or when deciding what to remove rather than add.
---

# Taste

Taste is mostly subtraction. A tasteful design is one where nothing can be removed without loss, and nothing is competing for attention that shouldn't be. When asked to make something "nicer" or "more premium", remove and refine before adding.

## The restraint hierarchy

When elevating a design, work in this order:

1. Remove — decorative borders, redundant labels, extra colors, extra font weights, boxes around things that don't need boxes.
2. Align — everything to a grid and to each other; shared edges create calm.
3. Space — increase whitespace 1.5–2x from the first instinct; premium design breathes.
4. Refine — then, and only then, consider adding: one texture, one motion, one moment of surprise.

Hard limits for a tasteful page:
- Max 2 typefaces. Max 4 weights total across both.
- One accent color. Everything else is a neutral ramp.
- One "moment" per page — a single bold gesture (huge type, a bleed image, an unexpected interaction). Two moments compete; three is noise.

## Editorial typography

Borrow from print, not from dashboards:

- Big serif or high-contrast display face for headlines; quiet grotesque for body. Pairing lives on contrast: if the display face is loud, the body must be invisible.
- Measure: body text 55–70 characters per line. Never full-width paragraphs.
- Use real typographic detail: proper quotes (“ ”), en/em dashes, `font-variant-numeric: tabular-nums` for data, `text-wrap: balance` on headlines.
- Eyebrow labels: 11–13px, uppercase, letter-spacing 0.08–0.12em, muted color — used above headlines to add structure without size.
- Leading: tight for display (1.0–1.1), relaxed for body (1.5–1.65). A common taste failure is display type with body leading.
- Don't justify text on the web. Don't center paragraphs longer than 2 lines.

## Sophisticated motion

- Everything eases; nothing is linear except opacity-only fades.
- Slow is confident: hero and page-level transitions at 500–800ms with strong ease-out feel expensive; 200ms everywhere feels twitchy.
- Move few things. One element animating with intent beats ten elements wiggling.
- Motion should reveal structure (staggered lines of a headline, a mask wipe following the grid), not decorate (no floating, pulsing, or bouncing idle animations).
- Hover states: subtle transform (scale 1.02, or translateY(-2px)) plus a color/shadow shift, 200–250ms. Never rotate, never bounce.

## When to break the grid

Grid-breaking is an accent, governed by rules:

- Break it once per view, deliberately: an image bleeding across a section boundary, a headline overlapping media, a rotated caption.
- The break must still relate to the grid — overlap by a full column or half a spacing step, not a random offset.
- Everything else on the page must be strictly on-grid, or the break reads as sloppiness instead of intent.

## Calibration references

Aim at the standard of Awwwards/FWA-level marketing sites and editorial products: think Stripe's marketing pages, Linear's landing pages, Apple product pages, high-end studio portfolios (e.g. Locomotive, Basement Studio) and magazines like The Gentlewoman. Common properties to emulate:

- Massive type juxtaposed with tiny meta-text; almost nothing mid-sized.
- Neutral palettes with one strategic accent.
- Scroll choreography tied to content structure, not gratuitous parallax.
- Custom details in small places: selection color, focus rings, list markers, 404 pages.

## Taste evaluation checklist

Score the design against each; fix the failures lowest in the list first:

1. Can anything be deleted with no loss? Delete it.
2. Is there exactly one focal point per screen?
3. Do all edges align to something? (Trace left edges — they should form few, clean vertical lines.)
4. Is the palette ≤ 1 accent + neutrals?
5. Does the type scale skip the middle? (Huge + small beats an even ramp of mediums.)
6. Is motion scarce, eased, and structural?
7. Is there one memorable gesture — and only one?
8. Would this hold up printed in black and white? (Hierarchy must survive without color.)

## Anti-taste patterns to flag on sight

- Gradient text on headlines; drop shadows on text.
- Rounded-corner cards for every single content group ("card disease").
- Icon + heading + paragraph repeated 6+ times.
- Badges, pills, and emoji seasoning copy.
- Every section title centered with a decorative underline.
- Stock 3D illustrations or generic "abstract blob" art.
