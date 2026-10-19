# Kế hoạch triển khai AdaptiveMath MVP

**Trạng thái:** ĐANG TRIỂN KHAI — phê duyệt từng mốc (phase gate).
**Ngày:** 2026-09-21
**Nguồn yêu cầu:** `docs/PRD-AdaptiveMath.md` (nghiệp vụ); kế hoạch này ghi nhận phạm vi triển khai kỹ thuật.

> Luật bất biến: Không tuyên bố hoàn tất một mốc khi còn acceptance criterion bắt buộc chưa chạy hoặc chưa đạt. Không `git reset --hard`/thao tác phá hoại. Mọi schema change qua Prisma migration.

---

## 1. Kết quả rà soát prototype (audit)

### 1.1 Bối cảnh kỹ thuật hiện tại

| Hạng mục | Giá trị phát hiện | Ghi chú |
|---|---|---|
| Stack prototype | React 18 + Vite 5, JavaScript (JSX), CSS thuần | `package.json`, `vite.config.js` |
| Routing | State trong `App.jsx` (`currentView`, `activeTab`) — không URL | `src/App.jsx` |
| Data | `localStorage` (`adaptivemath_user/profile/test_results/mistakes`) | `src/App.jsx`, `RegisterPage.jsx` |
| Điểm đến | Landing → Register/Login → Loading → Dashboard → Onboarding 8 bước → Diagnostic 3 câu → results → các tab (dashboard/profile/learning-path/diagnostic/missions/mistakes/classroom) | `src/App.jsx` |
| Diffusion | Prototype build OK: **pass** (`vite build`, 1.593 modules, JS 463.87 kB / gzip 140.42 kB) | đã chạy lại baseline |
| Git | Chưa có repo (`git rev-parse` fail) | sẽ `git init` ở mốc nền móng |
| Trạng thái chrome | `localStorage.clear()` ở logout; prefill account `hocsinh.demo4564…`; role dùng chung sidebar/menu cho cả Student/Teacher | vi phạm PRD |
| Data prototype | Diagnostic **24 topic / 90s/câu**, credit `1472 câu · 92 bài học` trong UI | QA báo **1472 câu** (P1: ngân hàng thật chưa có) |
| Timestamp hard-code | `examDate '05/06/2027'`, `Năm học 2026-2027`, `38 học sinh`, `studentsCount`, `getDaysRemaining` fallback 264 | vi phạm PRD 6/18 |

### 1.2 Đối chiếu với mục "Kết quả rà soát prototype" (PRD §3)

| PRD §3 | Trạng thái code hiện tại | Kế hoạch |
|---|---|---|
| P0: Login giả lập, mật khẩu không xác minh | `RegisterPage.jsx` dùng `setTimeout` chứ không xác thực | Soucelly auth (Step 3) |
| P0: Không RBAC / ownership | Sidebar dùng chung, route không guard | RBAC + scope (Step 3+) |
| P0: Data trong `localStorage` | `App.jsx` `localStorage` | PostgreSQL (Step 2) |
| P0: Mã lớp 4 ký tự tùy ý | `ClassroomView.jsx` nhận mọi code ≥4 | Mã 8 ký tự Crockford + rate limit (Step 5) |
| P1: Topic lớp 9 cho mọi grade | Onboarding luôn hiện GRADE_9_CHAPTERS | Curriculum theo grade (Step 4) |
| P1: `localStorage.clear()` ở logout | `handleLogout` gọi `localStorage.clear()` | Thu hồi session (Step 3) |
| Trả lời thiếu câu cuối | DiagnosticQuiz `userAnswers` + `setTimeout` submit có thể miss | Attempt bất biến (Step 4) |
| Timer hết giờ im lặng reset | `setTimeLeft(prev => prev<=1 ? return 90)` | Ghi timeout/skip (Step 4) |

---

## 2. Kiến trúc mục tiêu (monorepo TypeScript)

```text
adaptivemath/                                   ← npm workspaces root (giữ prototype chạy)
├─ package.json                                 ← root: scripts + workspaces + deps của prototype
├─ index.html · vite.config.js · src/           ← PROTOTYPE giữ nguyên, chạy được
├─ apps/
│  ├─ api/        NestJS 12 REST API (modular monolith)   · /api/v1· /api/docs
│  └─ web/        Next.js 16 App Router (React 19)        · /student /teacher /admin
├─ packages/
│  ├─ contracts/  zod schemas + types dùng chung web↔api
│  └─ config/     eslint + tsconfig base
└─ docker-compose.yml · .env.example · prisma/ (shared schema ở apps/api)
```

**Quyết định chốt:**
- NestJS + NestJS 12 + Prisma 6 LTS (pin lý do: §9) + PostgreSQL 17 + Redis 7 (cache/rate-limit/job; source of truth = PostgreSQL).
- Next.js 16 App Router (React 19) cho web; component prototype giữ lại trong quá trình migration, không viết lại UI một lần.
- DTO chung Zod (frontend validation + Nest DTO validation); shared package `contracts`.
- Vitest + Testing Library (unit/component web), Nest + Vitest + supertest (integration), Playwright (E2E — nhánh riêng, đưa vào mốc 7).
- Session: opaque server-side ID trong cookie `__Host-am_session` (HttpOnly, Secure, SameSite=Lax, Path=/). Không token/JWT/session/password trong `localStorage`. Argon2id (`@node-rs/argon2`, tham số cấu hình). CSRF + Origin/Referer check cho state-changing. `permissionVersion` làm mất hiệu lực session cũ.

---

## 3. Epics & task theo dependency

```text
E0  Nền móng chạy được            (Step 2)
├─ E0.1 Monorepo + workspaces + root scripts
├─ E0.2 docker-compose (postgres, redis) + .env.example
├─ E0.3 apps/api: NestJS skeleton + config validation (zod) + health + OpenAPI + error shape
├─ E0.4 Prisma schema (auth/RBAC + core domain) + migration + seed demo an toàn
├─ E0.5 apps/web: Next.js skeleton + 3 role layouts (/student /teacher /admin) + landing
├─ E0.6 lint/typecheck/unit/integration/build + secret scan    [GATE 0]

E1  Identity + RBAC vertical slice  (Step 3)
├─ E1.1 Register Student / Teacher applicant
├─ E1.2 Login/logout/logout-all · session list/revoke · session rotation
├─ E1.3 Verify email · forgot/reset password
├─ E1.4 Roles/permissions/permissionVersion · RBAC guard + ownership guard
├─ E1.5 Teacher verification state (applicant → pending → verified)
├─ E1.6 Admin invitation (MFA foundation) + admin-only invite endpoints
├─ E1.7 Audit log cho thao tác nhạy cảm
├─ E1.8 User-facing auth UI + middleware để các route /student /teacher /admin
[GATE 1: 401/403/cross-access integration tests pass]

E2  Student vertical slice        (Step 4) — onboarding theo grade, diagnostic (autosave/resume/timeout/idempotent submit), mastery + decision trace, learning path, mistake notebook
E3  Teacher vertical slice        (Step 5) — verification, classroom, join code Crockford+HMAC+expiry/rotate/revoke/rate-limit, assignment lifecycle, dashboard
E4  Admin & content slice         (Step 6) — maker-checker, content workflow draft→in_review→approved→published→retired, audit viewer, immutable question versions
E5  Hardening                     (Step 7) — a11y, CSP/headers, authz matrix tests, backup/restore, structured logs+requestId, analytics, Playwright E2E
```

**Điểm nhánh theo mốc:** mỗi gate build/test được, có thể rollback; không làm schema thủ công.

---

## 4. Migration strategy — giữ prototype

1. Root giữ nguyên: làm npm workspace root + giữ scripts của prototype (`npm run dev` = vite). Prototype chạy ở `/` cho đến khi màn hình tương ứng migrate.
2. Backend thật (NestJS) là nguồn sự thật; UI mới theo từng screen migrate từ prototype (Step 1 → step-by-step).
3. Không xóa prototype; các route mới ở `/student /teacher /admin` từ Next.

---

## 5. Database migration plan

- PostgreSQL local qua docker-compose (`postgres:17-alpine`, port 5432) + Redis (`redis:7-alpine`, port 6379).
- Prisma schema tập trung ở `apps/api/prisma/schema.prisma`; mọi thay đổi qua `prisma migrate dev` (không sửa DB tay).
- Bảng lõi (Step 2–3): `users`, `credentials`, `roles`, `permissions`, `role_permissions`, `user_roles` (+scope/expiry), `sessions` (token_hash, permissionVersion, expires/revoked), `permission_version`, `user_permission_versions`, `teacher_verifications`, `student_profiles`, `email_tokens` (verify/reset, hash + TTL), `admin_invitations`, `mfa_enrollments`+`mfa_challenges` (foundation), `audit_logs` (append-only + hash-chain reference), core content/classroom entity set theo PRD §13.
- Seed chỉ là demo an toàn (mật khẩu demo riêng, không phải dữ liệu học sinh thật; log không chứa password/session/code).
- Attempts/questions: các câu đã dùng trong attempt là bất biến; version bất biến khi đã publish.

---

## 6. Threat model sơ bộ (MVP)

| Mối đe dọa | Giảm thiểu |
|---|---|
| Session theft / XSS đọc token | Cookie HttpOnly + Secure + SameSite=Lax; không token/JWT trong localStorage; CSP |
| CSRF | SameSite=Lax + Origin/Referer check + double-submit CSRF token cho state-changing; Nest guard |
| Credential stuffing / brute force | Argon2id + @nestjs/throttler (IP+account) trên endpoint auth |
| Role tráo không hợp lệ | RBAC guard backend: role/permission theo session DB + ownership/scope; `permissionVersion` thu hồi session cũ; không tin `role` từ client |
| Teacher applicant gian lận | `pending_verification` chưa tạo lớp/xem học sinh; admin duyệt |
| Data rò rỉ giữa lớp | OWner/scope check ở mọi query (classroom owner, student member); integration tests chéo lớp |
| Credential leak vào log | Magic number: không log password/session/reset token/join code; secrets trong .env/.env.example không commit |

---

## 7. Test strategy

- **Unit (web):** Vitest + Testing Library + jsdom — components, form, RBAC-guard rendering, helper (days, mastery).
- **Integration (api):** Nest app + supertest chống PostgreSQL (testcontainers) — auth flow, 401/403, permissionVersion rotation, cross-classroom denial, CSRF.
- **E2E:** Playwright (nhánh riêng, mốc 7) — happy path Student/Teacher/Admin + negative permission path.
- **Static:** ESLint 9 flat config + `tsc --noEmit` (typecheck) ở từng app; `prisma validate` + `prisma migrate status`; secret scan (git + .env không ở trong repo).
- Baseline prototype: `npm run build` trước mỗi thay đổi để chứng minh không break prototype.

---

## 8. Các quyết định Product còn thiếu & assumption tạm thời

Xem `docs/DECISIONS-NEEDED.md`. Các điều KHÔNG tự quyết trong mốc này:
- Grade pilot, loại tài khoản học sinh, tiêu chí xác minh Giáo viên, phạm vi dữ liệu Giáo viên xem được, luật đồng ý dữ liệu trẻ em (Câu hỏi 20.1–20.10).
- Không mở beta học sinh thật trước privacy gate.

Assumption tạm thời cho nền móng (đều reversible, không chạm schema quyết định quan trọng):
- Đăng ký Student/Teacher bằng email + password + verify email (PRD §8.1). Role `teacher` chỉ cấp sau duyệt.
- Teacher DV không có trạng thái publish riêng nhưng có luồng đơn xác minh pending.
- MFA: foundation (enroll/challenge) cho Admin như PRD §8.4; bắt buộc MFA cho Admin, optional cho Teacher theo §11.3/§7.5.
- MVP: một owner teacher / lớp (không co-teacher — PRD bắt buộc).
- Email gửi qua mailer (dev console transport + cấu hình SMTP sẵn), chưa nối provider bên ngoài.

---

## 9. Pinned dependencies & lý do

Bảng đầy đủ trong `docs/DEPENDENCIES-AND-PINS.md`. Điểm chốt:

| Dependency | Version | Lý do |
|---|---|---|
| `prisma`/`@prisma/client` | **6.19.3** (pin LTS) | Prisma 7 dùng driver-adapter + ESM-first + `prisma.config.ts` — thay đổi khá lớn so với NestJS CJS; dùng line 6 LTS ổn định, không cần adapter, giảm rủi ro cho vertical slice đầu; upgrade lên 7 là task riêng có migration. |
| `@node-rs/argon2` | 2.2.1 | Argon2id; prebuilt binary (không cần toolchain build runtime) — tránh node-gyp trên Windows; tham số (memoryCost/timeCost/parallelism) cấu hình được. |
| `zod` | 4.x | DTO chung + runtime validation, tái dùng web/api. |
| `@nestjs/*` | 12.x | Modular monolith theo PRD. |
| `next` | 16.x | App Router, route/layout riêng cho 3 role, deep-link + server guard. |

Tất cả version ghi chính xác trong lockfile (install reproducible); mọi non-trivial dependency có lý do ở trên.

---

## 10. Định nghĩa Xong (Definition of Done) cho mốc

Mọi mốc xác nhận bằng: `npm run build` (prototype) · `npm run typecheck` · `npm run lint` · unit tests · integration tests · `prisma migrate status`/`prisma validate` · secret scan · production build (web/api). Chỉ tuyên bố hoàn tất khi tất cả pass (hoặc xác định lỗi môi trường vs lỗi code, ghi command+output, dùng kiểm chứng thay thế hợp lệ).
