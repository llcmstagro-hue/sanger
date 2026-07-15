---
name: theme-factory
description: Generates cohesive light and dark color palettes from a single seed color using OKLCH, producing tokenized scales for background, surface, text, borders, and accent. Trigger when creating or extending a theme, adding dark mode, deriving tints/shades, or building a color token set from a brand color.
---

# Theme Factory

Turn one seed color (e.g. SANGER red `#E4141C`) into a full, consistent light+dark theme using OKLCH so lightness stays perceptually even.

## When to use
- Bootstrapping a theme or color-token file.
- Adding a dark mode that mirrors the light theme.
- Deriving a ramp of tints/shades from a brand or accent color.

## Method
1. Convert the seed to OKLCH and record its `L C H`. For SANGER red that's roughly `oklch(0.55 0.22 25)`. Hue (H) is the brand anchor — keep it fixed across the accent ramp.
2. Build the accent ramp by varying L in even steps while gently reducing C at the extremes (very light/dark colors can't hold high chroma): e.g. 0.95, 0.85, 0.72, 0.62, 0.55 (base), 0.46, 0.38, 0.30 at hue 25.
3. Derive neutrals from the accent hue for warmth, not pure gray: use very low chroma (C ≈ 0.005–0.02) at the same or nearby hue. This gives paper `oklch(0.98 0.005 95)` (SANGER `#FAFAF8`) and ink `oklch(0.18 0 0)` (`#111`) a subtle relationship.
4. Define semantic tokens, not raw colors: `--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-hover`, `--focus`. Components reference only semantic tokens.
5. Generate the dark theme by inverting lightness intent, not by flipping values 1:1. Backgrounds go dark but not pure black (`oklch(0.16 0.005 95)`), text goes to a soft off-white (`oklch(0.95 0 0)`), and the accent usually needs +L / slightly -C to stay vivid on dark.
6. Hold contrast, not lightness: check every text/bg pair against WCAG AA (4.5:1 body, 3:1 large). OKLCH lightness is a good proxy but verify actual contrast ratios.
7. Emit as CSS variables under `:root` and `[data-theme="dark"]` (or `.dark`), wired into `tailwind.config` theme colors so classes like `bg-surface text-muted` work.
8. Keep chroma restrained overall for a premium feel — one saturated accent against near-neutral surfaces, matching the SANGER single-red discipline.

## Checklist
- [ ] Seed converted to OKLCH; accent ramp shares one fixed hue.
- [ ] Chroma reduced at light/dark extremes so colors stay clean.
- [ ] Neutrals carry a faint shared hue, not pure gray.
- [ ] Semantic tokens defined; components reference only those.
- [ ] Dark theme derived by intent, backgrounds not pure black.
- [ ] Every text/bg pair passes WCAG AA (verified ratios).
- [ ] Tokens emitted as CSS vars and wired into tailwind.config.
