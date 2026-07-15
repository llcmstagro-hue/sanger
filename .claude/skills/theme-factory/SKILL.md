---
name: theme-factory
description: Generates a complete UI theme from a single seed color — 10-step color ramps, semantic tokens (background/surface/border/text/accent), coordinated light and dark variants, and WCAG AA contrast verification. Use when creating or overhauling a color system, theming an app, or producing dark mode from an existing palette.
---

# Theme Factory

Given a seed color, produce a full theme: ramps → semantic tokens → light/dark variants → contrast check. Work in OKLCH throughout; convert to hex only for final output if required.

## Step 1: Normalize the seed

Convert the seed to OKLCH. Note its hue (H) and chroma (C). If the seed is very dark or light, treat it as one step of the ramp (usually 600 or 500) and rebuild the rest around it rather than forcing it to be the midpoint.

## Step 2: Build the accent ramp (10 steps)

Fix the hue, vary lightness on a fixed schedule, and taper chroma at the extremes (high chroma is impossible near white/black in gamut):

| Step | L | C (× seed C) |
|---|---|---|
| 50  | 0.97 | 0.15 |
| 100 | 0.94 | 0.30 |
| 200 | 0.88 | 0.50 |
| 300 | 0.80 | 0.75 |
| 400 | 0.70 | 0.90 |
| 500 | 0.62 | 1.00 |
| 600 | 0.54 | 1.00 |
| 700 | 0.46 | 0.90 |
| 800 | 0.38 | 0.75 |
| 900 | 0.28 | 0.55 |

Allow hue drift of ±3–6° toward warm at the light end if the raw ramp looks dull. Clamp any out-of-gamut colors by reducing C, never by shifting L (preserves the lightness schedule).

## Step 3: Build the neutral ramp

Same 10 L-steps, but C = 0.005–0.02 with the seed's hue (or its complement for a cooler feel). Pure gray (C = 0) looks dead next to a chromatic accent. Also generate status ramps by reusing the schedule with fixed hues: success H≈150, warning H≈85, danger H≈25, info H≈250 — matching the neutral's chroma temperament.

## Step 4: Map semantic tokens

Semantic tokens are the only names components may use. Ramp steps are internal.

```css
:root {
  --background:      var(--neutral-50);
  --surface:         oklch(1 0 0);          /* cards, inputs */
  --surface-raised:  oklch(1 0 0);          /* + shadow for elevation */
  --border:          var(--neutral-200);
  --border-strong:   var(--neutral-300);
  --text:            var(--neutral-900);
  --text-muted:      var(--neutral-500);
  --accent:          var(--accent-600);
  --accent-hover:    var(--accent-700);
  --accent-subtle:   var(--accent-100);     /* tinted backgrounds */
  --on-accent:       oklch(0.98 0.01 var(--accent-h)); /* text on accent */
}
```

## Step 5: Dark variant

Dark mode is not inversion. Rules:

- Background: L 0.14–0.20 with the neutral's hue, never pure black (except OLED-targeted themes).
- Elevation flips from shadows to lightness: surface = background + 0.04 L, raised = + 0.07 L. Shadows are nearly invisible on dark.
- Accent: lighten by 1–2 ramp steps (600 → 400/500) and cut chroma ~10–20% — saturated colors vibrate on dark backgrounds.
- Text: L ≈ 0.90 primary (not white), L ≈ 0.65 muted. Reduce contrast slightly vs light mode to avoid glare.
- Borders: background + 0.10–0.12 L; hairlines need more contrast on dark than light.

```css
[data-theme="dark"] {
  --background: oklch(0.16 0.01 var(--h));
  --surface:    oklch(0.20 0.012 var(--h));
  --border:     oklch(0.28 0.012 var(--h));
  --text:       oklch(0.90 0.008 var(--h));
  --text-muted: oklch(0.65 0.01 var(--h));
  --accent:     var(--accent-400);
  --accent-subtle: oklch(0.25 0.06 var(--accent-h));
}
```

## Step 6: Contrast verification (WCAG AA)

Check every foreground/background pair actually used. Requirements: 4.5:1 normal text, 3:1 large text (≥24px or ≥18.66px bold) and UI components/borders of controls.

Verify programmatically — never eyeball it:

```js
// npx: culori
import { wcagContrast } from "culori";
const pairs = [
  ["--text", "--background"], ["--text", "--surface"],
  ["--text-muted", "--background"], ["--on-accent", "--accent"],
  ["--accent", "--background"], // link text
];
for (const [fg, bg] of pairs) {
  const ratio = wcagContrast(resolve(fg), resolve(bg));
  console.log(fg, "on", bg, ratio.toFixed(2), ratio >= 4.5 ? "PASS" : "FAIL");
}
```

Failure fixes, in order of preference: adjust L of the token (keep hue/chroma), pick an adjacent ramp step, or restrict the pairing to large text only. Repeat the check for the dark variant — dark-mode muted text is the most common AA failure.

## Deliverable checklist

- Accent ramp (10 steps), neutral ramp (10 steps), status ramps.
- Semantic token block for light and dark, components referencing only semantic tokens.
- Contrast table for both modes with PASS/FAIL per pair; all required pairs PASS AA.
- A small swatch/demo page rendering both modes side by side for visual sanity check.
