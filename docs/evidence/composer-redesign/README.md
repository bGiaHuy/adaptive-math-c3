# Composer redesign verification — 2026-10-17

Checked against the running local application with Chrome and the available teacher account. No assignments were saved or sent.

## Decisions

- Reduced the desktop header and source chooser so the working area begins at approximately y=498 in a 1440×900 viewport.
- Replaced the 1,472 px topic list with a 248 px scroll area (224 px on mobile), chapter groups, two desktop columns, whole-row labels, selected states and accent-insensitive search.
- Moved question filters above topics. Added an all-question-types option. Topic filtering preserves questions already added.
- Added subtle method textures and distinct stripe/checker/dot progress fills with labels and numeric counts.
- Adapted the progress panel to the current configurable question counts. Missing positions filter by question type; these positions do not certify cognitive-level or difficulty matching.
- Mobile uses a horizontally scrollable method chooser and an expandable progress panel after the working area.

## Verified

- Empty bank selection, topic search without accents, whole-row selection, question results and adding a question.
- Added question remains when deselecting a topic and switching through all five methods.
- Incomplete structure shows 1/22; missing-position buttons apply the type filter and can be cleared.
- 1440×900 desktop and 390×844 mobile: no document horizontal overflow.
- Mobile progress expands/collapses; final content can scroll above the fixed footer.
- No browser runtime errors. Production build passes.

Evidence: before-desktop.png / after-desktop.png and before-mobile.png / after-mobile.png were captured at matching viewport settings. Full-page images have different output heights because document height changed. Additional viewport and interaction images are included. Machine-readable measurements: verification.json. Repeat checks with scripts/verify-composer-redesign.mjs.

Scope: browser UI and local data were verified. This does not certify live AI generation, file conversion, saving or assigning exams to students.
