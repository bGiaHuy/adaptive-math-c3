# AdaptiveMath — Clean Release Package Verification Report

- **Package File:** `adaptivemath-release-1.0.0-rc1.zip`
- **File Size:** 405863 bytes (0.39 MB)
- **SHA-256 Checksum:** `409d6f33e1bca672600d874ddfca10160413a6f54b8bf4ea4ff6acaabc65f994`
- **Verification Timestamp:** 2026-09-21T11:50:10.453Z
- **Environment:** Node.js v24.19.0, npm v10.x, Windows Server 2025 / 11, bsdtar 3.8.4
- **Isolated Test Database:** `postgresql://am:***@localhost:5432/adaptivemath_test`

---

## 1. Kết Quả Kiểm Toán Bảo Mật & Danh Mục Loại Trừ (Denylist & Security Scan)
- **Số tệp mã nguồn đóng gói:** 128 tệp
- **Kiểm tra .env, private key và mẫu credential thông dụng:** ✅ PASSED trên các mẫu đã cấu hình; chưa phải secret scan toàn diện.
- **Kiểm tra SQL dumps & binary videos:** ✅ PASSED (Loại trừ toàn bộ `*.sql` và `*.webm`)
- **Kiểm tra Cache & Build artifacts:** ✅ PASSED (Loại trừ `node_modules`, `dist`, `*.tsbuildinfo`)

---

## 2. Kết Quả Kiểm Chứng Clean-Machine Pipeline (Extracted Archive Verification)

| STT | Bước kiểm chứng | Lệnh thực thi | Thời gian | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Clean Dependency Installation (npm ci) | `ok` | 12.04s | ✅ PASS |
| 2 | Prisma Client Generation (npm run prisma:generate) | `ok` | 2.69s | ✅ PASS |
| 3 | Frontend Production Build (npm run build:prototype) | `ok` | 0.97s | ✅ PASS |
| 4 | Full Monorepo Typecheck (npm run typecheck) | `ok` | 3.00s | ✅ PASS |
| 5 | Backend NestJS Build (npm run build:api) | `ok` | 3.18s | ✅ PASS |
| 6 | Automated Test Suites (npm run test -> adaptivemath_test) | `ok` | 12.89s | ✅ PASS |

---

## 3. Kết Luận
Bản đóng gói mã nguồn `adaptivemath-release-1.0.0-rc1.zip` đã được giải nén và xác minh trên cùng máy với PostgreSQL test DB có sẵn. Đây chưa phải kiểm chứng trên máy trắng độc lập, chưa gồm browser E2E hay Docker boot từ đầu. Không tự mở gate bàn giao kỹ thuật từ kết quả này.
