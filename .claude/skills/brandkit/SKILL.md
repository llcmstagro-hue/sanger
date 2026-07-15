---
name: brandkit
description: Produces a one-shot, single-page brand identity board — logo treatment, palette with hex values, type pairing, spacing, and sample components — for a given brand, with The Ulu Team and Living Hawaiʻi as built-in house brands. Use when asked for a brand board, brand kit, visual identity summary, or brand-consistent starting point for any design.
---

# Brandkit

Given a brand, deliver one self-contained page (HTML artifact or document) that shows the entire identity at a glance. One page, one brand, no exceptions.

## House brands (defaults)

When work is for either house brand, use these specs verbatim — do not restyle, reinterpret, or "refresh" them.

### The Ulu Team
Keller Williams Honolulu real estate team, Kapolei, Oʻahu.
- Primary: Deep Red `#B32025`
- Supporting neutrals: near-black `#1A1A1A`, warm off-white `#FAF8F5`, mid gray `#6B6560`
- Headings: Playfair Display (serif; 500–700 weights)
- Body: Raleway (sans; 400/500, 600 for emphasis)
- Temperament: warm, established, editorial. Red is an accent (<10% of any layout), not a background wash.

### Living Hawaiʻi
- Golden yellow on black. Yellow: `#F5B700` range (tune per asset, always unmistakably golden, never lemon/neon). Black: `#0A0A0A`.
- High-contrast, bold, media-brand energy. Yellow carries headlines and accents on black grounds; body text is white/off-white on black.

### Hard rule: never mix the brands
One artifact = one brand. No Ulu red in a Living Hawaiʻi piece, no golden-yellow-on-black in an Ulu piece, no co-branded layouts unless the user explicitly demands it — and then push back once, citing this rule, before complying.

### Hawaiian diacriticals
ʻOkina (ʻ) and kahakō (ā ē ī ō ū) are required in all text: Oʻahu, Hawaiʻi, Kapolei, Wahiawā, Kāneʻohe. Use the real ʻokina character (U+02BB), not an apostrophe. Sole exception: MLS plain-text fields, which strip diacriticals.

## Board contents (all on one page)

1. **Header** — brand name set in the display face, one-line descriptor, location if relevant.
2. **Logo treatment** — wordmark/lockup shown on light and dark grounds; clear-space rule (min = height of one cap letter); minimum size; one "don't" (e.g. never stretch, never recolor).
3. **Palette** — swatches with hex under each; label roles (primary, ink, ground, muted, accent). 4–6 colors max. Show one approved combination pair (e.g. "ink on ground", "primary on ground") and one forbidden pair if contrast fails.
4. **Type pairing** — display face and body face, each with: name, weights used, a live specimen (display at ~48–72px, body at 16–18px with a real paragraph), and the scale (e.g. 12/14/16/20/28/40/64).
5. **Spacing & radius** — the spacing scale in use (e.g. 4/8/16/24/40/64) and corner radius system, shown as labeled bars/chips, not prose.
6. **Sample components** — three or four real elements built from the tokens above: a button pair (primary + quiet), a card, a heading+paragraph block, and one brand-specific piece (Ulu: a property listing card; Living Hawaiʻi: an episode/post tile).
7. **Voice line** — one sentence of sample copy in-brand, demonstrating tone and correct diacriticals.

## Construction rules

- Build the board *in* the brand: the page's own typography, colors, and spacing must use the brand's system. A brand board set in default sans is a failed board.
- Every color shown must appear as a swatch with its hex. No unlabeled colors anywhere on the board.
- Derive missing pieces conservatively for new (non-house) brands: if given only a logo or a single color, build a neutral ramp around it, choose one display + one body face with clear contrast, and state what you inferred.
- Fonts: load Google Fonts (Playfair Display and Raleway are both on Google Fonts) or system fallbacks; declare the full stack: `"Playfair Display", Georgia, serif` / `Raleway, "Helvetica Neue", Arial, sans-serif`.
- Keep it printable: the board should read correctly on one screen/page at 1280px wide without scrolling more than ~2 viewport heights.

## One-shot discipline

"One-shot" means complete on the first delivery:
- No placeholders ("logo TBD", "colors coming"). If an element is unknown, design a credible v1 and label it "proposed".
- All seven sections present.
- Check before delivering: correct hexes, correct fonts actually rendering, diacriticals correct (search the output for `Hawai'i`, `Oahu`, `O'ahu` — all are errors), and zero elements from the other house brand.

## Compliance notes

- Brand boards are shareable artifacts: never include client names, transaction details, or any PII on a board.
- Ulu Team real estate materials must carry the brokerage identification (Keller Williams Honolulu, RB-21303) when used publicly; include a footer slot for it on Ulu boards.
