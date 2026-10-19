# Visible Teacher Portal workspace replacement

Date: 18 October 2026 (Asia/Saigon).

## Implemented scope

The first refactor improved local component behavior but left the main teacher screens visually similar. This batch replaces their information architecture rather than changing only spacing.

| Screen | Before | After |
| --- | --- | --- |
| Library and class assignment lists | Folder rail, selection button and separate inspector for core actions | Full-width records with direct results/paper actions; secondary actions stay with the record; status/search/topic filters stay adjacent |
| Teacher home | Large statistics and class cards preceding assignment work | Inline activity summary, assignment monitoring, factual follow-up work and compact class navigation |
| Class directory | Large class cards | Comparable member/assignment rows with class search and grade filter |

New components: `TeacherLibrary.jsx`/`TeacherLibrary.css`, `TeacherOverview.jsx`/`teacher-overview.css`, `TeacherClassDirectory.jsx`/`teacher-portal-layout.css`. `TeacherWorkspace.jsx` integrates them and removes the obsolete inspector/selection state. Existing report, composer, reuse, settings and delete-confirmation callbacks are retained.

No grading, authorization, API, matrix or stored-data changes were made. The class directory uses existing assignment counts; the home follow-up queue uses actual draft status and open assignments with zero submissions rather than inferred learning outcomes.

## Verification

Independent review and the current gate are in [UX_VERIFICATION_REPORT.md](UX_VERIFICATION_REPORT.md). Browser screenshots and JSON are in `docs/evidence/teacher-workspace-redesign/`, covering 1440×900, 1280×800, 768×1024 and 390×844, with empty/sparse/normal/dense fixtures. Direct navigation, reuse, delete cancellation, filtering and pagination were exercised. These fixtures are isolated browser evidence, not a claim about the user's current account data.

Production build and 16 existing frontend/domain tests passed. A separate read-only localhost API check authenticated the existing demo teacher and returned one class with no assignments; it does not establish coverage of the user's different session/class.

Current local server responses include the new components. Library: `http://127.0.0.1:3000/#/teacher-library`; home: `http://127.0.0.1:3000/#/teacher-overview`; classes: `http://127.0.0.1:3000/#/teacher-classes`.

## Remaining boundaries

This is acceptance of the three replacement screens and checked interactions, not a new claim of product-wide WCAG or production end-to-end certification. Real browser/API/file-transport coverage and broader report/composer limitations remain as documented in the verification report. Preserve full mathematical content and existing assessment semantics in later batches.
