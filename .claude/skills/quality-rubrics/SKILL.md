---
name: quality-rubrics
description: Define explicit pass/fail rubrics for deliverables on the SANGER marketing site and grade the work against them before declaring it done. Use before finishing any component, page, copy block, or refactor, and whenever "is this good enough to ship" needs an objective answer.
---

# Quality-rubrics

Turn "done" into a checked-against-criteria judgment instead of a feeling, by writing a small rubric and grading the deliverable before you hand it off.

## When to use
- Finishing a new component, page, or section on the site.
- Delivering marketing copy or content edits.
- Completing a refactor, style pass, or animation.
- Any moment you're about to say "done" — grade first.

## Method
1. Before or right after building, write 4-8 rubric criteria specific to the deliverable. Each must be objectively checkable (pass/fail), not vague ("looks nice").
2. Draw criteria from the relevant dimensions:
   - Correctness: does it do what was asked; edge cases handled.
   - Build health: `tsc`/lint clean, no console errors, no broken imports.
   - Responsiveness: works at mobile, tablet, desktop breakpoints.
   - Accessibility: semantic HTML, alt text, focus states, sufficient contrast.
   - Design fidelity: matches the premium look — spacing scale, Tailwind tokens, typography, motion consistency.
   - Copy quality: on-brand, no typos, no unverifiable claims.
3. Grade each criterion honestly: pass, fail, or N/A. A single fail means not done.
4. For each fail, fix it and re-grade, or explicitly flag it to the user as a known gap with a reason.
5. Verify dynamic criteria by execution: actually run the build, actually check breakpoints — don't grade from assumption (see trust-calibration).
6. Report the rubric result when handing off: what passed, what failed, what you chose not to address and why.
7. Keep the rubric proportional — a 200-line refactor doesn't need a 20-item rubric; a landing page does.

## Checklist
- [ ] A concrete, pass/fail rubric of 4-8 criteria was written for this deliverable.
- [ ] Correctness, build health, responsiveness, a11y, and design fidelity were considered.
- [ ] Each criterion was graded honestly against the actual artifact, not assumed.
- [ ] Dynamic criteria (build, breakpoints) were verified by running/checking.
- [ ] Every failing criterion was fixed or explicitly flagged as a known gap.
- [ ] The grade summary accompanies the handoff, not just a bare "done."
