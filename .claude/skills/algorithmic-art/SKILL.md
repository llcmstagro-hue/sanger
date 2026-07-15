---
name: algorithmic-art
description: Creates generative art from math — flow fields, Perlin noise, particle systems, L-systems, and recursive subdivision — with seeded randomness for reproducible output. Use when the user asks for generative, procedural, or algorithmic art, abstract backgrounds, or code-driven visuals.
---

# Generative Art from Math

## Ground rules

- **Seed everything.** Unseeded art can never be reproduced or refined. Use a seeded PRNG, print the seed on every run, and let the user pass one in. `Math.random()` and bare `random.random()` are banned.
- Render big: work at 2000px+ and downscale; generative line work aliases badly at small sizes.
- Iterate on *parameters*, not code rewrites. Expose 4–6 named knobs and vary one at a time.
- Save each render with the seed and knob values in the filename: `flow_s1234_sc0.003_n4000.png`.

## Seeded randomness

JS (mulberry32 — tiny and good enough for art):

```js
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1234);
```

Python: `rng = random.Random(1234)` or `rng = numpy.random.default_rng(1234)` — pass `rng` around, never use module-level functions.

## Canonical technique: flow field

A grid of angles (driven by noise) that particles drift through. This one sketch, re-parameterized, covers a huge range of looks. Node example (`npm i canvas simplex-noise`); in-browser canvas is identical minus the imports.

```js
import { createCanvas } from "canvas";
import { createNoise2D } from "simplex-noise";
import { writeFileSync } from "fs";

const SEED = 1234;                 // reproducibility
const W = 2000, H = 2000;
const SCALE = 0.003;               // noise zoom: lower = smoother, sweeping curves
const N_PARTICLES = 4000;          // density of line work
const STEPS = 120;                 // stroke length
const STEP_LEN = 2.5;              // px per step
const CURL = 2.0;                  // angle multiplier: >1 = loopier, chaotic

const rand = mulberry32(SEED);
const noise2D = createNoise2D(rand);
const cv = createCanvas(W, H), ctx = cv.getContext("2d");
ctx.fillStyle = "#0e0e12"; ctx.fillRect(0, 0, W, H);
ctx.strokeStyle = "rgba(230,225,210,0.06)";   // low alpha: overlap builds tone
ctx.lineWidth = 1.2;

for (let p = 0; p < N_PARTICLES; p++) {
  let x = rand() * W, y = rand() * H;
  ctx.beginPath(); ctx.moveTo(x, y);
  for (let s = 0; s < STEPS; s++) {
    const a = noise2D(x * SCALE, y * SCALE) * Math.PI * CURL;
    x += Math.cos(a) * STEP_LEN; y += Math.sin(a) * STEP_LEN;
    if (x < 0 || x > W || y < 0 || y > H) break;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
writeFileSync(`flow_s${SEED}.png`, cv.toBuffer("image/png"));
```

Parameters to vary (one per iteration): `SCALE` (0.0005 = oceanic sweeps, 0.01 = turbulent), `CURL` (1 = laminar, 4+ = tangles), `STEPS`/`STEP_LEN` (hair vs ribbon), alpha (0.03–0.15 controls tonal buildup), palette (map stroke hue to start position or to the noise value). Simplex is fine wherever "Perlin" is called for; in Python use the `noise` package (`noise.pnoise2`) or `opensimplex`.

## Other core techniques

**Particle systems.** Particles with position/velocity/age; forces = attraction to points, noise-driven wind, mutual repulsion. Draw trails (low-alpha, no clearing between frames) rather than dots. Kill and respawn particles at random positions to keep density even.

**L-systems** (plants, fractal branches). Rewrite a string N times, then interpret it with a turtle: `F` draw forward, `+`/`-` turn by angle, `[`/`]` push/pop state. Classic fern: axiom `X`, rules `X → F+[[X]-X]-F[-FX]+X`, `F → FF`, angle 25°, depth 6. Randomize the angle ±3° per turn (seeded) for organic variation. Depth above ~7 explodes exponentially — cap it.

**Recursive subdivision** (Mondrian, quadtrees, tiling). Recursively split a rectangle at a seeded ratio between 0.3–0.7; stop when area < threshold or `rand() < stopChance`. Fill leaves from a small palette with weighted probability; inset each cell by a gutter for the classic look.

**Perlin/simplex beyond flow fields.** Sample noise as: terrain heightmaps (map value to color ramp), organic blob outlines (radius = base + noise(angle·k, t)), or displacement of a regular grid (subtle warp turns rigid patterns organic).

## Palette discipline

Pick 3–5 colors before coding and store them as an array; index with the seeded RNG or map from noise value. Muted background + one saturated accent reads as intentional; full-spectrum HSL cycling reads as a screensaver.

## Output

- Node/browser canvas → PNG as above; for print or editability, emit the same geometry as SVG paths instead of canvas strokes.
- Python: draw with Pillow or matplotlib (`ax.set_axis_off()`, `fig.savefig(..., dpi=300)`), or write SVG directly with `svgwrite`.
- Always render, then Read the image file to inspect before iterating.
