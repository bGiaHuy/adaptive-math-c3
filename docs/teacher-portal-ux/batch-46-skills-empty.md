# Batch 46 — Capability inventory and skills empty state

P2: skills aggregation with existing reports but no eligible questions rendered only a heading and generic explanation. Added a specific empty message with guidance to review content/grading modes, without changing exclusion or scoring rules. The existing no-report empty state was already present and remains unchanged.

TeacherWorkspace.jsx changed. verify-teacher-skills-empty.mjs uses published reports whose questions are all EXCLUDE; before/after captures at1440×900,820×1000,390×844. After checks passed with no page errors or document overflow; no synthetic0% substituted. Build passed. Evidence docs/evidence/teacher-skills-empty/. Initial verifier targeted the existing no-report state and was corrected to the actual missing edge case; the after verifier also had to stop requiring the heading replaced by the empty state.

Created capability-inventory.md mapping current UI entry points and functions to dedicated evidence. It is a source/evidence inventory, not an exhaustive claim of feature preservation or production integration. Next: remaining nested visual states and completion audit; no goal completion claim.
