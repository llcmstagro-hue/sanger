---
name: figma-mcp
description: Works with a Figma MCP server to read frames, components, and variables, extract exact design values, and generate code that matches the source frame. Use when the user shares a figma.com URL, asks to implement a Figma design, or wants designs pushed to or pulled from Figma.
---

# Figma MCP Integration

Figma is the source of truth when a frame exists. Extract exact values from the file — never eyeball a screenshot when the structured data is one tool call away.

## First: confirm tools are connected

Figma MCP tools may be deferred rather than loaded. Before declaring Figma unavailable:

1. Run ToolSearch with a query like `+figma design context` (or `select:mcp__Figma__get_design_context,mcp__Figma__get_screenshot,mcp__Figma__get_metadata,mcp__Figma__get_variable_defs`) to load schemas for any deferred Figma tools.
2. Only if ToolSearch returns no Figma tools should you tell the user no Figma MCP server is connected. Then offer the fallbacks: (a) they connect the Figma MCP server and retry, (b) they export/paste a screenshot plus the values panel, or (c) you build from written specs and flag that values are unverified against Figma.

Never silently guess at a design because tools were missing — say what you couldn't verify.

## Reading a design (design-to-code)

Given a Figma URL, parse the file key and node id (`figma.com/design/<fileKey>/...?node-id=<id>`), then:

1. `get_metadata` — map the node tree; find the exact frame the user means. Confirm if the URL points at a page rather than a frame.
2. `get_design_context` — the primary tool: returns structure, styles, and layout for the node. Prefer its output over anything visual.
3. `get_screenshot` — grab a reference image to validate your build against, not to measure from.
4. `get_variable_defs` — pull design tokens (colors, spacing, radii, type) so generated code references variables, not baked-in literals, when the codebase has a token system.

## Exact values, not eyeballing

- Colors: use the hex/rgba from the file. `#B32025` and "dark red-ish" are not the same deliverable.
- Spacing and size: use the frame's auto-layout padding/gap values verbatim. Do not round 12px to "about 16".
- Typography: font family, weight, size, line-height, letter-spacing — all from the file.
- If a value looks wrong (a 13px odd-one-out in an 8px system), flag it as a question rather than "fixing" it silently.

## Generating code that matches the frame

- Check `get_code_connect_map` first — if components are mapped to code, use the existing codebase components instead of regenerating markup.
- Respect the frame's semantic structure: auto-layout → flex/grid; component instances → component calls; variants → props.
- Match responsive intent, not just the drawn width: a 390px frame implies mobile behavior, not `width:390px`.
- After building, compare against the screenshot at the frame's size. List any deliberate deviations (accessibility fixes, real data lengths) in your summary.

## Writing to Figma (code-to-design)

- Load the `/figma-use` skill before calling `use_figma` — it is mandatory per the server's instructions.
- Use `create_new_file` for new work; don't dump generated frames into an unrelated team file.
- When pushing a page from code, reuse the file's existing components and variables rather than creating duplicates.

## Committing generated code

- Reference tokens/variables in code the same way the Figma variables are named (map `color/brand/primary` → `--color-brand-primary`).
- Include the Figma node URL in the PR description or a code comment at the top of the generated component, so future edits can trace back to the frame.
- Never commit screenshots or exported assets into the repo without checking where existing assets live and how they're optimized.

## Checklist before delivering

- [ ] ToolSearch checked; Figma tool availability confirmed or fallback disclosed
- [ ] Values sourced from `get_design_context` / `get_variable_defs`, not from a screenshot
- [ ] Existing Code Connect mappings honored
- [ ] Output visually compared to `get_screenshot` reference
- [ ] Deviations from the frame listed explicitly
- [ ] Figma source URL recorded with the generated code
