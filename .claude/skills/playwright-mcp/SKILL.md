---
name: playwright-mcp
description: Drives a live browser via Playwright to screenshot the running app and iterate on design from real visual feedback instead of guessing. Trigger when asked to check how something looks, verify a design in-browser, debug a visual/layout bug, or iterate on styling until it looks right.
---

# Playwright MCP

Close the loop between code and appearance: render the actual app, look at it, adjust, repeat.

## When to use
- "Does this look right?", "check it in the browser," "screenshot the page."
- Debugging a visual/layout/responsive bug you can't see from code.
- Iterating on styling where the outcome is judged by eye.

## Method
1. Start the dev server (`npm run dev`, typically `http://localhost:3000`) in the background and confirm it's serving before navigating.
2. Drive a real browser with Playwright: navigate to the target route, wait for network/animations to settle, then capture a screenshot. Prefer the project's Playwright setup already used for e2e tests.
3. Screenshot at the breakpoints that matter — at minimum mobile (375px), tablet (768px), and desktop (1440px). Layout bugs usually hide at the edges.
4. Actually inspect the image: check alignment, spacing rhythm, type sizes, color, overflow, and whether the SANGER accent/hierarchy reads. Compare against the intended design or Figma frame if there is one.
5. Diagnose from the DOM when something's off: query computed styles, box sizes, and element positions via Playwright rather than guessing which rule is wrong.
6. Exercise interactive/motion states you can't see statically: hover, focus, click, scroll to trigger `whileInView` reveals, and capture those states too.
7. Make one targeted change, re-render, re-screenshot, and diff visually. Iterate in small steps; avoid changing many things between captures.
8. Test dark mode and `prefers-reduced-motion` by emulating them in the browser context.
9. Save screenshots to the scratchpad dir for before/after comparison; surface the key ones to the user when the result is the deliverable.

## Checklist
- [ ] Dev server confirmed running before navigation.
- [ ] Captured at mobile / tablet / desktop widths.
- [ ] Screenshot actually inspected against the intended design.
- [ ] Interactive/motion states triggered and verified.
- [ ] Computed styles checked from DOM when diagnosing.
- [ ] Changes iterated one at a time with fresh captures.
- [ ] Dark mode and reduced-motion verified where relevant.
