> Đợt UX đã hoàn tất kiểm chứng theo phạm vi trong [completion-audit.md](completion-audit.md), ngày2026-10-18. Các mục “còn lại” bên dưới ghi trạng thái lịch sử; đối chiếu completion audit để xem kết luận và giới hạn cuối.

# Current Teacher Portal capability inventory

Source inspected: TeacherWorkspace.jsx, its five class tabs and four report tabs, TeacherExamComposer, ExamResultDialog and account modals. Source presence and fixture tests do not prove production backend behavior.

| Entry | Capability retained | Dedicated fixture evidence |
|---|---|---|
| Overview | pending tasks, recent assignments, classes, new class/exam | overview-priority, class-directory |
| Library | folders/status/search, grid/list, pagination, report/paper, reuse/settings/delete | library-density, draft-reuse, settings |
| Class overview | counts, recent work, invitation create/revoke | class-management |
| Class assignments | existing library controls scoped to class | density, partial-load |
| Class students | search/pagination and member metadata | density, class-management |
| Gradebook | scores, student drilldown, all-row CSV | report-navigation, independent-loads, settings |
| Skills | weighted observed results, excluded questions omitted, no-report and no-eligible-question empty states | broad audit; skills-empty |
| Report results | KPIs, score distribution, roster filters/sort/page, export and publish review | assignment-report-ux, settings |
| Report analysis | topic filtering, per-question distribution and student groups | assignment-report-ux, question-roster |
| Report paper | document, full questions/key, navigation, edit/regrade preview/apply | paper-navigation, regrade-ux |
| Report settings | title/folder/results policy/tracking/solutions, receiving status | settings |
| Student result | answer review, question jump/filter, solutions, activity summary/details | question-roster, student-activity; exhaustive question-state review still incomplete |
| Composer | AI/bank/manual/file/JSON, metadata, draft, reuse, review/assign | composer-flow, draft-reuse, manual-json, generation |
| Bank | search/filter/page, metadata editing with rights/error feedback | bank-labels |
| Account | password close/reset, sessions refresh/revoke/logout | account, sessions, account-accessibility, session-logout |

Outstanding verification boundaries: system clipboard, actual mobile keyboard, real server integrations and permissions, historical before screenshots for some states, exhaustive visual review of nested question states. These are not silently treated as passing.
