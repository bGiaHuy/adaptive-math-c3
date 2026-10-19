# Ranh giới module

## Quy tắc được máy kiểm tra

`scripts/architecture/check.mjs` dùng parser TypeScript hiện có, không dùng regex để phân tích import.
Nguồn kiểm tra: `src`, `apps/api/src`, `packages/contracts`; tệp ảnh/CSS/JSON được giải quyết đường dẫn nhưng không tham gia đồ thị mã.

| Mã quy tắc             | Điều bị từ chối                                              |
| ---------------------- | ------------------------------------------------------------ |
| `browser-server`       | Trình duyệt import mã API, NestJS, Prisma hoặc Node builtin  |
| `server-browser`       | API import mã trình duyệt                                    |
| `contracts-pure`       | Contracts import thư viện ngoài hoặc mã ngoài package        |
| `domain-pure`          | Miền thuần import ngoài `common/domain`                      |
| `foundation-direction` | `common`/`config` import ngược module nghiệp vụ              |
| `frontend-foundation`  | `lib`/`data`/`shared` import `components`/`features`         |
| `feature-isolation`    | Một frontend feature import feature khác                     |
| `feature-public`       | Consumer ngoài feature import tệp khác `index.js/ts/jsx/tsx` |
| `module-dependency`    | Cạnh API liên module không được khai báo                     |
| `module-public`        | Cạnh API liên module vào tệp không công khai                 |
| `module-registration`  | Module API chưa đăng ký trong policy                         |
| `resolve-import`       | Import tương đối không tồn tại                               |
| `source-scope`         | Import mã tương đối ra ngoài ba vùng nguồn được kiểm tra     |
| `static-import`        | `import()`/`require()` không dùng chuỗi literal              |
| `workspace-public`     | Subpath `@adaptivemath/*` chưa được đăng ký                  |
| `cycle`                | Vòng phụ thuộc tệp, kể cả import type-only                   |

Mỗi hàng có cặp fixture hợp lệ/vi phạm chạy CLI thật tại `tests/architecture.test.mjs`; thư mục tạm được xóa trong `finally` rồi kiểm tra việc xóa. Fixture không đi vào mã sản phẩm.

## Các cạnh API được phép

| Consumer         | Module đích                            |
| ---------------- | -------------------------------------- |
| admin            | auth, prisma, question, curriculum     |
| assignment       | auth, prisma, question, curriculum, ai |
| auth             | prisma                                 |
| classroom        | auth, prisma                           |
| curriculum       | auth, prisma                           |
| diagnostic       | auth, prisma, question, curriculum     |
| student          | auth, prisma, question, curriculum, ai |
| english          | auth, prisma                           |
| health           | prisma                                 |
| ai               | prisma                                 |
| question, prisma | Không có module khác                   |

Giao diện công khai:

- `auth`: `auth.module.ts`, `session-cookie.ts`, hai guard và hai decorator trong policy. `auth.service.ts` là nội bộ.
- `prisma`: `prisma.module.ts`, `prisma.service.ts`.
- `question`: `math-question.ts`, `typed-question.dto.ts`, `question-labels.ts`, `question-label-rubric.ts`, `diagnostic-blueprint.ts`.
- `curriculum`: `thpt-catalog.ts`.
- `ai`: `ai-budget.service.ts`, `ai.config.ts`.
- Contracts: entry DTO hiện hữu và `@adaptivemath/contracts/curriculum.js` cho runtime. Danh mục CommonJS kèm `.d.ts` phục vụ đồng thời API CommonJS và Vite; không đổi module mode của ứng dụng.

`main.ts` và `app.module.ts` là composition root được phép lắp module. Checker không áp chính sách liên module cho composition root nhưng vẫn kiểm tra đường dẫn và vòng.
Đường dẫn `student/math-adaptive.ts` và `diagnostic/diagnostic-blueprint.ts` còn là shim tương thích cho test/script cũ; mã production mới dùng chủ sở hữu mới. Policy không cho module khác sử dụng shim.

## Hướng dẫn cần review, chưa được cưỡng chế hoàn toàn

- Controller chỉ nhận DTO, guard và gọi service; không tự truy cập Prisma.
- Service chịu ownership và transaction; `PrismaService` không phải repository trừu tượng cho mọi bảng.
- Không I/O hoặc thay đổi global trong miền thuần: checker chỉ chặn import, không chứng minh độ thuần tuyệt đối.
- Không đổi response, session cookie, CSRF, quyền giáo viên hoặc thời điểm công bố kết quả trong refactor cấu trúc.
- Không trộn đáp án hiển thị với thuật toán chấm; không hợp nhất `src/lib/irt.js` với thuật toán server khi chưa chứng minh tương đương.
- Giữ toàn bộ hợp đồng trình bày câu hỏi và giới hạn sửa snapshot trong root `AGENTS.md`.
