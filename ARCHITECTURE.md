# Kiến trúc Adaptive Math C3

## Phạm vi và nguyên tắc

Repository độc lập: `bGiaHuy/adaptive-math-c3`; mốc trước refactor: `26e6215`.
Thiết kế lấy cảm hứng từ ranh giới rõ ràng và kiểm tra tự động, không áp dụng máy móc các hạn chế của Dune.
Giữ React/Vite và NestJS/Prisma hiện có, chuyển từng phần có bằng chứng; không viết lại toàn bộ.

## Cấu trúc và luồng dữ liệu

```text
src/main.jsx → App.jsx → components (định tuyến hash và điều phối giao diện)
                         ↓
                   lib/apiClient.js, lib/mathTutorStream.js
                         ↓ HTTP /api/v1, cookie HttpOnly
apps/api/src/main.ts → controller + DTO + guards → service → PrismaService → PostgreSQL
                                                   ↓
                            common/domain + question (thuật toán và quy tắc dùng chung)

packages/contracts → dữ liệu/giao kèo độc lập cho cả trình duyệt và server
```

`src/features/<tên>/index.js` là đích di chuyển dần khi có tác vụ cụ thể; hiện chưa chuyển hàng loạt component vào đây.
Các component hiện hữu là vùng kế thừa, không phải bằng chứng rằng mọi phụ thuộc UI đã được phân chia theo tính năng.

## Quyền sở hữu

| Vùng                                                               | Trách nhiệm                                                                                  |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `src/App.jsx`, `lib/mathNavigation.js`                             | Phiên giao diện, hash route, khôi phục tab theo người dùng/vai trò                           |
| `src/components`                                                   | Trình bày và luồng tương tác hiện hữu; `QuestionDisplay` sở hữu giải phẫu câu hỏi dùng chung |
| `src/lib`                                                          | Adapter HTTP/SSE, lưu nháp, navigation, helper trình bày; không phụ thuộc ngược vào UI       |
| `packages/contracts`                                               | DTO hiện hữu và danh mục THPT công khai; không nhập framework/server/trình duyệt             |
| `apps/api/src/common/domain`                                       | Thuật toán học thích ứng không phụ thuộc hạ tầng                                             |
| `modules/question`                                                 | Kiểu câu hỏi, chấm điểm, nhãn và ma trận đề dùng chung                                       |
| `modules/auth`                                                     | Tài khoản, session, cookie, vai trò và xác minh giáo viên                                    |
| `modules/assignment`                                               | Snapshot đề của từng bài giao, nộp bài, chấm lại, audit và tài liệu đề                       |
| `modules/classroom`                                                | Lớp, thành viên và mã mời                                                                    |
| `modules/diagnostic`, `student`                                    | Phiên chẩn đoán và tiến độ/luyện/ôn theo học sinh                                            |
| `modules/curriculum`, `english`, `admin`, `health`, `ai`, `prisma` | Danh mục/tài liệu, học tiếng Anh, quản trị, sức khỏe, ngân sách AI và kết nối DB             |

## Hợp đồng

Danh sách import được phép nằm trong [module-boundaries](docs/architecture/module-boundaries.md) và `scripts/architecture/policy.mjs`.
Module mới phải được đăng ký rõ ràng; không tự mở rộng allowlist để làm checker xanh.
Không tạo barrel xuất mọi service. Giữ giao diện công khai bằng danh sách tệp cụ thể phù hợp NestJS.

Server sở hữu quyền truy cập, đáp án chuẩn, chấm điểm và dữ liệu bền vững. Điều hướng phía client không thay thế phân quyền server.
`App` giữ phiên giao diện; `useRouteState` giữ ngữ cảnh URL; `useDraftState` giữ nháp localStorage; `mathNavigation` giữ tab theo user trong sessionStorage.
API là nguồn sự thật cho kết quả và tiến độ. Demo chỉ hoạt động khi dev chủ động bật; không dùng kết quả giả cho production.

I/O nằm tại adapter HTTP/SSE, service, Prisma hoặc hook lưu trạng thái đã được chỉ rõ. Hàm miền nhận đầu vào, trả kết quả; thời gian hiện có được bảo toàn, chưa ép toàn bộ chuyển sang clock injection.
Service dùng exception NestJS hiện có; filter trả `code`, `message`, `fieldErrors`, `requestId`, `timestamp` và che chi tiết nội bộ. Client giữ `ApiError`, timeout, abort và retry GET; không tự retry mutation.

Sửa câu hỏi của giáo viên chỉ cập nhật snapshot trong bài giao thuộc sở hữu giáo viên, điểm liên quan, revision và audit trong transaction. Không ghi về ngân hàng nguồn, paper chung hoặc bài giao khác. Giữ khóa transaction, preview và hạn chế sửa nội dung khi đã có lượt bắt đầu.

## Kiểm chứng

`npm run lint`, `npm run format:check`, `npm run architecture:check`, `npm run architecture:test`, `npm run typecheck`, `npm run test:frontend`, `npm test`, `npm run build`, `npm run build:api`.
`npm run verify` chạy chuỗi đầy đủ và dừng tại lỗi đầu tiên; hiện bộ API còn lỗi baseline, vì vậy không được tuyên bố toàn bộ verify đạt.

Lint hiện kiểm tra cú pháp và quy ước `debugger`/conflict marker, chưa thay thế ESLint về hooks, accessibility hay kiểu dữ liệu JS.
Prettier chỉ bắt buộc cho nền tảng mới được liệt kê trong script, tránh định dạng lại toàn bộ mã cũ.
Typecheck áp dụng API và contracts; JSX chưa có typecheck ngữ nghĩa.

CI có job nền tảng và job API đầy đủ với PostgreSQL dùng một lần; không có `continue-on-error` hoặc bỏ qua lỗi để báo xanh.
Kiểm tra import dùng AST TypeScript, hỗ trợ import/export/type/require/import động literal, kiểm tra chu trình kể cả cạnh type-only. Alias tùy biến, computed require, eval và loader đặc biệt không phải giao diện được hỗ trợ.

Quy tắc về side effect trực tiếp, bảo mật, snapshot, nội dung toán, kiến trúc state và cấu trúc controller/service là **hướng dẫn cần review và kiểm thử hành vi**, không được coi là đã cưỡng chế hoàn toàn bằng checker import.

## Điểm bắt đầu cho agent

Đọc `AGENTS.md`, tài liệu này, scoped `AGENTS.md` và đúng một gói trong [agent-tasks](docs/architecture/agent-tasks/README.md).
Đọc [báo cáo khảo sát](docs/architecture/reconnaissance.md), [kế hoạch](docs/architecture/refactoring-plan.md), [ADR](docs/architecture/decisions/0001-foundation.md) và [bằng chứng](docs/architecture/verification.md) trước khi đổi quy tắc.
