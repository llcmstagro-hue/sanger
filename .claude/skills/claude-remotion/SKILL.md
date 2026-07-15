---
name: claude-remotion
description: Builds polished title animations in Remotion — staggered per-character and per-word text reveals, spring configs tuned for titles, frame-accurate timing charts at 30fps, and enter/hold/exit choreography for title cards and lower-thirds. Use when animating text, titles, captions, or lower-thirds in a Remotion project.
---

# Remotion Title Animation

Assumes a working Remotion project (see the remotion-superpowers skill for setup). Everything below is frame-driven: no CSS animations, all motion from `useCurrentFrame()`.

## The stagger pattern

All text choreography is one idea: split the string, render each unit with the same spring, offset each unit's frame by `index * delay`.

```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StaggerTitle = ({ text, perUnit = 3 }: { text: string; perUnit?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <h1 style={{ display: "flex", gap: "0.35em", fontSize: 110, fontWeight: 800 }}>
      {words.map((word, i) => {
        const s = spring({ frame: frame - i * perUnit, fps, config: { damping: 200 } });
        return (
          <span key={i} style={{
            opacity: s,
            transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
            display: "inline-block",
          }}>{word}</span>
        );
      })}
    </h1>
  );
};
```

Notes:

- `frame - i * perUnit` is the whole trick — springs accept negative input (they output 0), so no per-unit Sequences needed.
- Per-**word** delay 2–4 frames reads editorial; per-**character** delay 1–2 frames reads kinetic. For characters, `text.split("")` and preserve spaces with `whiteSpace: "pre"`.
- Wrap long titles: split into lines first, stagger lines by ~6 frames, then words within each line.
- Derive one value `s` per unit and reuse it for opacity, translate, scale, blur — properties moving in lockstep is what makes it feel designed.

## Spring configs for titles

| Feel | config | Use for |
|---|---|---|
| Smooth editorial | `{ damping: 200 }` | Default. Lower-thirds, corporate, real-estate |
| Confident snap | `{ damping: 20, stiffness: 200 }` | Big single-word titles |
| Playful bounce | `{ damping: 12 }` | Social hooks, countdowns |
| Heavy settle | `{ damping: 30, mass: 2 }` | Large display type, logo lockups |

Speed a spring up without changing its character by scaling frame: `spring({ frame: frame * 1.4, ... })`. Never bounce body-size text — bounce is for display type only.

## Timing chart (30 fps)

Cheat sheet for choreography; all values in frames.

```
frames:  0        10        20        30        45        60        75        90
         |--------|---------|---------|---------|---------|---------|---------|
title:   [==enter==]          [============= hold =============]      [=exit=]
sub:          [==enter==]     [========== hold ===========]        [=exit=]
accent:  [=grow=]             [============ hold =============]       [=exit=]
```

- Enter: 10–15 frames (0.33–0.5s). Under 8 feels abrupt; over 20 feels sluggish.
- Hold: minimum readable time ≈ `words * 0.3s + 0.7s` → frames = `(words * 9) + 21`. Round up.
- Exit: ~60–70% of enter duration (8–10 frames). Exits should always be faster than entrances.
- Stagger element *groups* (title → subtitle → accent) by 5–8 frames, in that order; exit in reverse order.

## Enter / hold / exit choreography

Compute the exit from the tail end of the sequence so it survives duration changes.

```tsx
const { durationInFrames, fps } = useVideoConfig();
const enter = spring({ frame, fps, config: { damping: 200 } });
const exit = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
const opacity = enter * (1 - exit);
const y = interpolate(enter, [0, 1], [40, 0]) - exit * 30; // exit continues upward
```

Exit through motion, not just fade: continue the entrance direction (up-in → up-out) or fade + slight scale-down (0.97). Cutting a title that never exits looks like a bug.

## Lower-thirds

Standard build, in order: (1) accent bar wipes in via `scaleX` with `transformOrigin: "left"`, (2) name staggers in per-word starting frame 6, (3) role/eyebrow fades in frame 12. Exit reverses: text out first, bar collapses last.

```tsx
const bar = spring({ frame, fps, config: { damping: 200 } });
<div style={{ transform: `scaleX(${bar})`, transformOrigin: "left center",
              height: 6, width: 420, background: "#B32025" }} />
```

Safe areas: keep lower-thirds inside 5% margins; for 9:16 social, keep critical text in the middle ~50% vertically (UI chrome eats top and bottom).

Clip text reveals with an overflow mask for the classic rise-from-nothing look:

```tsx
<div style={{ overflow: "hidden" }}>
  <div style={{ transform: `translateY(${interpolate(enter, [0, 1], [100, 0])}%)` }}>
    {line}
  </div>
</div>
```

## Reusable API shape

Build one `<AnimatedTitle>` with props `{ text, delayFrames, perUnit, unit: "word" | "char", spring: SpringConfig }` and compose title cards from it inside `<Sequence>`s, rather than hand-animating each card. Preview timing in `npx remotion studio` scrubbing frame by frame; verify final timing by rendering stills at the chart's key frames (`npx remotion still <id> out/f30.png --frame=30`) and Reading them.
