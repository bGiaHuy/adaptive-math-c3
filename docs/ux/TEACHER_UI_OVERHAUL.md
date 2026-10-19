# Teacher Portal visual overhaul

18 October 2026 · Current local implementation. Independent scoped review: [TEACHER_UI_OVERHAUL_REVIEW.md](TEACHER_UI_OVERHAUL_REVIEW.md).

## What changed visibly

- Teacher app frame: 232px forest-green vertical navigation on desktop, 84px compact rail on tablet, labelled fixed bottom navigation on phones. The content sits on a neutral grey canvas beneath a white context bar on desktop/tablet.
- Library: a two-column exam gallery by default, with a functioning list-view switch. Each exam keeps its status, deadline, class, question count, duration, submission progress and results/paper actions. Search/topic/state filtering remains available; page size belongs with pagination.
- Overview: three concise metric tiles, a white assignment-monitoring panel, a class-navigation panel and factual next-work items.
- Related screens: shared header, tabs, fields and surface treatment applies to classes, question bank, reports and composer. Student/admin frames are outside the teacher role selector.
- Mobile editor: the save/continue footer is fully within the viewport and above bottom navigation, with enough document clearance to reach the last controls.

## Source ownership

`src/App.jsx`, `src/components/Sidebar.jsx`, `src/main.jsx` connect the role-specific frame. `src/teacher-app-shell.css` owns that frame and teacher-wide surface rules. `TeacherLibrary.jsx`/`TeacherLibrary.css` own the gallery/list view, and `TeacherOverview.jsx`/`teacher-overview.css` own the dashboard panels. No grading, API, authentication, blueprint or stored-data rules were changed by this batch.

## Actual verification

Before: 92 captures. After: 116 capture/measurement records at 1440×900, 1280×800, 768×1024 and 390×844. Final sampled captures have no reported document overflow, page errors or axe violations. The last mobile-footer repair is covered separately by `footer-clearance.json` and `final-composer-bottom-mobile.png`, superseding the earlier generic after-sweep footer geometry.

`actions.json` records four viewports and 40 named interaction groups: gallery/list, search, stored-status and topic filters, direct results/paper navigation, delete cancellation, account-menu positioning, role navigation and frame geometry. Native action clicks are scrolled into the unobscured viewport before interaction to account for the fixed mobile navigation.

The mobile footer was checked both initially and at document bottom: x=16…374px, bottom=750px; navigation begins at 761.4px in the 390×844 viewport. A retained centering transform and competing bottom-inset rule were repaired before acceptance. Contrast failures in the initial visual pass were corrected at the source.

Production build and 19 existing frontend/domain tests passed. Fixtures are intercepted locally; this run does not establish production data behavior, live browser-to-API mutations or complete WCAG conformance. Existing long-paper height reflects fully expanded question content; no content was hidden to shorten it.

## Evidence

- [Library before](../evidence/teacher-ui-overhaul/before-library-desktop.png) / [after](../evidence/teacher-ui-overhaul/after-library-desktop.png)
- [Overview after](../evidence/teacher-ui-overhaul/after-overview-desktop.png)
- [Phone library](../evidence/teacher-ui-overhaul/final-library-grid-mobile.png)
- [Phone editor clearance](../evidence/teacher-ui-overhaul/final-composer-bottom-mobile.png)
- JSON and reproducible scripts: `docs/evidence/teacher-ui-overhaul/`, `scripts/verify-teacher-ui-overhaul.mjs`, `scripts/verify-teacher-overhaul-actions.mjs`, `scripts/verify-teacher-overhaul-footer.mjs`.
