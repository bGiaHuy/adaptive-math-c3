# Teacher Portal structural UX audit

## Visible workspace refactor — 18 October 2026

The earlier structural patches did not sufficiently change the primary teacher workspace. A subsequent batch replaces the library selection/inspector architecture, the generic home dashboard, and the large class-card directory. Root causes were an extra selection step before every library action, an unnecessary persistent folder rail, oversized class cards, and top-level summary metrics separated from the records they described.

`TeacherLibrary` now places results and paper actions on each record, groups secondary actions in a native disclosure, and keeps search/folder/status filters adjacent to records. `TeacherOverview` uses assignment monitoring and a compact class sidebar instead of equal dashboard cards. `TeacherClassDirectory` provides search/grade filtering with comparable member/assignment counts. Existing report, grading, draft, permission and API behavior remains the integration boundary. Current evidence and acceptance are recorded in `TEACHER_WORKSPACE_REDESIGN.md`.

## Final evidence update

The source audit below records the initial findings. Browser verification is now complete for the controlled first batch: see [UX_VERIFICATION_REPORT.md](UX_VERIFICATION_REPORT.md) for the final independent PASS decision, 116 after-sweep records, 36 targeted state records, matched before/after screenshots, and remaining whole-product HOLD items. Initial “pending” entries below describe the audit-time evidence level; they do not supersede the final verification report. Live production data, mutation workflows and full WCAG conformance remain unverified.

Audit date: 18 October 2026. Evidence level: source inspection and the supplied written observations. Browser findings, screenshots, measured geometry, and accessibility conformance remain pending in `UX_VERIFICATION_REPORT.md`. Historical screenshots are not evidence of the current build. No P0 data-loss or grading defect was established by this audit.

## Repeated root causes

The portal has shared visual styling but does not consistently share structural component contracts. `teacher-foundation.css`, `teacher-workspace.css`, `TeacherExamComposer.css`, `assignment-report.css`, and `site-polish.css` each participate in teacher layout. Broad descendant selectors and successive responsive overrides make the final anatomy depend on cascade order. Adding another card or local margin cannot resolve that ownership problem.

| ID / severity | Screen and source evidence | User impact and violated principle | Structural solution and acceptance |
| --- | --- | --- | --- |
| UX-01 / P1 | Composer: desktop `TeacherExamComposer.css` gives `.tw-title-input` two grid tracks, `70px minmax(0,1fr)`. `TeacherWorkspace.jsx` places label text, input, and helper in that element. | The third grid item can auto-place into the 70px label track. Help becomes a narrow column. Violates readable reflow and proximity. | Explicit label/control/helper placement. Helper belongs below input; stack on narrow widths. Verify full helper at 1440, 1280, 768 and 390px; input association remains intact. |
| UX-02 / P1 | Paper/answer list: `tw-surface tw-question` combines section-surface padding and bottom margin with summary height and summary bottom margin. `assignment-report.css` further changes report surface padding. | Closed disclosures inherit panel density, multiplying scroll cost across 22 questions. Violates task-based density. | A compact disclosure row owns summary and expanded body spacing. Closed rows are content-height; full question, options and solution remain available when opened. Compare same data and viewport before/after. |
| UX-03 / P1 | Question bank: `QuestionBankView.jsx` embeds block-rendered `MathRenderer` plus all classification metadata in one native summary; inline row padding and `site-polish.css` summary rules participate. | Native marker can separate from block content; long prompts and concatenated metadata are hard to scan. Violates component anatomy and alignment. | Summary has explicit disclosure anchor, question preview, grouped metadata and action relationship. Preserve native keyboard disclosure and all metadata; render full mathematics on expansion. Pagination already exists (10 rows); do not claim virtualization is required. |
| UX-04 / P1 | Library: `.tw-assignment-layout` has fixed folder/list/preview tracks, `min-height:460px`, and `overflow:hidden`; preview placeholder renders without selection. Foundation also repositions preview at 1100/650px. | One-item and no-selection states reserve a large empty detail region; tablet ordering is controlled by competing rules. Violates data-adaptive structure. | Render preview only when useful; list fills available space otherwise. Define selected/unselected layout modes and stable DOM order. Verify 0/1/many items, filter-to-empty, selection and deselection at all widths. |
| UX-05 / P1 | Shared controls: `.teacher-workspace label` defaults to flex column and all inputs default to 100% width/min-height44; composer overrides checkbox/radio and answer rows separately. | New field/choice combinations inherit assumptions unrelated to their purpose. Violates predictable component boundaries. | Explicit field, choice-row and toolbar contracts; use `min-width:0` on flexible content, intrinsic width for choice inputs. Verify topic selection, options, booleans, regrade forms and dialogs. |
| UX-06 / P2 | Tokens: `teacher-foundation.css` is imported before `teacher-workspace.css`, both set `--tw-*` on `.teacher-workspace`. Hardcoded colors/spacing continue in composer and report. | Semantic aliases can lose to later equal-specificity declarations, making density and state styling difficult to maintain. | One authoritative semantic token owner; component styles consume tokens. Audit generated cascade before moving imports because import changes have product-wide effects. |
| UX-07 / P2 | Analytics: `ar-question-preview` gives incorrect rate text prominence; `.ar-analysis-question` is a padded card per question and breakdown is a wrapping text cluster. | Comparing many questions requires repeated reading, with little shared visual scale. Violates comparison efficiency. | Compact comparable rows and optional proportional encoding tied to existing numerator/denominator. Keep incorrect/unanswered/pending distinct; do not change aggregation or grading semantics. |
| UX-08 / P1 verification risk | Composer selected questions, topics, report roster, and dialog bodies each own bounded scrolling; footer and support panel are sticky. | At short/tablet heights nested scroll and sticky boundaries may obscure fields or focus. Current source alone cannot establish an actual collision. | Verify keyboard focus visibility, final-field/footer clearance, page versus inner scrolling, Escape and return focus. Restrict horizontal scroll to genuine math/table regions. |

## Existing strengths to preserve

- Question bank already has search, type/topic/difficulty filters, empty messaging and pagination.
- Composer preserves multiple creation methods and the fixed 22-question blueprint. Source-switch persistence and matrix rules are protected behavior.
- Regrade editing already exposes preview-before-apply and revision/history information; these must remain visible and usable.
- Result and analytics components already distinguish several states through the shared answer-state helpers. Structural refactoring must consume those meanings rather than infer new meanings from scores.
- Existing teacher guidelines require density, deferred help, visible save actions and same-viewport evidence. The current work makes those rules enforceable at component boundaries.

## Coverage and limitations

Source inspected: teacher shell/navigation integration, composer, library/master-detail, question bank, classroom and student-list entry points, paper/regrade rendering, report/analytics CSS and shared foundation. The classroom aggregation, student attempt drawer, publishing dialog, dense mathematical formulas, loading/error states and full keyboard traversal need live browser review. This is not a claim of whole-product browser coverage or WCAG 2.2 AA certification.

Prioritization: repair deterministic form-track failure and shared disclosure anatomy first; adapt library sparse states and question-bank anatomy in the same controlled structural batch only when the changed files remain reviewable. Defer broader analytics redesign until those contracts have live evidence.

## Grading denominators and anomalous answer values

Source inspection of `assignmentReportInsights.js` establishes that scored averages and the below-five rate use submitted rows with finite scores in the 0–10 interval. Question miss rates use `(wrongAnswers + skippedAnswers) / totalAnswers`; zero denominators produce `null` through `reportPercent`. Topic rates sum response counts across questions, so their denominator is responses rather than distinct students. These are existing semantics to preserve, not proposed recalculations.

The question drawer in `TeacherWorkspace.jsx` uses submitted roster length for distribution progress and statement labels, while ranked analytics use API `totalAnswers`. Whether these populations always match is an unverified contract question. Verify with submitted, pending, excluded, partially answered and zero-submission fixtures before changing any denominator. `answerState.js` distinguishes unanswered, incomplete, pending, partial, incorrect, correct, credited and excluded for presentation; some drawer filtering separately checks blankness. A future consistency change must preserve partial and pending distinctions and cannot treat every `!isCorrect` as an incorrect response.

The literal `99999991` was not found in the searched frontend, API source or tests. That does not establish its origin or validity in stored responses. No production data was inspected. Repeated anomalous answers require authorized data/fixture provenance and comparison with raw submitted response, rendering, import normalization and accepted-answer values; never hide, rewrite or reinterpret them as a cosmetic fix.

| Area | Source coverage | Live verification status |
| --- | --- | --- |
| Library / composer / question bank / paper | Direct markup and CSS inspection; deterministic and likely structural causes listed above | Pending matched-viewport before/after evidence |
| Classes / assignments | Shell, list and roster entry-point inspection | Empty, dense and nested workflows pending |
| Results / analytics | Insight denominator helpers, answer-state helper, drawer markup and report CSS inspected | Population reconciliation and all visual states pending |
| Dialogs / student attempt / regrade | Rendering and interaction entry points inspected | Keyboard, focus return, scroll and live mutation flows pending |
