# Khảo sát trước refactor — 19/10/2026

## Phạm vi đã đọc và kiểm kê

Đã kiểm kê 165 tệp JS/JSX/TS của frontend, API và contracts bằng AST, các import liên module, entry, cấu hình build/test, DTO, Prisma schema/migration, danh sách kiểm thử, root/parent AGENTS và tài liệu dự án liên quan. Đọc sâu bootstrap, routing, client HTTP/SSE, state, guards, exception filter, service chẩn đoán/bài giao và luồng chấm lại. Không khẳng định đã kiểm toán ngữ nghĩa từng dòng trong toàn bộ script nhập dữ liệu/tài liệu học tập.

Stack: React 18, Vite 8, JavaScript JSX; NestJS 12, TypeScript 5, Express, Prisma 5, PostgreSQL; npm workspace, API CommonJS. Không phải Next.js. Frontend chạy hash routing thủ công, lazy component và React state; không có Redux/router ngoài.

Entrypoint: `src/main.jsx` → `App.jsx`; `apps/api/src/main.ts` → `AppModule` → module nghiệp vụ. `/api/v1`, Swagger `/api/docs`, global validation whitelist/forbid/transform, Helmet, request ID, CORS và origin check cho mutation có cookie.

Auth: Argon2, session cookie hoặc Bearer, `validateSession`, kiểm tra vai trò và trạng thái xác minh giáo viên. Ownership nằm cả trong service. Persist chính ở PostgreSQL; localStorage cho nháp/activity, sessionStorage cho tab theo user. AI có budget service và SSE riêng.

`modules/question` đã có chấm ba loại câu hỏi, parser số và rubric; tránh tạo thêm một lớp domain tổng quát. Prisma được gọi trực tiếp trong service, chưa có repository layer. Contracts có DTO nhưng phần lớn JS/API chưa tiêu thụ trực tiếp; không ép chuyển tất cả schema.

## Phát hiện và quyết định

| Phát hiện                                           | Bằng chứng                                                                                        | Xử lý                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| assignment phụ thuộc diagnostic chỉ để dùng ma trận | 3 import từ controller/service/workspace                                                          | Chuyển ma trận sang question, giữ shim                      |
| diagnostic phụ thuộc student chỉ để dùng thuật toán | Import math-adaptive trong diagnostic.service                                                     | Chuyển thuật toán sang common/domain, giữ shim              |
| Browser import trực tiếp server                     | `src/data/thptCurriculum.js` export từ API                                                        | Chuyển danh mục sang contracts runtime chung                |
| Chưa có vòng import                                 | Duyệt đồ thị AST trước/sau                                                                        | Cài phát hiện vòng, không báo đã sửa vòng không tồn tại     |
| Nghiệp vụ tập trung vào component/service lớn       | TeacherClassroomsView 1776 dòng, AdminPortalView 1695, ClassroomView 1066, assignment.service 806 | Tách theo gói độc lập sau baseline                          |
| Logic gần giống nhưng chưa chứng minh trùng         | IRT frontend/server; parser/validation frontend/server                                            | Không hợp nhất công thức hoặc sửa đáp án toán trong lần này |
| Bộ kiểm thử mẫu cũ không khớp THPT                  | Test tạo lớp grade 9 bị DTO từ chối, test pause gọi DB không như kỳ vọng                          | Gói Codex xác định hợp đồng; không sửa expectation tùy tiện |
| Cấu hình deploy kế thừa                             | render.yaml còn chỉ repo math, URL frontend cũ                                                    | Không deploy; dành gói riêng sau xác nhận hạ tầng C3        |

## Baseline thực tế trước sửa mã sản phẩm

- `node --test tests/*.test.mjs`: 23 đạt.
- `npm run typecheck`: đạt cho API.
- `npm run build`: đạt.
- `npm test`: 31 tệp; 24 đạt, 7 lỗi; 172 test đạt, 11 lỗi, 14 bỏ qua do setup suite lỗi. Không phải baseline xanh.
- Hồi quy tập trung 7 tệp về thuật toán, ma trận, quyền, workspace/chấm và route: 57/57 đạt trước di chuyển.

Git ban đầu thuộc kho cha `adaptive-learning`, C3 chưa được theo dõi; đã tạo Git độc lập và repo private theo yêu cầu, snapshot `26e6215`, refactor trên `codex/architecture-foundation`. Không đưa mã C3 vào repo Math cũ.
Không reset công việc khác. Các script `dev:local`/`materials:*` hiện hữu được giữ nguyên khi bổ sung script kiểm chứng.

## Giới hạn kiểm kê

Không đăng nhập production, không xác minh cấu hình cloud, không thay schema/data nguồn. Chưa có test browser tự động được chạy cho lần refactor này; build thành công không chứng minh trải nghiệm end-to-end. Không tự quyết định sửa test THCS hay bật/tắt ngân hàng THPT để làm suite xanh.
