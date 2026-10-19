# AdaptiveMath — Product Decision Log

### Quyết định triển khai D-MATH-20261014: biểu đồ và hội thoại gia sư

- Trạng thái: IMPLEMENTED AND TECHNICALLY VERIFIED ON MATH PRODUCTION; không thay thế sign-off nội dung hoặc phát hành pilot toàn sản phẩm.
- Cơ sở: người dùng yêu cầu tự thực hiện các task biểu đồ năng lực và chatbot ngày 14/10/2026. Lựa chọn cụ thể dưới đây là quyết định triển khai của agent trong phạm vi đó, không giả định có người phê duyệt khác.
- Biểu đồ: thanh ngang từng kỹ năng, lọc chương và sắp xếp điểm thấp trước; dùng catalog đúng lớp, giữ null cho kỹ năng chưa đánh giá. Không tổng hợp chương hoặc dựng khoảng tin cậy từ số câu bằng chứng.
- Chatbot: hỏi tiếp theo bài ôn đã mở đáp án, ngữ cảnh server, 6 lượt gần nhất, 20 lượt/hội thoại. Hiển thị lịch sử 30 ngày; dọn nội dung quá hạn khi mở hội thoại. Xóa nội dung theo yêu cầu giữ nguyên sổ chi phí. Tái sử dụng ledger và provider hiện có; không tự đổi nhà cung cấp.
- Kiểm chứng: build/typecheck, QA Math 70 test đạt và 1 bỏ qua, 13 test chatbot sau sửa chỉ dẫn; kiểm tra lịch sử/phân quyền/gửi trùng/xóa nội dung. Production kiểm chứng biểu đồ trên desktop/390px và trạng thái trống/tải/lỗi/thử lại; hai vòng, mỗi vòng hai lượt MWAPI thật. Bốn request COMPLETED, tổng chi phí ledger 0,119080 USD, không còn giữ chỗ hoặc dữ liệu QA hoạt động. Không nghiệm thu ngân hàng câu hỏi chính thức bằng fixture QA.
- Tham chiếu: `docs/COMPETENCY-AND-CHATBOT-TASKS.md`, `docs/evidence/math-tutor/VERIFICATION.md`, `docs/evidence/math-tutor/live/MWAPI-VERIFICATION.md`, `docs/evidence/math-tutor/live/FINAL-AUDIT.json`.


**Tài liệu:** Formal Product, Architecture & Governance Decision Log  
**Vai trò sở hữu:** Antigravity (Product Release Controller)  
**Phiên bản:** 1.0  
**Ngày cập nhật:** 2026-09-21  
**Quy tắc quản trị:**
1. **Recommendation $\ne$ Approved:** Khuyến nghị kỹ thuật hoặc nghiệp vụ từ Product/UX Lead không có giá trị ràng buộc pháp lý hoặc phạm vi cho đến khi có người chịu trách nhiệm chính thức ký duyệt (Sign-off).
2. **Pending by Default:** Mọi quyết định chưa có chữ ký thật, ngày phê duyệt thật và người phê duyệt rõ ràng bắt buộc phải giữ trạng thái `PENDING`.
3. **Traceability:** Mọi quyết định được phê duyệt phải cập nhật ngược lại các artifacts bị ảnh hưởng (Affected Artifacts) và gửi Change Impact cho Kỹ sư triển khai (OpenCode).

---

## 1. Bảng Tổng Hợp Quyết Định (Decision Register)

| Decision ID | Tên Quyết Định | Phân loại | Trạng thái | Khuyến nghị (Recommendation) | Người duyệt (Approver) | Ngày duyệt |
| :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| **D-01** | Khối lớp & Bộ sách cho Controlled Pilot | Scope / Product | **PENDING** | Phương án A: Lớp 9 KNTT, trọng tâm ôn thi vào 10 | Head of Product & Academic Lead | — |
| **D-02** | Mô hình định danh & Đăng ký Học sinh | Privacy / Auth | **PENDING** | Phương án 3: Mô hình Lai 2 nấc (Username + Parent Email) | Legal Officer & Product Owner | — |
| **D-03** | Tiêu chí & Quy trình duyệt Giáo viên | Security / RBAC | **PENDING** | Kết hợp B & C: Mã mời đợt đầu + Hàng đợi Applicant | Lead Architect & Operations Lead | — |
| **D-04** | Ranh giới dữ liệu HS chia sẻ Giáo viên | Privacy / Scope | **PENDING** | Phương án 2: Scoped Intervention Privacy | Product Owner & Lead Architect | — |
| **D-TECH-01** | Kiến trúc Session & Xác thực người dùng | Architecture | **APPROVED** | Opaque Session DB + Cookie `__Host-am_session` + Argon2id | Lead Architect (Codex) | 2026-09-21 |
| **D-TECH-02** | Cơ chế sinh và lưu trữ Mã mời lớp học | Security | **APPROVED** | Crockford Base32 8 ký tự + HMAC sha256 + Rate limit | Lead Architect (Codex) | 2026-09-21 |
| **D-TECH-03** | Quy trình Maker-Checker cho Câu hỏi | Academic QA | **APPROVED** | Tách quyền Author/Reviewer + Versioning bất biến khi có attempt | Academic Lead & Lead Architect | 2026-09-21 |
| **D-TECH-04** | Tích hợp Reverse Proxy Vite & HttpOnly Cookies | Frontend Architecture | **APPROVED** | Proxy `/api` tới backend port 4000, không lưu token ở localStorage | Primary Implementation Owner | 2026-09-21 |
| **D-TECH-05** | Hệ thống Thông báo Nội bộ thay thế Native Alerts | UX / Accessibility | **APPROVED** | Loại bỏ hoàn toàn `window.alert`/`confirm`, dùng inline banners & modal xác nhận `role="alert"` | Primary Implementation Owner | 2026-09-21 |
| **D-TECH-06** | Chiến lược Di chuyển Dữ liệu Di sản (Legacy Content) | Content Engineering | **APPROVED** | Lọc trùng đề bài, phân bố theo 24 SkillNode Lớp 9, trạng thái ban đầu `IN_REVIEW` | Academic Lead & Implementation Owner | 2026-09-21 |
| **D-TECH-07** | Kiến trúc Phòng vệ CSRF Origin & Kiểm thử Tải đồng thời | Security / Perf | **APPROVED** | Khóa chặt `Origin` header cho POST/PATCH/DELETE; verify tải 20 client đồng thời | Lead Architect & Release Engineer | 2026-09-21 |

---

## 2. Chi Tiết Từng Quyết Định

### Quyết định D-01: Khối lớp và Bộ SGK cho đợt Controlled Pilot
- **Decision ID:** `D-01`
- **Trạng thái:** `PENDING` (Chờ ký duyệt)
- **Vấn đề cần quyết định:** Xác định phạm vi khối lớp và bộ sách giáo khoa cho đợt thử nghiệm Pilot có kiểm soát 6 tuần (Horizon 2).
- **Các phương án xem xét:**
  - *Phương án A:* Focus hẹp — Lớp 9, Bộ "Kết nối tri thức với cuộc sống", trọng tâm 6–8 kỹ năng ôn thi vào 10.
  - *Phương án B:* Toàn bộ Lớp 9 của cả 3 bộ SGK (KNTT, Cánh Diều, Chân trời sáng tạo).
  - *Phương án C:* Dải rộng Lớp 6 đến Lớp 9 (như bản mẫu Prototype ban đầu).
- **Khuyến nghị của Product/UX Lead:** Chọn **Phương án A**. Tập trung toàn lực vào 8 kỹ năng trọng tâm của Lớp 9 KNTT để tạo kết quả tiến bộ rõ rệt trong 6 tuần.
- **Lựa chọn cuối cùng (Final Choice):** `CHƯA CÓ QUYẾT ĐỊNH CHÍNH THỨC`
- **Người chịu trách nhiệm phê duyệt (Approver):** Head of Product & Academic Lead
- **Ngày phê duyệt:** `PENDING` (Hạn chót: Hết Tuần 1)
- **Cơ sở lý luận (Rationale):** Tập trung nguồn lực biên soạn và thẩm định sâu 320 câu hỏi chất lượng cao thay vì dàn trải 3.000 câu cho 4 khối lớp; giải quyết đúng điểm đau cấp bách nhất của học sinh thi vào 10.
- **Tài liệu bị ảnh hưởng (Affected Artifacts):**
  - `docs/product/GATE-0-DECISION-PACK.md`
  - `docs/product/CONTENT-READINESS.md`
  - `apps/api/prisma/schema.prisma` (bảng `Curriculum`, trường `grade`, `textbook`)
  - `src/components/OnboardingWizard.jsx` / `apps/web` (Bước 2 chọn lớp)
- **Ngày rà soát định kỳ (Review Date):** Cuối Tuần 1 triển khai.

---

### Quyết định D-02: Mô hình Định danh và Đăng ký của Học sinh
- **Decision ID:** `D-02`
- **Trạng thái:** `PENDING` (Chờ ký duyệt)
- **Vấn đề cần quyết định:** Cơ chế đăng ký tài khoản cho học sinh vị thành niên (11–15 tuổi) bảo đảm tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân nhưng không làm gãy phễu Onboarding.
- **Các phương án xem xét:**
  - *Phương án 1:* Email + Mật khẩu cá nhân độc lập (Mô hình Prototype).
  - *Phương án 2:* Định danh kép (Parent-linked cứng) — Phụ huynh duyệt OTP trước khi học sinh được kích hoạt.
  - *Phương án 3:* Mô hình Lai 2 nấc (Two-tier Hybrid Identity) — Nấc 1: Username/Email vào học ngay; Nấc 2: Bổ sung Email phụ huynh để nhận báo cáo và bảo hộ.
- **Khuyến nghị của Product/UX Lead:** Chọn **Phương án 3**.
- **Lựa chọn cuối cùng (Final Choice):** `CHƯA CÓ QUYẾT ĐỊNH CHÍNH THỨC`
- **Người chịu trách nhiệm phê duyệt (Approver):** Legal & Privacy Officer & Product Owner
- **Ngày phê duyệt:** `PENDING` (Hạn chót: Hết Tuần 1)
- **Cơ sở lý luận (Rationale):** Cân bằng giữa trải nghiệm học sinh bắt đầu nhanh (dưới 60 giây) và nghĩa vụ pháp lý thu thập thông tin người giám hộ khi có can thiệp lâu dài.
- **Lưu ý Pháp lý:** Hiện tại OpenCode đã tạo `parentEmail` và `parentConsentStatus` trong Schema và DTO. Đây là **giả định kỹ thuật tạm thời**, KHÔNG ĐƯỢC coi là yêu cầu pháp lý đã duyệt cho đến khi có chữ ký chính thức từ Legal Officer.
- **Tài liệu bị ảnh hưởng (Affected Artifacts):**
  - `docs/PRD-AdaptiveMath.md` (Mục 8.1 & 20.2)
  - `docs/product/GATE-0-DECISION-PACK.md`
  - `apps/api/prisma/schema.prisma` (`User.username`, `User.email`, `StudentProfile.parentEmail`)
  - `apps/api/src/modules/auth/dto/register-student.dto.ts`
- **Ngày rà soát định kỳ (Review Date):** Cuối Tuần 1 triển khai.

---

### Quyết định D-03: Tiêu chí và Quy trình Xác minh Giáo viên
- **Decision ID:** `D-03`
- **Trạng thái:** `PENDING` (Chờ ký duyệt)
- **Vấn đề cần quyết định:** Ngăn chặn lỗ hổng người dùng tự phong quyền Giáo viên để tạo lớp và xem trộm thông tin học sinh.
- **Các phương án xem xét:**
  - *Phương án A:* Tự động kích hoạt qua email giáo dục `@edu.vn`.
  - *Phương án B:* Hàng đợi duyệt Admin thủ công (Maker-Checker, nộp thẻ giáo viên).
  - *Phương án C:* Mã kích hoạt nội bộ do Ban Quản trị cấp (Invite Code).
- **Khuyến nghị của Product/UX Lead:** **Kết hợp B và C**: Đợt pilot dùng Mã mời nội bộ cho 2–5 giáo viên đối tác; hệ thống vẫn xây dựng role `TEACHER_APPLICANT` và hàng đợi duyệt để sẵn sàng cho phương án B.
- **Lựa chọn cuối cùng (Final Choice):** `CHƯA CÓ QUYẾT ĐỊNH CHÍNH THỨC`
- **Người chịu trách nhiệm phê duyệt (Approver):** Lead Architect (Codex) & Operations Lead
- **Ngày phê duyệt:** `PENDING` (Hạn chót: Hết Tuần 2)
- **Cơ sở lý luận (Rationale):** Đa số giáo viên THCS tại Việt Nam dùng Gmail cá nhân; dùng invite code kiểm soát thủ công 100% rủi ro cho đợt pilot đầu tiên.
- **Tài liệu bị ảnh hưởng (Affected Artifacts):**
  - `docs/PRD-AdaptiveMath.md` (Mục 7.5 & 8.2)
  - `docs/product/GATE-0-DECISION-PACK.md`
  - `apps/api/prisma/schema.prisma` (`UserRole.TEACHER_APPLICANT`, `TeacherProfile.verificationStatus`)
  - `apps/api/src/modules/auth/auth.service.ts`
- **Ngày rà soát định kỳ (Review Date):** Cuối Tuần 2 triển khai.

---

### Quyết định D-04: Ranh giới Dữ liệu Học sinh Giáo viên được phép xem
- **Decision ID:** `D-04`
- **Trạng thái:** `PENDING` (Chờ ký duyệt)
- **Vấn đề cần quyết định:** Xác định giới hạn quyền riêng tư của học sinh khi vào lớp học của giáo viên.
- **Các phương án xem xét:**
  - *Phương án 1:* Toàn quyền xem mọi dữ liệu (Full Transparency).
  - *Phương án 2:* Ranh giới phân định rõ ràng (Scoped Intervention Privacy) — Giáo viên xem bài tập trên lớp và % thành thạo kỹ năng tổng hợp; không xem nhật ký tự học và câu sai riêng tư.
  - *Phương án 3:* Dữ liệu ẩn danh cấp lớp (Anonymous Class Analytics).
- **Khuyến nghị của Product/UX Lead:** Chọn **Phương án 2 (Scoped Intervention Privacy)**.
- **Lựa chọn cuối cùng (Final Choice):** `CHƯA CÓ QUYẾT ĐỊNH CHÍNH THỨC`
- **Người chịu trách nhiệm phê duyệt (Approver):** Product Owner & Lead Architect
- **Ngày phê duyệt:** `PENDING` (Hạn chót: Hết Tuần 1)
- **Cơ sở lý luận (Rationale):** Bảo vệ tâm lý học tập trung thực của học sinh, ngăn ngừa tâm lý sợ sai, nhưng vẫn cung cấp đầy đủ tín hiệu để giáo viên can thiệp phụ đạo kịp thời.
- **Tài liệu bị ảnh hưởng (Affected Artifacts):**
  - `docs/PRD-AdaptiveMath.md` (Mục 7.6 & 20.4)
  - `docs/product/GATE-0-DECISION-PACK.md`
  - `docs/product/TARGET-JOURNEYS.md` (Hành trình J-02, J-04)
  - API Controller của Giáo viên (chưa viết: `GET /api/v1/teacher/classes/:id/students/:studentId`)
- **Ngày rà soát định kỳ (Review Date):** Cuối Tuần 1 triển khai.

---

### Quyết định D-TECH-01: Kiến trúc Session và Xác thực Phía Máy chủ
- **Decision ID:** `D-TECH-01`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Lựa chọn giải pháp Authentication & Session management cho MVP.
- **Phương án chọn:** Opaque Session ID lưu trong bảng `Session` của PostgreSQL; hash token bằng HMAC trước khi lưu DB; truyền qua Cookie `__Host-am_session` (`HttpOnly; Secure; SameSite=Lax`); băm mật khẩu bằng Argon2id.
- **Người phê duyệt (Approver):** Lead Architect (Codex)
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Tuân thủ tuyệt đối PRD và Engineering Guardrails: Cho phép hủy phiên tức thì (`logoutAll`), tăng `permissionVersion` để vô hiệu hóa cache quyền cũ; không lưu credential hay token trong `localStorage`.
- **Tài liệu bị ảnh hưởng:** `docs/IMPLEMENTATION-PLAN.md`, `apps/api/prisma/schema.prisma`, `apps/api/src/modules/auth/auth.service.ts`.
- **Ngày rà soát định kỳ:** Khi triển khai Redis caching ở Step 7.

---

### Quyết định D-TECH-02: Cơ chế Sinh và Lưu trữ Mã Lớp Học
- **Decision ID:** `D-TECH-02`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Chuẩn hóa định dạng mã mời tham gia lớp học thay thế mã 4 ký tự tự do của prototype.
- **Phương án chọn:** Mã 8 ký tự Crockford Base32 ngẫu nhiên (loại bỏ ký tự dễ nhầm `I, L, O, 0, 1`); lưu trữ dưới dạng HMAC digest (`codeHash`); lưu 3 ký tự đầu làm prefix (`codePlainPrefix`); áp dụng Rate limit tối đa 5 lần thử sai / 15 phút.
- **Người phê duyệt (Approver):** Lead Architect (Codex)
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Ngăn ngừa brute-force dò mã lớp của giáo viên khác; mã Crockford dễ đọc khi chiếu trên máy chiếu lớp học.
- **Tài liệu bị ảnh hưởng:** `apps/api/prisma/schema.prisma` (`ClassroomInviteCode`), `docs/product/TARGET-JOURNEYS.md` (J-02, J-04).
- **Ngày rà soát định kỳ:** Khi triển khai Step 5 (Teacher Vertical Slice).

---

### Quyết định D-TECH-03: Quy trình Maker-Checker và Bất biến Phiên bản Câu hỏi
- **Decision ID:** `D-TECH-03`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Cơ chế quản lý vòng đời nội dung và bảo đảm tính toàn vẹn dữ liệu kết quả thi.
- **Phương án chọn:** Câu hỏi có 2 trường `authorId` và `reviewerId` (`authorId !== reviewerId`); câu hỏi một khi đã được dùng trong bài thi (`AttemptAnswer`) thì trở thành bất biến (`Immutable`), mọi sửa đổi bắt buộc tạo phiên bản mới `versionNumber + 1`.
- **Người phê duyệt (Approver):** Academic Lead & Lead Architect (Codex)
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Đảm bảo tính khách quan khoa học của đề thi và ngăn ngừa lỗi dữ liệu khi sửa câu hỏi cũ làm sai lệch lịch sử đánh giá năng lực của học sinh.
- **Tài liệu bị ảnh hưởng:** `apps/api/prisma/schema.prisma` (`Question`, `SkillNode`), `docs/product/TARGET-JOURNEYS.md` (J-05).
- **Ngày rà soát định kỳ:** Khi triển khai Step 6 (Admin & Content Slice).

---

### Quyết định D-TECH-04: Tích hợp Reverse Proxy Vite & HttpOnly Cookies
- **Decision ID:** `D-TECH-04`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Kiến trúc kết nối giữa Frontend SPA và Backend API trong môi trường phát triển & kiểm thử nội bộ.
- **Phương án chọn:** Cấu hình reverse proxy trong `vite.config.js` chuyển tiếp toàn bộ request `/api` về `http://localhost:4000`. Trình duyệt gửi cookie `__Host-am_session` tự động cùng domain/origin, triệt tiêu hoàn toàn nhu cầu lưu JWT hoặc session token trong `localStorage`.
- **Người phê duyệt (Approver):** Primary Implementation Owner & Lead Architect
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Bảo đảm an toàn trước tấn công XSS; tuân thủ nghiêm ngặt PRD §8.3; đơn giản hóa cấu hình CORS giữa frontend và backend.
- **Tài liệu bị ảnh hưởng:** `vite.config.js`, `src/lib/apiClient.js`, `src/App.jsx`.

---

### Quyết định D-TECH-05: Hệ thống Thông báo Nội bộ thay thế Native Alerts
- **Decision ID:** `D-TECH-05`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Nâng cấp trải nghiệm người dùng và khả năng tiếp cận (Accessibility WCAG 2.1 AA) cho các luồng xác nhận và thông báo lỗi.
- **Phương án chọn:** Xóa bỏ hoàn toàn tất cả các lệnh gọi `window.alert()` và `window.confirm()` trong toàn bộ source code. Thay thế bằng các Banner thông báo nội bộ và Confirmation Dialog có `role="alert"`, hỗ trợ bàn phím, tương thích với theme "Math Studio".
- **Người phê duyệt (Approver):** Primary Implementation Owner & UX Lead
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Hộp thoại trình duyệt native gây gián đoạn luồng người dùng, không thể tùy biến giao diện hoặc bản địa hóa, không truy cập được cho người dùng thiết bị trợ thính/màn hình đọc.
- **Tài liệu bị ảnh hưởng:** `src/components/AdminPortalView.jsx`, `src/components/TeacherClassroomsView.jsx`, `src/components/MistakeNotebookView.jsx`, `src/components/SessionManagementModal.jsx`.

---

### Quyết định D-TECH-06: Chiến lược Di chuyển Dữ liệu Di sản (Legacy Content Migration)
- **Decision ID:** `D-TECH-06`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Phương thức đưa 1.472 câu hỏi legacy từ prototype vào cơ sở dữ liệu PostgreSQL chuẩn.
- **Phương án chọn:** Viết script `migrate-legacy-questions.ts` với cờ `--dry-run` và `--apply`. Tự động lọc bỏ các câu hỏi trùng lặp nội dung đề bài (168 câu trùng bị bỏ qua), phân phối 216 câu hỏi duy nhất vào 24 `SkillNode` Lớp 9. Toàn bộ câu hỏi nhập vào được gắn trạng thái `IN_REVIEW` (chờ duyệt) để đảm bảo tuân thủ quy trình Maker-Checker (Gate 3).
- **Người phê duyệt (Approver):** Academic Lead & Primary Implementation Owner
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Không tự ý xuất bản (`PUBLISHED`) hàng loạt câu hỏi chưa qua thẩm định học thuật; bảo vệ tính chính xác của đề thi Adaptive CAT.
- **Tài liệu bị ảnh hưởng:** `apps/api/scripts/migrate-legacy-questions.ts`, `docs/product/CONTENT-READINESS.md`.

---

### Quyết định D-TECH-07: Kiến trúc Phòng vệ CSRF Origin & Kiểm thử Tải đồng thời
- **Decision ID:** `D-TECH-07`
- **Trạng thái:** `APPROVED`
- **Vấn đề cần quyết định:** Đảm bảo an toàn chống CSRF khi dùng cookie xác thực và kiểm chứng năng lực chịu tải của API NestJS + PostgreSQL.
- **Phương án chọn:** Kích hoạt kiểm tra header `Origin` trên mọi HTTP request thay đổi trạng thái (POST, PATCH, DELETE). Chỉ cho phép các origin được định nghĩa trong whitelist (`http://localhost:3000`, `http://localhost:4000`, production domain). Xây dựng kịch bản kiểm thử tải đồng thời 20 client thực hiện chu trình CAT hoàn chỉnh để xác minh không bị deadlock hoặc nghẽn connection pool.
- **Người phê duyệt (Approver):** Lead Architect & Release Engineer
- **Ngày phê duyệt:** 2026-09-21
- **Cơ sở lý luận (Rationale):** Đảm bảo an toàn tối đa cho cookie session; chứng minh hệ thống sẵn sàng bàn giao kỹ thuật cho khách hàng thử nghiệm pilot.
- **Tài liệu bị ảnh hưởng:** `apps/api/src/common/guards/csrf-origin.guard.ts`, `apps/api/scripts/concurrency-smoke-test.ts`.
