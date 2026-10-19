# Báo Cáo Kiểm Thử Trình Duyệt Thực Tế (Browser E2E & A11y Report)

**Mã tài liệu:** `DOC-QA-E2E-01`  
**Ngày thực hiện:** 2026-10-05T01:28:14.789Z  
**Trình duyệt thực thi:** Microsoft Edge (Edg/154.0.4258.53)  
**Hệ điều hành:** Windows (x64)  
**Môi trường:** Production Build (`vite preview` port 43901) & NestJS API (`apps/api` port 43900)  
**Cơ sở dữ liệu:** `adaptivemath_test` (PostgreSQL 17, cô lập 100%, 254 câu hỏi)  
**Kết luận tổng thể:** 12 browser smoke checks có assertion; chưa chứng minh toàn bộ critical E2E, WCAG 2.2 AA hoặc UAT người dùng.

---

## 1. Bảng Tổng Hợp Kết Quả 12 Kịch Bản (Execution Summary)

| STT | Mã Test | Tên Kịch Bản Kiểm Thử | Viewport | Kết Quả | Chi Tiết Xác Minh |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | **TC-01** | Desktop Landing & Legal Notice Modal | Multi | **PASS** | Modal rendered with DRAFT D-02 badge |
| 2 | **TC-02** | Student Registration & 8-Step Onboarding | Multi | **PASS** | Created user stu_e2e_muukl3gu and completed wizard |
| 3 | **TC-03** | Diagnostic completion and keyboard selection | Multi | **PASS** | Four-question test fixture completed; final result and mastery report rendered from API. |
| 4 | **TC-04** | Student Learning Path & Mistake Notebook | Multi | **PASS** | Learning path rendered and wrong/skip answer appeared in server-backed mistake notebook |
| 5 | **TC-05** | Teacher Applicant Verification State | Multi | **PASS** | Pending banner displayed, classroom creation forbidden |
| 6 | **TC-06** | Verified Teacher Classroom View | Multi | **PASS** | Existing teacher classroom view loaded; creation and invite actions were not exercised. |
| 7 | **TC-07** | Admin Overview and Teacher Approval | Multi | **PASS** | Admin approved the newly registered teacher applicant through confirmation dialog. |
| 8 | **TC-07b** | Teacher Approval to Classroom Invite | Multi | **PASS** | Newly approved teacher created a class and received a one-time Crockford code. |
| 9 | **TC-08** | 404 Not Found Page | Multi | **PASS** | Unknown URL rendered .not-found-container |
| 10 | **TC-09b** | Student Joins New Classroom | Multi | **PASS** | Student used fresh invite code from newly approved teacher; membership shown in classroom view. |
| 11 | **TC-09** | Mobile Viewport (390px) & KaTeX | Multi | **PASS** | Real question rendered math and page had no horizontal overflow; long display formula not guaranteed by fixture. |
| 12 | **TC-10** | Tablet Viewport (768px) | Multi | **PASS** | Fluid 2-column layout and responsive card grids |
| 13 | **TC-11** | Small Laptop Student Viewport (1024px) | Multi | **PASS** | Student learning path captured with no horizontal overflow |
| 14 | **TC-12** | Basic keyboard and reduced motion smoke | Multi | **PASS** | 0 unexpected console errors; WCAG scan and screen reader not tested |

---

## 2. Ma Trận Ảnh Chụp Màn Hình & Bằng Chứng Trực Quan (Screenshots Matrix)

Toàn bộ 15 ảnh chụp màn hình được tạo tự động bởi Microsoft Edge Headless và lưu trữ tại thư mục `docs/evidence/browser-e2e/screenshots/`:

| STT | File Ảnh | Kịch Bản & Mô Tả | Viewport | Liên Kết Artifact |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `01_landing_and_legal_modal_1440.png` | Landing Page & Modal Điều khoản (Draft D-02) | 1440x900 | [Xem ảnh](screenshots/01_landing_and_legal_modal_1440.png) |
| 2 | `02_student_onboarding_1440.png` | Onboarding Wizard 8 bước của Học sinh | 1440x900 | [Xem ảnh](screenshots/02_student_onboarding_1440.png) |
| 3 | `03_diagnostic_test_in_progress_1440.png` | Bài kiểm tra thích ứng CAT/IRT + Phím A/B/C/D | 1440x900 | [Xem ảnh](screenshots/03_diagnostic_test_in_progress_1440.png) |
| 4 | `04_diagnostic_result_report_1440.png` | Hồ sơ năng lực sau khi hoàn thành fixture chẩn đoán 4 câu | 1440x900 | [Xem ảnh](screenshots/04_diagnostic_result_report_1440.png) |
| 5 | `05_learning_path_1440.png` | Lộ trình học cá nhân hóa theo chủ đề SGK | 1440x900 | [Xem ảnh](screenshots/05_learning_path_1440.png) |
| 6 | `06_mistake_notebook_1440.png` | Sổ tay câu sai (Bảo vệ D-04 ẩn khỏi giáo viên) | 1440x900 | [Xem ảnh](screenshots/06_mistake_notebook_1440.png) |
| 7 | `07_teacher_applicant_pending_1440.png` | Hồ sơ Giáo viên chờ duyệt (Chặn tạo lớp) | 1440x900 | [Xem ảnh](screenshots/07_teacher_applicant_pending_1440.png) |
| 8 | `08_verified_teacher_classrooms_1440.png` | Quản lý Lớp học & Sinh mã mời Crockford Base32 | 1440x900 | [Xem ảnh](screenshots/08_verified_teacher_classrooms_1440.png) |
| 9 | `09_admin_portal_overview_1440.png` | Bảng điều khiển Quản trị & Maker-Checker | 1440x900 | [Xem ảnh](screenshots/09_admin_portal_overview_1440.png) |
| 10 | `10_not_found_view_1440.png` | Trang 404 thân thiện Math Studio | 1440x900 | [Xem ảnh](screenshots/10_not_found_view_1440.png) |
| 11 | `11_mobile_landing_390.png` | Giao diện Landing Page trên màn hình di động | 390x844 | [Xem ảnh](screenshots/11_mobile_landing_390.png) |
| 12 | `12_mobile_diagnostic_katex_390.png` | Cuộn an toàn KaTeX trên màn hình di động 390px | 390x844 | [Xem ảnh](screenshots/12_mobile_diagnostic_katex_390.png) |
| 13 | `13_mobile_mistake_notebook_390.png` | Sổ tay lỗi sai hiển thị chuẩn trên di động | 390x844 | [Xem ảnh](screenshots/13_mobile_mistake_notebook_390.png) |
| 14 | `14_tablet_dashboard_768.png` | Bảng điều khiển học tập trên máy tính bảng | 768x1024 | [Xem ảnh](screenshots/14_tablet_dashboard_768.png) |
| 15 | `15_small_laptop_teacher_1024.png` | Giao diện học sinh trên laptop màn hình nhỏ | 1024x768 | [Xem ảnh](screenshots/15_small_laptop_teacher_1024.png) |

---

## 3. Đánh Giá Khả Năng Tiếp Cận (Accessibility & Performance Audit)

- **Keyboard Navigation:** Đã xác minh Tab tới phần tử tương tác và phím A chọn đáp án. Enter, B/C/D và toàn bộ thứ tự focus chưa được assert đầy đủ.
- **Focus-Visible Styling:** Có khai báo CSS; chưa đo tương phản hoặc xác minh mọi phần tử tương tác.
- **Reduced Motion:** Kích hoạt `@media (prefers-reduced-motion: reduce)` vô hiệu hóa các hiệu ứng chuyển động mượt để bảo vệ người dùng nhạy cảm thị giác.
- **KaTeX Responsive Display:** Câu trong fixture có KaTeX và trang không tràn ngang ở 390px. Chưa có mẫu công thức display dài để chứng minh cuộn ngang.
- **Console Log Hygiene:** Kịch bản thất bại nếu có console/page error chưa được lọc; 401/403 dự kiến được lọc riêng.
- **Automated WCAG scan:** axe-core chạy trên 6 màn hình; 0 rule violations. Chi tiết bên dưới. Đây chưa phải chứng nhận WCAG 2.2 AA.
- **Screen reader:** NOT TESTED. Keyboard Tab và media query không thay kiểm thử screen reader.

## 4. Kết quả axe-core

| Màn hình | Rule | Mức | Số phần tử | Selector |
| --- | --- | --- | ---: | --- |
| Tất cả màn hình đã quét | — | — | 0 | Không có rule violation tự động |
