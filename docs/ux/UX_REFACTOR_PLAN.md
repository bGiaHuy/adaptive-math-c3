# Teacher Portal controlled structural refactor plan

Current visual direction has additionally shipped: teacher-only app frame, desktop/tablet/mobile navigation, gallery/list library and overview panels. See [TEACHER_UI_OVERHAUL.md](TEACHER_UI_OVERHAUL.md) for implementation and current verification; earlier iterations below are history.

Latest execution: the primary overview, library/class-assignment list and class directory have additionally been replaced with task-oriented components. See [TEACHER_WORKSPACE_REDESIGN.md](TEACHER_WORKSPACE_REDESIGN.md) and the latest independent browser gate in [UX_VERIFICATION_REPORT.md](UX_VERIFICATION_REPORT.md). This supersedes the earlier assumption that component-level changes alone delivered a visibly restructured workspace.

## Execution update — 18 October 2026

All three implementation batches have now been executed. Batch 1 established explicit fields/disclosures/library anatomy. Batch 2 added comparable topic/question rows, shared response distributions, actionable report priorities and full-detail access instead of clipped math previews. Batch 3 consolidated modal keyboard/scroll/focus behavior and bounded answer-comparison tables. See `UX_VERIFICATION_REPORT.md` for the independent browser gate and remaining evidence limits.

Backend verification now has 58 passing tests across seven suites, including real isolated Nest HTTP/Prisma publication and regrade preview/apply/revision-conflict coverage. See `UX_BACKEND_VERIFICATION.md`; frontend intercepted browser checks and real backend tests remain distinct evidence layers. A browser connected to the real isolated API, actual file transport and assistive-technology assessment are still separate outstanding verification tasks, not unimplemented structural batches.

Date: 18 October 2026. This plan protects authentication, authorization, API contracts, existing data, question classification, scoring, matrix rules and regrade behavior. Documentation or successful compilation alone does not complete a batch.

## Batch 1 — Shared structure and the highest-impact reading failures

Scope: composer title field; closed/expanded question disclosures; question-bank item anatomy; library selected/unselected layout; a small report distribution encoding using the existing counts and denominator. Root causes: UX-01 through UX-05 in `UX_AUDIT.md`.

Implementation order:

1. Establish explicit spacing/density, field, disclosure, metadata and adaptive-layout rules in `DESIGN_SYSTEM_RULES.md` and the teacher stylesheet layer.
2. Place title help under its input at desktop and stack the field cleanly at smaller widths. Preserve its `aria-describedby` association.
3. Give question summaries one consistent compact row and separate expanded-body spacing. Preserve content and native disclosure behavior.
4. Group question-bank prompt, metadata and disclosure anchor. Keep all classifications and existing filters/pagination.
5. Make library preview conditional on useful selection; remove empty structural height requirements. Verify selected/unselected and filter-to-empty transitions without changing assignment identity or route state.

6. Add a shared-scale segmented distribution to existing per-question analytics rows, preserving correct, wrong/partial and blank textual counts and all existing calculations. Broader report and nested-workflow restructuring remains in Batch 2.

Expected changes: `TeacherWorkspace.jsx`, `TeacherExamComposer.css`, `QuestionBankView.jsx` `AssignmentAnalyticsPanel.jsx`, `assignment-report.css`, `question-bank.css` and authoritative teacher workspace rules. Avoid opportunistic changes to API/state/assessment code. Record the exact actual changed-file list in the verification report.

Acceptance: helper remains readable; collapsed disclosures have no empty panel body; disclosure marker stays anchored; all question data remains reachable; sparse library does not reserve an unused preview; controls reflow without page-level horizontal overflow. Keyboard opens/closes details and focus remains visible. All four required viewports must have evidence.

## Batch 2 — Comparison and state semantics

Scope: broader analytics question-list anatomy beyond the small Batch 1 encoding, results summaries and per-option/subquestion comparison. Depends on Batch 1 anatomy and browser findings.

Use a common row alignment for question number/type, prompt preview, existing result counts and inspection action. Where a proportional indicator improves comparison, derive it from the existing report denominator and show textual values. Unanswered, incorrect, pending and excluded remain separate. Preserve existing calculations, filtering, question drilldown and regrade/publish actions.

Acceptance: figures reconcile with unchanged fixtures; zero submissions never imply incorrect responses; long formulas remain readable; dense lists stay comparable; question detail and result drawer show matching state labels.

## Batch 3 — Classroom and nested workflow consistency

Scope: class list/roster, assignment settings, publish/regrade dialogs, student result drawer and sticky/scroll boundaries. Depends on targeted regression evidence from earlier batches.

Reuse field and metadata anatomy; keep tables in named scroll regions; verify empty, sparse and dense rosters. Validate modal focus, Escape, focus return, sticky footer clearance, long labels, loading/error feedback and disabled controls. Preserve local draft and source-switch state.

## Required verification for every batch

Use 1440×900, 1280×800, 768×1024 and 390×844. Capture before/after on the same route, viewport, dataset, state and scroll position. Evidence must name whether data comes from fixtures or a live service; fixtures do not prove live service behavior.

Exercise empty, sparse, normal, dense, long mathematics, loading, error, selected and disclosure-expanded/collapsed states. Check document horizontal overflow, overlap, clipped labels, narrow wrapping, closed-item height, alignment and sticky obstruction. Check keyboard traversal, visible focus, accessible names, disclosure state and target size; test color contrast rather than claiming compliance from token names.

Run existing relevant regression checks and production build; retain results and limitations. UI Finish-Gate Reviewer evaluates real evidence independently. Verdict is HOLD when any required evidence, viewport, state, workflow or significant issue remains unresolved. A numeric quality score is optional and cannot replace the gate.

## Rollback and risk control

Keep batches separable. Review stylesheet import order and selector scope before changes because existing broad teacher selectors affect dialogs, choice inputs and report surfaces. If a rule affects unrelated routes, narrow its component boundary rather than adding a global reset. Compare question counts, selected IDs, score/denominator values and revision state before and after using existing fixtures. Do not remove information to achieve density.
