---
name: impeccable
description: Enforces systematic design tokens — OKLCH colors and a strict 4px spacing grid — and eliminates arbitrary hex values and off-grid spacing. Trigger when writing or reviewing Tailwind styles, adding colors/spacing, refactoring CSS, or when a diff introduces magic numbers like `#3a3a3a`, `padding: 13px`, or `top-[7px]`.
---

# Impeccable

Keep the styling layer disciplined: every color goes through OKLCH tokens, every spatial value snaps to a 4px grid.

## When to use
- Adding or editing colors, spacing, radii, or sizing in Tailwind/CSS.
- Reviewing a diff for stray hex codes or arbitrary pixel values.
- Setting up or extending the design token scale.

## Method
1. Ban raw hex in components. Colors live as CSS variables in OKLCH, e.g. `--ink: oklch(0.15 0 0)`, `--paper: oklch(0.98 0.005 95)`, `--accent: oklch(0.55 0.22 25)` (SANGER red), referenced via Tailwind theme tokens.
2. Convert any incoming hex to OKLCH before adding it. Keep lightness/chroma/hue explicit so tints and shades are derived by nudging L (lightness) and C (chroma), not by eyeballing new hex.
3. Snap every spacing value to the 4px grid: allowed steps are 4, 8, 12, 16, 24, 32, 48, 64, 96. Map these to Tailwind's default scale (`p-1`=4, `p-2`=8, `p-4`=16, `p-6`=24, `p-8`=32...). No `p-[13px]`, no `mt-[7px]`.
4. Reject arbitrary-value brackets (`w-[327px]`, `gap-[10px]`) unless the value is a true one-off constrained by content (an asset's intrinsic size). Prefer a scale token; if a new step is genuinely needed, add it to the theme, don't inline it.
5. Radii and border widths follow their own small scales (radius 0/4/8/16/full; border 1/2). Keep them tokenized too.
6. Grep the diff for violations: `#[0-9a-fA-F]{3,6}`, `\[[0-9]+px\]`, `rgb(`, `hsl(`. Each hit must be justified or replaced.
7. When a value can't snap cleanly, fix the root cause (an off-grid asset, an unaligned line-height) rather than papering with an arbitrary offset.

## Checklist
- [ ] No raw hex in component/markup files — all colors via OKLCH tokens.
- [ ] Every spacing value is on the 4/8/12/16/24/32/48/64/96 grid.
- [ ] No arbitrary `[Npx]` brackets except justified content-locked one-offs.
- [ ] Tints/shades derived by adjusting OKLCH L/C, not new hex.
- [ ] Radii and borders drawn from their tokenized scales.
- [ ] Diff grep for hex/px-brackets/rgb/hsl comes back clean or justified.
