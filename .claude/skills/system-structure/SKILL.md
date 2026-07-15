---
name: system-structure
description: Structures system prompts into a clean, ordered anatomy (role, context, capabilities, constraints, output format, examples) with clear sectioning. Use when writing a new system prompt from scratch or reorganizing a messy, contradictory, or bloated existing prompt for an assistant, GPT, or Claude Project.
---

# System Prompt Structure

Build every system prompt from the same ordered skeleton. Order matters: models weight early content as identity ("who am I") and later content as procedure ("how do I respond"). Put durable facts first, per-response mechanics last, and examples at the very end so they are the freshest pattern in context before the user's message.

## The canonical section order

1. **Role** — one or two sentences: who the assistant is, who it serves, its single main job.
2. **Context** — stable background facts: the business, the audience, the domain, key terminology.
3. **Capabilities** — what the assistant can and should do; its tools and knowledge scope.
4. **Constraints** — what it must not do; compliance, safety, escalation rules.
5. **Output format** — length, structure, formatting rules for responses.
6. **Examples** — 1–5 sample exchanges demonstrating the target behavior.

## Skeleton template

```
You are {role}, an assistant for {organization/audience}. Your job is to {primary task}.

<context>
{Stable facts: business details, audience, domain vocabulary, timezone, links.}
</context>

<capabilities>
- You can {task 1}, {task 2}, {task 3}.
- When asked about {topic}, draw on {source}.
</capabilities>

<constraints>
- Never {prohibited behavior}. If asked, {fallback behavior}.
- If a request involves {escalation trigger}, direct the user to {human/professional}.
</constraints>

<output_format>
- Default to {length/structure}.
- Use {formatting rules}.
</output_format>

<examples>
<example>
User: {typical input}
Assistant: {ideal output}
</example>
</examples>
```

## Sectioning: XML tags vs markdown headers

- Use **XML tags** (`<constraints>`, `<examples>`) when the prompt is long (>50 lines), machine-assembled, or contains examples that could be confused with instructions. Tags create unambiguous boundaries the model can reference ("per the constraints above").
- Use **markdown headers** (`## Constraints`) for shorter, human-maintained prompts where readability during editing matters most.
- Pick one scheme and use it consistently. Never nest markdown-section content inside XML haphazardly or mix `## Rules` with `<rules>` in the same prompt.
- Name tags for their function, not their content: `<escalation_policy>` beats `<misc_notes_2>`.

## Why order matters — three failure modes

1. **Buried instructions.** A critical rule dropped mid-paragraph inside a long context block gets diluted. Rules belong in the constraints section as their own bullet. Test: could you find every MUST/NEVER rule by reading only the constraints section? If not, move them.
2. **Late identity.** Defining the persona at the end ("oh, and you're a pirate") produces inconsistent voice, because everything before was written and weighted as a generic assistant. Identity goes first, always.
3. **Format rules before content rules.** If output format comes before capabilities, writers tend to over-specify format and under-specify behavior. Behavior first, presentation last.

## Anti-patterns to fix on sight

- **Contradictions.** "Be concise" in section 2, "always explain your reasoning in detail" in section 6. Resolve by making one conditional: "Be concise by default; explain reasoning in detail only when the user asks why." Scan every pair of imperative rules for conflict before shipping.
- **Duplicated rules with drift.** The same rule stated twice in slightly different words ("respond within 3 sentences" / "keep replies short") invites the model to pick one arbitrarily. State each rule exactly once.
- **Instruction soup.** Twenty rules in one flat list, mixing identity, tone, format, and compliance. Group by section; if a section exceeds ~7 bullets, split it or cut low-value rules.
- **Negation without fallback.** "Never discuss pricing" leaves the model stranded when asked about pricing. Every NEVER needs a paired instead-do: "Never quote prices; instead, offer to connect them with {contact}."
- **Example/instruction bleed.** Sample dialogue floating outside any wrapper gets read as literal instruction. Always fence examples in `<example>` tags or a clearly labeled section.
- **Kitchen-sink context.** Paragraphs of history the assistant never needs. Every context fact should be traceable to some response it changes. Delete the rest.

## Worked example (condensed)

Bad (real-world pattern):

```
You help with customer questions. Be friendly. Our hours are 9-5. Never make
promises about refunds but be helpful about refunds. You are Kai, the support
bot for Mahina Coffee. Keep it short. Use bullet points and write in flowing
paragraphs.
```

Problems: identity buried at sentence 5; refund rule self-contradicts; "bullet points" vs "flowing paragraphs" conflict; no fallback for the refund prohibition.

Fixed:

```
You are Kai, the support assistant for Mahina Coffee.

<context>
Hours: 9am-5pm HST, Monday-Saturday.
</context>

<constraints>
- Never promise a refund outcome. Instead, explain the refund request process
  and offer to open a ticket for the team to review.
</constraints>

<output_format>
- 2-4 sentences by default. Use bullets only for step-by-step instructions.
</output_format>
```

## Revision checklist

- [ ] Role stated in the first sentence
- [ ] Sections in canonical order, one sectioning scheme throughout
- [ ] Every NEVER has an instead-do
- [ ] No two rules conflict; no rule appears twice
- [ ] All examples fenced and labeled
- [ ] Nothing in context that changes no response
