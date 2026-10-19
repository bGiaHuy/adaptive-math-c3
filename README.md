# AdaptiveMath — Nền Tảng Học Toán Thích Ứng THCS GDPT 2018

> **Math riêng đã phát hành 14/10/2026:** [Mở site Math](https://adaptivemath-blush.vercel.app). Biểu đồ năng lực và gia sư hỏi tiếp bài ôn đã kiểm chứng production với MWAPI thật; backend/database tách khỏi Adaptive English. Database mới có 8 kỹ năng tham chiếu, chưa có ngân hàng câu hỏi chính thức đã xuất bản. Xem [bằng chứng kỹ thuật](docs/evidence/math-tutor/live/FINAL-AUDIT.json); không đồng nghĩa đã đạt các sign-off nội dung/pilot toàn sản phẩm.

> **Rà soát task 14/10/2026:** Xem [biểu đồ năng lực, chatbot/AI và đối chiếu Vercel–Supabase–Resend](docs/COMPETENCY-AND-CHATBOT-TASKS.md) để phân biệt phần đã có, backlog và tiêu chí nghiệm thu.

> **Cập nhật Math 09/10/2026:** Đã bổ sung chẩn đoán 3PL/MAP, vòng luyện theo chủ đề, BKT và lộ trình theo ngày. Tham số còn tạm, chưa triển khai database đích; xem [bản sửa và giới hạn](docs/MATH-ADAPTIVE-UPDATE.md). Adaptive English được giữ nguyên.

> **Trạng Thái Kỹ Thuật (Release Status):** `PILOT GO-LIVE BLOCKED BY EXTERNAL SIGN-OFF`  
> **Phiên bản:** 1.0.0 (Tháng 09/2026)  
> **Kiến trúc:** Monorepo (Vite + React 18 SPA, NestJS + Prisma REST API, PostgreSQL 16)  
> **Ngôn ngữ thiết kế:** Math Studio ("Giấy kẻ - Mực tối - Điểm nhấn Hổ phách/Amber")

---

## 1. Tổng Quan Dự Án

AdaptiveMath là hệ thống học tập toán học cá nhân hóa thích ứng (Adaptive Learning) bám sát Chương trình Giáo dục phổ thông 2018 (SGK Kết nối tri thức với cuộc sống), định hướng ôn thi tuyển sinh vào lớp 10. Hệ thống tích hợp thuật toán thích ứng CAT (Computerized Adaptive Testing) trên mô hình IRT 3 tham số, bẫy tư duy sư phạm (Misconceptions), sổ tay lỗi sai cá nhân hóa và cổng quản lý lớp học tuân thủ phân tách dữ liệu sư phạm nghiêm ngặt.

---

## 2. Kiến Trúc Kỹ Thuật (System Architecture)

```
                       ┌─────────────────────────────────────┐
                       │   Client Trình Duyệt / Mobile PWA   │
                       │   (React 18 + Vite + KaTeX Engine)  │
                       └──────────────────┬──────────────────┘
                                          │ Same-Origin / Reverse Proxy
                                          ▼
                       ┌─────────────────────────────────────┐
                       │   NestJS 12 Modular Backend API     │
                       │   - Argon2id Password Hashing       │
                       │   - HttpOnly Cookie Sessions        │
                       │   - Crockford Base32 HMAC Invites   │
                       │   - Maker-Checker Content Workflow  │
                       │   - Security Immutable Audit Logs   │
                       └──────────────────┬──────────────────┘
                                          │ Prisma ORM
                                          ▼
                       ┌─────────────────────────────────────┐
                       │   PostgreSQL 16 Relational DB       │
                       │   - 242 Ngân hàng câu hỏi Toán 9    │
                       │   - 24 Kỹ năng GDPT 2018 KNTT       │
                       │   - Session & Permission Versioning │
                       └─────────────────────────────────────┘
```

### Các Module Cốt Lõi:
1. **Auth & Identity:** Đăng ký, đăng nhập, phân quyền RBAC (Student, Teacher Applicant, Verified Teacher, Admin, Content Author, Reviewer), vô hiệu hóa session cache đa thiết bị qua `permissionVersion`.
2. **Student Experience:** Onboarding Wizard mục tiêu học tập, bài kiểm tra chẩn đoán thích ứng CAT/IRT, bảng tổng hợp độ thành thạo kỹ năng, lộ trình học đề xuất và sổ tay lỗi sai.
3. **Teacher Portal:** Quản lý lớp học, sinh mã mời Crockford Base32, chiếu máy chiếu toàn màn hình, bảng danh sách học sinh tuân thủ bảo vệ dữ liệu cá nhân (Gate 0 D-04: Giáo viên xem tiến độ chung, không xâm phạm sổ tay lỗi sai cá nhân).
4. **Admin & Content Governance:** Thẩm định hồ sơ giáo viên ứng tuyển, biên soạn câu hỏi, duyệt câu hỏi theo quy chuẩn Maker-Checker (Tác giả không được tự duyệt câu của mình), nhật ký kiểm toán bất biến (Audit Logs).

---

## 3. Hướng Dẫn Cài Đặt Khởi Chạy Từ Máy Trắng (Clean Machine Setup)

### Yêu Cầu Tiên Quyết:
- **Node.js:** `>= 20.16.0` (Khuyến nghị `20.x` hoặc `22.x LTS`)
- **npm:** `>= 10.x`
- **PostgreSQL:** `>= 16` (hoặc Docker để chạy container PostgreSQL)
- **Git:** phiên bản mới nhất

### Bước 1: Clone kho lưu trữ mã nguồn
```bash
git clone https://github.com/your-org/adaptivemath.git
cd adaptivemath
```

### Bước 2: Cài đặt Dependencies toàn bộ Monorepo
```bash
npm install
```

### Bước 3: Thiết lập Biến Môi Trường (Environment Variables)
Tạo file `.env` tại thư mục gốc của API `apps/api/.env` từ file mẫu:
```bash
cp apps/api/.env.example apps/api/.env
```
Nội dung file cấu hình cơ bản:
```env
NODE_ENV=development
PORT=4000
WEB_URL=http://localhost:3000

POSTGRES_USER=am
POSTGRES_PASSWORD=am_dev_password
POSTGRES_DB=adaptivemath
POSTGRES_PORT=5432
DATABASE_URL="postgresql://am:am_dev_password@localhost:5432/adaptivemath?schema=public"

SESSION_SECRET=adaptivemath_dev_session_secret_key_at_least_32_chars_long
SESSION_COOKIE_NAME=am_session
SESSION_TTL_SECONDS=604800

INVITE_CODE_HMAC_SECRET=adaptivemath_dev_invite_code_hmac_secret_key_32_chars

ARGON_MEMORY_COST=19456
ARGON_TIME_COST=2
ARGON_PARALLELISM=1
```

### Bước 4: Khởi chạy Cơ Sở Dữ Liệu PostgreSQL
Nếu sử dụng Docker:
```bash
docker run -d \
  --name am-postgres \
  -e POSTGRES_USER=am \
  -e POSTGRES_PASSWORD=am_dev_password \
  -e POSTGRES_DB=adaptivemath \
  -p 5432:5432 \
  postgres:16-alpine
```

### Bước 5: Đồng bộ Schema & Nạp Dữ Liệu Khởi Tạo (Seed)
```bash
# 1. Sinh Prisma Client
npm run prisma:generate

# 2. Chạy Migration DB
npm run prisma:push

# 3. Nạp dữ liệu mẫu ban đầu (Tài khoản mẫu & 8 kỹ năng pilot cốt lõi)
npm run prisma:seed
```

### Bước 6: Di chuyển Ngân hàng Câu hỏi GDPT 2018 (Migration Script)
```bash
# Kiểm thử toàn vẹn dữ liệu trước khi ghi (Dry Run)
npx ts-node apps/api/scripts/migrate-legacy-questions.ts --dry-run

# Ghi dữ liệu chính thức vào PostgreSQL (Toán 9 GDPT 2018)
npx ts-node apps/api/scripts/migrate-legacy-questions.ts --apply --grade=9
```

### Bước 7: Khởi chạy Môi Trường Phát Triển (Development)
Khởi chạy song song Backend API và Frontend:

**Terminal 1 (Backend API - Port 4000):**
```bash
npm run dev:api
# API chạy tại: http://localhost:4000
# Swagger API Docs: http://localhost:4000/api/docs
# Healthcheck: http://localhost:4000/api/v1/health
```

**Terminal 2 (Frontend Client - Port 3000):**
```bash
npm run dev:prototype
# Frontend chạy tại: http://localhost:3000 (Proxy reverse /api -> localhost:4000)
```

---

## 4. Danh Sách Tài Khoản Hệ Thống & Dữ Liệu Mẫu (System & Mock Data Accounts)

### A. Quản Trị Hệ Thống Trong Môi Trường Sản Xuất (Production Governance)
> [!IMPORTANT]
> **Tuân thủ An toàn & Bảo mật Thông tin:**
> - Toàn bộ thông tin định danh và tài khoản quản trị thực tế (Production Admins) **tuyệt đối không được ghi trong tài liệu mã nguồn (README/Docs)** để tuân thủ tiêu chuẩn an toàn thông tin OWASP/ISO 27001.
> - Tài khoản quản trị sản xuất được khởi tạo độc lập qua quy trình an toàn (Secret Manager / Internal CLI) trong môi trường staging/production.
> - **Cảnh báo Rotation:** Nếu có bất kỳ tài khoản thực tế nào từng được ghi chép trong tài liệu hoặc dùng mật khẩu mặc định, đội ngũ vận hành cần thực hiện **đổi mật khẩu (Credential Rotation)** ngay lập tức trước khi triển khai chính thức.


### B. Tài khoản Dữ liệu Mẫu (Mock Data Accounts - Phục vụ Demo & Kiểm thử)
Toàn bộ tài khoản mock data đều được gắn nhãn `(Mock Data)` trên toàn bộ hệ thống:

| Phân Quyền (Role) | Tên đăng nhập (Username) | Email | Mật khẩu mặc định | Mục đích kiểm thử (Mock Data) |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin` | `admin@adaptivemath.vn` | `P@ssword123!` | [Mock Data] Super Admin mẫu |
| **Giáo viên Đã duyệt (TEACHER)** | `thaynam` | `thaynam@adaptivemath.vn` | `P@ssword123!` | [Mock Data] Thầy Nguyễn Văn Nam (Lớp 9A1) |
| **Hồ sơ xin duyệt (APPLICANT)** | `co_thu_trang` | `thu.trang@thcsthanglong.edu.vn` | `P@ssword123!` | [Mock Data] Cô Phạm Thu Trang (Chờ duyệt ở Admin Portal) |
| **Giáo viên Chờ duyệt (APPLICANT)** | `teacher_pending` | `teacher.applicant@adaptivemath.vn` | `P@ssword123!` | [Mock Data] Cô Lê Thị Mai |
| **Học sinh (STUDENT)** | `duc_nguyen` | `hocsinh.demo4564@adaptivemath.vn` | `P@ssword123!` | [Mock Data] Nguyễn Minh Đức (Làm bài CAT, lộ trình) |

> **Mã mời lớp học mẫu (Crockford Base32):** `KTR2QX79` (Lớp 9A1 - Thầy Nguyễn Văn Nam [Mock Data])

---

## 5. Kiểm Thử Tự Động & Đảm Bảo Chất Lượng (Quality Assurance)

```bash
# 1. Kiểm tra tĩnh kiểu dữ liệu (TypeScript No-Emit)
npm run typecheck

# 2. Đóng gói kiểm chuẩn Frontend Production
npm run build:prototype

# 3. Chạy toàn bộ Test Suites (Vitest Unit & Integration & E2E)
npm run test

# 4. Chạy kiểm thử tải đồng thời 20 Clients (Reliability Smoke Test)
npx ts-node apps/api/scripts/concurrency-smoke-test.ts
```

---

## 6. Cấu Trúc Thư Mục Repository

```
adaptivemath/
├── apps/
│   └── api/                     # Backend NestJS REST API
│       ├── prisma/              # Schema PostgreSQL & Seed script
│       │   ├── schema.prisma    # Data models (Users, Questions, Attempts, Audit)
│       │   └── seed.ts          # Seed dữ liệu mặc định
│       ├── scripts/             # CLI Utilities
│       │   ├── migrate-legacy-questions.ts  # Script di chuyển kho câu hỏi cũ
│       │   └── concurrency-smoke-test.ts    # Stress test 20 clients
│       ├── src/
│       │   ├── modules/         # Auth, Student, Teacher, Classroom, Admin, Diagnostic
│       │   └── main.ts          # Server bootstrap
│       └── test/                # Integration & E2E Test Suites
├── src/                         # Frontend React 18 SPA
│   ├── components/              # Math Studio UI Components
│   │   ├── AdminPortalView.jsx
│   │   ├── ClassroomView.jsx
│   │   ├── DiagnosticTest.jsx
│   │   ├── MathRenderer.jsx
│   │   ├── MistakeNotebookView.jsx
│   │   ├── SessionManagementModal.jsx
│   │   └── TeacherClassroomsView.jsx
│   ├── lib/
│   │   └── apiClient.js         # Production API Client (HttpOnly cookies, exponential retry)
│   ├── index.css                # Math Studio Typography & Design Tokens
│   └── App.jsx                  # Main Application Shell
├── docs/                        # Tài liệu nghiệp vụ, bàn giao & vận hành
│   ├── deployment/              # Hướng dẫn Deploy Docker / Production
│   ├── operations/              # Quy trình sao lưu, phục hồi & vận hành
│   ├── handoff/                 # Báo cáo bàn giao nghiệm thu kỹ thuật
│   └── product/                 # Decision logs, Content readiness, Release readiness
├── package.json                 # Monorepo configuration
└── vite.config.js               # Reverse proxy cấu hình
```

---

## 7. Tuyên Bố Trạng Thái Bàn Giao (Release Status)

Dự án hiện đạt mức:  
**PILOT GO-LIVE BLOCKED BY EXTERNAL SIGN-OFF**

> [!WARNING]
> **Tuyệt đối KHÔNG được tự tuyên bố project là ready, handoff ready hoặc pilot ready nếu chưa có legal, privacy và academic sign-off chính thức.**

- **Phần Kỹ thuật (Engineering):** Đã hoàn tất cài đặt các tính năng cốt lõi, kiểm thử tự động, tối ưu hóa bundle và tài liệu kỹ thuật. Hệ thống KHÔNG tự tuyên bố handoff ready hoặc pilot ready khi chưa có các phê duyệt bên ngoài bắt buộc.
- **Phần Học thuật & Pháp lý (Academic & Legal):** Đang chờ chữ ký phê duyệt thực tế của Academic Content Lead (Gate 3) và Legal Officer (Gate 0 D-01..D-04) trước khi tiến hành Controlled Pilot trên học sinh thực tế.
