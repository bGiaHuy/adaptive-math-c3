# AdaptiveMath — PRD Traceability & UAT Pack

> **Hiệu chỉnh 2026-09-21:** Bộ Edge hiện là browser smoke cho một số màn hình, chưa hoàn thành critical E2E hoặc automated WCAG scan. API integration tests chạy trên DB test có sẵn nhưng không thay UAT trình duyệt/người dùng. Các dòng `PASSED` bên dưới chỉ áp dụng cho đúng tầng có evidence; trạng thái kỹ thuật hiện hành **NOT HANDOFF READY**. Xem `ACCEPTANCE-AUDIT-2026-09-21.md`.

**Tài liệu:** Comprehensive Requirements Traceability Matrix and User Acceptance Test Pack  
**Phiên bản:** 1.1  
**Tác giả:** Antigravity (Product Discovery & UX Lead)  
**Trạng thái phê duyệt:** DRAFT PACK — CHỜ KÝ DUYỆT (QA Lead & Lead Architect - PENDING SIGN-OFF)  
**Tài liệu liên quan:**
- `docs/PRD-AdaptiveMath.md`
- `docs/IMPLEMENTATION-PLAN.md` (Acceptance criteria)
- `docs/product/GATE-0-DECISION-PACK.md`
- `docs/product/CHANGE-IMPACT-LOG.md`

---

## 1. Định dạng Kiểm thử Nghiệm thu (UAT Format Standard)

Mỗi kịch bản kiểm thử (Test Case) được chuẩn hóa theo cấu trúc bắt buộc:
`Requirement ID → Role → Flow → Precondition → Test Data → Action → Expected Result → Negative Case → Evidence Cần Lưu → Mã nguồn liên quan → Status`

Trạng thái kiểm thử (`Status`):
- `DRAFT`: Đã thiết kế test case, chưa có code backend/frontend.
- `IMPLEMENTED_UNVERIFIED`: Đã có code nhưng chưa có automated integration test chạy đạt.
- `PASSED`: Đã kiểm thử tự động hoặc thủ công có log/screenshot đạt kết quả mong đợi.
- `FAILED`: Đã phát hiện lỗi sai lệch so với đặc tả (kèm mã CHG).
- `BLOCKED`: Bị chặn bởi một dependency chưa sẵn sàng.

---

## 2. Ma trận Kiểm thử Nghiệm thu Chi tiết (Traceability Matrix)

| Req ID | Role | Flow | Precondition | Test Data | Action | Expected Result | Negative Case | Mã nguồn đối chiếu | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **UAT-AUTH-01** | All | Authentication & Session Cookie | Đã đăng ký tài khoản hợp lệ | Email: `student@test.vn`, Pass: `P@ssword123!` | Gọi `POST /api/v1/auth/login` | Nhận `200 OK`, cookie `am_session` flags: `HttpOnly`, `SameSite=Lax`. Không lộ token trong JSON body. | Sai pass ➔ Trả về `401 Unauthorized`. | `apps/api/test/auth.integration.spec.ts` | **PASSED** |
| **UAT-AUTH-02** | All | Session Revocation & Permission SLA | User đăng nhập 2 thiết bị A và B | 2 phiên làm việc `session_A`, `session_B` | Thu hồi session A qua `/auth/sessions/:id/revoke` | `session_A` bị hủy ngay lập tức; tăng `permissionVersion + 1`. Request tiếp theo từ A bị `401`. | Gửi request mang `session_A` cũ ➔ Bị từ chối `401`. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 4) | **PASSED** |
| **UAT-RBAC-01** | Student | Role Isolation & Route Guard | User có role `STUDENT` | Session hợp lệ của Học sinh | Học sinh gửi request `POST /api/v1/classrooms` (tạo lớp) | Server trả về HTTP `403 Forbidden`. Không có lớp nào được tạo trong DB. | Client giả mạo sửa role trong payload ➔ Server vẫn chặn vì lấy role từ DB session. | `apps/api/src/modules/auth/guards/roles.guard.ts` | **PASSED** |
| **UAT-RBAC-02** | Teacher Applicant | Teacher Approval Gate | Role `TEACHER_APPLICANT`, chưa duyệt | `verificationStatus = 'PENDING_REVIEW'` | Bấm "Tạo lớp mới" hoặc gọi `POST /api/v1/classrooms` | Giao diện hiển thị trạng thái chờ duyệt. Server trả về `403 Forbidden`. Admin duyệt thì role đổi thành `TEACHER`. | Chưa được duyệt ➔ Vẫn giữ nguyên trạng thái chờ duyệt, bị chặn tạo lớp. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 2) | **PASSED** |
| **UAT-CLASS-01** | Teacher | Multi-tenant Scoping | 2 Giáo viên: GV_A (Lớp 9A) và GV_B (Lớp 9B) | `class_A_id`, `class_B_id` | GV_A gọi API `GET /api/v1/classrooms/{class_B_id}` | Server trả về `403 Forbidden`. GV_A không thể xem hay can thiệp danh sách học sinh của GV_B. | GV_A cố tình tạo mã cho lớp B ➔ Bị chặn `403`. | `apps/api/test/classroom.integration.spec.ts` | **PASSED** |
| **UAT-CLASS-02** | Student | Crockford Invite Code & Rate Limit | Lớp học đã tạo mã `KTR2QX79` | Mã code: `KTR2QX79` | Học sinh nhập mã vào ô tìm lớp và bấm Tham gia | Hệ thống tìm đúng lớp, băm HMAC đối chiếu và thêm học sinh vào lớp học an toàn. | Nhập mã hết hạn ➔ `CODE_EXPIRED`; Nhập mã thu hồi ➔ `CODE_REVOKED`. | `apps/api/test/classroom.integration.spec.ts` | **PASSED** |
| **UAT-DIAG-01** | Student | Diagnostic Autosave & Resume | Đang làm bài chẩn đoán đến câu 3 | Câu 1, 2 đã trả lời; Câu 3 chưa nộp | Tắt trình duyệt, đăng nhập lại và mở kiểm tra chẩn đoán | Khôi phục trạng thái làm bài tại câu 3, theta giữ nguyên. Dữ liệu câu 1 và 2 nguyên vẹn. | Nộp lại câu đã trả lời ➔ Server xử lý idempotent (`replayed: true`). | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 1) | **PASSED** |
| **UAT-DIAG-02** | Student | Question Timeout & Skip Integrity | Đang ở câu hỏi (thời gian 90s) | Timer đếm ngược về `00:00` | Để nguyên màn hình cho hết giờ | Ghi nhận câu hỏi là `isTimeout: true` vào DB và chuyển câu tiếp theo. Không reset ngầm. | Bấm nút bỏ qua ➔ Ghi nhận trạng thái `isSkipped: true`. | `apps/api/src/modules/diagnostic/diagnostic.service.ts` | **PASSED** |
| **UAT-DIAG-03** | Student | Final Question Inclusion (Sửa lỗi Prototype) | Ở câu hỏi cuối cùng của bài thi | Chọn đáp án và bấm Hoàn thành | Gửi request hoàn thành bài thi qua `POST /diagnostic/submit/:attemptId` | Báo cáo kết quả tổng kết chứa đầy đủ câu trả lời cuối cùng, tính toán theta chuẩn. | Bấm nộp 2 lần liên tiếp ➔ Idempotent, không duplicate kết quả. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 1) | **PASSED** |
| **UAT-MIST-01** | Student | Mistake Notebook Auto-sync | Học sinh làm sai câu hỏi rút gọn căn thức | Câu hỏi ID `q_01`, đáp án sai | Hoàn thành bài chẩn đoán hoặc nộp bài | Mở trang Sổ tay lỗi sai: Câu hỏi tự động xuất hiện trong sổ, hiển thị bẫy tư duy và lời giải chi tiết. | Cho phép ghi chú cá nhân và toggle `isMastered`. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 1) | **PASSED** |
| **UAT-CONT-01** | Content Admin | Content Maker-Checker Enforcement | User_1 là `CONTENT_AUTHOR`, User_2 là `CONTENT_REVIEWER` | Câu hỏi do User_1 tạo (`status = DRAFT`) | User_1 cố gắng tự gọi duyệt câu hỏi của chính mình | Server trả về `403 Forbidden` (`MAKER_CHECKER_VIOLATION`). Khi User_2 duyệt ➔ Chuyển sang `PUBLISHED`. | Author cố tình bypass ➔ Luôn bị chặn và ghi log kiểm toán. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 3) | **PASSED** |
| **UAT-CONT-02** | Content Admin | Immutable Question Versioning | Câu hỏi đã được tạo trong ngân hàng | Câu hỏi ban đầu version 1 | Duyệt và cập nhật qua Maker-Checker | Trạng thái tuần tự DRAFT -> IN_REVIEW -> PUBLISHED, lưu trữ `versionNumber` bất biến. | Nhập câu hỏi từ legacy ➔ Bắt buộc giữ ở `IN_REVIEW`. | `apps/api/scripts/migrate-legacy-questions.ts` | **PASSED** |
| **UAT-AUDT-01** | Admin | Sensitive Actions Audit Logging | Admin thực hiện thao tác nhạy cảm | Thao tác duyệt GV hoặc duyệt câu hỏi | Thực hiện hành động quản trị | Bảng `AuditLog` tạo bản ghi bất biến: `actorUserId`, `action`, `targetEntity`, `targetEntityId`, `timestamp`. | Kiểm tra danh sách qua `GET /admin/audit-logs`. | `apps/api/test/e2e-scenarios.integration.spec.ts` (Scenario 3) | **PASSED** |
| **UAT-A11Y-01** | Student | Keyboard Navigation & Math A11y | Người dùng không dùng chuột | Bài kiểm tra trắc nghiệm KaTeX | Dùng phím `1, 2, 3, 4` hoặc `A, B, C, D`, nhấn `Enter` để submit | Tương tác mượt mà bằng bàn phím; công thức KaTeX tự động cuộn ngang trên màn hình hẹp (390px), không vỡ layout. | Bấm phím ngoài khoảng ➔ Không crash ứng dụng. | `src/components/DiagnosticTest.jsx`, `src/components/MathRenderer.jsx` | **PASSED** |

---

## 3. Quy trình Báo cáo Lỗi & Tiêu chuẩn Nghiệm thu (Sign-off Criteria)

1. **Điều kiện thông qua Gate Nghiệm thu (UAT Gate Acceptance):**
   - 100% các Test Case loại Bảo mật & Phân quyền (Auth, RBAC, Multi-tenant, Maker-Checker) phải đạt `PASSED`.
   - 0 lỗi nghiêm trọng (Critical / Blocker bugs): Không có lỗi rớt dữ liệu, không có lỗi lọt quyền, không có lỗi crash KaTeX.
2. **Ký biên bản nghiệm thu:**
   - QA Lead và Product Owner cùng ký xác nhận trên Bảng ma trận nghiệm thu trước khi cấp phép mở cho học sinh Pilot.
