# Batch 38 — Runtime recovery and password dialog

## Finding and change

P1: closing the password dialog with Escape bypassed its form reset. Reopening could retain passwords and their visibility. `ChangePasswordModal.jsx` now clears values, visibility and feedback when the dialog closes. Its delayed success-close timer is cleaned up on close/unmount so it cannot close a later dialog instance.

## Verification

The local execution environment recovered on 2026-10-18. Existing workspace edits were preserved.

`node scripts/verify-teacher-account.mjs` passed in Chrome at 1440×900, 820×1000 and 390×844. Each check entered synthetic passwords, revealed a field, closed with Escape and reopened: all three inputs were empty and masked. No page errors or horizontal page overflow. Screenshots and machine-readable results: `docs/evidence/teacher-account/`.

`npm run build` passed. Tests intercepted API requests and did not change a real password or revoke real sessions. No historical before screenshot exists for this specific defect.

## Remaining scope

Session-management loading, failure/retry, empty and revocation states still require dedicated browser coverage. This batch does not establish that the complete Teacher Portal goal is finished. Next: verify those states with intercepted API responses and preserve existing authentication semantics.
