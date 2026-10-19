# Backend verification for the structural UX refactor

Run date: 18 October 2026 (Asia/Saigon). Final backend gate: **PASS for the executed scope: 58 tests passed across 7 files, 0 failed or skipped**. Whole-product browser/backend integration remains HOLD until its outstanding flows have evidence.

Machine-readable actual evidence: `docs/evidence/ux-structural-followup/backend/vitest-results.json`. Reproduce with `node scripts/verify-ux-backend.mjs` from repository root. Final run duration: 6.94 seconds, as reported by Vitest.

## Isolation

The new runner uses the existing `math-qa-database.mjs` bridge to create fresh in-memory PGlite PostgreSQL, bound exclusively to 127.0.0.1 on a random port. A collision fails closed. Prisma generates schema DDL from the local schema (`migrate diff --from-empty`), applied only to this fresh instance. One synthetic reference skill supplies an existing integration prerequisite. The suite creates its own users, questions and assignments. Both database environment variables are overridden for child execution; database/socket close even after failure.

No existing database, production records, environment files or secret values were inspected. No production seed or migration ran. The runner inherits the process environment for executable operation but does not print or select inherited database credentials. External AI generation was not requested. `run-browser-e2e.mjs` was inspected but not executed because its fixed localhost database isolation was unproven.

## Actual executed coverage

| Suite | Level | Final result |
| --- | --- | --- |
| assignment.integration.spec.ts | Real Nest HTTP via Supertest, Prisma, isolated PGlite | 13 passed |
| assignment-blueprint-route.spec.ts | Nest route, substituted service dependencies | 1 passed |
| exam-blueprint-enforcement.spec.ts | Domain/service, mocked persistence | 8 passed |
| math-question-types.spec.ts | Validation/grading domain | 11 passed |
| exam-documents.spec.ts | Service, mocked Prisma | 4 passed |
| legacy-importer.spec.ts | Import validation/domain | 15 passed |
| teacher-workspace.spec.ts | Workspace domain helpers | 6 passed |

Real integration establishes creation/list, pre-submit answer secrecy, auto-grading/mistake logging, full result explanations, teacher scoreboard/analytics, mixed-type draft persistence/resume and partial credit, immutable submitted answers, expired-draft grading and rejected late edits, custom/hybrid paper creation, schema template and admin read-only restrictions.

The added real HTTP test establishes result publication and persisted settings, hidden score under manual-unpublished policy, regrade preview showing changed score without changing persisted score/revision/audit log, apply persisting changed score and one audit entry, incremented revision, stale revision returning HTTP409, unchanged original bank questions/options and student result matching applied score.

Document suite establishes signature validation, private-byte storage calls and owner/member access using mocked persistence. Import suite establishes math syntax/delimiter and cognitive-level mapping. Neither proves real file transport, committed bulk import, conversion or external AI.

## Repairs and run history

Initial fresh DB setup lacked a reference skill; added exactly one synthetic test prerequisite in the runner. First complete execution produced 54 pass / 3 failures in custom creation. Existing fixture questions omitted required difficulty; explicit EASY/MEDIUM/HARD was added while preserving assertions. That exposed obsolete APPLY/RECOGNIZE/UNDERSTAND fixture strings; they now use existing Prisma enum values APPLYING/REMEMBERING/UNDERSTANDING. No product source or grading semantics changed.

The new publication test initially assumed the entire hidden result was null. Inspection of actual response established score is null while the summary remains present; the assertion now checks that actual visibility contract. After correction all 58 tests passed. A subsequent run persisted the machine-readable JSON evidence and also passed all 58.

## Remaining limits

No browser was launched by this runner. Supertest establishes real route/service/database execution, not browser-to-API orchestration, responsive layout or accessibility. Actual file upload/download over HTTP, persisted bulk import, external document conversion and external AI behavior remain unverified. Dedicated real browser workflows should use an explicitly isolated database, distinct from intercepted frontend fixtures.

These backend checks pass for their stated scope. They cannot independently establish the product-wide visual finish gate or WCAG conformance.
