---
name: remotion-superpowers
description: Uses Remotion as a full React video studio — project setup, compositions and Sequences, frame-driven animation with useCurrentFrame/interpolate/spring, rendering MP4s and stills, and data-driven video. Use when the user wants programmatic video, animated social content, or video generated from data or templates.
---

# Remotion: React as a Video Studio

## Mental model

A Remotion video is a React component rendered once per frame. There is no timeline UI and no wall-clock time — `useCurrentFrame()` returns an integer, and every visual property is a pure function of it. If you can compute it from `frame`, you can animate it. Deterministic rendering also means renders parallelize and reproduce exactly.

## Setup

Requires Node 16+ and, for video encoding, ffmpeg is bundled — no separate install. Chrome/Chromium is downloaded automatically for rendering. Check `node --version` first; if Node is absent, stop and say so.

```bash
npx create-video@latest my-video   # pick a template (blank / Hello World / TS)
cd my-video && npm i
npx remotion studio                # live-preview studio in the browser
```

Project spine:

- `src/index.ts` — calls `registerRoot(Root)`
- `src/Root.tsx` — declares every `<Composition>` (id, component, dimensions, fps, duration)
- One file per composition component

```tsx
// Root.tsx
import { Composition } from "remotion";
import { PropertyTour } from "./PropertyTour";

export const Root = () => (
  <Composition
    id="PropertyTour"
    component={PropertyTour}
    durationInFrames={30 * 20}   // 20s at 30fps
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ address: "Kapolei, Oʻahu" }}
  />
);
```

## Structuring time with Sequence

`<Sequence from={n} durationInFrames={m}>` shifts its children's local frame to 0 at frame `n` — the core tool for scenes. Child components animate from *their own* frame 0, so scenes are reusable and reorderable.

```tsx
import { AbsoluteFill, Sequence, Series } from "remotion";

export const PropertyTour = ({ address }: { address: string }) => (
  <AbsoluteFill style={{ backgroundColor: "#0e0e12" }}>
    <Series>
      <Series.Sequence durationInFrames={90}><Intro address={address} /></Series.Sequence>
      <Series.Sequence durationInFrames={240}><Slideshow /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><OutroCard /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
```

`<Series>` auto-stacks sequences back to back. Use `<AbsoluteFill>` as the standard full-frame layer container. For media, use Remotion's `<OffthreadVideo>`, `<Audio>`, `<Img>` and `staticFile()` — never bare `<video>`/`<img>` (they don't sync with the render clock).

## The animation trio

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

const frame = useCurrentFrame();
const { fps, durationInFrames } = useVideoConfig();

// interpolate: map frame ranges to value ranges. ALWAYS clamp.
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const drift = interpolate(frame, [0, durationInFrames], [1, 1.08]); // slow Ken Burns zoom

// spring: physical motion for entrances. Returns 0→1.
const pop = spring({ frame, fps, config: { damping: 200 } }); // damping 200 ≈ smooth, no bounce
const y = interpolate(pop, [0, 1], [60, 0]);                  // slide-up via the spring value
```

Habits that prevent 90% of bugs:

- Clamp every `interpolate` unless overshoot is intentional.
- Express all timing in frames derived from `fps` (`2 * fps`, not `60`).
- Springs: `damping: 200` = buttery ease; `damping: 10–15` = playful bounce; add `delay: n` frames via `frame - n` (spring input below 0 is fine).
- Fade audio/video with `interpolate` on the `volume` prop the same way.

## Rendering

```bash
npx remotion render PropertyTour out/tour.mp4                 # MP4 (H.264)
npx remotion render PropertyTour out/tour.mp4 --props='{"address":"ʻEwa Beach, Oʻahu"}'
npx remotion still PropertyTour out/thumb.png --frame=45      # single-frame still
npx remotion render PropertyTour out/tour.webm --codec=vp8    # other codecs
```

Stills make Remotion a thumbnail/OG-image factory: one composition, `--props` per render. After rendering, verify the output exists and spot-check a still with the Read tool.

## Data-driven video

The superpower: `--props` (or `calculateMetadata` for per-data durations) turns one composition into a video *template*. Feed it JSON rows and loop:

```bash
node -e '
const { execSync } = require("child_process");
const listings = require("./listings.json");
for (const l of listings) {
  execSync(`npx remotion render PropertyTour out/${l.mls}.mp4 --props=${JSON.stringify(JSON.stringify(l))}`, { stdio: "inherit" });
}'
```

For fetched data, use `delayRender()`/`continueRender()` inside the component, or prefer `calculateMetadata` to fetch once before rendering. For heavy batch work, `@remotion/renderer`'s Node API (`renderMedia`, `selectComposition`) skips CLI overhead.

## Pitfalls

- Randomness must use Remotion's `random(seed)` — `Math.random()` differs across render threads and produces flicker.
- CSS transitions/animations don't advance with frames; drive everything from `useCurrentFrame`.
- Keep compositions pure: no side effects that vary per render pass.
- Check the Remotion docs for current version specifics before scaffolding; APIs above are the stable core.
