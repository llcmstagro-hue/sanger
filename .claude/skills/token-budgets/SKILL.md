---
name: token-budgets
description: Manages context-window token math for long design and coding sessions — estimating token costs, budgeting reads versus outputs, and deciding when to summarize or delegate to subagents. Use when a session involves large files, many assets, long transcripts, or is at risk of running out of context.
---

# Token Budgets

Context is a finite budget. Spend it on reasoning and deliverables, not on raw bytes you didn't need. Every read, every tool result, and every verbose reply is a purchase — decide if it's worth the price before you make it.

## Estimation rules of thumb

- English prose and markup: **~4 characters per token** (a 40 KB file ≈ 10k tokens).
- Code: ~3–3.5 chars/token (denser symbols).
- JSON and minified content: ~2.5–3 chars/token (punctuation-heavy).
- A 2,000-line source file ≈ 15k–25k tokens. A full HTML mockup you author ≈ 3k–8k tokens.
- Base64/embedded assets are catastrophic: a 100 KB image inlined as base64 ≈ 33k+ tokens. Never read one into context.

Quick check before reading: `wc -c <file>` then divide by 4. If the answer is >10k tokens, read a slice or delegate.

## Budgeting reads

- Read only the range you need: use `offset`/`limit` on Read, and Grep with `-C` context lines instead of opening whole files.
- Know the file size before opening anything unfamiliar (`wc -c`, `ls -la`). Never open a file blind that could be generated output, a lockfile, a bundle, or data.
- Do not re-read files you already have in context; do not read a file just to "verify" an edit that succeeded.
- For directory surveys, use Glob + targeted Grep, not sequential full-file reads.
- Blocklist for direct reads: `*.min.*`, lockfiles, `dist/`, `build/`, `node_modules/`, CSVs over a few hundred rows, images-as-text, sourcemaps.

## Budgeting outputs

- Don't echo file contents back to the user that they can open themselves — report the path and what changed.
- When editing, prefer Edit (surgical diff) over Write (whole-file rewrite) for large files: a Write costs the whole file in output tokens.
- Generated artifacts (mockups, decks) go to disk/Artifact, then reference the path — don't also paste the source inline.
- Keep progress narration to one line per step; the deliverable carries the detail.

## When to summarize or delegate

Delegate to a subagent (Explore / general-purpose) when:
- The task is "find X across many files" — the subagent burns its own context on the search and returns only the conclusion.
- You need to digest a large document (>15k tokens) into a brief — have the agent return a summary, not excerpts.
- Parallel independent investigations exist — fan out rather than reading serially in your own window.

Summarize in place when:
- A long transcript's early details are settled — restate decisions in a compact list and rely on that going forward.
- Tool results contained large payloads you needed once (API responses, logs) — extract the 3 values that matter and move on.

Do NOT delegate when you already know the exact file and line — a direct targeted read is cheaper than agent overhead.

## Keeping large assets out of context

- Images: reference by path; only Read an image when you must visually inspect it, and never more than needed.
- Data files: process with a script (`python`, `jq`, `awk`) in Bash and bring back only aggregates.
- Fonts, media, binaries: never read; operate on them by path.
- When generating assets, write straight to disk — don't draft a 500-line file in the reply and then also Write it.

## Session hygiene for long design sessions

- Front-load a plan so later turns don't re-derive it.
- Maintain one small "state" summary (decisions, token values, file paths) and update it instead of re-explaining.
- If the session approaches its limit mid-deliverable: finish and save the current artifact to disk first, then summarize open threads — files on disk survive; context does not.

## Red flags — stop and rebudget

- You're about to Read a third 1,000+ line file "for context".
- A tool returned >20k tokens and you're about to call it again with broader parameters.
- You're pasting the same large snippet into the conversation a second time.
- The user's actual question could have been answered with one Grep.
