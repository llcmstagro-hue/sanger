# Skills Library

Agent Skills for Claude Code, integrated into this repo under `.claude/skills/`.
Each skill is a `SKILL.md` (YAML frontmatter + body) and is auto-loaded by
Claude when its `description` trigger matches the task.

**Source:** the skills are the authentic files from the public repository
[`the-ulu-team/claude`](https://github.com/the-ulu-team/claude) (42 skills across
6 plugins). They are copied here verbatim and flattened into `.claude/skills/` so
Claude Code loads them directly. The 6 plugins map 1:1 to the "layers" from the
reference carousel:

## Layer 1 — Design Foundations (`design-foundations`)
`frontend-design` · `impeccable` · `taste-skill` · `animate` · `design-motion` ·
`theme-factory` · `figma-implement` · `playwright-mcp` · `brandkit` · `designer-skills`

## Layer 2 — Visual Media (`visual-media`)
`nano-banana` · `banana-claude` · `canvas-design` · `algorithmic-art` ·
`remotion-superpowers` · `claude-remotion` · `blender-motion` · `ae-motion`

> Note: the carousel's item 14 "Animate — math-based flow fields" is the
> `algorithmic-art` skill (flow fields, Perlin noise, particle systems).

## Layers 3 & 4 — Design Ops (`design-ops`)
`hi-fi-mockups` · `brandkit-sync` · `slide-decks` · `figma-mcp` · `token-budgets` ·
`turn-repair` · `generative-ui` · `progressive-reveal` · `frustration-checks` · `feedback-loops`

## Layer 5 — Prompt Craft (`prompt-craft`)
`chain-of-thought` · `few-shot-patterns` · `system-structure` · `persona-architecture` ·
`tone-calibration` · `constraint-spec` · `emotional-design` · `template-design`

> This layer was missing from the source screenshots; it is included here from the
> upstream repo, completing the full 42-skill set.

## Layer 6 — Agent Reliability (`agent-reliability`)
`guardrails` · `trust-calibration` · `transparency-patterns` · `quality-rubrics` ·
`task-decomposition` · `handoff-protocols`

---

**Total: 42 skills.**

Some upstream skills reference the original author's house brands and examples
(The Ulu Team, Living Hawaiʻi, real-estate/MLS copy). These are kept verbatim as
the authentic source. To tailor them to SANGER, swap those brand/example
references for SANGER's own (white theme `#FAFAF8`/`#111111`, red accent `#E4141C`).
