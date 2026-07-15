---
name: slide-decks
description: A reusable template system for building presentation decks (HTML or React) with consistent layouts, on-brand styling, and predictable slide types. Use when creating a pitch deck, client proposal, sales one-pager set, or internal review deck for SANGER, or when standardizing an existing ad-hoc deck.
---

# Slide Decks

Build presentation decks from a small set of reusable slide layouts sharing the SANGER brand system, so decks are fast to assemble and visually consistent.

## When to use
- Creating a client pitch or proposal deck for a team/club uniform program.
- Assembling a sales one-pager set or capability overview.
- Internal review or roadmap deck that should look on-brand.
- Standardizing a deck that was hand-built slide by slide.

## Method
1. Define the deck as one HTML file (inline CSS) or a React route under `preview/`. Each slide is a full-viewport section (`100vw` x `100vh`) with `scroll-snap-align: start` on the container for keyboard/scroll paging.
2. Reuse brand tokens: pull colors, fonts, and spacing from `tailwind.config.ts` / `app/globals.css` so the deck matches the product, not a generic template.
3. Build a fixed vocabulary of slide layouts and reuse them:
   - Title (logo, headline, subline).
   - Section divider (big number + label).
   - Statement (one large claim, generous whitespace).
   - Two-column (text left, visual/mockup right).
   - Grid (3-4 cards: sports, features, or process steps).
   - Metrics (KPI row).
   - Gallery (product/jersey imagery from `public/`).
   - Contact/CTA (mirrors the lead form's value prop).
4. Keep content in a data array (slides = [...]) and map over it, so reordering and edits are trivial.
5. Add minimal chrome: slide counter, and left/right arrow + spacebar navigation.
6. Ensure print/PDF export works: each slide breaks cleanly (`break-after: page`) and colors survive `-webkit-print-color-adjust: exact`.
7. Screenshot the first, a content, and the CTA slide for review before finalizing.

## Checklist
- [ ] Slides use brand tokens from the project config, not generic styling.
- [ ] Every slide maps to one of the defined layout types (no bespoke one-offs).
- [ ] Content lives in a data array, not hardcoded per slide.
- [ ] Keyboard + scroll navigation works; slide counter present.
- [ ] Clean PDF/print export with per-slide page breaks and preserved colors.
- [ ] Reviewed at presentation aspect ratio (16:9) before hand-off.
