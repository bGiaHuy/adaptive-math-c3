# Project UI requirements

- Show full question content and answer options immediately in teacher question banks and assignment paper/answer views. Do not hide individual questions behind accordions, `<details>`, or click-to-expand headers. Do not add “expand all / collapse all” controls for question content. Apply the same rule to question editing fields. Secondary metadata and history may use disclosure.
- Place a distinctively colored “Chỉnh sửa câu hỏi” button at the far right of each assignment question header. Open editing for that specific question, including prompt, correct answers and explanation. Preserve existing permissions, server restrictions for attempts already started, preview of scoring impact, revision checks and audit history.
- Teacher question banks do not need label-editing controls.
- Answer key boxes, correct choices and Đ/S circles in the teacher question bank use a green fill and black outline. Keep the explicit “Đáp án chuẩn” context.

## Assignment question edit isolation

- Teacher edits must affect only the question snapshot in the selected teacher-owned assignment. Never update the system question bank, source question record, shared paper, other assignments or other teachers' papers as a side effect.
- Persist changes through the assignment-specific update/regrade flow with teacher ownership checks. Preserve source question IDs and update only assignment snapshots, relevant submission grading, assignment revision and audit history.
- State this scope explicitly in the edit UI. Do not add any implicit synchronization back to the source bank.

## Shared question presentation

- Use QuestionDisplay for shared question anatomy across bank, paper preview and result views. Keep academic content prominent, metadata secondary and edit actions quiet at the far right.
- Paper-view short answers must be read-only boxes with green fill and a black outline, sized to the answer rather than stretched across the card. Do not remove these boxes during visual cleanup. Group tolerance with the answer heading. Preserve the explicitly requested green/black bank variant and student grading semantics.
- Empty explanations use one compact row with an add-explanation action when editing is allowed. Never reserve a full solution section for missing content.
- Flag suspect mathematical answers for independent review; never silently correct source-bank data during UI work.

- In assignment paper views, every A–D option must have its own visible bordered box; the correct option has green fill and a black outline. True/false statements also retain boxed rows with green, black-outlined Đ/S circles. Apply the box requirement to all three question types, not only short answers.
