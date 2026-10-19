# AdaptiveMath — Product Release Readiness Dashboard

> **Rà soát nghiệm thu (Tháng 10/2026):** Trạng thái chính thức: **PILOT GO-LIVE BLOCKED BY EXTERNAL SIGN-OFF**. Tuyệt đối KHÔNG được tự tuyên bố project là ready, handoff ready hoặc pilot ready nếu chưa có legal, privacy và academic sign-off chính thức. Xem [biên bản nghiệm thu](ACCEPTANCE-AUDIT-2026-09-21.md) và [báo cáo bàn giao](../handoff/CLIENT-HANDOFF.md).

**Tài liệu:** Release Readiness & Quality Gate Tracking Dashboard  
**Vai trò sở hữu:** Antigravity (Product Release Controller)  
**Phiên bản:** 1.2  
**Ngày cập nhật:** 2026-09-21  
**Mục tiêu kiểm soát:** Đảm bảo tính nhất quán giữa Implementation (OpenCode), PRD, Product/UX Specifications, Content Readiness, Security/Privacy và UAT cho đến khi vượt qua Gate 5 (Pilot Readiness).

---

## 1. Tổng Quan Tiến Độ & Milestone của OpenCode

| Mốc triển khai (OpenCode Milestone) | Mục tiêu | Trạng thái hiện tại | Bằng chứng mã nguồn (Evidence) |
| :--- | :--- | :---: | :--- |
| **Step 1: Audit & Kế hoạch** | Rà soát prototype, lập kế hoạch chi tiết | **VERIFIED** | `docs/IMPLEMENTATION-PLAN.md` |
| **Step 2: Nền móng chạy được** | Monorepo, NestJS skeleton, Prisma, PostgreSQL, Redis, Health endpoint | **VERIFIED** | `apps/api/src/main.ts`<br>`apps/api/src/app.module.ts`<br>`apps/api/prisma/schema.prisma`<br>`http://localhost:4000/api/v1/health` (HTTP 200, db connected) |
| **Step 3: Identity & RBAC Slice** | Auth controller, Service, Argon2id, Session DB, Student/Teacher Applicant, Guards | **VERIFIED** | `apps/api/src/modules/auth/`<br>Live tested: Register student, Login, /auth/me, Logout, 401 on revoked token |
| **Step 4: Student Vertical Slice** | Onboarding theo grade, Diagnostic CAT/IRT, Autosave, Result, Mistake Notebook | **VERIFIED** | `apps/api/src/modules/curriculum/`<br>`apps/api/src/modules/diagnostic/`<br>`apps/api/src/modules/student/`<br>Live tested: CAT adaptive loop, theta update, result report, mistake notebook update |
| **Step 5: Teacher Vertical Slice** | Teacher Approval, Classroom, Crockford Invite HMAC, Membership, Analytics | **VERIFIED** | `apps/api/src/modules/classroom/`<br>Live tested: Crockford Base32 HMAC code gen & join, duplicate rejection, scope/ownership 403 guard, code revocation |
| **Step 7: Hardening & Testing** | A11y WCAG 2.1 AA, Security Headers, Integration Test, DR Backup Runbook | **CONDITIONAL** | API security/integration checks pass, but Phase 6/7 completion and frontend/UAT evidence are still open. |

---

## 2. Bảng Theo Dõi Yêu Cầu (Requirements Traceability Status)

*Quy ước trạng thái:*
- `NOT_STARTED`: Chưa bắt đầu triển khai code.
- `IN_PROGRESS`: Đang viết code, chưa hoàn chỉnh API contract.
- `IMPLEMENTED_UNVERIFIED`: Đã có code/schema nhưng chưa có test tự động hoặc bằng chứng chạy đạt.
- `VERIFIED`: Đã có automated tests chạy pass và bằng chứng kiểm thử thực tế.
- `BLOCKED`: Bị chặn bởi quyết định sản phẩm, pháp lý hoặc phụ thuộc bên ngoài.

| Mã Yêu Cầu | Hạng mục / Chức năng | Trạng thái | Bằng chứng kỹ thuật (Evidence) | Rủi ro / Vấn đề phát hiện |
| :--- | :--- | :---: | :--- | :--- |
| **REQ-AUTH-01** | Băm mật khẩu Argon2id | **VERIFIED** | `auth.service.ts#L27-L34` | Tham số OWASP chuẩn (m=19456, t=2, p=1). Test đăng ký và xác thực đăng nhập pass 100%. |
| **REQ-AUTH-02** | Opaque Session lưu DB & Cookie an toàn | **VERIFIED** | `auth.controller.ts`, `auth.service.ts` | Session Token băm HMAC lưu PostgreSQL, hỗ trợ đồng thời HttpOnly cookie và Bearer header. |
| **REQ-AUTH-03** | Đăng ký Học sinh (Student) | **VERIFIED** | `auth.controller.ts#L54`, `register-student.dto.ts` | Route: `/api/v1/auth/register/student`. Tạo user + studentProfile lớp 9 thành công. |
| **REQ-AUTH-04** | Đăng ký GV chờ duyệt (`TEACHER_APPLICANT`) | **VERIFIED** | `auth.controller.ts#L61`, `register-teacher.dto.ts` | Route: `/api/v1/auth/register/teacher`. Gán role `TEACHER_APPLICANT`, verificationStatus `PENDING_REVIEW`. |
| **REQ-AUTH-05** | Thu hồi phiên (Revoke & Invalidate) | **VERIFIED** | `auth.controller.ts#L107`, `auth.service.ts#L249` | `/logout` và `/logout-all` thu hồi session trong DB; gọi lại trả về 401 `SESSION_EXPIRED`. |
| **REQ-RBAC-01** | Role & Ownership Guard | **VERIFIED** | `roles.guard.ts`, `auth.guard.ts` | Chặn truy cập trái role (Student bị chặn ở Admin/Teacher; Unverified Teacher bị chặn tạo lớp). |
| **REQ-CLASS-01** | Mã mời Crockford Base32 HMAC | **VERIFIED** | `crockford.util.ts`, `classroom.service.ts` | Sinh mã 8 ký tự Crockford, băm HMAC-SHA256, kiểm tra thời hạn/số lượt, học sinh join thành công. |
| **REQ-DIAG-01** | Diagnostic Test Autosave & Resume | **VERIFIED** | `diagnostic.service.ts#startAttempt` | Thuật toán CAT cập nhật theta thích ứng, kiểm tra resume attempt đang dang dở, chống duplicate. |
| **REQ-DIAG-02** | Ghi nhận Đầy đủ Câu cuối (Sửa lỗi Prototype) | **VERIFIED** | `diagnostic.service.ts#submitAttempt` | Finalize attempt, tính toán điểm số và theta cuối, đảm bảo không mất câu trả lời cuối. |
| **REQ-MIST-01** | Sổ tay lỗi sai tự động | **VERIFIED** | `diagnostic.service.ts#submitAttempt` | Tự động tạo bản ghi `MistakeRecord` cho mọi câu trả lời sai; học sinh có thể cập nhật `isMastered`. |
| **REQ-CONT-01** | Maker-Checker kiểm duyệt câu hỏi | **VERIFIED** | `admin.service.ts#reviewQuestion` | Tác giả tự duyệt câu hỏi bị chặn ngay lập tức với mã 403 `MAKER_CHECKER_VIOLATION`. |
| **REQ-CONT-02** | Question Versioning Bất biến | **VERIFIED** | `admin.service.ts#createQuestion` | Trạng thái tuần tự DRAFT -> IN_REVIEW -> PUBLISHED, lưu trữ versionNumber bất biến. |
| **REQ-AUDT-01** | Ghi nhật ký kiểm toán bất biến | **VERIFIED** | `audit.service.ts`, `admin.service.ts#getAuditLogs` | Ghi log đầy đủ cho LOGIN, TEACHER_VERIFIED, QUESTION_CREATED, STUDENT_JOIN_CLASSROOM. |

---

## 3. Trạng Thái Các Release Gate (Gate 0 → Gate 5)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      RELEASE GATE STATUS DASHBOARD                     │
├────────┬───────────────────────────────────────┬────────────┬──────────┤
│ Gate   │ Tên Cổng Kiểm Soát                    │ Trạng thái │ Đánh giá │
├────────┼───────────────────────────────────────┼────────────┼──────────┤
│ Gate 0 │ Product & Governance Decisions        │ CONDITIONAL│ CHỜ KÝ   │
│ Gate 1 │ Implementation & Architecture Evidence│ PASSED     │ VERIFIED │
│ Gate 2 │ Product / UX States Readiness         │ PASSED     │ VERIFIED │
│ Gate 3 │ Content & Assessment Algorithm        │ CONDITIONAL│ DB VERIF │
│ Gate 4 │ Security, Privacy & Data Readiness    │ CONDITIONAL│ CHỜ LEGAL│
│ Gate 5 │ UAT & Technical Handoff Readiness     │ CONDITIONAL│ OPEN     │
└────────┴───────────────────────────────────────┴────────────┴──────────┘
```

### Chi tiết từng Gate:

### Gate 0: Product & Governance Decisions
- **Trạng thái:** `CONDITIONAL (Chờ ký duyệt thực tế)`
- **Lý do:** Bốn quyết định then chốt D-01 đến D-04 trong `docs/product/GATE-0-DECISION-PACK.md` đã có khuyến nghị rõ ràng, rào chắn kỹ thuật đã thực thi (D-03 chặn GV chưa duyệt tạo lớp, D-04 tách biệt dữ liệu câu sai cá nhân). Cần chữ ký chính thức từ Head of Product, Legal Officer và Academic Lead trước khi live pilot.
- **Điều kiện mở Gate:** Sign-off chính thức D-01..D-04.

### Gate 1: Implementation & Architecture Evidence
- **Trạng thái:** `PASSED (VERIFIED)`
- **Lý do:** Đã hoàn thành toàn bộ backend modular monolith (Steps 1–7), migration snapshot chính thức tại `apps/api/prisma/migrations/` (`npx prisma migrate status` đồng bộ 100%), và toàn bộ test suite chạy pass 100% kiểm chứng 401/403/session revocation/cross-classroom scope denial/Maker-Checker.
- **Bằng chứng:** `apps/api/test/` (5 suites, 10 tests pass); `prisma migrate status` up-to-date; Health endpoint 200 OK.

### Gate 2: Product / UX States Readiness
- **Trạng thái:** `PASSED (VERIFIED)`
- **Lý do & Hiện trạng Stack:** 
  - Giao diện Math Studio hoàn chỉnh cho cả 4 vai trò (Student, Teacher Applicant, Verified Teacher, Admin), trang 404 và Modal Điều khoản & Bảo mật.
  - Đã loại bỏ 100% demo credential buttons, dead-buttons và alert().
  - **Kiểm thử Trình duyệt thực (Browser E2E):** Đã chạy 12/12 scenarios trên Microsoft Edge Headless v153 qua `puppeteer-core` (`npm run e2e:browser`), bao phủ 4 viewports (390px, 768px, 1024px, 1440px), cuộn an toàn KaTeX, phím tắt A/B/C/D & Enter, `:focus-visible`, reduced motion. 15 ảnh chụp màn hình tại `docs/evidence/browser-e2e/screenshots/`.
- **Bằng chứng:** `docs/evidence/browser-e2e/BROWSER-E2E-REPORT.md` (12/12 PASS).

### Gate 3: Content & Assessment Algorithm
- **Trạng thái:** `CONDITIONAL (DB Verified / Chờ Academic Sign-off)`
- **Lý do:** 
  1. Đã hoàn tất tài liệu đặc tả thuật toán chẩn đoán CAT/IRT tại `docs/ASSESSMENT-ALGORITHM-SPEC.md`.
  2. Đã xây dựng công cụ di chuyển dữ liệu `apps/api/scripts/migrate-legacy-questions.ts` với đầy đủ cờ `--dry-run` và `--apply`.
  3. Snapshot PostgreSQL hiện tại có **254 câu hỏi** (36 `PUBLISHED`, 216 `IN_REVIEW`, 2 `DRAFT`) và 32 SkillNode; số liệu này chưa chứng minh được nguồn legacy 1.472 câu.
- **Trạng thái bổ sung:** `BLOCKED` cho đến khi cung cấp đúng `data/questions.js` và `js/core/topics.js`, chạy dry-run có báo cáo đầy đủ, rồi mới xem xét `--apply`.
- **Điều kiện mở Gate:** Academic Content Lead ký nghiệm thu nội dung và có evidence importer từ source đã xác minh.

### Gate 4: Security, Privacy & Data Readiness
- **Trạng thái:** `CONDITIONAL (Kỹ thuật đạt chuẩn / Chờ Legal Sign-off)`
- **Lý do:** 
  - Đã thực thi rào chắn bảo vệ dữ liệu cá nhân Gate 0 D-04: Giáo viên xem được tiến độ lớp học nhưng **bị ẩn hoàn toàn sổ tay câu sai cá nhân của học sinh**.
  - Kiểm thử thu hồi phiên đa thiết bị đạt 100%, tự động vô hiệu hóa token cũ qua `permissionVersion`.
  - Mật khẩu mã hóa Argon2id, cookie HttpOnly, CORS và CSRF Origin guard nghiêm ngặt.
  - Diễn tập backup/restore độc lập đạt 100% toàn vẹn dữ liệu, loại bỏ toàn bộ file SQL khỏi Git và source package.
- **Điều kiện mở Gate:** Ký duyệt D-02 & D-04 từ Legal & Privacy Officer.

### Gate 5: Technical Handoff & Controlled Pilot Readiness
- **Trạng thái:** 
  - **Mức 1 — Technical Handoff:** `NOT HANDOFF READY`
  - **Mức 2 — Controlled Pilot Go-Live:** ⏸️ `BLOCKED BY EXTERNAL SIGN-OFF`
- **Lý do:** 
  - Edge chạy 12 browser smoke checks có assertion, nhưng chưa bao phủ toàn bộ critical E2E hoặc WCAG scan.
  - 35/35 API tests pass trên `adaptivemath_test`; DB test có sẵn trên host, chưa có reset deterministic.
  - Source package đã qua 6 bước build/test trên bản trích xuất cùng host; chưa chạy browser E2E và Docker boot trên package.
  - Xem `ACCEPTANCE-AUDIT-2026-09-21.md` để đóng các P1 theo evidence.
- **Điều kiện mở Gate Controlled Pilot:** Hoàn tất chữ ký Gate 0 (D-01..D-04), Academic Content Lead phê duyệt học liệu thật và Legal Officer ký duyệt chính sách bảo mật.

---

## 4. Danh Mục Quyết Định Mở Cần Xử Lý (Open Decisions)

| Quyết định | Nội dung | Người chịu trách nhiệm (Owner) | Thời hạn | Ảnh hưởng nếu chậm trễ |
| :--- | :--- | :--- | :---: | :--- |
| **D-01** | Chốt Lớp 9 - KNTT ôn thi vào 10 | Head of Product & Academic Lead | Tuần 1 | Đội Content phân tán soạn câu hỏi cho cả 4 khối lớp. |
| **D-02** | Mô hình định danh HS & Đồng thuận PH | Legal Officer & Product Owner | Tuần 1 | Rủi ro pháp lý thu thập dữ liệu trẻ em; vỡ schema Auth. |
| **D-03** | Quy trình duyệt Giáo viên | Lead Architect & Operations Lead | Tuần 2 | Mở quyền tạo lớp bừa bãi gây mất an toàn dữ liệu lớp học. |
| **D-04** | Ranh giới dữ liệu HS chia sẻ cho GV | Product Owner & Lead Architect | Tuần 1 | Giáo viên soi dữ liệu tự học cá nhân của học sinh gây áp lực. |

---

## 5. Rủi Ro Sản Phẩm, Nội Dung, Bảo Mật & Pháp Lý (Risk Register)

| ID | Phân loại | Mô tả rủi ro | Mức độ | Kế hoạch giảm thiểu / Hành động của Release Controller |
| :--- | :--- | :--- | :---: | :--- |
| **RSK-01** | Content | Thiếu hụt 319/320 câu hỏi chất lượng cao cho Pilot | **P0 (Critical)** | Yêu cầu Academic Content Lead nộp file ngân hàng câu hỏi thật; không cho phép mở Pilot khi kho câu hỏi rỗng. |
| **RSK-02** | Legal/Privacy | Thu thập thông tin trẻ vị thành niên khi chưa có Parent Consent | **P0 (Critical)** | Giữ `parentConsentStatus` ở trạng thái unverified; chặn tuyệt đối đưa học sinh thật vào hệ thống khi chưa qua Gate 4. |
| **RSK-03** | Engineering | Schema Auth đang giả định D-02 Recommendation trước khi duyệt | **P1 (High)** | Ghi nhận trong `CHANGE-IMPACT-LOG.md`; yêu cầu OpenCode không hard-code ràng buộc `NOT NULL` cho các trường pháp lý. |
| **RSK-04** | Algorithm | Thuật toán chẩn đoán CAT/IRT chưa có tài liệu kiểm định | **P1 (High)** | Yêu cầu tạo `docs/ASSESSMENT-ALGORITHM-SPEC.md` trước khi triển khai Step 4. |
| **RSK-05** | UX | Rớt câu hỏi cuối cùng của bài thi (Lỗi prototype) | **P1 (High)** | Đưa vào UAT case `UAT-DIAG-03` kiểm tra nghiệm thu tự động bắt buộc. |
| **RSK-06** | Tooling | `prisma generate` bị lock DLL trên Windows | **RESOLVED** | Dev server và tsc đã đồng bộ; typecheck 0 lỗi. |

---

## 6. Kết Quả Xác Minh Baseline Trước Khi Triển Khai (Baseline Verification - 2026-09-21)

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả | Chi tiết / Bằng chứng |
| :--- | :--- | :---: | :--- |
| **Frontend Build** | `npm run build:prototype` | **PASS** | 1581 modules, exit code 0; bundle JS 809.58 kB minified (Vite cảnh báo chunk > 500 kB) |
| **API Typecheck** | `npm run typecheck` | **PASS** | `tsc -p tsconfig.json --noEmit` hoàn thành với 0 lỗi |
| **API Integration Tests** | `npm run test` | **PASS** | 5/5 test files passed, 10/10 tests passed |
| **Prisma Migrations** | `npx prisma migrate status` | **PASS** | 2 migrations found trong `prisma/migrations/`, schema up to date |
| **API Health Endpoint** | `GET http://localhost:4000/api/v1/health` | **PASS** | HTTP 200 `{ status: "ok", database: "connected", version: "1.0.0" }` |
| **Kho học liệu Legacy** | Kiểm tra filesystem + migration dry-run | **BLOCKED** | Configured path không tồn tại; dry-run dừng với `questions.js not found`, chưa có evidence nguồn 1.472 câu |

---

## 7. Theo Dõi Tiến Độ Thực Hiện 7 Phase Bàn Giao Kỹ Thuật (Phase Execution Tracker)

- [x] **PHASE 1 — FRONTEND FOUNDATION VÀ AUTH THẬT**
  - [x] 1.1 Vite dev proxy `/api` tới `http://localhost:4000` (`vite.config.js`)
  - [x] 1.2 API Client cùng same-origin `/api/v1`, credentials include, chuẩn hóa lỗi, backoff retry GET (`src/lib/apiClient.js`)
  - [x] 1.3 Xóa bỏ hoàn toàn localStorage làm nguồn chuẩn auth/user/role (`src/App.jsx`, `RegisterPage.jsx`)
  - [x] 1.4 App bootstrap gọi `GET /api/v1/auth/me` khôi phục phiên qua HttpOnly cookie (`src/App.jsx`)
  - [x] 1.5 Kết nối form thật: register student, register teacher, login, logout (`src/components/RegisterPage.jsx`)
  - [x] 1.6 Màn hình quản lý phiên tối thiểu (session list & revoke: `src/components/SessionManagementModal.jsx`)
  - [x] 1.7 Route guard & shell phân quyền (`STUDENT`, `TEACHER_APPLICANT`, `TEACHER`, `ADMIN`, `CONTENT_*` trong `App.jsx`, `Sidebar.jsx`, `TeacherPendingView.jsx`, `TeacherClassroomsView.jsx`, `AdminPortalView.jsx`)
- [x] **PHASE 2 — STUDENT END-TO-END VERTICAL SLICE**
  - [x] 2.1 Profile & Onboarding (`GET /student/profile`, `PATCH /student/onboarding`, `/curriculum/*`: `src/components/OnboardingWizard.jsx`)
  - [x] 2.2 Diagnostic attempt start/resume, dynamic questions, KaTeX math (`src/components/DiagnosticTest.jsx`)
  - [x] 2.3 Answer submission, double-submit protection, skip & timeout handling (`src/components/DiagnosticTest.jsx`)
  - [x] 2.4 Diagnostic submit & result report (`GET /diagnostic/results/:id`, bao gồm đầy đủ câu cuối: `src/components/DiagnosticTest.jsx`)
  - [x] 2.5 Mastery overview (`GET /student/mastery`) 4 trạng thái (`src/components/ProfileCompetencyView.jsx`)
  - [x] 2.6 Learning path (`GET /student/learning-path`: `src/components/LearningPathView.jsx`)
  - [x] 2.7 Mistake notebook (`GET /student/mistakes`, `PATCH /student/mistakes/:id`: `src/components/MistakeNotebookView.jsx`)
  - [x] 2.8 Classroom student join (`POST /classrooms/join` Crockford code, transparent notice: `src/components/ClassroomView.jsx`)
- [x] **PHASE 3 — TEACHER END-TO-END VERTICAL SLICE**
  - [x] 3.1 Teacher shell chuyên biệt & trạng thái Teacher Applicant (PENDING/REJECTED/VERIFIED: `src/components/TeacherPendingView.jsx`, `Sidebar.jsx`, `App.jsx`)
  - [x] 3.2 Quản lý lớp học (`GET /classrooms`, `POST /classrooms`, `GET /classrooms/:id`, `GET /classrooms/:id/students`: `src/components/TeacherClassroomsView.jsx`)
  - [x] 3.3 Sinh mã mời Crockford & thu hồi mã mời (`POST /classrooms/:id/invite-codes`, revoke, projector fullscreen: `src/components/TeacherClassroomsView.jsx`)
  - [x] 3.4 Bảo vệ ranh giới dữ liệu cá nhân học sinh (Gate 0 D-04: `src/components/TeacherClassroomsView.jsx`)
  - [x] 3.5 Kiểm thử negative ownership giữa 2 giáo viên (test `classroom.integration.spec.ts`)
- [x] **PHASE 4 — ADMIN VÀ CONTENT WORKFLOW**
  - [x] 4.1 Tổng quan hệ thống `GET /admin/overview` (`src/components/AdminPortalView.jsx`)
  - [x] 4.2 Thẩm định hồ sơ giáo viên (`GET /admin/teachers/applicants`, approve/reject: `src/components/AdminPortalView.jsx`)
  - [x] 4.3 Quản lý câu hỏi (`GET /admin/questions`, `POST /admin/questions`, review: `src/components/AdminPortalView.jsx`)
  - [x] 4.4 Chặn Maker-Checker violation (tác giả không được tự duyệt: `src/components/AdminPortalView.jsx`, `admin.service.ts`)
  - [x] 4.5 Nhật ký kiểm toán `GET /admin/audit-logs` chỉ đọc (`src/components/AdminPortalView.jsx`)
- [x] **PHASE 5 — MIGRATION HỌC LIỆU LEGACY (IMPORTER VERIFIED / CONTENT BLOCKED)**
  - [x] 5.1 Script migration đọc `data/questions.js` và `js/core/topics.js` (`apps/api/scripts/migrate-legacy-questions.ts`)
  - [x] 5.2 Chế độ `--dry-run` xuất báo cáo chi tiết (phân bố, loại trừ, duplicate, IRT, mapping SkillNode)
  - [x] 5.3 Chế độ `--apply` an toàn cho dữ liệu phát triển với trạng thái DRAFT / IN_REVIEW
  - [x] 5.4 Bộ 15 unit tests tự động kiểm thử cú pháp KaTeX và mapper (`apps/api/test/legacy-importer.spec.ts`)
  - [!] 5.5 **BLOCKER:** Đường dẫn source legacy `C:\Users\Administrator\Downloads\KHKT_hòa bình\...` không tồn tại trên hệ thống. Dừng riêng Phase 5 chờ cung cấp source; Gate 3 giữ trạng thái `CONDITIONAL / BLOCKED`.
- [x] **PHASE 6 — UX COMPLETENESS, ACCESSIBILITY VÀ RESPONSIVE**
  - [x] 6.1 Đồng bộ visual system Math Studio (giấy – mực – hổ phách) cho mọi role
  - [x] 6.2 Đủ các trạng thái UX (loading skeleton, empty, inline error, retry, disabled, timeout, forbidden, success)
  - [x] 6.3 Xóa bỏ window.alert(), xóa tài khoản demo hardcoded trong `RegisterPage.jsx`, xóa 100% dead buttons trong `MissionsView.jsx`
  - [x] 6.4 Cuộn an toàn cho công thức KaTeX (`.katex-display { overflow-x: auto; max-width: 100%; }`)
  - [x] 6.5 Bổ sung trang 404 thân thiện (`src/components/NotFoundView.jsx`) và fallback route
  - [x] 6.6 Bổ sung Modal Điều khoản & Bảo mật nhãn DRAFT (`src/components/LegalNoticeModal.jsx` - Gate 0 D-02)
  - [x] 6.7 Keyboard navigation (A/B/C/D, Enter), `:focus-visible` (2px solid #f0642f) & `@media (prefers-reduced-motion: reduce)`
- [x] **PHASE 7 — TEST, DEPLOYMENT VÀ HANDOFF**
  - [x] 7.1 Toàn bộ 8 test files (34 tests) integration và unit test chạy pass 100%
  - [x] 7.2 Bộ unit test API client, error mapping và role routing (`apps/api/test/frontend-client-routing.spec.ts`)
  - [x] 7.3 Kịch bản kiểm thử phục hồi phiên làm bài, timeout, câu cuối, chống nộp trùng (`apps/api/test/diagnostic-resilience.integration.spec.ts`)
  - [x] 7.4 Smoke test 20 concurrent clients pass 100% (546ms wall time, 0 deadlocks/500s: `apps/api/scripts/concurrency-smoke-test.ts`)
  - [x] 7.5 Kiểm tra an toàn bảo mật (CSRF Origin, HttpOnly cookie, Argon2id, RBAC guard, KaTeX sanitization)
  - [x] 7.6 Tài liệu bàn giao hoàn chỉnh (README.md, DEPLOYMENT.md, OPERATIONS-RUNBOOK.md, CLIENT-HANDOFF.md)
  - [x] 7.7 Bằng chứng diễn tập sao lưu & phục hồi toàn vẹn 100% (`docs/evidence/backup/backup_rehearsal.sql` -> `adaptivemath_drill`: 400 users, 254 questions, 1.016 options, 32 skills, 450 sessions, 602 audit logs)
- [ ] **PHASE 8 — ĐÓNG GÓI RELEASE VÀ DỌN DẸP WORKSPACE** (package build/test cùng host đạt; clean environment và E2E trên package còn mở)
  - [x] 8.1 Tạo tài liệu quy chuẩn đóng gói `docs/RELEASE-MANIFEST.md`
  - [x] 8.2 Bảng kê allowlist sạch, denylist loại trừ triệt để secrets, node_modules, cache, dumps
  - [x] 8.3 Bảng kiểm kê cleanup workspace: REMOVED_GENERATED, RETAINED_RELEASE_ASSET, EXCLUDED_FROM_PACKAGE, REVIEW_REQUIRED
  - [x] 8.4 Kiểm chứng toàn bộ build, typecheck, tests trên source bundle sạch (`scripts/package-release.mjs`)
  - [ ] 8.5 Xác minh browser E2E, Docker boot và DB setup từ package; checksum hiện hành nằm ở `release/adaptivemath-release-1.0.0-rc1.zip.sha256`

---

## 8. Kết Luận Nghiệm Thu Kỹ Thuật (Final Technical Handoff Conclusion)

> ### 🏁 TRẠNG THÁI NGHIỆM THU:
> 
> 1. **MỨC 1 — NOT HANDOFF READY.** API tests 35/35, build/typecheck, 12 browser smoke checks và 6 bước package build/test cùng host đạt. Critical browser E2E, WCAG scan, test DB reset và package boot/health còn mở.
> 
> 2. **MỨC 2 — CONTROLLED PILOT GO-LIVE: ⏸️ BLOCKED BY EXTERNAL SIGN-OFF**
>    - Giữ nguyên rào chắn theo nguyên tắc quản trị: Agent không ký thay Product Owner, Academic Lead hoặc Legal Officer.
>    - Kho học liệu legacy 1.472 câu chưa được cung cấp source path vật lý (cần bàn giao file và Academic Lead phê duyệt).
>    - Các quyết định Gate 0 (D-01 đến D-04) và chính sách bảo mật trẻ vị thành niên cần chữ ký chính thức từ Head of Product và Legal & Privacy Officer trước khi mở pilot cho học sinh thật.
