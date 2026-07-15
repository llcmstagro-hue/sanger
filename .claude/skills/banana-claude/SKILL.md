---
name: banana-claude
description: Builds image-generation prompts with a repeatable 5-component formula — Subject + Setting + Style/Medium + Lighting/Mood + Technical specs — with worked examples for real-estate marketing (listing heroes, lifestyle scenes, neighborhood vibes). Use when composing or reviewing prompts for any text-to-image model, especially marketing imagery.
---

# The 5-Component Image Prompt Formula

Every prompt is assembled from five slots. Fill all five; vagueness in any slot is where generations go wrong.

```
[Subject] + [Setting/Context] + [Style/Medium] + [Lighting/Mood] + [Technical specs]
```

| Slot | What goes in it | Weak → strong |
|---|---|---|
| Subject | The main thing, with 2–3 concrete attributes | "a house" → "a single-story plantation-style home with a deep front lanai and white trim" |
| Setting/Context | Where, when, what surrounds it | "outside" → "on a quiet cul-de-sac at the base of green ridgelines, late afternoon" |
| Style/Medium | The visual language | "nice" → "editorial architectural photography" or "flat vector illustration" |
| Lighting/Mood | Light source + emotional temperature | "bright" → "golden hour side-light, warm and inviting" |
| Technical specs | Aspect ratio, camera/lens, detail level | (omitted) → "16:9, 24mm wide-angle, eye level, crisp detail in foreground" |

Write the finished prompt as one or two flowing sentences, not a comma list. Order the slots as above — models weight early tokens more heavily, so the subject leads.

## Filling each slot well

- **Subject**: name materials, colors, and one distinguishing feature. Anchor brand colors with hex + plain name ("deep red #B32025, a rich brick red").
- **Setting**: include time of day and one atmospheric detail (trade winds moving palm fronds, wet pavement after rain). This does more for realism than resolution keywords.
- **Style/Medium**: pick one and commit. Mixing "photorealistic" with "illustration" produces mush. For photo styles, a film/format reference helps: "35mm film look, soft grain".
- **Lighting/Mood**: the highest-leverage slot. Golden hour = warm/aspirational; blue hour with lit windows = cozy/premium; overcast = calm/editorial; hard noon = documentary.
- **Technical specs**: always state aspect ratio (in the API parameter if available, otherwise in-prompt). Lens choice sets the feel: 16–24mm for interiors and establishing shots, 35–50mm for lifestyle, 85mm for portraits, drone altitude for aerials.

## Worked examples — real-estate marketing

Use Hawaiian diacriticals (ʻokina, kahakō) in all copy: Oʻahu, Kapolei, Hawaiʻi, ʻEwa Beach, Mākaha.

**Listing hero (exterior).**
> A modern two-story family home with a standing-seam metal roof and a stone-accent entry [Subject], on a landscaped corner lot in Kapolei, Oʻahu, with the Waiʻanae range soft in the background [Setting]. Editorial architectural photography [Style]. Golden hour, warm side-light raking across the facade, sky in soft peach and lavender [Lighting/Mood]. 16:9, 24mm lens at eye level, sharp foreground detail, gentle depth falloff [Tech].

**Lifestyle scene (interior).**
> A bright open-plan kitchen with white quartz counters and koa-tone cabinetry, a bowl of fresh mango and papaya on the island [Subject], sliding doors open to a lanai with ocean glimpse beyond [Setting]. Warm lifestyle photography, lived-in but tidy [Style]. Soft morning light through sheer curtains, airy and welcoming [Lighting/Mood]. 4:5 vertical for social, 35mm lens, natural color, no HDR look [Tech].

**Neighborhood vibe.**
> A tree-lined residential street with families walking and kids on bikes, plumeria trees in bloom [Subject], an ʻEwa-side Oʻahu neighborhood near a community park, late Saturday morning [Setting]. Candid documentary photography [Style]. Bright but soft light under high broken clouds, friendly and unhurried mood [Lighting/Mood]. 16:9, 50mm lens, mid-distance perspective, people small in frame and not identifiable [Tech].

**Aerial/locator shot.**
> Aerial view of a master-planned community with parks, walking paths, and a golf course edge [Subject], Kapolei, Oʻahu, coastline visible at the horizon [Setting]. Clean drone photography [Style]. Mid-morning clear light, vivid greens and blue Pacific [Lighting/Mood]. 16:9, drone at roughly 150m, slight downward tilt, high detail [Tech].

## Real-estate guardrails

- **Never misrepresent the property.** Generated images are for concept art, ambience, blog headers, and social — not for depicting the actual listing as if photographed. Label AI imagery when used near a listing.
- Keep generated people generic and non-identifiable; never synthesize clients or agents.
- Leave negative space where the layout needs headline text ("open sky upper third for title text"), and overlay real type in post rather than asking the model to render it.
- Fair-housing awareness: depict neighborhoods and lifestyles inclusively; avoid prompts that encode demographic steering.

## Iteration protocol

1. Fill all five slots; generate 2–3 candidates.
2. Inspect at full size (Read the output image file).
3. Change exactly one slot per revision, starting with Lighting/Mood if the feel is off, Subject attributes if content is wrong.
4. Freeze the Style and Tech slots verbatim across a campaign so the set stays cohesive.
