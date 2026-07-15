---
name: nano-banana
description: Generates hero, section, and background imagery from text prompts using an image-generation model/MCP, then optimizes and saves the result as WebP/AVIF into the SANGER site assets. Use when the request mentions generating an image, hero visual, product/lifestyle shot, photo, or background art, or asks to "create a picture" for a page/section.
---

# Nano-Banana: Text-to-Image for SANGER

Drive an image-generation model from the agent to produce on-brand photography and art, then hand off optimized files ready for `next/image`.

## When to use
- "Generate a hero image / section background / lifestyle shot for ..."
- Need original team-sports / jersey / stadium / locker-room imagery.
- Replacing a placeholder in `public/assets/` with real generated art.
- Producing multiple aspect-ratio variants (desktop 16:9, mobile 4:5) of one concept.

## Method
1. Clarify intent: page/section, subject, aspect ratio, and mood. Default palette is SANGER brand — off-white #FAFAF8, near-black #111111, red accent #E4141C. Keep imagery premium, editorial, not stocky.
2. Build the prompt with the `banana-claude` 5-component formula (subject, composition, style, lighting, technical). Always include camera/lens cues and "no text, no watermark, no logos".
3. Pick a generation backend, in priority order:
   - An image-gen MCP if connected (e.g. `mcp__higgsfield__generate_image`) — call with the prompt, aspect ratio, and a high-quality/photoreal preset; poll job status; then `media_import_url` / download the result URL.
   - A local CLI/API fallback (e.g. an `openai images` / `replicate` / `comfyui` CLI wrapper) if configured in the repo.
4. Download the raw output to a temp path (e.g. the scratchpad dir), never straight into `public/`.
5. Optimize and convert to modern formats with `sharp` or `cwebp`/`avifenc`:
   - `npx sharp -i raw.png -o hero.webp --webp-quality 82`
   - Also emit AVIF: `npx @squoosh/cli --avif '{"cqLevel":30}' raw.png` (or `avifenc`).
   - Resize to the largest needed render width (e.g. 2400px wide for hero) plus a 1x mobile variant.
6. Save into `/home/user/sanger/public/assets/` using a descriptive kebab name and dimension suffix, e.g. `hero-team-lineup-2400.webp`, `hero-team-lineup-2400.avif`, `hero-team-lineup-mobile-1080.webp`.
7. Report the exact paths and a ready-to-paste `next/image` snippet (width/height, `sizes`, `priority` for hero).

## Fallback
If no image MCP or generation CLI is available, do NOT fabricate a binary. Instead: (a) write the finalized prompt to the scratchpad and tell the user which tool to run it in, and (b) offer to generate a lightweight SVG/gradient placeholder via the `canvas-design` skill so layout work can proceed.

## Checklist
- [ ] Prompt uses the 5-component formula and forbids text/watermark/logo
- [ ] Output saved as BOTH `.webp` and `.avif` in `/home/user/sanger/public/assets/`
- [ ] File names are kebab-case with a width suffix; desktop + mobile variants exist where needed
- [ ] Largest dimension matches the real render size (no multi-MB oversized files)
- [ ] Reported paths are absolute and a `next/image` usage snippet is included
- [ ] Imagery is on-brand (premium, correct palette, no stray logos/text)
