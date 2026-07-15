---
name: figma-mcp
description: Reads frames, variables, and assets from Figma via the Figma MCP and translates them into on-brand code changes, keeping the SANGER codebase and design file in sync. Use when a Figma URL is shared, when implementing a design handoff, or when syncing updated design tokens/frames into components.
---

# Figma MCP

Bridge Figma and code: read a frame's structure, variables, and exports through the Figma MCP and turn them into components that respect the existing SANGER token system.

## When to use
- A `figma.com` frame/file URL is shared for implementation.
- A design handoff must become a real page/section or component.
- Design tokens (colors, type, spacing) changed in Figma and must land in `tailwind.config.ts` / `app/globals.css`.
- Verifying that an implemented section still matches its Figma source.

## Method
1. Before calling `use_figma`, load the Figma plugin skill it requires (`/figma-use` or the served fallback). Follow the MCP server's mandatory-skill guidance.
2. Read the frame: use `get_design_context` and `get_screenshot` for the target node, and `get_metadata` to understand the layer tree. Use `get_variable_defs` to extract design variables.
3. Map variables to existing tokens FIRST. Do not introduce new hardcoded values if a matching token already exists in `tailwind.config.ts` or `app/globals.css`. Only add a token when Figma genuinely introduces a new one (see brandkit-sync skill).
4. Pull needed assets with `download_assets` into `public/`, using descriptive kebab-case names; prefer SVG for icons/logos.
5. Translate layout to the project's conventions: Tailwind utilities, existing UI primitives (`components/ui/Container`, `Button`, `SectionHeading`), and Framer Motion `Reveal` for entrance animation.
6. Build responsive: honor the Figma desktop frame but define the `sm` mobile behavior explicitly; Figma often only shows one breakpoint.
7. Compare against source: screenshot the built component at the frame's width and diff visually against `get_screenshot`. Reconcile spacing, type scale, and color.
8. Keep sync bidirectional when asked: if code diverged intentionally, note it; use Code Connect mapping if the team maintains it.

## Checklist
- [ ] Required Figma skill loaded before `use_figma`.
- [ ] Frame structure and variables read via MCP, not eyeballed from a screenshot alone.
- [ ] Figma variables mapped to existing project tokens; new tokens added to source of truth only when necessary.
- [ ] Assets downloaded to `public/` with clean names (SVG where possible).
- [ ] Built with existing UI primitives + Framer Motion, responsive mobile behavior defined.
- [ ] Visual diff against the Figma screenshot reconciled.
