# Batch 53 — Bank guidance progressive disclosure

P2: the question bank repeated the page title and a long introductory paragraph before frequent filters. Replaced the duplicate heading/intro with a native guidance disclosure. All guidance remains available, with the creation instruction naming the actual “Tạo đề mới” action. Common filters stay visible.

Changed QuestionBankView.jsx and question-bank.css. Updated two audit selectors to count/open .qb-question rather than every details element, since help is not a question. verify-teacher-bank-guidance passes1440×900,820×1000,390×844,360×640: help collapsed initially, Enter expands/collapses it, full difficulty explanation retained, combined filters/search-empty/reset/paging unchanged. Matching before/after screenshots and measurements in docs/evidence/teacher-bank-guidance/. First question starts44px earlier desktop/tablet and92px earlier mobile. At390px it is still near/below the bottom navigation, so no claim of full first-question visibility.

Bank-labels regression passed including retry, author permissions, filtered-item change and backend-shaped topic response. Build passed. Shared regression configures35 suites; last full run32/32, subsequent checks are targeted.

Remaining: final requirement evidence review and historical baseline limitations. Do not remove controls or shrink touch targets merely to fit the first viewport.
