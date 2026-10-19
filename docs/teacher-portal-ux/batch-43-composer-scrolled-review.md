# Batch 43 — Scrolled manual composer review

The previous initial-viewport screenshots showed the fixed editor footer above the lower source choices. Investigated whether that represented an unreachable authoring workflow rather than assuming an overlap defect from the initial image.

New browser verification scrolls the actual explanation field and add-question button into view and checks the element at each control center. Passed1440×900,820×1000,390×844,360×640. Inspected add-question-mobile and explanation-small-phone screenshots: manual inputs and add action remain above the fixed footer, navigation remains separate, and the structure panel follows the authoring form. No layout change was warranted from this evidence.

Evidence: docs/evidence/teacher-composer-reachability/verification.json and screenshots. Script: verify-teacher-composer-reachability.mjs, now in shared regression command (27 scripts; last full run remains25/25, later targeted runs recorded individually). No server writes and no page errors. First script attempt clicked an already-hidden Continue source button; corrected the verifier to respect the opened-method state, without changing product code.

This is scroll/pointer reachability in desktop Chrome with viewport emulation. It does not simulate a real mobile software keyboard. Initial source selector still uses substantial vertical space, but every source remains visible/discoverable through normal scrolling; changing it requires evaluating the full source-selection interaction rather than hiding controls for shorter screenshots.

Next: inspect remaining populated nested views and verify account logout success in isolated fixtures; retain historical before-image limitations in completion audit.
