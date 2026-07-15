---
name: generative-ui
description: Renders responsive widgets and dashboards on demand as self-contained HTML artifacts — mobile-first, theme-aware, with data baked in and no external dependencies. Use when the user asks for a dashboard, widget, calculator, tracker, status board, or any small interactive UI generated to answer their need.
---

# Generative UI

When a question is better answered by an interface than a paragraph, generate the interface. A dashboard the user can scan beats a table they must parse — but only if it works on their phone, in their theme, offline.

## Self-contained or broken

- One HTML file: inline `<style>` and `<script>`, zero external requests.
- **No CDNs, ever** — no Google Fonts, no chart libraries, no icon packs, no fetch/XHR. Artifact CSPs block external hosts, so a CDN reference is a blank page.
- Fonts: system stacks (`-apple-system, 'Segoe UI', Roboto, sans-serif`; `Georgia, serif`).
- Icons: small inline SVGs. Images: inline SVG scenes or data URIs, kept small.
- Charts: hand-rolled SVG or CSS — bars, lines, sparklines, and donuts need no library:

```html
<svg viewBox="0 0 100 30" preserveAspectRatio="none">
  <polyline fill="none" stroke="currentColor" stroke-width="1.5"
    points="0,25 15,20 30,22 45,12 60,15 75,8 100,5"/>
</svg>
```

## Data baked in

- Embed the dataset as a JS const or directly in markup — the widget must render with the network cable cut.
- Use the user's real data when provided; otherwise realistic invented data, clearly labeled as sample. Never lorem ipsum, never client PII.
- Precompute derived values (totals, deltas, percentages) or compute them in the inline script — but verify the math yourself; don't trust the rendering to hide a wrong sum.
- Show data freshness: a small "as of <date>" caption on anything time-sensitive.

## Mobile-first responsive rules

- Write base styles for ~360px width; add breakpoints upward (`@media (min-width: 640px)`, `768px`, `1024px`).
- Layout with grid/flex and relative units; `max-width:100%` on all media.
- The page body must never scroll horizontally. Wide tables and charts get their own `overflow-x:auto` wrapper.
- Touch targets >= 44px; hover-only affordances get a tap equivalent.
- Dashboard pattern: single column of cards on mobile → 2-up at 640px → 12-col grid at 1024px, with key metrics (stat tiles) first in source order so mobile leads with the headline numbers.

## Theme-aware (light and dark)

Style both themes; assume the viewer may toggle:

```css
:root { --bg:#ffffff; --ink:#1a1a1a; --muted:#666; --card:#f6f6f8; }
@media (prefers-color-scheme: dark) {
  :root { --bg:#111114; --ink:#ececf0; --muted:#9a9aa2; --card:#1d1d22; }
}
:root[data-theme="dark"]  { --bg:#111114; --ink:#ececf0; --muted:#9a9aa2; --card:#1d1d22; }
:root[data-theme="light"] { --bg:#ffffff; --ink:#1a1a1a; --muted:#666;    --card:#f6f6f8; }
```

- Every color in the widget goes through a variable — no raw hex in component rules.
- Check contrast in both themes (>= 4.5:1 body text); accent colors often pass in light and fail in dark, so define per-theme accent values.
- Charts use `currentColor` or variables so they flip with the theme.

## Interactivity budget

- Vanilla JS only; keep it under ~150 lines. Filters, tabs, sort toggles, and simple calculators are in scope; routing and state libraries are not.
- Everything must degrade: with JS disabled the default view still shows all data.
- No `localStorage` dependence for first paint; persist preferences only as enhancement.

## Before delivering — checklist

- [ ] Zero external URLs anywhere in the file (grep for `http` inside the artifact)
- [ ] Renders correctly at 360px, 768px, and 1280px widths; no horizontal body scroll
- [ ] Light and dark both styled via variables; `data-theme` overrides present
- [ ] All numbers internally consistent; freshness date shown
- [ ] Interactive controls keyboard-accessible (real `<button>`, `<select>`, labels on inputs)
- [ ] File published via the Artifact tool when available, with a stable title
