# Batch 50 — Invite-copy failure recovery

P2: browser clipboard denial exposed a technical error with no next step. Added Vietnamese guidance to select the visible invite code and copy manually or grant copying permission and retry. The invite code stays visible. Existing success feedback and permissions are unchanged.

TeacherWorkspace.jsx changed. New verify-teacher-invite-copy.mjs simulates denied clipboard then successful write, verifies the exact invite code, clears stale error on retry, and preserves the one-time code after class-details loading. Passed1440×900,820×1000,390×844 before/after with no page errors; production build passed. Inspected after-mobile screenshot. Evidence docs/evidence/teacher-invite-copy/. System clipboard never read or modified; simulated clipboard is explicitly not an OS integration test.

Configured shared regression now33 suites; last full completed run remains32/32. Runtime recovery uses the available elevated execution path because default sandbox account launch still fails1909. No Windows account/security changes were made.

Remaining: requirement-level evidence gaps and final visual review. Historical before-state gaps and real mobile keyboard remain limitations. This batch does not complete the goal.
