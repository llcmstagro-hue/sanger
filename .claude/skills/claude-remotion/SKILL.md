---
name: claude-remotion
description: Fine-tunes Remotion motion — easing curves, spring configs, and cascading/staggered title reveals — to make motion typography and scene transitions feel polished and intentional. Use when Remotion animation looks stiff/robotic, when building animated titles/kinetic type, or when asked to refine timing, easing, or stagger.
---

# Claude-Remotion: Polished Motion Typography

Refine the feel of Remotion animations: professional easing, spring physics, and staggered reveals for headline and kinetic-type sequences.

## When to use
- Titles/words appear all at once and need a cascading reveal.
- Motion looks linear/robotic and needs easing or spring polish.
- Tuning enter/exit transitions, timing offsets, or overshoot.
- Pairs with `remotion-superpowers` (which sets up the studio).

## Method
1. Prefer springs over linear interpolation for entrances:
   - `const p = spring({ frame, fps, config: { damping: 200, mass: 0.8, stiffness: 120 } })`
   - Map to transforms: `translateY(interpolate(p,[0,1],[24,0]))`, `opacity: p`, subtle `scale`.
   - Tune `damping` up to kill bounce for premium/serious motion; lower it for playful overshoot.
2. Use eased `interpolate` where springs are overkill:
   - `interpolate(frame,[0,15],[0,1],{ easing: Easing.bezier(0.16,1,0.3,1), extrapolateLeft:'clamp', extrapolateRight:'clamp' })` — this cubic is a strong "premium ease-out".
   - ALWAYS clamp extrapolation to avoid values shooting past the range.
3. Cascading / staggered reveals (the signature effect):
   - Split the headline into words or characters.
   - Offset each unit's start: `const delay = index * STAGGER;` then drive its spring/interpolate off `frame - delay`.
   - Typical `STAGGER` = 2–4 frames per word at 30fps; smaller for characters. Add a `<Sequence>` per line for clean scheduling.
4. Enter AND exit: give text a symmetric exit near the scene end (fade/translate up) so cuts don't feel abrupt. Compute exit from `durationInFrames - frame`.
5. Consistency: centralize timing constants (`STAGGER`, `ENTER_DURATION`, `EASE`) in one module and reuse across scenes so the whole video shares a rhythm.
6. Verify in `npx remotion studio` by scrubbing frame-by-frame; watch for pops at frame 0, clipped extrapolation, and uneven stagger.

## Reference snippet
```tsx
const StaggeredTitle = ({ words }: { words: string[] }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  return <>{words.map((w, i) => {
    const p = spring({ frame: frame - i * 3, fps, config: { damping: 200 } });
    return <span key={i} style={{ display:'inline-block', opacity:p,
      transform:`translateY(${interpolate(p,[0,1],[20,0])}px)` }}>{w}&nbsp;</span>;
  })}</>;
};
```

## Checklist
- [ ] Entrances use spring or a clamped premium ease-out (not linear)
- [ ] Titles reveal with a per-word/char stagger offset
- [ ] All `interpolate` calls clamp extrapolation (no pops/overshoot bugs)
- [ ] Scenes have deliberate exits, not hard cuts
- [ ] Timing constants centralized and reused for consistent rhythm
- [ ] Verified by scrubbing in Remotion studio
