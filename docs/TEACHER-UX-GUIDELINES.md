# Teacher interface: information density

- Show the current task, its inputs and its primary action first.
- Keep default help to one short sentence. Put professional definitions, examples and scoring details behind an explicit help control; preserve the complete source material.
- Keep cognitive level and difficulty as separate dimensions.
- Keep blueprint and completion checks in a desktop sidebar. Open the full 22-position matrix in a dialog, with question-to-position labels visible.
- Source selection belongs above its form. Switching sources preserves entered questions and drafts.
- Keep the next/save actions visible, with bottom space so they cannot cover the final input.
- Bound long question lists with their own scroll area. Do not place reference tables before the working form.
- Loading placeholders appear after 240 ms, with one shared animation and reduced-motion support. Success and failure must both remove loading. Limit placeholders to three representative question rows.
- Review the whole page at desktop and mobile sizes after every composer change, including scroll position, footer overlap, focus, dialogs, errors and preserved data.
- UI changes must preserve the fixed 22-question blueprint, classifications and scoring rules.

## Evidence required for composer UX changes

- Capture before and after with the same viewport: desktop 1440×900 and mobile 390×844.
- Topic choices are semantic labels containing the checkbox and text; the full row is clickable. Use two columns on desktop and one on mobile, grouped by chapter, with a bounded independent scroll region.
- Put question filters before the topic list. Provide accent-insensitive topic search and select/deselect of visible results.
- Filtering topics or switching methods must preserve questions already added.
- Use distinct subtle textures for method icon tiles and question-type progress fills, alongside icons, text and numeric counts. Never rely on color alone.
- Mobile source selection uses a horizontal chooser; progress expands on demand below the workspace.
- Verify empty, searching/selecting, added questions, incomplete structure, switching sources, mobile expansion, horizontal overflow and footer clearance. Save the report and screenshots with the change.
