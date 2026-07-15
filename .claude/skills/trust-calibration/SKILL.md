---
name: trust-calibration
description: Attach citations, file paths, and confirmation signals to claims about the SANGER codebase so the user can independently verify them, and clearly separate verified facts from assumptions. Use whenever reporting findings, asserting how code behaves, quoting config values, or making claims a user might act on without checking.
---

# Trust-calibration

Make every non-trivial claim verifiable by anchoring it to a source, and never present an assumption as a confirmed fact.

## When to use
- Reporting what a file, component, or config does after reading it.
- Stating that a build passes, a test runs, or a route exists.
- Quoting a value (env var, Tailwind token, dependency version, copy string).
- Summarizing behavior across multiple files for the parent agent or user.
- Making any claim the user might rely on without re-checking.

## Method
1. For each factual claim, attach its source: an absolute file path plus line, a command you ran, or a URL. No source means it is an assumption, not a fact.
2. Distinguish three tiers explicitly:
   - Verified: "I ran `npm run build` and it exited 0."
   - Read-but-inferred: "`Hero.tsx:42` sets the CTA text; I did not render it."
   - Assumed: "I assume the deploy target is Vercel (not confirmed in repo)."
3. Prefer showing the load-bearing evidence over describing it: quote the exact line when the wording matters.
4. When you did not verify something you'd normally check (didn't run the build, didn't open the file), say so plainly instead of implying you did.
5. Confirm dynamic claims by execution, not memory: run the command, read the file, hit the route. Package versions, script names, and config come from the repo, not recollection.
6. For external facts (library behavior, API limits), cite a doc URL or mark as needing lookup rather than asserting from training data.
7. When two sources conflict (docs vs. code), report both and say which you trust and why.

## Checklist
- [ ] Every factual claim has a source: file:line, a command run, or a URL.
- [ ] Verified facts, inferences, and assumptions are visibly labeled, not blended.
- [ ] Values (versions, tokens, copy) were quoted from the repo, not recalled.
- [ ] Anything not actually run or read is stated as unverified.
- [ ] File paths given are absolute so the user can jump straight to them.
- [ ] No confident claim rests on memory where the repo could be checked.
