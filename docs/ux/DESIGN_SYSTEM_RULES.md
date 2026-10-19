# Teacher Portal structural design rules

## Current teacher visual frame

The role-specific frame is owned by `src/teacher-app-shell.css`: graphite text, neutral grey canvas, white working surfaces and forest-green navigation/actions. Desktop uses a 232px rail; 768–1100px uses an 84px icon rail with accessible names; phones use labelled bottom navigation. Fixed mobile controls must clear the full navigation height and safe-area inset, and remain within viewport bounds. Library browsing defaults to two columns with an explicit list option; dense work may choose list mode. Existing domain metadata and actions remain in both presentations.

## Primary workspace anatomy

- Library records expose results and paper as direct per-record actions; secondary reuse/settings/delete actions live in the same record's disclosure. Do not require selecting a record and locating a separate inspector for primary work.
- Library search, topic and stored-status filters belong together immediately before records. Status tabs show existing stored-status counts; expiry labels do not rewrite stored status or API meaning.
- The home page places recent assignment identity, class, submission count and result action on one row. Supporting classes use compact navigation alongside the main task list. Only factual draft/open-with-zero-submission conditions populate follow-up work.
- Class directories use comparable rows, search and grade filtering. A class detail page retains its own students, assignments, gradebook and skills navigation.
- Empty and one-record states use content-driven height; no empty inspector or fixed-height filler. At narrow widths, record context precedes direct actions and columns reflow into explicit groups.

## Report and nested-workflow contracts (batches 2–3)

- Question comparison uses an anchored question index/type, readable content, counts on a shared denominator, and an explicit inspection action. Topic comparisons share the same percentage scale. Correct, wrong/partial and blank counts remain separate in text as well as color.
- Long mathematical content is opened in full detail; do not line-clamp rendered formulas. Preview disclosure labels identify the question and explain how to access the full content.
- Summary priorities derive from existing report insight counts and link to the corresponding filter or analysis. Missing/unsubmitted scores display an em dash, never an invented zero.
- Dialogs use the shared focus hook: lock background scrolling, contain Tab/Shift+Tab, include native summaries and named scroll regions, close on Escape when permitted, and restore focus. If the original trigger is removed during navigation, restore to the active report tab.
- Question answer comparison is a named, focusable scroll region with a bounded 480px reading area and sticky column headings. Long answer text wraps within its cell. The selected answer-option filter exposes `aria-pressed` as well as a visual state.
- Student result controls retain a 44px target and visible keyboard focus. Formula overflow belongs to the prompt region. Shared-dialog changes require regression checks on result/publish/create/delete/question dialogs, since portal rendering may place a dialog outside the teacher workspace.

## Scope and intent
Preserve current navigation, identity, access rules, APIs and grading semantics. Layout must express the relationship between a task, its supporting data and its actions. Use the existing spacing scale: 4, 8, 12, 16, 24 and 32 px.

## Spatial and responsive contract
- Same group: 4–8 px; groups within a section: 12–16 px; sections: 24–32 px.
- Working surfaces use 16–24 px padding; list rows use 12–16 px. A closed disclosure has a content-driven height and a minimum 44 px target, without open-body spacing.
- Variable content has no fixed or minimum panel height solely to fill the screen. Grid children use `min-width: 0`; form helpers retain the usable width of their control.
- Desktop title fields explicitly place label in column one and input plus helper in column two. Below the desktop breakpoint, stack all three.
- Library folders become horizontal navigation when no actual folders exist. An inspector exists only for an actual selection. At tablet widths it stacks above the list; mobile uses one column.
- Prose stays near 65–75 characters. Mathematical expressions retain their complete symbols; overflow belongs to the expression region, never the page. Do not clamp formulas to disguise overflow.

## Anatomy
- Field: label, input, helper; helper is subdued, normal weight and next to its input. An icon is attached to its action or label.
- Question row: primary mathematical content, topic metadata, type/difficulty/status metadata, and one explicit expand indicator. Metadata wraps as independent items. Expanded content contains answers, classification controls and explanation as a group. For statements longer than 500 characters, use an explicitly labeled long-question disclosure and render the entire mathematical statement in the expanded body; do not clamp or crop formulas.
- Native `details`/`summary` retain keyboard behavior. The whole summary is interactive, with a visible focus ring and open indicator. Closed question rows never inherit card-body spacing.
- Library row: document identity, descriptive metadata, submission progress and selection state. Empty selection must not reserve an empty inspector column.
- Statistical row: question identity, content excerpt, comparable encoded distribution, textual counts and a drill-down action. Wrong/partial and blank remain distinct; missing data never becomes zero achievement.

## Density definitions
- Compact: repeated question and student rows, 12–16 px vertical spacing, minimum 44 px interaction target; metadata uses 12–13 px text and wraps within its own row.
- Standard: authoring fields and classification controls, 16 px group gaps and 16–24 px section padding; labels use 14 px and body 15 px.
- Comfortable: overview summaries and empty-state guidance, 24–32 px section gaps with readable text width. Extra space must support a decision or next action, never force matching heights.

## Density and state rules
Use rows for repeated questions, tables for comparable student records, and surfaces for sections. Avoid wrapping every value in another card or badge. Pagination bounds large lists. Filters sit with their result count and empty state.

Do not replace error, skipped, unfinished or missing results with success icons. Every chart has textual values; color is supplementary. Preserve the denominator and source definitions used by the reporting helpers. Flag content/data anomalies separately from visual fixes.

## Verification gate
Check empty, one-row and multi-row library; closed/open questions; long Vietnamese labels; inline/display math; title helper at desktop/tablet/mobile; filtering and pagination; report counts and drill-down; keyboard focus and native disclosure toggling. Test at 390, 768, 1280 and 1440 px. No horizontal page scroll, detached expand marker or narrow helper column is acceptable. Performance and accessibility results must be reported from actual checks, not assumed.
