---
name: designer-skills
description: Produces professional design specs and redlines for engineering handoff — precise measurements, tokens, states, and behavior annotations. Trigger when asked to spec a component/screen, create redlines, document a design for implementation, or prepare a design-to-dev handoff.
---

# Designer Skills

Turn a design into an unambiguous implementation spec so an engineer can build it correctly without guessing.

## When to use
- "Spec this component," "create redlines," "document for handoff."
- Preparing a design so another dev (or future you) can implement exactly.
- Closing gaps between a mockup and buildable requirements.

## Method
1. Frame the spec: name the component/screen, its purpose, where it's used, and its responsive scope (which breakpoints).
2. **Redline measurements** — annotate exact spacing (padding, margins, gaps) using the 4px grid tokens (see `impeccable`), element sizes, and container/max-widths. Express as tokens (`space-4`, `p-6`) not loose pixels wherever possible.
3. **Color** — specify every fill, text, border, and shadow as a semantic OKLCH token (`--surface`, `--text-muted`, `--accent`) with the resolved value. Note the SANGER red is a deliberate accent, not decoration.
4. **Typography** — per text element: font (Montserrat/Manrope), size, weight, line-height, letter-spacing, and truncation/wrapping behavior. Preserve Russian copy verbatim.
5. **States** — document every interactive state: default, hover, focus-visible, active/pressed, disabled, loading, error, and empty. Specify the visual delta and the transition (duration/easing, see `animate`).
6. **Behavior & logic** — annotate interactions: what a click/submit does, validation rules (tie to Zod schema fields if applicable), conditional visibility, and edge cases (long text, zero items, overflow).
7. **Responsive behavior** — describe layout changes per breakpoint (stack order, hidden elements, size changes), not just the desktop frame.
8. **Accessibility** — required roles/labels, focus order, keyboard interaction, contrast confirmations (WCAG AA), and reduced-motion fallback.
9. **Assets** — list needed icons/images with sizes/formats and where they live.
10. Deliver as a structured doc (Markdown or an annotated HTML artifact with a rendered specimen); make every value copy-paste ready so implementation is mechanical.

## Checklist
- [ ] Spacing/sizing redlined as 4px-grid tokens, not loose px.
- [ ] Every color/type value given as a resolved semantic token.
- [ ] All interactive states specified with their transitions.
- [ ] Behavior, validation, and edge cases annotated.
- [ ] Responsive behavior documented per breakpoint.
- [ ] Accessibility: roles, focus, keyboard, contrast, reduced-motion.
- [ ] Assets listed with sizes/formats; Russian copy preserved verbatim.
