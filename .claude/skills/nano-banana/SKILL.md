---
name: nano-banana
description: Crafts effective prompts for text-to-image generation models (e.g. Google's Nano Banana / Gemini image generation) and runs an iteration workflow from the terminal. Use when the user asks to generate, create, or refine AI images, or when an image-generation tool or API is available and images are needed.
---

# Prompting Text-to-Image Models

## Check tooling first

Before promising an image, verify a generation path exists:

1. Look for an image-generation MCP tool in the current session (names commonly contain `image`, `generate`, `imagen`, `gemini`, `nano`). Canva's `generate-design` can also produce visual output for design-shaped requests.
2. Check for a CLI or SDK: `gemini --help`, or a Python environment with `google-genai` installed plus an API key in the environment (`GEMINI_API_KEY` / `GOOGLE_API_KEY`).
3. If nothing is available, say so plainly and offer the next best thing: write the finished prompt(s) for the user to paste into their tool of choice, or build the visual as SVG/HTML instead. Never fabricate an API endpoint or model ID — check current docs for exact model names before writing API code.

## Anatomy of a strong prompt

Write prompts as a scene description, not a keyword pile. Modern models (Gemini-family especially) respond better to fluent sentences than to comma-spam. Cover these axes, in roughly this order:

1. **Subject** — who/what, with concrete attributes: "a weathered cedar beach cottage with a wraparound lanai"
2. **Composition** — framing and viewpoint: "wide establishing shot, low angle, subject on the right third, generous negative space left for text"
3. **Lighting** — the single highest-leverage descriptor: "golden hour backlight with long soft shadows", "overcast diffuse light", "hard noon sun", "blue hour with warm interior lights glowing"
4. **Lens/camera** — implies depth of field and geometry: "shot on a 24mm lens" (wide, environmental), "85mm f/1.8" (portrait, creamy bokeh), "100mm macro", "drone shot from 120m"
5. **Style/medium** — "editorial photography", "watercolor illustration", "flat vector infographic", "35mm film grain, Kodak Portra palette"

Example assembled prompt:

> An editorial photograph of a weathered cedar beach cottage with a wraparound lanai, wide establishing shot from a low angle with the cottage on the right third and open sky on the left. Golden hour backlight, long soft shadows across the sand. Shot on a 24mm lens. Warm, slightly desaturated film palette.

## Iteration workflow

- Generate, inspect (use the Read tool on the output file — you can see images), then change **one axis at a time**. If lighting is wrong, fix only lighting; do not rewrite the whole prompt or you lose the ability to attribute improvements.
- Keep a numbered log of prompt versions in a scratch file so you can revert.
- When a model supports conversational editing (Gemini image models do), prefer "same image, but make the sky overcast" over regenerating from scratch — it preserves composition.
- Generate 2–4 candidates for hero images; pick, then refine the winner.
- Ask for the target aspect ratio explicitly (via API parameter if the tool exposes one, otherwise in-prompt: "16:9 widescreen composition"). Don't crop-and-hope.

## Negative/steering language

Most current models take steering better as positive phrasing than as negative lists. Instead of "no people", write "an empty, quiet scene". If the tool exposes a true negative-prompt parameter, use it for concrete artifacts: "text, watermark, logo, extra fingers".

## Common failure modes and fixes

**Text inside images.** Models mangle long strings. Rules of thumb: keep required in-image text to 1–5 words; put the exact string in quotes in the prompt ("a sign that reads \"OPEN HOUSE\""); if the text matters (flyers, social posts), generate the image *without* text and overlay real type afterwards with SVG/HTML or an image editor — that also keeps the text editable.

**Hands and limbs.** Reduce hand prominence: "hands in pockets", "holding a coffee mug" (gives fingers a job), or crop tighter. If hands are essential, generate several candidates and inspect closely at full size.

**Brand colors drifting.** Models approximate color names loosely. Anchor with the hex code *and* a plain-language name: "deep red (#B32025), a rich brick red — not orange, not pink". Expect ±10% drift anyway; for strict brand compliance, generate near-target and color-correct after, or keep brand-colored elements (logo, bar, frame) as a post-composited overlay.

**Sameness across a set.** For a series that must feel cohesive, freeze the style clause word-for-word across prompts and vary only the subject clause.

**Uncanny realism for marketing.** For real-estate and product marketing, prefer "photorealistic" plus a concrete camera/film reference over "hyper-realistic 8k ultra detailed", which tends to produce plasticky HDR looks.

## Ethics and compliance notes

- AI-generated imagery used in listings or ads must not misrepresent the actual property. Label renders/concepts as such.
- Never generate images of real, identifiable people (clients, agents) without an explicit request and a clear legitimate purpose.
