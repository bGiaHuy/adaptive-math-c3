# Batch 45 — Student activity progressive disclosure

P1: every screen-leave event rendered expanded in the student result dialog. A long event history created a wall of secondary information below the answers. Keep count, total duration, reload count and the explanatory limitation always visible; place individual timestamps inside a native details disclosure with count and44px summary target. No events removed or interpretation changed.

Changed TeacherWorkspace.jsx and exam-result.css. Fixture with30 events, including one without known return/duration, tested before and after at1440×900,820×1000,390×844. Details starts closed, expands to all30 entries, preserves unknown-return text, collapses again; closing student view returns to the same question and roster search. Inspected after-mobile screenshot, header/score/footer remain visible and summary readable. Build passed. No real writes or page errors.

Evidence: docs/evidence/teacher-student-activity/before/after.json and matching viewport PNGs. Verifier added to shared command (29 suites configured; no claim of a full29-suite run). This test covers activity/navigation, not every student question state. Next: finish visual/capability review and consolidate final evidence; preserve historical baseline gaps.
