---
name: brandkit
description: Produces complete brand guidelines in one pass — logo usage, color system, typography, voice/tone, spacing, and imagery rules. Trigger when asked to create a brand kit, style guide, brand guidelines, or to document the visual identity of the SANGER site.
---

# Brandkit

Assemble a coherent, usable brand guideline document in a single structured pass, grounded in the SANGER identity.

## When to use
- "Create a brand kit / style guide / brand guidelines."
- Documenting the visual identity for consistency across pages or teams.
- Onboarding new contributors to the SANGER look and voice.

## Method
Produce each section below; keep it prescriptive (rules and specs), not descriptive fluff.

1. **Brand essence** — one paragraph: SANGER is a premium team-sports uniform manufacturer. Capture the positioning (precision, performance, understated premium) in 3–5 adjectives that guide every other decision.
2. **Logo** — usage rules: clear space (min = cap-height of the wordmark), minimum size, approved color versions (ink on paper, paper on ink, single-color), and a "don'ts" list (no stretching, recoloring outside palette, drop shadows, gradients, rotation).
3. **Color** — document the system in OKLCH + hex: paper `#FAFAF8`, ink `#111111`, single accent red `#E4141C`, plus derived neutrals/surfaces. State roles (accent = one deliberate use per view), pairings, and WCAG contrast pass/fail for key combos. Reference `theme-factory`.
4. **Typography** — Montserrat for headings, Manrope for body. Give the type ramp (sizes, weights, line-height, letter-spacing), usage per level, and rules for measure and hierarchy. Note that product copy is Russian and must render correctly (Cyrillic support).
5. **Spacing & layout** — the 4px grid (see `impeccable`), container widths, section rhythm, and grid usage. Show the allowed spacing scale.
6. **Motion** — the motion signature: shared easing curve, duration set, reveal pattern, restraint principles (reference `animate`/`design-motion`).
7. **Imagery & iconography** — photography direction (athletes, fabric detail, high-contrast, minimal), treatment, aspect ratios; icon style (stroke weight, corners).
8. **Voice & tone** — in Russian context: confident, precise, no hype. Give do/don't example phrasings.
9. Deliver as a single scannable document (Markdown, or an HTML artifact with live color swatches and type specimens) with copy-paste-ready tokens.

## Checklist
- [ ] All sections present: essence, logo, color, type, spacing, motion, imagery, voice.
- [ ] Color specified in OKLCH + hex with roles and contrast results.
- [ ] Type ramp fully specified with Montserrat/Manrope and Cyrillic note.
- [ ] 4px spacing grid and container/layout rules documented.
- [ ] Logo clear-space, min-size, and don'ts included.
- [ ] Voice/tone shown with concrete do/don't examples.
- [ ] Tokens are copy-paste ready and consistent with the codebase.
