---
name: canvas-design
description: Designs posters, flyers, social graphics, and other static visual art as editable SVG first, then exports to PNG. Use when creating any fixed-canvas graphic where the user may want revisions — SVG keeps text, colors, and layout editable and scales losslessly.
---

# SVG-First Static Design

## Why SVG first

A poster built as SVG is a document, not a picture: every headline, color, and shape stays editable by re-opening the file, and it rasterizes to any resolution without quality loss. Only reach for direct raster generation when the artwork is inherently photographic.

## Set up the canvas

Fix the artboard in design units and never change it between revisions — export scale handles resolution.

Common canvases: social square 1080×1080, portrait 1080×1350, story 1080×1920, US Letter flyer 816×1056 (96dpi units), presentation 1920×1080.

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"
     viewBox="0 0 1080 1350" font-family="Raleway, sans-serif">
  <!-- background -->
  <rect width="1080" height="1350" fill="#faf7f2"/>
  <!-- content groups go here -->
</svg>
```

## Layout composition

- Work on a grid: define margins (7–9% of the short side) and a 12-column or rule-of-thirds structure. Compute positions as numbers, don't eyeball.
- Build in layers using `<g>` with `id`s: `background`, `imagery`, `shapes`, `text`, `logo`. This makes surgical edits trivial later.
- Establish hierarchy with no more than 3 type sizes: display (8–12% of canvas height), subhead (~40% of display), body/detail (~20% of display).
- Alignment beats decoration. Left-align a single strong axis rather than centering everything.
- Use `text-anchor` (`start`/`middle`/`end`) plus `dominant-baseline` for predictable placement; position by the anchor point, not by trial and error.
- SVG `<text>` does not wrap. Break lines manually with `<tspan x="..." dy="1.3em">` and count characters to keep lines balanced.
- Reserve deliberate negative space; a poster that breathes reads as premium.

```xml
<g id="text">
  <text x="86" y="220" font-size="120" font-weight="700" fill="#1a1a1a">
    <tspan x="86" dy="0">OPEN</tspan>
    <tspan x="86" dy="1.05em">HOUSE</tspan>
  </text>
  <text x="86" y="520" font-size="34" fill="#555">Sunday 2–5 PM · Kapolei, Oʻahu</text>
</g>
```

## Color and brand

- Declare the palette once as reusable values (CSS variables inside a `<style>` block, or consistent literals). Brand colors go in as exact hex — this is the big win over generative rasters, where brand colors drift.
- Check text contrast (aim WCAG AA: 4.5:1 body, 3:1 large text) before shipping.

## Type: live text vs outlines

- **Keep text live** during design — editable, and fine if the render environment has the font installed.
- **The portability trap**: SVG does not embed fonts. Rendered on a machine without the font, live text silently falls back to a default and the layout breaks.
- Options, in order of preference:
  1. Rasterize on a machine where the fonts are installed (verify with `fc-list | grep -i <font>` on Linux).
  2. Embed the font as a base64 `@font-face` inside a `<style>` block (bloats the file; fully portable).
  3. Convert display type to outlines (paths) for final delivery — e.g. Inkscape: `inkscape file.svg --export-text-to-path --export-filename=out.svg`. Do this only on a *copy*; outlined text is no longer editable.
- Rule: master file keeps live text; delivery file may be outlined.

## Export to PNG at 2x

Always export at 2x (or 3x for print-adjacent use) so the raster stays crisp on high-DPI screens.

Check which rasterizer is installed and use the first available:

```bash
# rsvg (fast, good fidelity)
rsvg-convert -w 2160 -h 2700 poster.svg -o poster@2x.png

# Inkscape
inkscape poster.svg --export-width=2160 --export-filename=poster@2x.png

# ImageMagick (set density before reading)
magick -density 192 poster.svg -resize 2160x2700 poster@2x.png

# Chromium headless (best CSS/font support): wrap the SVG in an HTML page sized to the canvas
chromium --headless --screenshot=poster@2x.png --window-size=2160,2700 --force-device-scale-factor=2 page.html
```

If none are installed, say so and offer to install one (`rsvg-convert` is in `librsvg2-bin` on Debian/Ubuntu) or deliver the SVG plus a rendering command the user can run.

After export, **Read the PNG** to visually verify: check for font fallback, clipped text, and color accuracy. Fix in the SVG and re-export — never patch the PNG.

## Revision loop

1. Write the SVG with grouped layers and computed coordinates.
2. Export at 1x for a quick proof; inspect it.
3. Adjust coordinates/type in the SVG source (small, targeted edits).
4. Final export at 2x; outline or embed fonts if the file leaves your machine.
