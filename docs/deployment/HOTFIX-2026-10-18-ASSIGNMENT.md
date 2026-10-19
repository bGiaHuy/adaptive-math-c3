# Assignment save hotfix — 18 October 2026

Production: https://adaptivemath-blush.vercel.app
Source commit: 85312edbfc75945e40bc819f9053c1c7d498accf
Render deployment: dep-dbaacg942hec73dd66gg (live)
Vercel deployment: dpl_CTrb4hKZspLThbQPrius2b6CVY6G (READY; production domain confirmed)

## Cause and fix

Production logs showed Prisma P2028 during assignment creation: the interactive transaction expired after 5 seconds while creating custom questions and repeatedly resolving their fallback skill. The application also updated each assignment snapshot separately.

Custom questions and options now use bulk inserts. Explicit skills are resolved in one query; the grade-0 teacher-document fallback is resolved once per paper. Snapshots are created with assignment rows in a bulk nested insert. All writes remain in one atomic transaction, with a bounded 30-second timeout and 10-second acquisition allowance for cloud latency. No schema migration, existing assignment, student answer, or content-bank label was changed by the fix.

Removed the conflicting semantic CSS override so the AI tutor uses its fixed bottom-right position on desktop and mobile.

## Verification

- Typecheck and API production build passed.
- 14 isolated assignment integration tests passed, including a new 22-question mixed paper (12 single-choice, 4 true/false, 6 short answer), complete immutable answer snapshots, and rejection of duplicate content without extra question rows.
- Real production API: verified QA teacher login, class creation, document upload, publication of 22 questions, student registration and join, draft save/resume with 22 answers, submission, hidden result before teacher publication, report retrieval, publication and score 10/10.
- Initial production assignment creation took 3596 ms; draft save 3256 ms; submission 2506 ms.
- PDF parity: uploaded the actual 1,100,162-byte Hung Yen PDF from the screenshot, downloaded it byte-identically (SHA-256 match), created a 22-question paper with it, and repeated the browser confirmation flow successfully. Changing the source document on a paper with an existing submission correctly returned HTTP 400; a separate fresh QA paper was used.
- Real production browser: clicked through reuse, settings, review and Confirm assignment; POST returned 201 and editor exited successfully. Extra assignment made for this browser check was deleted; dedicated QA class, student and initial sample remain for traceability.
- 12 production routes were checked after loading: teacher overview/classes/library/bank and student dashboard/profile/learning-path/missions/mistakes/review/classroom/diagnostic. No JavaScript errors or API 500 responses occurred in these checks.
- Tutor launcher positioned at bottom/right 24 px on desktop; checked mobile at 390 px and chat open/close.
- Render unhandled-error log search after release returned no new entries during verification.

Evidence: `docs/evidence/assignment-timeout-hotfix/production.json`, `production-composer.json`, `production-composer-pdf.json`, `production-pages.json`, `production-pdf.json`, screenshots and `vitest-results.json`.

## Remaining content limitation

New diagnostic creation still returns HTTP 400 `DIAGNOSTIC_BLUEPRINT_INSUFFICIENT`: the published grade-9 bank does not fill the required topic/cognitive/difficulty slots. This is a real user-facing limitation and is not resolved by the assignment hotfix. The diagnostic screen itself loads. Do not describe the entire site or all its flows as passing; the diagnostic bank needs content/label review before new diagnostic attempts can run. AI text generation and all admin roles were not exercised in this verification.
