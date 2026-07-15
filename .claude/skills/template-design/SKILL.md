---
name: template-design
description: Builds parameterized prompt templates with {brace} variables — naming conventions, required vs optional slots, defaults, and validation instructions. Use when creating reusable prompts that different people or systems will fill in with varying data, such as listing descriptions, outreach messages, or report generators.
---

# Parameterized Prompt Templates

A prompt template is a contract: named slots, rules for filling them, and defined behavior when a slot is empty or malformed. Most template failures come from ambiguous slot names, silent handling of missing values, or unfilled braces leaking into output. Design all three explicitly.

## Variable naming

- Lowercase snake_case inside single braces: `{property_address}`, `{buyer_first_name}`.
- Name the content, not the position: `{closing_date}` not `{date2}`.
- Encode units and format in the name when ambiguity is possible: `{price_usd}`, `{sqft_interior}`, `{tour_time_hst}`.
- Prefix booleans and enums so they read as conditions: `{is_pet_friendly}`, `{tone_level}`.
- Never reuse one name for two meanings, and never use two names for one meaning across a template family — keep a shared glossary if you maintain multiple templates.

## Required vs optional slots, and defaults

Declare every slot in a header block the model reads before the template body:

```
<slots>
Required: {address}, {beds}, {baths}, {sqft}
Optional: {highlights} (default: derive 2 highlights from the required facts)
Optional: {tone_level} (default: 3 — friendly)
Optional: {max_words} (default: 150)
</slots>
```

Three rules:
1. **Required means halt.** If a required slot is missing, the template must not guess. Instruct: "If any required slot is empty or still contains a brace placeholder, do not generate the output; instead list the missing slots and ask for them."
2. **Optional means defined default.** Every optional slot states its default inline. "Optional" with no default is a hidden requirement.
3. **Defaults are behaviors, not just values.** A default can be an instruction ("derive from required facts") — often better than a static fallback.

## Validation instructions

Put validation before generation in the template body:

```
<validation>
Before writing, check each filled slot:
- {sqft}: numeric, 100–20000. Outside range → ask for confirmation, don't generate.
- {beds}, {baths}: numeric; baths may be .5 increments.
- {address}: must include unit number if the property is a condo.
- Any slot containing text like "{" or "TBD" or "xxx" → treat as unfilled.
Never let a raw placeholder or filler value appear in the final output.
</validation>
```

The "TBD/xxx" check matters in practice: humans paste half-filled templates constantly, and the model will happily write "this TBD-bedroom home" without it.

## Worked example: reusable listing-description template

```
You generate MLS-ready listing descriptions.

<slots>
Required: {address}, {beds}, {baths}, {sqft}
Optional: {highlights} — comma-separated features (default: select the 2 most
  marketable facts from the required slots)
Optional: {neighborhood} (default: omit neighborhood references)
Optional: {max_chars} (default: 1000)
</slots>

<validation>
- If {address}, {beds}, {baths}, or {sqft} is missing or contains a brace,
  stop and list what you need.
- {highlights}: use at most 4 even if more are provided; pick the most
  specific ones (a named upgrade beats "great location").
- Never invent features not present in {highlights} or derivable from the
  required slots. No "ocean views" unless it's in {highlights}.
</validation>

<output>
One paragraph, at most {max_chars} characters. Open with the strongest
highlight, not the address. Weave in {beds}/{baths}/{sqft} naturally —
never as a bare stat list. End with a low-pressure viewing invitation.
Factual, warm, zero superlative stacking (max one "stunning"-class word).
</output>
```

Filled call:

```
{address}: 94-1021 Kanehoa Loop, Waipahu
{beds}: 3   {baths}: 2   {sqft}: 1240
{highlights}: remodeled kitchen (2024), corner lot, PV panels owned outright
```

Expected behavior: opens on the remodeled kitchen or owned PV, works the 3/2/1,240 into prose, no invented view claims, one paragraph under 1,000 characters.

## Template hygiene rules

- **Version your templates.** Add `template_version: 1.3` in a comment; when outputs regress you need to know which version produced them.
- **Keep slot count under ~8.** More than that, split into two templates or move stable choices (brand voice, banned words) into the surrounding system prompt instead of slots.
- **Separate data slots from control slots.** Data slots hold facts ({sqft}); control slots steer generation ({tone_level}, {max_chars}). List them separately so fillers know which are safe to leave on defaults.
- **Test the empty case.** Run the template with zero slots filled and with only required slots filled. The first must produce a request for inputs; the second must produce acceptable output using every default.

## Checklist

- [ ] snake_case slot names that encode units/format where ambiguous
- [ ] Slots declared up front: required vs optional, every optional with a default
- [ ] Halt-and-ask rule for missing required slots and leftover braces
- [ ] Per-slot validation with ranges and filler-value detection
- [ ] No-invention rule: output facts must trace to a slot
- [ ] Empty-case and defaults-only case tested
