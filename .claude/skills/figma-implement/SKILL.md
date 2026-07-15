---
name: figma-implement
description: Translates a Figma design into faithful production Next.js/Tailwind code — matching spacing, type, color, and component structure exactly. Trigger when the user shares a figma.com link or frame, asks to "implement this design," "build this from Figma," or convert a mockup to code.
---

# Figma Implement

Reproduce a Figma frame as production code with high fidelity, not an approximation.

## When to use
- A figma.com URL, frame, or node is provided to build.
- "Implement/build this design," "code this mockup," "match the Figma."
- Updating existing UI to match a revised Figma.

## Method
1. Pull ground truth from Figma, don't eyeball a screenshot: use the Figma MCP tools — `get_design_context`/`get_variable_defs` for exact tokens, `get_metadata` for structure, `get_screenshot` only as a visual reference. Read the `/figma-use` skill first if using write tools.
2. Extract the design tokens before writing markup: exact colors (convert to the project's OKLCH tokens), font family/size/weight/line-height/letter-spacing, spacing, radii, and shadows. Map them onto existing SANGER tokens where they match; only add new tokens for genuinely new values.
3. Snap measurements to the project's systems: round Figma's pixel values to the 4px grid (see `impeccable`) unless a value is intentionally exact. Don't hardcode Figma's absolute px if a scale token fits.
4. Rebuild the layout with the same structure Figma implies: auto-layout frames → flexbox/grid with matching gap/padding/alignment; constraints → responsive behavior. Preserve the nesting hierarchy.
5. Reuse existing components. Before creating new ones, search the codebase for an existing button/card/section that matches; extend it rather than duplicating. Map Figma components to code components 1:1.
6. Implement type faithfully with the project fonts (Montserrat/Manrope): match the type ramp, and preserve Russian copy exactly as authored — don't translate or transliterate.
7. Make it responsive even if Figma shows one breakpoint: define sensible behavior for mobile/tablet from the desktop frame using Tailwind breakpoints.
8. Verify side-by-side: run the app and compare against the Figma screenshot (see `playwright-mcp`). Check spacing, alignment, and color at 1:1 before calling it done.

## Checklist
- [ ] Tokens pulled from Figma data, not guessed from an image.
- [ ] Colors mapped to OKLCH tokens; type matches family/size/weight/leading.
- [ ] Spacing snapped to the 4px grid; auto-layout mapped to flex/grid.
- [ ] Existing components reused; new ones only where necessary.
- [ ] Russian copy preserved verbatim.
- [ ] Responsive behavior defined beyond the single Figma frame.
- [ ] Rendered output compared side-by-side with the design.
