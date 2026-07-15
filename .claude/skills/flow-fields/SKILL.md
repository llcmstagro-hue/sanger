---
name: flow-fields
description: Builds math-based flow-field and particle animations (vector fields driven by noise) rendered to canvas/SVG or exported as video, for hero motion and section backgrounds. Use for requests about generative/particle backgrounds, animated motion graphics, flow fields, noise fields, or "add subtle movement" to a hero/section.
---

# Flow-Fields: Generative Motion Backgrounds

Create premium, subtle generative motion — particles advecting through a noise-driven vector field — for SANGER hero and section backgrounds.

## When to use
- "Animate the hero background / add a particle field / generative motion."
- Ambient, math-driven visuals that stay on-brand and lightweight.
- Need either a live in-browser component OR an exported video/GIF loop.

## Method
1. Choose the delivery target:
   - **Live component** (preferred for web perf): a `<canvas>` React client component in the app, animated with `requestAnimationFrame`.
   - **Rendered video** (for hero poster/fallback or heavy scenes): render offline and export MP4/WebM.
2. Core algorithm (flow field):
   - Seed N particles at random positions.
   - Sample an angle from a noise function: `angle = noise(x*scale, y*scale, t*timeScale) * TAU`. Use `simplex-noise` (`npm i simplex-noise`).
   - Advance each particle along `(cos(angle), sin(angle)) * speed`; wrap or respawn at bounds.
   - Draw short trails with low-alpha fills for the smoky, premium look.
3. Brand the palette: background #FAFAF8, particles in near-black #111111 at low opacity with occasional #E4141C accents. Keep density/contrast subtle — this is ambience, not a screensaver.
4. Performance & a11y: cap particle count, use `devicePixelRatio` scaling, pause when tab hidden, and respect `prefers-reduced-motion` (render a static frame instead).
5. Export to video when needed:
   - Deterministic offline render: run the same sim headless and capture frames (e.g. `node-canvas` writing PNG sequence, or Remotion via the `remotion-superpowers` skill wrapping the canvas).
   - Encode: `ffmpeg -framerate 60 -i frame-%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 hero-flow.mp4` and a `-c:v libvpx-vp9` WebM.
6. Save outputs to `/home/user/sanger/public/assets/` (e.g. `hero-flow.mp4`, `hero-flow.webm`, `hero-flow-poster.webp`). For the live component, place it under the app's components dir and export a poster frame as WebP for the loading state.

## Fallback
If `ffmpeg`/`node-canvas` is unavailable for video export, ship the live canvas component plus a single exported poster frame, and note the encode command for later. If no build tooling at all, deliver a self-contained HTML canvas demo in the scratchpad to preview the effect.

## Checklist
- [ ] Field driven by a real noise function (simplex/perlin), not random jitter
- [ ] Palette on-brand and subtle (ambient, not distracting)
- [ ] `prefers-reduced-motion` honored + pause when hidden
- [ ] DPR-aware rendering, particle count capped for 60fps
- [ ] Live component and/or MP4+WebM+poster saved to `/home/user/sanger/public/assets/`
- [ ] Absolute paths reported and usage/mount snippet included
