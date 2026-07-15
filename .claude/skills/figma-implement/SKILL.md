---
name: figma-implement
description: Translates a design source — Figma frame, screenshot, or mockup — into code that matches it exactly, by extracting real spacing, type, and color values and verifying the build against the original. Use whenever implementing UI from any visual reference rather than from a written spec.
---

# Figma Implement

The design is the spec. Your job is fidelity, not interpretation. "Close enough" is a failure: a 14px gap where the design shows 16px, or #333 where the design uses #2B2B2B, are bugs.

## Step 1: Extract values — never estimate

From a Figma frame (via MCP/API access):
- Pull exact values: fills, strokes, corner radii, effects, padding, item spacing, font family/size/weight/line-height/letter-spacing. Use `get_design_context` / `get_variable_defs` rather than reading numbers off a screenshot of the frame.
- Prefer bound variables/styles over raw values — if the frame uses `color/text/primary`, wire your code to a token of the same meaning, not the resolved hex.
- Note Auto Layout properties: direction, gap, padding, alignment, and hug/fill sizing — these map directly to flexbox (`gap`, `padding`, `align-items`, `flex: 1` vs intrinsic width).

From a screenshot or mockup (no live file):
- Sample colors with an eyedropper at multiple points (watch for anti-aliasing at edges — sample interiors).
- Measure spacing by cropping and counting pixels; establish the grid first (most designs use 4px or 8px units) and snap measurements to it.
- Identify fonts by comparing distinctive glyphs (a, g, R, Q); if uncertain, ask or check the project's existing font stack before substituting.
- State assumptions explicitly in your summary ("assumed 8px grid; sampled background as #F7F6F3").

## Step 2: Build structure before pixels

1. Recreate the layout skeleton: containers, direction, gaps, alignment — with design values, not placeholders you'll "fix later" (you won't).
2. Map extracted values onto the project's existing tokens where they match (16px → `--space-4`). If a design value is off the project's scale, flag it rather than silently snapping — it may be intentional or a design bug.
3. Use the same content as the design (real strings, real image crops) during implementation. Lorem-ipsum-length differences hide layout errors.

## Step 3: Match, don't approximate

- Line-height and letter-spacing are part of the type spec. Figma line-height in px maps directly; letter-spacing in % maps to `em` (e.g. -2% → -0.02em).
- Border radii, shadow values (x, y, blur, spread, color+alpha), and stroke widths copied exactly. Figma drop shadow → `box-shadow` with the same four values and rgba.
- Watch for details that are easy to miss: gradient angles, inner shadows, background blur, images with rounded crops, text truncation vs wrapping, icon sizes distinct from their touch targets.
- Match spacing asymmetries. If a card has 24px top and 20px bottom padding, that may be optical compensation — reproduce it, don't normalize it.
- If the design conflicts with itself (two instances of the same component with different values), pick the majority/most-recent and note the discrepancy.

## Step 4: Verify against the original

Never call it done on memory. Compare directly:

1. Render the implementation at exactly the design's frame width (e.g. 1440px viewport for a 1440 frame).
2. Take a screenshot and place it side by side with the design export. Better: overlay at 50% opacity or use a difference blend — misalignments become instantly visible.
3. Check systematically, top to bottom: type sizes/weights, spacing between every adjacent pair, colors, radii, shadows, alignment edges.
4. Fix, re-screenshot, repeat until the diff shows only rendering noise (font antialiasing differences are acceptable; position/size differences are not).

Tolerances: position/size within 1px; colors exact (or exact token match); fonts exact family and weight (400 vs 500 matters).

## Step 5: Handle what the design doesn't show

A static frame under-specifies. Fill gaps deliberately and say so:

- Responsive behavior: if only desktop is provided, derive mobile from the layout's structure (stack columns, reduce section padding ~50%, clamp type) and label it as inferred.
- Interactive states: if hover/focus/disabled aren't in the file, derive them from the design system's conventions (see the impeccable skill's state rules) and list them for design review.
- Real-content edge cases: long names, empty states, 0 and 4-digit numbers. Build them safe (truncation, min-heights) even if the mockup shows ideal content.

## Fidelity checklist

- All colors, type values, spacing, radii, shadows extracted from source, not guessed.
- Rendered at design width and visually diffed against the original.
- No unexplained deviations; intentional deviations documented in the handoff summary.
- States and responsive behavior either from the design or explicitly labeled as inferred.
