---
name: brandkit-sync
description: Keeps a single source of truth for brand guidelines (colors, type, spacing, motion) in sync across Tailwind config, CSS variables, and components. Use when adding or changing a brand token, when values drift between the config and hardcoded styles, or when auditing the codebase for off-brand hex/spacing values.
---

# Brandkit Sync

Maintain one canonical brand definition and propagate it consistently to `tailwind.config.ts`, `app/globals.css` CSS vars, and consuming components, eliminating drift and one-off hardcoded values.

## When to use
- Adding, renaming, or retiring a brand token (new accent color, updated font, motion timing).
- You spot a raw hex, px, or magic number in a component that should be a token.
- Onboarding a new section that must stay on-brand.
- Periodic audit to catch divergence between Tailwind theme and CSS vars.

## Method
1. Establish the source of truth. In this repo that is `tailwind.config.ts` `theme.extend` plus the `:root` custom properties in `app/globals.css`. Confirm which values are duplicated across both and pick one to own each concern.
2. When adding a token: define it once (Tailwind for utility classes; a CSS var when it must be read at runtime or by Framer Motion), then reference it everywhere else rather than copying the literal.
3. Audit for drift: grep components for raw values that should be tokens.
   - Colors: `#[0-9a-fA-F]{3,6}` and `rgb(`/`rgba(` in `components/` and `app/`.
   - Spacing/radius: suspicious inline px in `style={{...}}` or arbitrary Tailwind values like `w-[137px]`.
4. Replace found literals with the mapped token; if no token exists, add it to the source of truth first, then reference it.
5. Keep Tailwind and CSS vars aligned: if a color exists in both places, ensure identical values; prefer having the CSS var reference the Tailwind value or documenting the pairing.
6. Verify visually: run the app and check hero, Studio (`components/studio/`), and the lead form still render on-brand across light surfaces.
7. Record the token change in the decisions trail (see feedback-loops skill) so rationale survives.

## Checklist
- [ ] Each brand value defined exactly once and referenced elsewhere.
- [ ] No raw hex/rgb color literals remain in `components/` or `app/` (except the source of truth).
- [ ] No arbitrary Tailwind values (`[...]`) that duplicate an existing token.
- [ ] Tailwind theme and `globals.css` CSS vars agree on shared values.
- [ ] App renders on-brand across hero, Studio, and lead form after the change.
- [ ] Token add/change logged in the decisions trail.
