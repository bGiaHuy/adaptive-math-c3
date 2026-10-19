# UI finish gate — semantic pattern diversity

## Decision: PASS for demonstrated student patterns; HOLD for whole-application release certification

The application-wide source inventory is in [the design contract](ui-semantic-design-contract.md). Final runtime evidence covers five student pages at 1440px and 390px, plus the actual result component rendered in isolation at both widths. This accepts demonstrated interaction patterns. It does not certify every role, backend workflow, recovery state, or assessment configuration.

## Accepted improvements

| Surface | Final evidence | Why the pattern fits the task |
|---|---|---|
| Learning path | after-learning-path-1440.png / 390.png | Today's activity has a direct action. Aligned topic rows compare estimate, evidence, availability, and practice action. Unknown topics lack numerical bars. Search/reset was exercised. Mobile preserves these decisions without individual rounded topic boxes. |
| Notebook | after-mistakes-1440.png / 390.png and expanded.png | Mathematical question summaries replace repeated full answers and explanations. Select a question, then reveal its solution separately. Unanswered text differs from selected wrong responses. Both disclosures were exercised. |
| Tasks | after-missions-1440.png / 390.png | Ordered action checklist replaces fabricated XP, streaks, and permanent zero-progress cards. Diagnostic completion comes from real application state. |
| Review entry | after-review-1440.png / 390.png | Start/reload appears before secondary metrics and recommendations, including at narrow width. Final fixture has coherent empty saved-question counts. Actual due-question completion remains unverified. |
| Competency | after-profile-1440.png / 390.png | One comparison list provides chapter/order controls, evidence counts, target markers, provisional states, and explicit no-data values. The redundant second list with contradictory labels was removed. |
| Results | after-results-1440.png / 390.png; result-checks.json | Number navigation leads into mathematical response review. Eight explicit states distinguish unanswered, incomplete, pending, correct, partial, incorrect, excluded, and full-credit. Solutions start collapsed. Keyboard checks cover Tab containment, reverse wrap, and Enter disclosure activation. |
| Tutor launcher | Final student screenshots | A normal-flow toolbar removes the former overlap with search and question controls. The explicitly opened panel requires its own runtime review. |

These changes pass because they reduce simultaneously expanded detail, improve comparison, expose evidence gaps, and distinguish response semantics. Border changes alone would not pass.

## Resolved blockers

- Desktop notebook now waits for page content and captures populated content.
- Review's primary action moved above metrics and recommendations.
- Collapsed tutor launcher no longer obscures controls.
- Modal focus handling includes native summaries and form controls.
- Presentation-only answer classification drives precise labels; review filters exclude pending and credited answers from error counts.
- Profile has one skill list rather than two inconsistent versions.
- Result contrast failures were corrected. Final result-checks.json reports no runtime errors and an empty automated accessibility violation list. This is isolated-component evidence, not application-wide accessibility certification.

## Required for whole-application PASS

1. Exercise teacher question detail with blank, partial, and pending answers; publication; regrading; admin maker-checker; and authoring states at desktop/mobile. Existing roster comparisons, answer distributions, focused editors, and regrade previews are justified by source inspection and should be retained.
2. Verify real diagnostic/classroom submissions, restored answers, timers, weighted/true-false scoring, accepted short answers/tolerance, hidden solutions, unpublished scores, and excluded/full-credit adjustments. Isolated presentation tests do not prove end-to-end scoring preservation.
3. Verify changed loading, server failure/retry, disabled operations, long mathematics, tutor panel, authentication, and role-specific keyboard behavior. Search/reset, notebook disclosure, and isolated result keyboard checks cover only their named interactions.
4. Exercise a nonempty review queue: start, reveal, recall decision, next card, pending, and retry. The final review capture demonstrates entry and coherent empty state only.
5. Keep baseline limitations explicit: prior screenshots in evidence/site-redesign use different fixtures. They illustrate earlier layout; they are not matched experiments or measured task-time improvements. New evidence uses controlled API fixtures, not production data.

Evidence is in [evidence/semantic-ui](evidence/semantic-ui/). after.json records ten student viewport checks without document overflow or page errors. result-checks.json records isolated result labels, keyboard checks, and automated accessibility results. Build and answer-state regression checks were reported passing by the implementing agent; this reviewer inspected final source, images, and evidence records.

## Remaining refinement

Review recommendations still use larger bordered blocks, and an empty retrieval shell appears before a session starts. The primary action now precedes them. Compressing recommendations and hiding the unused shell would improve density, but these do not negate the demonstrated improvement.

No unresolved blocker remains for the demonstrated student pattern changes. Keep the whole-application HOLD visible until integration and role-specific runtime evidence exists.
