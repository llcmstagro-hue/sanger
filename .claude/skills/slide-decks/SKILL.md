---
name: slide-decks
description: Builds presentation decks from reusable HTML slide templates with consistent masters, a 16:9 grid, and an on-brand type scale, including listing-presentation and buyer-consult patterns for The Ulu Team. Use when the user asks for a deck, presentation, slides, or a pitch for clients or internal use.
---

# Slide Deck Rigs

Build decks as a set of reusable HTML slide masters, then instantiate content into them. Never design each slide from scratch — the rig guarantees consistency; the content varies.

## The five masters

Every deck is composed from exactly these templates:

1. **Title** — deck title, presenter, date, one hero visual. No body text.
2. **Section** — full-bleed divider announcing the next chapter. One line of text.
3. **Content** — headline (the claim) + supporting body/visual. The workhorse.
4. **Data** — one chart or one table, headline states the takeaway ("Kapolei median up 6% YoY"), not the topic ("Market data").
5. **Closing** — recap, call to action, contact block.

If a slide doesn't fit a master, split it into two slides — don't invent a sixth layout mid-deck.

## 16:9 layout grid

Fixed stage: 1280 x 720 px per slide.

```css
.slide { width:1280px; height:720px; display:grid;
  grid-template-columns: repeat(12, 1fr); gap:24px;
  padding: 64px 80px; box-sizing:border-box; }
```

- 12-column grid, 24px gutters, 80px side margins, 64px top/bottom.
- Headlines span columns 1–10 max; never wall-to-wall text.
- Keep a consistent headline baseline position across all Content slides — the headline must not jump between slides.

## Type scale (on-brand)

For The Ulu Team decks: headings in Playfair Display, body in Raleway, accents in deep red `#B32025`. For Living Hawaiʻi decks: golden yellow on black throughout. One brand per deck — never both (see brandkit-sync).

Scale at 1280x720: headline 48px, section title 64px, body 24px, caption/source 16px, data labels 20px. Minimum on-screen body size is 24px — if text needs to be smaller to fit, there is too much text.

Hawaiian diacriticals are required in all slide text: Oʻahu, Hawaiʻi, Kapolei.

## One idea per slide

- Each slide makes exactly one claim; the headline IS the claim, written as a sentence.
- Maximum 4 bullets, 8 words each — beyond that, split the slide.
- If the audience must read while you talk, the slide has failed. Move detail to a leave-behind or appendix.
- Test: cover everything but the headline. Does the deck still tell the story? It should.

## Real estate deck patterns

**Listing presentation** (seller-facing, ~12 slides):
1. Title — property address as hero
2. Section — "Your Home"
3. Content — property highlights (what makes it sell)
4. Data — comparable sales table (3–5 comps, address/beds/baths/sold price/DOM)
5. Data — pricing strategy (recommended range, rationale headline)
6. Section — "Our Marketing"
7. Content x2 — marketing plan (photography/staging, digital reach)
8. Content — timeline: prep → list → offers → close
9. Content — team credentials (production stats, not adjectives)
10. Closing — next steps + signature block

**Buyer consult** (~9 slides): Title → Section "Your Search" → Content criteria recap → Data market snapshot for target neighborhoods → Content buying process timeline → Content financing overview (general steps only — direct clients to their lender, no personalized financial advice) → Content what the team handles → Closing next steps.

## Compliance in decks

- No client PII on any slide that could be reused or shown to another party — use "the Sellers", invented example figures, or aggregate stats.
- Financing and legal content stays generic; add "consult your lender/attorney" where relevant.
- MLS data cited on Data slides gets a source + date caption at 16px.

## Build and delivery checklist

- [ ] All slides instantiate one of the five masters
- [ ] Single brand throughout; tokens loaded from the brand kit, no hard-coded off-brand values
- [ ] Every headline is a claim, one idea per slide
- [ ] Consistent slide numbering and footer (team name, page x/y)
- [ ] Diacriticals verified; no bare "Oahu"/"Hawaii"
- [ ] Self-contained HTML (no CDNs); each `.slide` renders at exactly 1280x720; deck scrolls vertically slide by slide
- [ ] Print check: slides survive grayscale (data slides don't rely on color alone)
