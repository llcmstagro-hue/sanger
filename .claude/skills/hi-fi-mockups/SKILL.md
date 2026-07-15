---
name: hi-fi-mockups
description: Builds high-fidelity UI mockups as self-contained HTML/CSS pages with realistic data, real device frames, and explicit states. Use when the user asks for a mockup, wireframe, UI concept, screen design, or wants to compare design options before committing to implementation.
---

# High-Fidelity Mockups

Produce mockups that look like screenshots of a shipped product, not diagrams of one. A mockup that stakeholders can't mistake for the real thing gets real feedback; a gray-box wireframe gets shrugs.

## Core rules

1. **Self-contained HTML/CSS only.** One file, inline `<style>`, no external CDNs, fonts embedded via system stacks or data URIs. It must render identically when opened from disk or published as an Artifact.
2. **Realistic data, never lorem ipsum.** Invent plausible names, prices, dates, addresses, and copy that match the product domain. "Kailua 3bd/2ba — $1,285,000" sells the design; "Lorem ipsum dolor" kills it. Never use real client PII — invent people.
3. **Real viewport sizes.** Render inside an accurate device frame or fixed-size stage:
   - Phone: 390 x 844 (iPhone-class), 360 x 800 (Android-class)
   - Tablet: 834 x 1194
   - Laptop: 1440 x 900; Desktop: 1920 x 1080
   Draw the frame as a rounded-rect chrome around a fixed-size inner viewport so proportions are honest.
4. **Design at 100% zoom.** No scaled-down thumbnails as the primary deliverable; scale the *stage*, not the type.

## Show states, not just the happy path

Every interactive mockup should include at least three of:

- Default / populated state
- Empty state (first-run: what does the user see with zero data?)
- Loading state (skeletons, not spinners, for content areas)
- Error / validation state (inline messages, exact copy)
- Edge cases: longest realistic string (a 42-character name, a $12,450,000 price), 0 items, 1 item, 200 items, offline

Label each state clearly above its frame ("Empty state — no saved listings").

## Presenting multiple options

When the user is choosing a direction, present 2–4 options side by side on one canvas:

- Same data in every option — vary only the design, so the comparison is fair.
- Give each option a short name and a one-line rationale ("Option B — Card grid: faster scanning, weaker hierarchy").
- Never present a decoy you don't believe in; every option must be shippable.
- Recommend one, with reasons, but make the recommendation visually neutral (no gold star on your favorite).

Canvas layout for comparisons:

```html
<div style="display:flex; gap:48px; padding:48px; overflow-x:auto; background:#f0f0f3;">
  <figure><figcaption>Option A — List</figcaption><div class="device">…</div></figure>
  <figure><figcaption>Option B — Cards</figcaption><div class="device">…</div></figure>
</div>
```

## Fidelity checklist (run before delivering)

- [ ] Real typography scale (e.g. 12/14/16/20/24/32) — no arbitrary sizes
- [ ] Consistent spacing on a 4px or 8px grid
- [ ] Actual icons (inline SVG), not emoji, for UI chrome
- [ ] Shadows/elevation used sparingly and consistently
- [ ] Touch targets >= 44px on mobile frames
- [ ] Text contrast >= 4.5:1 for body copy
- [ ] Status bar / URL bar hinted in device frames so context reads instantly
- [ ] All numbers internally consistent (totals sum, dates in order)

## Anti-patterns

- Placeholder gray boxes labeled "image" — use CSS gradients or inline SVG scenes instead.
- Buttons that say "Button", nav items that say "Link 1".
- A single frame when the flow spans steps — show the sequence.
- Mixing fidelity levels in one deliverable (a hi-fi screen next to a sketch reads as unfinished).
- Making it interactive when the ask was visual — fake affordances (hover states drawn statically) are fine; half-working JS is not.

## Delivery

Publish via the Artifact tool when available so the user views it in-browser. Name frames and states in the page itself — the mockup should be self-explanatory when forwarded to someone who never saw this conversation.
