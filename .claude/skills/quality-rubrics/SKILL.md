---
name: quality-rubrics
description: Builds pass/fail evaluation matrices for agent output and applies them before delivery — binary criteria, self-scoring workflow, and worked rubrics for a real estate listing description and a client email. Use when defining quality gates for agent deliverables or checking work before it ships.
---

# Quality Rubrics: Pass/Fail Matrices for Agent Output

Score every deliverable against an explicit rubric before handing it over. "Looks good" is not a quality check; a filled-in matrix is.

## Build rubrics with binary criteria

- Every criterion must be answerable **pass or fail** by someone other than the author. "Well-written" is not a criterion; "no sentence exceeds 30 words" is. "Compliant" is not a criterion; "contains no personalized legal or financial advice" is.
- If you catch yourself wanting a 1–5 scale, split the criterion. "Tone: 3/5" becomes three binaries: uses brand voice vocabulary (pass/fail), no exclamation-point clusters (pass/fail), addresses the client by name (pass/fail).
- Group criteria into categories — typically **Accuracy**, **Compliance**, **Brand/Voice**, **Completeness**, **Safety/PII** — so a failure tells you which reviewer or fix path it needs.
- Mark criteria as **blocking** or **advisory**. Any blocking failure means the output does not ship, full stop. Advisory failures ship with a note if the deadline demands it.
- Keep rubrics to 6–12 criteria. Beyond that, checking degrades into skimming.
- Every criterion needs a verification method: read the source, run the search, count the words. A criterion you can't verify mechanically or by direct comparison is a wish, not a check.

## Scoring workflow

1. Draft the output.
2. Fill in the matrix, one row at a time, actually performing each check — do not batch-declare "all pass."
3. Fix every blocking failure and re-check that row.
4. Deliver the output. Include the matrix when the stakes warrant it (published material, client-facing documents); omit it for low-stakes internal drafts but still run it.
5. If a criterion fails twice after fixes, escalate to a human rather than looping.

Score the output as it will ship, not the version in your head. Re-run the rubric after any edit, however small — edits reintroduce failures.

## Worked rubric: listing description

| # | Criterion | Blocking | Check method |
|---|---|---|---|
| 1 | Every factual claim (beds, baths, sqft, year, fees) matches the source data sheet | Yes | Compare field-by-field |
| 2 | No fair-housing red flags (no references to protected classes, "perfect for families," neighborhood demographics) | Yes | Scan against fair-housing wordlist |
| 3 | No fabricated specifics — nothing stated that isn't in source docs or photos | Yes | Trace each claim to a source |
| 4 | Hawaiian diacriticals (ʻokina, kahakō) correct in all place names — except MLS plain-text fields, which get the plain-ASCII version | Yes | Check each Hawaiian word both ways |
| 5 | No client PII: no seller name, contact info, or personal circumstances ("motivated," "divorce," "estate sale" tied to persons) | Yes | Scan for names/numbers/circumstances |
| 6 | Brand voice: The Ulu Team register — warm, specific, no ALL-CAPS, no more than one exclamation point total | No | Read-through against brand guide |
| 7 | Length fits the target field limit (e.g., MLS remarks character cap) | Yes | Character count |
| 8 | Opens with the property's strongest verifiable feature, not boilerplate | No | Read-through |

## Worked rubric: client email

| # | Criterion | Blocking | Check method |
|---|---|---|---|
| 1 | All dates, amounts, and deadlines verified against transaction documents this session | Yes | Trace each to its document |
| 2 | No personalized legal or financial advice; where the topic arises, the email directs the client to a licensed professional | Yes | Scan for advice phrasing ("you should," "I recommend" + legal/financial subject) |
| 3 | If an agreement is attached or described, it is framed as a "Memorandum of Agreement" with the not-an-attorney disclaimer recommending independent legal counsel | Yes | Check title and disclaimer text |
| 4 | No third-party PII: no other client's name, price, or situation leaked into this email | Yes | Scan recipients vs. content |
| 5 | Correct recipient and correct transaction — names, address, and details all belong to the same deal | Yes | Cross-check against the project |
| 6 | Hawaiian diacriticals correct throughout (email is not an MLS plain-text field) | Yes | Check each Hawaiian word |
| 7 | One clear ask or next step, stated in the first or last paragraph | No | Read-through |
| 8 | Brand voice: Playfair/Raleway-era Ulu Team tone — professional, warm, no jargon dumps | No | Read-through against brand guide |
| 9 | Attachments mentioned in the body are actually attached | Yes | Compare list to attachments |

## Writing new rubrics

When a deliverable type has no rubric yet, derive one in this order:
1. **What breaks trust or compliance if wrong?** → blocking accuracy and compliance rows first.
2. **What has gone wrong before?** → one row per past incident.
3. **What does the brand or channel require?** → voice, formatting, field limits.
4. **What would a careful human check last?** → recipient, attachments, names.

Retire criteria that have never failed in 20+ uses and add a row whenever a defect ships that the rubric missed. A rubric that never changes is a rubric nobody is using.
