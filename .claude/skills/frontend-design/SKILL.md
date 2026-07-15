---
name: frontend-design
description: Produces bold, distinctive web layouts with strong hierarchy, oversized type, asymmetry, and generous whitespace. Use when building or restyling any web page, landing page, hero, or app shell, especially to avoid generic "AI-looking" design.
---

# Frontend Design

Build layouts that look designed on purpose, not generated. The default failure mode is the "AI look": a centered card on a purple gradient, three equal feature columns with icons, everything symmetric, everything medium-sized. Refuse that mode.

## Anti-generic rules (hard constraints)

- NEVER center a lone card on a full-viewport gradient background.
- NEVER use three identical icon+title+blurb columns as the primary content pattern.
- No purple-to-blue gradients, no glassmorphism blur cards, no floating 3D blobs unless the brand explicitly calls for them.
- At most one decorative gradient per page, and it must not carry text.
- Do not make every section the same width, same alignment, same rhythm. Vary at least one of: column count, alignment, background, type scale per section.
- Emoji are not icons. Use a real icon set (inline SVG) or none.

## Hierarchy

Every screen needs exactly one dominant element. Check with the squint test: blur your mental view of the page — one thing must clearly win.

- Size ratio between the H1 and body text should be at least 3:1 on marketing pages (e.g. 72px vs 18px), 2:1 in apps.
- Establish hierarchy with maximum two levers at once (size + weight, or size + color). Using all levers everywhere flattens hierarchy.
- De-emphasize instead of emphasizing: make secondary things smaller/grayer rather than making the primary thing louder.

## Oversized type

- Hero headlines: `clamp(2.5rem, 8vw, 7rem)`, tight line-height (0.95–1.1), letter-spacing -0.02em to -0.04em for large sizes.
- Prefer few words set huge over many words set medium. Cut headline copy until it fits in 2 lines at desktop width.
- Use weight contrast inside the headline (one phrase bold or italic, rest regular) instead of a second color.

## Layout grid and asymmetry

Work on a 12-column grid, but occupy it asymmetrically:

- Hero text spanning columns 1–7, media in 8–12 (or media bleeding off-canvas).
- Offset vertical starts: let the image start 80–120px lower than the headline.
- Full-bleed sections alternating with contained (max-width 1100–1200px) sections.
- Break the grid once per page — one element that overlaps a section boundary or bleeds off the edge. Once, not everywhere.

```css
.hero {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(16px, 2vw, 32px);
}
.hero__copy { grid-column: 1 / 8; }
.hero__media { grid-column: 8 / 13; margin-top: 96px; }
@media (max-width: 768px) {
  .hero__copy, .hero__media { grid-column: 1 / -1; margin-top: 0; }
}
```

## Spacing scale

Use a fixed scale and nothing off-scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192px.

- Section padding: 96–192px vertical on desktop, 48–64px mobile.
- Whitespace is the cheapest way to look expensive. When a layout feels cheap, first double the spacing between sections, then reassess.
- Related items close (8–16px), unrelated items far (48px+). Proximity is hierarchy.

## Hero composition checklist

1. One dominant headline (oversized, tight leading).
2. One subline, max 2 sentences, ~50–65ch measure.
3. One primary CTA; secondary CTA visually quiet (text link, not twin button).
4. Asymmetric placement — text block off-center or media offset.
5. Something anchoring the fold: a bleed image, a stat row, or the top of the next section peeking in.

## Color and surface

- Pick one accent color and use it for less than 10% of the page — CTAs, links, key highlights only.
- Prefer near-black (#111–#1a1a1a) and off-white (#fafaf8, #f5f4f0) over pure #000/#fff.
- Section backgrounds: alternate at most 2–3 surface tones; a single dark section creates rhythm.

## Self-review before finishing

- Squint test: is there one dominant element per screen?
- Could this page be mistaken for a template? If yes, add asymmetry or scale contrast.
- Is any text sitting on a gradient? Fix it.
- Is every section the same layout? Vary at least two sections.
- Does the type scale span at least 4x from smallest to largest text?
