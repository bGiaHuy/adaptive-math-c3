# Current gate — visual Teacher Portal overhaul

**PASS for the inspected visual overhaul and fixture interactions.** The teacher frame now uses a desktop vertical rail, tablet compact rail and phone bottom navigation; the library defaults to a two-column gallery with a working list mode; overview and related surfaces use the new product language. This is the current implementation, superseding the historical workspace replacement below. See [TEACHER_UI_OVERHAUL.md](TEACHER_UI_OVERHAUL.md) and the [independent final review](TEACHER_UI_OVERHAUL_REVIEW.md).

Evidence: 116 final after-sweep records, no reported page errors/document overflow/axe violations in sampled states; 40 named action groups across four sizes; separately verified mobile editor bounds fully above bottom navigation. Build and 19 existing frontend/domain tests passed. This gate does not certify production data, real transport mutations or exhaustive WCAG coverage.

---

# Previous gate — overview, library and class directory replaced

**PASS for the visible workspace replacement and verified actions at all4required sizes.** Latest evidence: teacher-workspace-redesign BEFORE32/AFTER32 captures, zero recorded overflow/pageerrors/axe violations;24direct-action checks plus search/folder/state/pagination and class search/grade/open assertions pass. The final “Workspace replacement” section is the current review; earlier batch reports below are retained history. Complete production/WCAG sign-off retains its documented coverage limits.

---
# Current finish gate — follow-up batches completed

**PASS: batches 1–3 for the verified structural, report-interpretation and dialog changes. HOLD: complete production/WCAG sign-off.** Batches2and3 are implemented and independently browser-checked; the earlier batch1 report below is historical. Its instruction to complete later batches is superseded by the follow-up section at the end of this file.

Final follow-up evidence:116 capture/measurement records at all4required viewports with no document overflow/pageerrors/axe violations;12 student/question/publish dialog cases pass40-Tab containment, Escape and focus restoration;8 create/delete cases pass15-Tab containment, body locking and focus restoration; mocked regrade failure/retry passes. Real browser-to-real-API transport and exhaustive report states remain unverified by this reviewer. Root reports build/typecheck,19 frontend/domain tests and58 isolated backend tests passed.

See the final “Follow-up execution — batches2and3” section for exact source changes, evidence paths and remaining coverage limits. No claim of complete WCAG compliance or production end-to-end coverage is made.

---
# UX Verification Report — Structural batch 1

Review date: 18 October 2026 (Asia/Saigon). Independent reviewer: UI Finish-Gate Reviewer agent.

**Decision: PASS for the controlled structural batch. HOLD for the complete product-wide mission.** The accepted batch fixes title/help alignment, question disclosure spacing, bank item anatomy, library selection layout, and response-distribution hierarchy. This is not approval of every Teacher Portal workflow or a WCAG conformance claim.

## Product lens and gate

Teachers prepare and reuse a 22-question examination, assign it to a class, and interpret student work. The first read must identify the examination/question/class and its status. Metadata supports that object; it must not compete with it. Composer work remains an editor, the library remains a searchable list with a real selected examination, and answer analysis remains a comparison of correct/wrong/blank counts. Existing math, grading and API semantics are preserved.

## Actual browser method

Chrome headless through puppeteer-core, pipe:true, against localhost:3000. Every /api/ request is intercepted by scripts/verify-ux-structural.mjs using tests/fixtures/teacher-portal-fixture.mjs. No production service or mutation was called. Before captures completed before the implementation agent started editing.

Required viewports: 1440×900, 1280×800, 768×1024 and 390×844.

- before.json: 92 page/viewport captures.
- after.json: 116 records: 108 capture records plus 4 footer measurements and 4 keyboard records; also 4 bottom-of-composer screenshots.
- states.json: corrected reload-based sparse/long question coverage, 36 records.
- selected.json and sparse-selected.json: 4 viewport selection checks each.
- All final recorded page states: no document horizontal overflow and no browser pageerror.
- axe-core ran WCAG 2 A/AA, 2.1 AA and 2.2 AA rule tags on the final after/state captures: zero reported violations. This automated sample does not prove full accessibility compliance.

The suite visits overview, classes, library, class assignments/students/gradebook/skills, bank, report results/paper/settings/analytics, create-class dialog and five composer methods. Empty/loading/error coverage uses the overview; sparse/long/expanded coverage uses the bank; normal/dense coverage uses the 36-assignment and 66-question fixtures. These states were not exhaustively tested on every page.

## Observed before/after evidence

| Finding | Final evidence | Gate |
|---|---|---|
| Title helper wrapped beneath the short label as a narrow word column | Composer helper is 698×19px desktop/laptop, 712×19px tablet and 366×19px mobile; aligned to input | PASS |
| Closed paper questions inherited surface padding and wasted vertical space | Final closed items 54px total with 52px summary at all four sizes; desktop paper height 3245→1969px | PASS |
| Bank disclosures used a browser triangle and a single undifferentiated metadata sentence | Explicit chevron and separate topic/type/difficulty/review/status hierarchy; marker measured none | PASS |
| Extremely long question text made every closed row unbounded | Long item uses a numbered disclosure prompt and full mathematics in the expanded body; mobile stress page 9098→2696px closed | PASS |
| Library had a permanent preview area without an actual selection | Unselected list uses available space; selected real preview mounts. At768px preview570px wide above rows; at390px356px wide | PASS |
| Composer support was scrollable without keyboard access at1280px | Focusable labelled support; final axe no scrollable-region-focusable violation | PASS |
| Document helper contrast was4.37:1 | Scoped darker helper; final axe no color-contrast violation | PASS |
| Sticky footer might obscure the last composer controls | Bottom scroll reached; footer bottoms888/788/1012/836px within900/800/1024/844px viewports. Mobile screenshot shows final structure control and footer separately. Tab from title reaches method button with solid outline | PASS for sampled state |

Normal bank rows remain taller than paper disclosures because they retain question text, topic and classification metadata. This is intentional domain density, not an arbitrary equal-height card system. Long expanded questions remain tall because their full content is retained.

## Screenshot pairs and inspected states

- [Composer before](../evidence/ux-structural/before-composer-picker-desktop.png) / [after](../evidence/ux-structural/after-composer-picker-desktop.png)
- [Paper before](../evidence/ux-structural/before-report-paper-desktop.png) / [after](../evidence/ux-structural/after-report-paper-desktop.png)
- [Bank before](../evidence/ux-structural/before-bank-desktop.png) / [after](../evidence/ux-structural/after-bank-desktop.png)
- [Library selected at768px](../evidence/ux-structural/after-library-selected-tablet.png)
- [Composer bottom at390px](../evidence/ux-structural/after-composer-bottom-mobile.png)
- [Sparse bank](../evidence/ux-structural/states-bank-sparse-desktop.png)

Reviewer directly opened raster screenshots of the before/after composer, bank, final desktop paper, selected tablet library and mobile composer bottom. Long-question measurements verify expansion and overflow; the top-of-page long screenshots alone do not show the complete question body.

## Supporting checks

## Changed components and regression boundaries

- `src/components/TeacherWorkspace.jsx`, `teacher-workspace.css`: explicit title anatomy, selected library inspector and selection feedback, content-height library and compact paper disclosures.
- `src/components/TeacherExamComposer.css`, `ComposerSupport.jsx`, `DocumentExamComposer.jsx`: helper placement, focusable scrolling support and scoped document helper contrast.
- `src/components/QuestionBankView.jsx`, `question-bank.css`: structured metadata, disclosure indicator, responsive filters and full-content expansion for long questions.
- `src/components/AssignmentAnalyticsPanel.jsx`, `assignment-report.css`: proportional response distribution using existing counts, distinct correct/wrong/blank labels, and surface padding excluding disclosures.
- `scripts/verify-ux-structural*.mjs` and `docs/evidence/ux-structural/`: reproducible fixture browser checks and captured evidence.

The main regression risks are competing legacy CSS selectors, long-question previews requiring expansion, and real backend states beyond fixture coverage. Authentication, authorization, grading calculations, blueprint requirements, API contracts and stored data were not modified by this batch. Next priority is Batch 2 comparison/interpretation, followed by Batch 3 nested workflows and backend-assisted verification.

### Build and domain checks

Root agent reported actual successful npm run build, npm run typecheck and 19 tests across assignment-report-insights, teacher-question-helpers, exam-activity and math-navigation. It also checked report-fixture reconciliation: each of22 questions has correct+wrong+skipped=31 submitted. These are supporting checks by the root agent, not browser grading mutation tests by this reviewer.

Fixture caveat: library assignment totalSubmissions15 is not consistent with report fixture submitted31; screenshots are controlled layout evidence, not proof of live aggregate reconciliation. Comparison uses report a3/class c1.

## Required before full-mission PASS

1. Complete the later batches in UX_REFACTOR_PLAN.md, particularly dashboard interpretation and remaining master-detail workflows.
2. Exercise real keyboard and assistive-technology flows beyond the sampled title-to-method focus path; inspect zoom/reflow, all focus orders, dialogs, announcements and focus obscuration.
3. Verify publish, draft/reuse, regrade preview/apply, import/upload and error recovery end to end with an authorized test backend. This read-only intercepted run proves none of those mutations.
4. Expand loading/error/empty/long mathematics coverage to every affected page, including real production-shaped data. Mobile analytics remains3900px; examine whether further prioritization helps teachers without hiding response semantics.

Keep the existing brand, question-type distinctions, actual counts, full mathematics, list pagination and real assignment selection. No information was removed merely to shorten the screen.


## Follow-up execution — batches 2 and 3

**Independent gate: PASS for report interpretation/density and shared dialog navigation in the inspected states.** The original broader mission HOLD is narrowed by this evidence, but browser-to-real-API transport, full assistive-technology assessment and unsampled workflow/state combinations remain outside this reviewer run. No arbitrary numeric design score is assigned.

### Changes and observed behavior

Batch2 changes AssignmentResultsPanel.jsx, AssignmentAnalyticsPanel.jsx, QuestionResponseDistribution.jsx and assignment-report.css. Results now exposes next actions tied to actual pending/low-score/question-review groups. Topic evidence uses aligned rows with a common scale. Question rows anchor question number/type, mathematical content, response distribution and drilldown. Counts explicitly distinguish wrong/partial and blank. Short mathematical content stays visible; long content has an explicit full-content drilldown. The score display checks whether a report actually has a score.

Batch3 changes TeacherWorkspace.jsx, useModalFocus.js and exam-result.css. Create/delete/question dialogs use the shared focus/scroll contract, the answer-comparison table is a labelled keyboard-focusable bounded region, response options expose selection, and student-result controls receive consistent focus/touch treatment. Question drilldown moves to analytics, so its old results trigger unmounts; Escape returns to the surviving active analytics tab.

### New real browser evidence

All files below live in docs/evidence/ux-structural-followup. This is a separate before/after set; it does not overwrite batch1 evidence.

- before.json:92 captures; before-dialogs.json:12 additional student/question/publish captures before source edits.
- after.json:116 records across1440×900,1280×800,768×1024,390×844; zero document overflow, zero pageerrors, zero axe violations in the sampled capture set.
- after-dialogs.json:12 final dialog checks.40 consecutive Tabs remained inside each dialog; Escape closed each; focus returned to Xem bài, Phân tích từng câu or Kiểm tra & công bố. Every measured nested overflow region reached its bottom. Question dialog scroll content reduced from3184px to1293px desktop and3174px to1283px mobile by bounding the31-student comparison region, retaining every row.
- additional-checks.json:create/delete at all4viewports—15 Tabs contained, Escape closed, correct trigger regained focus, background body locked while open and restored after close. Delete was cancelled; no deletion was performed. LOW next-action button selected the LOW filter at all4sizes and rendered the10-row first page. Settings screenshots captured at all4sizes.
- regrade/verification.json:mock503 preview failure retained reason, retry rendered impact without apply;22 editors retained question count, jump navigation and submitted-content lock; mock apply failure retained preview, explicit retry succeeded. Impact screenshots captured at all4required sizes. No production regrade was called. The inherited check description says three responsive viewports; the adapted script actually loops four, including1280×800 and768×1024.

The first focus run exposed an unmounted question trigger and was corrected with an explicit surviving-tab fallback. A separate publish check initially used evaluate-click, which does not model native focus; final evidence uses an actual ElementHandle click. A later script timeout came from persisted report-tab state; final dialog run reloads its explicit results URL before each case. Only the completed final JSON is used for the gate.

Reviewer directly inspected [desktop topic hierarchy](../evidence/ux-structural-followup/after-report-analysis-desktop.png), [mobile topic hierarchy](../evidence/ux-structural-followup/after-report-analysis-mobile.png), [desktop question rows](../evidence/ux-structural-followup/after-analytics-rows-desktop.png) and [mobile question rows](../evidence/ux-structural-followup/after-analytics-rows-mobile.png). The first-read topic and question evidence, explicit counts and full short formulae are visible. Mobile uses5-question pagination; desktop10. Topic section is still relatively tall, but each row communicates a distinct knowledge group and a direct filter action; this is an optional later density refinement rather than a release blocker for this batch.

Root reports final build, typecheck and19 domain/frontend tests passed, plus58/58 isolated backend tests. Those backend results are independent root/backend-agent evidence. This reviewer did not run a browser against that real backend, and does not infer browser/API end-to-end success from intercepted fixtures.

### Remaining release limits

Zero-submission report behavior was not separately captured in this follow-up. Overview empty/loading/error remain covered by the sweep; they do not substitute for every report state. Full reflow/zoom and screen-reader use remain unverified. Fixture aggregate/report-count inconsistency described above still applies. Publish/upload/draft mutation flows were not browser-tested with a real backend. These limits prevent a claim of complete production or WCAG conformance; they do not invalidate the verified structural and dialog improvements.


## Workspace replacement — visible structural refactor

**Independent gate: PASS for the replaced overview, library and class-directory workflows in the verified fixture states.** This is a product-specific structural change: the library now exposes results and paper actions directly in every record; overview shows recent assignments and concrete follow-up work; class selection uses searchable, grade-filtered comparison rows. The previous selection-first library and tall class-card grid no longer define those screens. This supersedes any earlier statement that these replacements remain future work.

Evidence folder: docs/evidence/teacher-workspace-redesign. scripts/verify-teacher-workspace-redesign.mjs captured32 BEFORE and32 AFTER states: overview/library at1440×900,1280×800,768×1024,390×844, each with empty, sparse, normal and dense fixtures. Normal means up to6assignments per class; dense means36assignments total. BEFORE sparse was1assignment per populated class (2total); AFTER sparse is exactly1total, so sparse images are not an exact cardinality comparison. Empty/dense/normal retain the same fixture definitions.

Final AFTER capture set: zero document horizontal overflow, zero browser pageerrors and zero axe rule violations for the sampled WCAG2A/AA,2.1AA,2.2AA tags. This is not a complete accessibility conformance assessment.

Actual assertions in scripts/verify-teacher-workspace-interactions.mjs passed at all4sizes:

-10-record first page and10-record next page; unaccented search “can thuc” finds9records; folder and draft-state filtering; clearing filters.
- Direct Xem kết quả opens the report results; Đề & đáp án opens question content; expanded Thao tác khác opens settings or reuse composer.
- Delete opens a confirmation and Escape cancels it. No deletion was confirmed or production request sent.
- Overview class navigation opens the class; overview result action opens the report.

The24logged action checks and additional search/filter/page assertions completed with zero pageerrors. All API requests were intercepted fixtures. Reuse was verified through opening the existing editor, not saving a new assignment.

scripts/verify-teacher-class-directory.mjs captured classes at all4sizes and asserted search9a1→1row, grade8→1row and successful class navigation. No class-directory BEFORE capture exists in this replacement set; older class screenshots in ux-structural-followup remain historical evidence.

Reviewer directly opened [dense desktop library](../evidence/teacher-workspace-redesign/after-teacher-library-dense-desktop.png), [dense mobile library](../evidence/teacher-workspace-redesign/after-teacher-library-dense-mobile.png), [dense mobile overview](../evidence/teacher-workspace-redesign/after-teacher-overview-dense-mobile.png) and [desktop classes](../evidence/teacher-workspace-redesign/after-classes-desktop.png). The library first read is the examination identity followed by status/deadline, submissions and two direct actions. Metadata stays under its examination. Class counts share aligned columns. The overview gives recent work a visible place ahead of lower-frequency class management.

Keep: full assignment metadata, explicit submission denominator, folder/search/status controls, real results/paper destinations and existing confirmation/reuse services. The desktop row is still approximately100px rather than a spreadsheet row because it retains three lines of identity/folder information and direct actions. Mobile uses a compact record stack with the same actions; its first record actions begin near the bottom of the first viewport and remain reachable by normal scroll. Further header/filter compaction is a possible refinement, not evidence of hidden or unreachable work.

Production transport, mutation persistence and the fixture aggregate/report inconsistency remain the limits described above. Root reports its local API read separately; this reviewer does not relabel fixture screenshots as live teacher data.


Final typography correction: root raised replacement overview/library metadata and small captions to12px and requested a screenshot-only regression pass. The32AFTER captures were regenerated after that CSS correction; interaction checks were retained because behavior did not change. Root separately reports a read-only local demo API response with1class and0assignments. That is the local demo dataset, not proof of the user's authenticated session or their data.
