---
name: playwright-mcp
description: Runs a screenshot-driven iteration loop — after building UI, drives it in Chromium via Playwright, captures screenshots, compares them against the design intent, and fixes discrepancies until they match. Use after implementing or changing any visual UI, and whenever a visual bug can't be diagnosed from code alone.
---

# Playwright Feedback Loop

Never declare UI work finished without looking at it. Code that "should" render correctly frequently doesn't. Chromium is preinstalled at `/opt/pw-browsers/chromium`.

## Setup

```bash
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
npm ls playwright >/dev/null 2>&1 || npm i -D playwright
```

Serve the UI (dev server, or `npx serve dist` / `python3 -m http.server` for static builds) and note the URL. Run the server in the background so the loop can proceed.

## The loop

Repeat until the screenshot matches intent, typically 2–4 iterations:

1. Build/refresh the UI.
2. Screenshot the relevant states and viewports.
3. Look at the screenshot — actually read it (Read tool renders images). Compare against the design source or written intent.
4. List concrete discrepancies (wrong gap, overflowing text, unstyled state, missing font).
5. Fix in code. Go to 2.

Baseline screenshot script (adapt paths; write screenshots to the scratchpad directory):

```js
// shot.mjs — node shot.mjs <url> <outfile> [width]
import { chromium } from "playwright";
const [url, out, width = 1440] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
```

## What to capture

- Key viewports: 1440 (desktop), 768 (tablet), 375 (mobile). Mobile bugs are the most common misses.
- Full page (`fullPage: true`) for layout review, plus element-scoped shots (`page.locator(sel).screenshot()`) when iterating on one component.
- Interactive states — drive them, don't assume:

```js
await page.hover(".btn-primary");                 // hover
await page.keyboard.press("Tab");                  // focus ring
await page.click(".menu-trigger");                 // open states
await page.emulateMedia({ colorScheme: "dark" });  // dark mode
await page.emulateMedia({ reducedMotion: "reduce" });
```

- Real-content stress: inject long strings/empty lists via `page.evaluate` to check truncation and empty states.

## Reading a screenshot critically

Do not glance and approve. Check in order:
1. Rendering integrity: fonts actually loaded (not fallback serif), images present, no unstyled FOUC content, nothing overlapping or clipped.
2. Layout: alignment edges, spacing consistency, no horizontal scrollbar, footer not floating mid-viewport on short pages.
3. Fidelity: compare against the design/intent item by item (see figma-implement for the diff method).
4. States: hover/focus visible and styled; dark mode has no hardcoded light-mode colors bleeding through.

Also harvest console and network errors each run — they explain many visual failures:

```js
page.on("console", m => m.type() === "error" && console.log("CONSOLE:", m.text()));
page.on("pageerror", e => console.log("PAGEERROR:", e.message));
page.on("requestfailed", r => console.log("FAILED:", r.url()));
```

## Animation and transition checks

- Screenshot mid-transition: trigger, then `await page.waitForTimeout(120)` before capturing to catch enter states.
- For motion review, record video: `browser.newContext({ recordVideo: { dir: "vids/" } })`, then step through the interaction.
- Verify reduced-motion by emulating it and confirming movement is gone but content still appears.

## Discipline rules

- Name screenshots by iteration and state: `hero-1440-v3.png`, `modal-open-375-v1.png` — comparing v2 to v3 shows whether a fix worked.
- One fix batch per iteration; re-screenshot after every batch. Don't stack five speculative fixes blind.
- If a fix doesn't change the screenshot, the edit isn't reaching the page (wrong file, cache, dead selector) — diagnose that before changing more CSS.
- Stop when: all viewports and key states visually correct, zero console errors, and the final screenshots have been compared against intent one last time. Include the final screenshot paths in your report.
