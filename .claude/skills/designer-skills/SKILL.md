---
name: designer-skills
description: Produces professional design-to-developer handoff specs — redlines, spacing annotations, component states, asset export conventions, and responsive breakpoint documentation. Use when documenting a design for implementation by someone else, or when a build needs an unambiguous spec instead of a mockup.
---

# Designer Skills: Handoff Specs

A handoff is complete when a developer can build the design without asking a single question or inventing a single value. Ambiguity in the spec becomes inconsistency in the product.

## Redlines

Annotate a copy of the design (or a structured text spec) with measurements:

- Dimensions: width/height of every fixed-size element; label fluid elements as `fill`, `hug`, or `max-width: Npx`.
- Spacing: every gap between adjacent elements, and padding on every container. Annotate one instance of a repeating pattern and mark it "applies to all X".
- Reference tokens, not just pixels: `16px (--space-4)` — the token is what the developer should type.
- Type: for each text style, give family, size, weight, line-height, letter-spacing, color token, and case treatment. Name the styles (`heading-lg`, `body-sm`) and reuse names.
- Color: token name + resolved value for every fill, border, and shadow. Never "gray" or "the brand color".

Text redline format when image annotation isn't available:

```
Card (listing-card)
  container: fill × hug, padding 24 (--space-6), radius 14 (--radius-lg),
             bg --surface, border 1px --border, shadow --elevation-1
  image: fill × 180 fixed, radius 8 top corners only, object-fit: cover
  gap image→title: 16   title: heading-md, --text, max 2 lines then ellipsis
  gap title→meta: 4     meta: body-sm, --text-muted
```

## Component states (all required)

Spec every interactive component in all applicable states. A component spec missing states is not done:

- default, hover, active/pressed, focus-visible, disabled
- plus where relevant: loading, error, selected, checked, readonly, empty

For each state, list only the deltas from default:

```
Button / primary
  default:  bg --accent, text --on-accent, radius --radius-md, h 40, px 16
  hover:    bg --accent-hover (150ms ease-out)
  active:   bg --accent-active, translateY(1px)
  focus:    outline 2px --accent, offset 2px (never remove outline)
  disabled: bg --neutral-200, text --neutral-500, cursor not-allowed, no hover
  loading:  spinner 16px replaces label, width locked to pre-loading width
```

Include behavior notes code can't guess: what happens on double-click during loading, whether disabled shows a tooltip, tab order, and which element receives focus when a dialog opens.

## Responsive breakpoint documentation

Document breakpoints as behavior changes, not just widths:

```
Breakpoints: 375 (mobile) / 768 (tablet) / 1200 (desktop) / 1440 (max content width)

Hero
  ≥1200: 12-col grid; copy cols 1–7, media 8–13; H1 64/68
  768–1199: copy cols 1–12, media below full-width; H1 44/48
  <768: single column, section padding 48→24 horizontal; H1 32/36;
        nav collapses to menu button; CTA becomes full-width
```

- State what happens *between* breakpoints: which elements are fluid, what clamps (`font-size: clamp(2rem, 5vw, 4rem)`), what min/max widths apply.
- Flag content rules: truncation vs wrap per text element, image crop behavior (`cover` focal point), minimum touch target 44×44 on mobile.

## Asset export conventions

- Icons and logos: SVG, viewBox preserved, fills set to `currentColor` where they should inherit; strokes outlined only if the icon must scale non-uniformly.
- Photos/raster: export @1x and @2x, WebP (or AVIF) with JPEG fallback if required; record intended display size so devs can set `width/height` attributes and avoid layout shift.
- Naming: `component-variant-state@scale.ext`, kebab-case — `icon-chevron-down.svg`, `hero-kapolei@2x.webp`. No spaces, no `Final_v3 (2)`.
- List every asset the build needs in a manifest with source location; missing assets discovered mid-build are a handoff failure.
- Fonts: exact families, weights, and where to load them from (Google Fonts URL or licensed files); the fallback stack; and `font-display` policy.

## The no-guessing checklist

Before delivering a handoff, confirm a developer never has to guess:

1. Every spacing value annotated or derivable from a stated pattern.
2. Every color and text style has a token name.
3. Every interactive element specced in all its states, including focus.
4. Responsive behavior stated for every breakpoint, including the awkward middle widths.
5. All assets exported, named per convention, and listed.
6. Edge content covered: longest realistic string, empty state, error state, loading.
7. Motion specced with duration + easing tokens (see the animate skill), or explicitly "no animation".
8. Open questions section is empty — or explicitly listed and assigned, never silent.
