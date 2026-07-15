---
name: remotion-superpowers
description: Builds a programmatic video studio in React using Remotion to compose data-driven promo videos (product reveals, stat cards, animated logos) and render them to MP4/WebM. Use when asked to create a promo/marketing video, animated explainer, social clip, or any "video from code/data" for SANGER.
---

# Remotion-Superpowers: Programmatic Video Studio

Author SANGER promo videos as React components with Remotion, so motion is data-driven, versionable, and re-renderable at any resolution.

## When to use
- "Make a promo / launch / social video for ..."
- Data-driven video: stat cards, roster reveals, price/feature callouts.
- Reusable video templates rendered from JSON props.

## Method
1. Scaffold (once): `npx create-video@latest` in a `video/` workspace, or add `remotion` + `@remotion/cli` to a subfolder. Keep it isolated from the Next.js app.
2. Define compositions in `src/Root.tsx` with `<Composition>` — set `id`, `durationInFrames`, `fps` (30), and `width`/`height` (1920x1080 landscape, 1080x1920 vertical for social).
3. Build scenes as components using Remotion primitives:
   - `useCurrentFrame()` + `interpolate()` for property animation.
   - `spring()` for natural motion; `<Sequence from={...}>` to schedule scenes on the timeline.
   - `<Series>` for back-to-back scenes; `<AbsoluteFill>` for layered backgrounds.
   - Use the `claude-remotion` skill for polished easing and staggered title reveals.
4. Make it data-driven: type `defaultProps` and pass real content (team name, stats, product images from `public/assets/`) via `--props=data.json` so one composition renders many videos.
5. Brand it: background #FAFAF8, text #111111, accent #E4141C; load brand fonts via `@remotion/google-fonts` or local `staticFile()`; pull imagery from the site assets.
6. Preview: `npx remotion studio` for the interactive timeline (mention the port so the user can open it).
7. Render to disk:
   - `npx remotion render <composition-id> out/promo.mp4 --props=data.json`
   - Vertical variant: render the 1080x1920 composition id.
   - Transparent overlays: `--codec=prores` or WebM with alpha (`--codec=vp8 --pixel-format=yuva420p`).
8. Copy final videos into `/home/user/sanger/public/assets/` (e.g. `promo-launch-1080p.mp4`, `promo-launch-vertical.mp4`) plus a WebP poster frame (`npx remotion still <id> poster.png` then convert).

## Fallback
If the Remotion CLI cannot render here (missing Chromium/ffmpeg), still author all composition code and commit it, run `remotion studio` for preview if possible, and give the exact `remotion render` command for the user to run locally. Do not fake an MP4.

## Checklist
- [ ] Compositions declared with correct fps/duration/dimensions (landscape + vertical where needed)
- [ ] Animation uses `interpolate`/`spring`/`Sequence`, not hard cuts
- [ ] Content passed via typed `defaultProps` (data-driven, re-renderable)
- [ ] Brand palette, fonts, and site assets applied
- [ ] Rendered MP4/WebM + poster saved to `/home/user/sanger/public/assets/`
- [ ] Render/preview commands and absolute output paths reported
