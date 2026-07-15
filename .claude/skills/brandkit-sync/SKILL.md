---
name: brandkit-sync
description: Maintains brand guidelines as a single source of truth (brand.md or a tokens file) and syncs every artifact to it, including The Ulu Team and Living Hawaiʻi brand rules. Use when creating or reviewing any branded material, defining brand tokens, or checking an artifact for brand drift.
---

# Brand Kit Sync

Every branded artifact must trace back to one canonical brand definition. If a color or font appears in an artifact but not in the brand file, either the artifact is wrong or the brand file is out of date — fix one of them before delivering.

## Single source of truth

Keep one `brand.md` (or `brand-tokens.json`) per brand at the repo/project root. Before producing any branded artifact, read it. If none exists, create it first from the rules below, then build against it. Never restate brand values from memory when a brand file exists — read the file.

Token file shape:

```json
{
  "brand": "the-ulu-team",
  "color": { "primary": "#B32025", "ink": "#1A1A1A", "paper": "#FFFFFF" },
  "type": { "heading": "Playfair Display", "body": "Raleway" },
  "spacing": { "unit": 8 },
  "voice": ["warm", "professional", "local"]
}
```

## The two house brands (never mix)

**Brand 1 — The Ulu Team** (Keller Williams Honolulu real estate team, Kapolei, Oʻahu):
- Primary color: deep red `#B32025`
- Headings: Playfair Display (serif). Body: Raleway (sans-serif).
- Use for: transaction docs, listing presentations, buyer materials, team collateral.

**Brand 2 — Living Hawaiʻi**:
- Golden yellow on black (yellow accents/type on black backgrounds).
- Distinct typography and mood from The Ulu Team — treat as a separate kit.

Hard rule: one artifact, one brand. Never place `#B32025` in a Living Hawaiʻi piece or golden-yellow-on-black in an Ulu Team piece. If the user asks for a combined artifact, stop and confirm which single brand applies, or propose two separate artifacts.

## Non-negotiable content rules

- **Hawaiian diacriticals always**: Oʻahu, Hawaiʻi, Kapolei, Waiʻanae — ʻokina (ʻ, U+02BB) and kahakō (ā ē ī ō ū) are required in all artifacts. Sole exception: MLS plain-text fields, which strip to ASCII (Oahu, Hawaii).
- **No client PII in shared or published material**: no client names paired with financial details, no loan amounts, SSNs, phone numbers, or personal emails in anything that could be forwarded or published. Use role labels ("Buyer", "Seller") or invented names in examples.

## Sync procedure (every branded artifact)

1. Identify the brand. If ambiguous, ask — do not guess between the two.
2. Read the brand file; load tokens as CSS variables:
   ```css
   :root { --brand-primary:#B32025; --font-heading:'Playfair Display',serif; --font-body:'Raleway',sans-serif; }
   ```
3. Build using only token references — no hard-coded hex values or font names in component styles.
4. Run the drift checklist below.
5. If the user requests an off-token value ("make it more orange"), apply it AND ask whether to update the brand file. Never silently fork the brand.

## Drift detection checklist

- [ ] Every color in the artifact resolves to a token (grep for `#` hex values; each must match the kit or be a neutral gray from it)
- [ ] Heading font is the kit heading font; body font is the kit body font; no third typeface
- [ ] Spacing follows the kit unit (multiples of 8px unless the kit says otherwise)
- [ ] Logo/wordmark usage matches the kit (clear space, no stretching, no recoloring)
- [ ] Voice check: copy matches the kit's voice adjectives
- [ ] Diacriticals present on all Hawaiian words (search for "Oahu", "Hawaii", "Kapolei" as drift signals — bare forms are errors outside MLS fields)
- [ ] No content from the other house brand
- [ ] No client PII

## When the brand file and reality disagree

If existing artifacts contradict the brand file, the brand file wins by default. Flag the discrepancy, list the offending artifacts, and offer to update them — or, if the drift is intentional and blessed by the user, update the brand file and note the change in a changelog line at the bottom of `brand.md`.
