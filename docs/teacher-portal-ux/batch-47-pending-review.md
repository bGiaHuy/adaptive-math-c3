# Batch 47 — Truthful review-filter empty state

P1: a student result with22 answered but pending questions showed “all questions correct” when the review filter had zero matches. The message inferred success from an empty review set, although pending/excluded/credited questions are deliberately outside that set. Reproduced the false claim on desktop, tablet and mobile before editing.

ExamResultDialog now reserves the all-correct statement for a nonempty set whose questions are all classified correct. Other empty review sets explain that pending, excluded and full-credit questions are not shown. Teacher wording addresses the student in third person. No grading, answer-state classification or filter membership changed.

verify-teacher-pending-review.mjs passed at1440×900,820×1000,390×844:22 pending badges before filtering and accurate empty text after filtering. Matching before/after screenshots and JSON in docs/evidence/teacher-pending-review/. answer-state unit test passed. No real writes or page errors. Shared regression now configures31 scripts including skills-empty; this is not a full31/31 claim.

Remaining: full regression after these changes and review of other nested answer states; original scope and historical before-image limitations remain unchanged.
