---
name: impeccable
description: Enforces precision craft in UI code — OKLCH color definitions, a strict 4px/8px spacing grid, consistent border radii, and optical alignment. Use when polishing UI, defining design tokens, or when output must be pixel-perfect and internally consistent.
---

# Impeccable

Precision is a system, not a vibe. Every value in the UI must come from a defined scale. If a value isn't on a scale, it's a bug.

## Color: OKLCH only

Define all colors in OKLCH. It is perceptually uniform — equal lightness steps look equal, unlike HSL where `hsl(60 100% 50%)` and `hsl(240 100% 50%)` differ wildly in perceived brightness.

Syntax: `oklch(L C H)` — L: 0–1 lightness, C: chroma (0 = gray, ~0.37 max in sRGB), H: hue angle 0–360.

```css
:root {
  --red-500: oklch(0.55 0.20 25);     /* brand red */
  --red-600: oklch(0.48 0.19 25);     /* hover — drop L, keep C/H */
  --gray-50:  oklch(0.98 0.005 90);
  --gray-200: oklch(0.92 0.008 90);
  --gray-500: oklch(0.62 0.01 90);
  --gray-900: oklch(0.22 0.01 90);
}
```

Rules:
- Derive states by shifting L only: hover = L −0.06, active = L −0.10, disabled = C ×0.3 and L toward background.
- Keep hue constant across a ramp; drift hue max ±4° for warmth at the light end.
- Grays are never pure: give them C 0.005–0.015 with a hue matching the brand's temperature.
- Provide hex fallbacks only if targeting browsers older than 2023; otherwise OKLCH everywhere, including shadows: `box-shadow: 0 1px 3px oklch(0.2 0.02 260 / 0.15)`.

## Spacing: 4px grid, 8px rhythm

All spacing, sizing, and positioning values are multiples of 4. Layout-level gaps are multiples of 8.

Token scale:

```css
:root {
  --space-1: 4px;   /* icon-to-label, tight pairs */
  --space-2: 8px;   /* inside compact components */
  --space-3: 12px;  /* input padding, chip padding */
  --space-4: 16px;  /* card padding (compact), gaps in forms */
  --space-6: 24px;  /* card padding (default) */
  --space-8: 32px;  /* between component groups */
  --space-12: 48px; /* between subsections */
  --space-16: 64px; /* between sections */
  --space-24: 96px; /* page sections, hero padding */
}
```

- Forbidden values: 5, 10, 13, 15, 18, 22, 25, 30px and any other off-grid number. If a mockup says 15px, use 16px.
- Component heights on the grid: inputs/buttons 32 / 40 / 48px. Line-heights in px must also land on 4px multiples (e.g. 14px/20px, 16px/24px, 18px/28px).
- Exception: 1–2px values are allowed for borders and hairline adjustments only.

## Border radius: one system

Pick a base radius and derive everything:

```css
:root {
  --radius-sm: 6px;   /* chips, tags, small controls */
  --radius-md: 10px;  /* buttons, inputs */
  --radius-lg: 14px;  /* cards, popovers */
  --radius-xl: 20px;  /* modals, large surfaces */
}
```

- Nested radius rule: inner radius = outer radius − padding between them (an 14px card with 8px padding gives inner elements 6px). Never nest a larger radius inside a smaller one.
- Never mix "mostly rounded" with one sharp-cornered element unless it is a deliberate, repeated motif.

## Optical alignment

Mathematical centering often looks wrong. Correct for perception:

- Play/triangle icons: nudge 1–2px toward the pointing direction inside their circle.
- Text next to icons: align icon to the text's cap height or x-height, not the line box — usually `translateY(1px)` on a 16px icon beside 14px text.
- ALL-CAPS labels and text in buttons sit optically low; add 1px more padding-bottom than padding-top or use `translateY(-0.5px)`.
- Circular avatars/icons need to be ~5–8% larger than square ones at the same nominal size to look equal.
- Hanging punctuation and bullets: let quote marks and list markers sit in the margin so text edges align.

## Pixel discipline checklist

- No fractional pixel positions on hairlines (blurry borders); ensure borders land on device pixels or use `transform: translateZ(0)` sparingly.
- Consistent icon set: one stroke width (usually 1.5 or 2px) across all icons, one size per context (16 inline, 20 buttons, 24 nav).
- Text colors: exactly one primary, one secondary, one disabled/tertiary. Not five grays.
- Focus rings: identical treatment everywhere — `outline: 2px solid var(--accent); outline-offset: 2px`.
- Shadows: define 3 elevations max, reuse them; never hand-roll a new shadow per component.
- Zoom the result to 200% and check: misaligned baselines, off-grid gaps, inconsistent radii all become obvious.
