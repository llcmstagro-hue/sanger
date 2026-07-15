---
name: hi-fi-mockups
description: Produces high-fidelity, pixel-accurate mockups of a page or section before writing production code, so design intent is locked and agreed before build. Use when starting a new page/section (a sport landing, the Studio, the lead form), when a redesign is requested, or when a stakeholder wants to preview look-and-feel before committing engineering time.
---

# Hi-Fi Mockups

Lock the visual design of a SANGER page/section as a self-contained, pixel-accurate mockup before touching production components, so intent is agreed up front and the build becomes a faithful translation.

## When to use
- A new page or section is requested (new sport route under `app/[sport]`, a Studio revamp, a new hero).
- A redesign of an existing section where visual direction is uncertain.
- Before estimating or building, when the "look" must be signed off first.
- When comparing 2-3 layout directions side by side.

## Method
1. Gather constraints: read `tailwind.config.ts` for the real tokens (colors, spacing, fonts, breakpoints) and `app/globals.css` for CSS vars. The mockup MUST use these, not invented values.
2. Pull reference content from `lib/sports.ts`, `lib/studioAssets.ts`, or the relevant data file so copy and imagery are realistic, not lorem ipsum.
3. Build the mockup as a single static HTML file (inline `<style>` using the project palette) or a throwaway `.tsx` under `preview/`. Do not wire it into routing or the Zustand store yet.
4. Match reality: exact hex values, font stack, border radii, shadow ramp, and the 8pt spacing rhythm. Include the mobile breakpoint (`sm`) and desktop side by side.
5. Represent interaction states statically: hover, focus, active, error, empty, loading. For the lead form show validation-error and success states; for the Studio show a configured jersey state.
6. Annotate: add short callouts naming the Tailwind classes/tokens each block should map to, so the build step is mechanical.
7. Render and screenshot (Playwright or browser) at 390px and 1440px widths. Present both for sign-off.
8. Only after approval, translate the mockup into real components under `components/` and remove the throwaway file.

## Checklist
- [ ] Mockup uses actual `tailwind.config.ts` tokens (no invented colors/spacing).
- [ ] Realistic copy/imagery sourced from `lib/` data, not placeholders.
- [ ] Mobile (390px) and desktop (1440px) both shown.
- [ ] Interaction/edge states represented (hover, focus, error, empty, loading, success).
- [ ] Token/class annotations included for a mechanical build handoff.
- [ ] Throwaway mockup kept out of routing/store until approved, then deleted.
- [ ] Stakeholder sign-off recorded before production code begins.
