---
name: banana-claude
description: A reusable 5-component prompt formula (subject, composition, style, lighting, technical) for writing image-generation prompts that reliably produce high-quality, on-brand results. Use whenever you are about to author or refine a text-to-image prompt, when generations look inconsistent/low-quality, or when someone asks "how should I prompt this image".
---

# Banana-Claude: The 5-Component Image Prompt Formula

Turn a vague image request into a structured, repeatable prompt so generations are consistent and premium instead of random.

## When to use
- Before calling any image generator (pairs with `nano-banana`).
- When outputs feel flat, generic, or off-brand and need a rewrite.
- Producing a set of images that must share a coherent look.

## Method
Compose the prompt from five explicit components, in this order:

1. **Subject** — the concrete focal content. Be specific: who/what, count, wardrobe, action, expression. e.g. "a five-player team-sports lineup in matching red-and-white jerseys, mid-stride walking toward camera".
2. **Composition** — framing and layout. Shot type, angle, rule-of-thirds, negative space for headline text, aspect ratio. e.g. "wide 16:9 hero shot, low three-quarter angle, subjects on the right, clean negative space on the left for a headline".
3. **Style** — the visual language. Medium, era, art direction, reference aesthetic. For SANGER: "premium editorial sports photography, modern minimalist, high-fashion sportswear campaign".
4. **Lighting** — direction, quality, color, mood. e.g. "soft directional key light, cool stadium ambience, subtle rim light separating subjects from a #FAFAF8 seamless background".
5. **Technical** — camera/render specs and quality flags. e.g. "shot on 85mm f/1.8, shallow depth of field, ultra-detailed, high dynamic range, 8k". Always append negatives: "no text, no watermark, no logos, no distorted hands".

### Assembly rules
- Front-load the most important tokens; models weight early words more.
- One clear subject — avoid stacking competing focal points.
- Bake the brand palette (#FAFAF8 / #111111 / #E4141C) into Style + Lighting.
- Keep a headline-safe empty region in Composition for hero images.
- For variant sets, change ONLY one component at a time so results stay comparable.
- Save the final assembled prompt to the scratchpad so it can be reused across aspect ratios.

### Template
`[Subject], [Composition], [Style], [Lighting], [Technical]. Negative: no text, no watermark, no logos.`

## Checklist
- [ ] All five components are present and explicit
- [ ] Subject is singular and specific (no competing focal points)
- [ ] Composition reserves negative space for headline text where needed
- [ ] Brand palette referenced in Style/Lighting
- [ ] Technical section includes camera/render + quality cues
- [ ] Negative clause forbids text/watermark/logos/artifacts
- [ ] Final prompt saved for reuse across variants
