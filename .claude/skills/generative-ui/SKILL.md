---
name: generative-ui
description: Renders adaptive, schema-driven UI widgets and components generated from data or intent rather than hand-written per case. Use when building configurable forms, dynamic option panels, or any UI whose fields/controls derive from a data schema — for example the Studio configurator controls or lead-form fields driven by sport data.
---

# Generative UI

Drive UI from data: define a schema (fields, types, constraints, defaults) and render controls generically, so new options appear without bespoke markup per case.

## When to use
- The Studio (`components/studio/StudioControls.tsx`) needs controls that vary by jersey/sport rather than a fixed hardcoded panel.
- Lead-form fields should adapt to the selected sport (`lib/sports.ts`).
- Building a settings/options panel whose shape comes from data.
- Reducing repetitive per-field JSX that all follows the same pattern.

## Method
1. Define the schema as typed data (extend `types/index.ts`): each field has `id`, `label`, `kind` (`text | select | color | toggle | number | range`), options/constraints, default, and optional visibility condition.
2. Keep the schema as the single source: derive Zod validation (`lib/validation.ts`) and Zustand store shape (`store/studioStore.ts`) from it rather than declaring fields three times.
3. Build a small renderer that maps each `kind` to a controlled input using existing UI primitives (`components/ui/Button`, inputs) and Tailwind tokens. One component per kind, selected via a switch.
4. Wire state generically: read/write values by field `id` into the store; validate on change against the derived Zod schema.
5. Support conditional fields: evaluate each field's visibility condition against current values so options reveal/hide dynamically (pairs well with progressive-reveal).
6. Preserve accessibility: every generated control has a `<label htmlFor>`, `aria-invalid` on error, focus-visible styling, and keyboard operability — do not lose these by generating.
7. Guard unknowns: render an explicit fallback/error for an unrecognized `kind` instead of failing silently.
8. Test with two different schemas (e.g. football vs basketball config) to prove the renderer is truly data-driven.

## Checklist
- [ ] Schema is typed and lives in one place; validation and store shape derive from it.
- [ ] One renderer maps `kind` -> control; no per-field bespoke JSX.
- [ ] Values read/written by field id; changes validated against Zod.
- [ ] Conditional visibility works from data.
- [ ] Generated controls keep labels, `aria-invalid`, focus-visible, and keyboard support.
- [ ] Unknown `kind` renders a safe fallback, not a crash.
- [ ] Verified against at least two distinct schemas.
