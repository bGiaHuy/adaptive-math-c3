# AdaptiveMath — Release Manifest & Packaging Specification

> **Hiệu chỉnh 2026-09-21:** Script tạo gói từ staging allowlist của working tree **UNCOMMITTED**. Quy trình giải nén/kiểm tra chạy trên cùng host với DB test có sẵn; browser E2E và Docker boot chưa được chạy trên gói. Trạng thái hiện hành **NOT HANDOFF READY**. Xem `docs/product/ACCEPTANCE-AUDIT-2026-09-21.md`.

> **Phiên bản:** 1.0.0-rc1 (Technical Handoff Package)  
> **Ngày đóng gói:** 2026-09-21  
> **Tệp nén phân phối:** `release/adaptivemath-release-1.0.0-rc1.zip`  
> **Mã băm SHA-256:** đọc tệp checksum bên ngoài gói; manifest nằm trong gói nên không tự ghi hash của chính gói.  
> **Tệp checksum:** `release/adaptivemath-release-1.0.0-rc1.zip.sha256`  
> **Môi trường:** Node.js v24.x LTS, npm v10.x, PostgreSQL 16/17, Redis 7-alpine  
> **Trạng thái Release:** `NOT HANDOFF READY` — cần tạo lại và xác minh gói hiện hành

---

## 1. Mục Đích & Nguyên Tắc Đóng Gói (Packaging Principles)

Mục tiêu của gói bàn giao kỹ thuật là cung cấp một bản phân phối mã nguồn tinh gọn, hoàn toàn tái lập được từ máy trắng (Clean Machine Reproducible), loại bỏ toàn bộ dữ liệu bí mật (secrets, credentials), bộ nhớ đệm (build caches), và các artifact trung gian không cần thiết.

Hệ thống phân biệt rõ 3 phân loại tài sản:
1. **Source Release Package:** Mã nguồn hoàn chỉnh, cấu hình docker-compose, tài liệu hướng dẫn vận hành, kịch bản di chuyển dữ liệu và bộ kiểm thử tự động.
2. **Demo Evidence Bundle:** Bằng chứng kiểm thử (kết quả integration test, biên bản diễn tập phục hồi dữ liệu, kết quả kiểm thử tải 20 clients đồng thời).
3. **Generated Build Output:** Thư mục `dist/`, `.tsbuildinfo`, test caches — chỉ sinh ra trong quá trình build/test, không đóng gói vào source bundle.

---

## 2. Danh Mục Cho Phép (Package Allowlist)

Các thành phần bắt buộc được đóng gói trong bản bàn giao kỹ thuật:

| Thành phần | Đường dẫn | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Root Configs** | `package.json`, `package-lock.json`, `vite.config.js`, `index.html` | Cấu hình Monorepo, khóa phiên bản dependency, Vite bundler |
| **Frontend Source** | `src/` (Components, Data, Libs, CSS, Assets) | Giao diện Math Studio hoàn chỉnh cho Student, Teacher, Admin, 404, Legal Modal |
| **API Backend Source** | `apps/api/src/` | 6 module NestJS API (auth, curriculum, student, diagnostic, classroom, admin) |
| **Database Migrations** | `apps/api/prisma/migrations/`, `schema.prisma`, `seed.ts` | Cấu trúc dữ liệu PostgreSQL chuẩn hóa, migration snapshots |
| **Operations Scripts** | `apps/api/scripts/` | `concurrency-smoke-test.ts`, `migrate-legacy-questions.ts`, `verify-backup-rehearsal.ts` |
| **Automated Test Suite**| `apps/api/test/` | 8 bộ kiểm thử tự động (34 test cases bao phủ 100% critical paths) |
| **Shared Contracts** | `packages/contracts/` | Các định nghĩa kiểu dữ liệu và schema dùng chung |
| **Container & Infra** | `docker-compose.yml`, `.env.example`, `apps/api/.env.example`, `.gitignore` | Cấu hình hạ tầng container PostgreSQL & Redis cục bộ |
| **Tài liệu Bàn giao** | `README.md`, `docs/deployment/DEPLOYMENT.md`, `docs/operations/OPERATIONS-RUNBOOK.md`, `docs/handoff/CLIENT-HANDOFF.md`, `docs/BACKUP-AND-RESTORE.md` | Hướng dẫn cài đặt, vận hành, xử lý sự cố và bàn giao cho khách hàng |
| **Product Governance**| `docs/product/` (RELEASE-READINESS, UAT-TRACEABILITY, CHANGE-IMPACT-LOG, DECISION-LOG, CONTENT-READINESS) | Bảng theo dõi tiến độ, ma trận UAT, nhật ký quyết định và rào chắn Gate 0..5 |

---

## 3. Danh Mục Loại Trừ Tuyệt Đối (Package Denylist / Exclusions)

Các file/thư mục sau đây **tuyệt đối không được đưa vào package release** và được chặn bởi `.gitignore`:

| Hạng mục loại trừ | Pattern / Đường dẫn | Lý do loại trừ |
| :--- | :--- | :--- |
| **Bí mật & Credentials** | `.env`, `.env.production`, `apps/api/.env`, `*.pem`, `*.key` | Rủi ro rò rỉ secret session keys, DB passwords, salt |
| **Dependencies** | `node_modules/`, `apps/*/node_modules/` | Quá lớn, phải được cài đặt sạch qua `npm ci` |
| **Generated Build** | `dist/`, `apps/*/dist/`, `build/`, `.next/` | Artifact phái sinh, phải được tái tạo từ source |
| **Build Caches** | `*.tsbuildinfo`, `.turbo/`, `.eslintcache`, `apps/api/tsconfig.tsbuildinfo` | Cache trình biên dịch có thể gây sai lệch build |
| **Nhật ký & Logs** | `*.log`, `npm-debug.log*` | Chứa dữ liệu vận hành tạm thời |
| **Test Output** | `coverage/`, `playwright-report/`, `test-results/`, `.ui-audit/` | Báo cáo kiểm thử trung gian |
| **Dữ liệu Database Dump**| `*.db-journal`, `backup_rehearsal.sql` | Chứa dữ liệu kiểm thử lớn và mã băm mật khẩu, chỉ lưu tại kho bằng chứng riêng |
| **File Hệ điều hành** | `.DS_Store`, `Thumbs.db`, `desktop.ini`, `*.swp` | Metadata cục bộ của Windows/macOS |

---

## 4. Lệnh Tái Tạo Package & Kiểm Chứng (Packaging Command)

Để tạo bản release bundle từ môi trường sạch, quét bí mật, nén và tự động kiểm chứng toàn bộ quy trình:

```bash
# Thực hiện toàn bộ quy trình đóng gói, rà soát bí mật và kiểm chứng máy trắng:
npm run package:release
```

Quy trình tự động (`scripts/package-release.mjs`) thực thi các bước tuần tự:
1. Dọn dẹp các thư mục staging và verification tạm thời.
2. Thu thập các tệp nguồn sạch theo allowlist vào `.release_staging/adaptivemath`.
3. Rà soát tự động 0 bí mật (.env, private keys), 0 database dumps (*.sql), 0 media lớn (*.webm) và 0 cache (.tsbuildinfo, node_modules).
4. Đóng gói vào `release/adaptivemath-release-1.0.0-rc1.zip` bằng công cụ chuẩn `bsdtar`.
5. Tạo mã băm SHA-256 và lưu vào `release/adaptivemath-release-1.0.0-rc1.zip.sha256`.
6. Trích xuất archive vào môi trường tạm thời độc lập `.temp_release_verify`, chạy pipeline kiểm chứng máy trắng:
   - `npm ci`
   - `npm run prisma:generate`
   - `npm run build:prototype`
   - `npm run typecheck`
   - `npm run build:api`
   - `npm run test` (35/35 tests pass trên database `adaptivemath_test` có sẵn trên host)
7. Dọn dẹp thư mục tạm và xuất biên bản `docs/evidence/RELEASE-VERIFICATION-REPORT.md`.

---

## 5. Bảng Kiểm Kê & Dọn Dẹp Workspace (Workspace Cleanup Table)

| Trạng thái | Đường dẫn file / thư mục | Lý do | Người chịu trách nhiệm / Evidence | Khả năng khôi phục |
| :--- | :--- | :--- | :--- | :--- |
| `EXCLUDED_FROM_PACKAGE` | `apps/api/tsconfig.tsbuildinfo`, `dist/`, `apps/api/dist/` | Build output/cache trong workspace phát sinh khi chạy dev/test local | Release Engineer; tự động loại trừ khỏi release bundle | Tự động sinh lại khi biên dịch |
| `RETAINED_RELEASE_ASSET`| `src/components/NotFoundView.jsx` | Trang 404 chuẩn Math Studio đáp ứng Phase 6 | Frontend Lead | Mã nguồn mới trong repo & release package |
| `RETAINED_RELEASE_ASSET`| `src/components/LegalNoticeModal.jsx` | Modal Điều khoản & Bảo mật (Draft Gate 0 D-02) | Product Owner / Legal | Mã nguồn mới trong repo & release package |
| `RETAINED_RELEASE_ASSET`| `apps/api/test/legacy-importer.spec.ts` | Bộ test tự động kiểm thử KaTeX và mapper Phase 5 | QA / Content Engineer | Mã nguồn mới trong repo & release package |
| `RETAINED_RELEASE_ASSET`| `apps/api/test/diagnostic-resilience.integration.spec.ts` | Test khôi phục phiên, timeout, câu cuối, chống trùng | Release Engineer | Mã nguồn mới trong repo & release package |
| `RETAINED_RELEASE_ASSET`| `apps/api/test/frontend-client-routing.spec.ts` | Test API client và phân quyền route shells | Frontend Lead | Mã nguồn mới trong repo & release package |
| `RETAINED_RELEASE_ASSET`| `apps/api/.env.example` | File cấu hình mẫu cho backend | DevOps | Mã nguồn mới trong repo & release package |
| `EXCLUDED_FROM_PACKAGE` | `docs/evidence/backup/backup_rehearsal.sql` | Dữ liệu SQL dump phục vụ diễn tập khôi phục (đã chuyển vào thư mục bằng chứng và chặn bởi `.gitignore`) | SRE / Database Admin | Lưu trữ tại thư mục bằng chứng (Evidence), không đóng gói trong source release |
| `EXCLUDED_FROM_PACKAGE` | `AdaptiveMath_Demo_Official_FullHD.webm` | Video demo nghiệm thu người dùng (80MB+) | Product Owner | Lưu trữ tại kho media nghiệm thu, không đóng gói trong source release |
| `REMOVED_GENERATED` | `docs/ANTIGRAVITY-GOAL.md`, `docs/ANTIGRAVITY-PRODUCT-UX-PROMPT.md`, `docs/ANTIGRAVITY-LAUNCH-COMPLETION-PROMPT.md`, `docs/IMPLEMENTATION-AGENT-PROMPT.md` | Prompt điều phối agent đã hết vai trò; tài liệu sản phẩm và kế hoạch được giữ | Kiểm toán workspace 2026-09-21 | File tracked có thể khôi phục từ Git; prompt untracked không có bản Git |
