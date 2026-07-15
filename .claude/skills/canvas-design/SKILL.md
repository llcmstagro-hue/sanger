---
name: canvas-design
description: Produces editable vector graphics as clean SVG (icons, logos, jersey graphics, badges) that stay editable rather than flattened, and exports crisp PNG/WebP rasters when needed. Use for requests about icons, logos, wordmarks, jersey/kit graphics, badges, crests, or any "make this an SVG / vector" task.
---

# Canvas-Design: Editable Vector Graphics

Author hand-crafted, editable SVG for SANGER's iconography and jersey graphics, keeping shapes, groups, and colors editable — never trace-flattened blobs.

## When to use
- "Create an icon / logo / wordmark / crest / badge ..."
- Jersey number sets, stripe patterns, kit graphics, sponsor-slot mockups.
- Converting a raster concept into a clean, editable vector.
- Building a small icon system that shares stroke width and grid.

## Method
1. Define a canvas and grid: pick a `viewBox` (e.g. `0 0 24 24` for icons, `0 0 512 512` for logos). Keep everything on the grid for crisp alignment.
2. Establish shared tokens up front: stroke width, corner radius, and the brand palette as named values (#111111 primary, #E4141C accent, #FAFAF8 ground). Reference them consistently.
3. Build with real primitives — `<path>`, `<rect>`, `<circle>`, `<g>` groups, `<use>`, `<symbol>`, `<defs>` for reusable gradients/patterns (e.g. jersey stripes). Never dump a single autotraced mega-path.
4. Keep it editable and semantic:
   - Group by logical part with `id`/`class` (e.g. `id="crest-outline"`, `id="jersey-stripes"`).
   - Use `currentColor` for single-color icons so CSS can theme them.
   - Prefer strokes with `stroke-linecap`/`stroke-linejoin` set; avoid needless boolean-flattened paths.
5. Optimize without destroying editability: run `npx svgo --multipass --pretty` (keep pretty output so it stays hand-editable; disable `removeViewBox` and `mergePaths` if they harm structure).
6. Export raster when a bitmap is required:
   - PNG: `npx sharp -i icon.svg -o icon.png --density 384` (or `resvg icon.svg icon.png`).
   - WebP for web: add `--webp-quality 90`, emit @1x and @2x.
7. Save the SVG (source of truth) and any raster into `/home/user/sanger/public/assets/`, e.g. `logo-sanger.svg`, `icon-jersey.svg`, `icon-jersey@2x.png`.
8. For React usage, note the file can be imported as a component (SVGR) or referenced via `next/image`.

## Fallback
If a Figma/Canva MCP is connected and the user prefers a design-tool round-trip, you may export from there; otherwise hand-author the SVG directly (no external tool required). If `resvg`/`sharp` is missing, deliver the SVG and note the exact command to rasterize locally.

## Checklist
- [ ] `viewBox` set; artwork aligned to a stated grid
- [ ] Shapes are real primitives/groups with ids — not a single flattened path
- [ ] Brand palette applied; single-color icons use `currentColor`
- [ ] Reusable parts factored into `<defs>`/`<symbol>` where sensible
- [ ] SVGO run in a structure-preserving way (viewBox kept, still readable)
- [ ] SVG source + any PNG/WebP export saved to `/home/user/sanger/public/assets/`
- [ ] Absolute paths reported plus React/`next/image` usage note
