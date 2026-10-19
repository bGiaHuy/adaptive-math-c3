# Báo cáo nền tảng kiến trúc Adaptive Math C3

## Tóm tắt điều hành

Đã tạo repo GitHub riêng tư `bGiaHuy/adaptive-math-c3`, tách Git khỏi kho cha, đẩy snapshot `26e6215` lên `main` trước refactor. Thực hiện nền tảng trên `codex/architecture-foundation`.

Đã cài checker AST với 16 quy tắc import/chu trình, chứng minh bằng fixture đúng/sai chạy CLI thật, thêm lint cú pháp, formatting có phạm vi, typecheck contracts và CI. Đã sửa ba vấn đề sở hữu mã bằng thay đổi có shim tương thích: thuật toán thích ứng, ma trận đề và danh mục THPT dùng chung. Không thay công thức, auth, schema, payload hoặc UI.

Đây là ranh giới nền tảng đã kiểm chứng, không phải hoàn tất mọi khoản nợ kiến trúc của ứng dụng.

## Trước và sau

| Trước                                            | Sau                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| C3 là thư mục chưa theo dõi trong kho cha        | Git độc lập, remote repo private C3                                   |
| assignment → diagnostic để lấy ma trận           | assignment → question                                                 |
| diagnostic → student để lấy thuật toán           | diagnostic/student → common/domain                                    |
| frontend import danh mục từ source API           | Hai runtime dùng contracts CommonJS kèm declaration                   |
| Không có kiến trúc được máy kiểm tra             | Policy module/public file, đồ thị vòng, fixture đối kháng             |
| Chỉ typecheck API, không lint/format/CI riêng C3 | Script kiểm chứng rõ ràng, typecheck contracts, hai job CI            |
| UI phẳng, service lớn                            | Vẫn kế thừa có chủ đích; có gói migration hẹp, không viết lại toàn bộ |

## Các thay đổi đã triển khai

| Tệp                                                                                                                 | Lý do                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `scripts/architecture/check.mjs`, `policy.mjs`, `lint.mjs`                                                          | Parser, policy, vòng phụ thuộc và kiểm tra cú pháp/quy ước                    |
| `tests/architecture.test.mjs`                                                                                       | 16 cặp đúng/sai và một kiểm tra cú pháp import; xóa fixture tạm               |
| `.prettierrc.json`, `.prettierignore`                                                                               | Định dạng nhất quán có phạm vi                                                |
| `.github/workflows/architecture.yml`                                                                                | Job nền tảng và toàn bộ API với PostgreSQL riêng                              |
| `package.json`, `package-lock.json`                                                                                 | Scripts, Prettier, khai báo TypeScript harness và contracts trực tiếp         |
| `apps/api/package.json`, `packages/contracts/package.json`, `packages/contracts/tsconfig.json`                      | Dependency runtime và typecheck/build contracts                               |
| `apps/api/src/common/domain/math-adaptive.ts`                                                                       | Chủ sở hữu mới của thân thuật toán không đổi                                  |
| `apps/api/src/modules/student/math-adaptive.ts`                                                                     | Shim giữ export cũ                                                            |
| `apps/api/src/modules/question/diagnostic-blueprint.ts`                                                             | Chủ sở hữu mới của ma trận dùng chung                                         |
| `apps/api/src/modules/diagnostic/diagnostic-blueprint.ts`                                                           | Shim giữ export cũ                                                            |
| `apps/api/src/modules/student/student.service.ts`, `math-practice.service.ts`                                       | Import thuật toán từ miền chung                                               |
| `apps/api/src/modules/diagnostic/diagnostic.service.ts`                                                             | Import thuật toán/ma trận từ đúng chủ sở hữu                                  |
| `apps/api/src/modules/assignment/assignment.controller.ts`, `assignment.service.ts`, `teacher-workspace.service.ts` | Chỉ đổi import ma trận, giữ nguyên nghiệp vụ                                  |
| `packages/contracts/curriculum.js`, `curriculum.d.ts`                                                               | Danh mục runtime chung và kiểu dữ liệu                                        |
| `apps/api/src/modules/curriculum/thpt-catalog.ts`, `src/data/thptCurriculum.js`                                     | Adapter tương thích đến contracts                                             |
| `apps/api/test/architecture-compatibility.spec.ts`                                                                  | Identity export, danh mục/ID/trạng thái và hash baseline                      |
| `ARCHITECTURE.md`, root/scoped `AGENTS.md`                                                                          | Hướng dẫn agent, ownership, side effect, dữ liệu và kiểm chứng                |
| `docs/architecture/*`, `decisions/*`, `agent-tasks/*`                                                               | Khảo sát, quyết định, hợp đồng, kế hoạch, bằng chứng, báo cáo và gói bàn giao |

Các thay đổi song song ở `assignmentReportInsights.js`, test tương ứng và `src/features/assignment-report` được giữ nguyên và loại khỏi commit nền tảng. Không ghi nhận chúng là việc do lần triển khai này thực hiện.

## Hợp đồng kiến trúc

Lượt kết thúc ghi nhận 20/20 harness test đạt (cả kiến trúc và lint), checker 173 tệp không vi phạm. Lượt frontend gần nhất đạt 42/42 trước khi bổ sung ba lint test đã được chạy riêng. Cả hai thay đổi helper song song (`assignment-report` và `exam-display`, cùng báo cáo riêng của chúng) được bảo toàn ngoài commit nền tảng; không gộp chúng vào phạm vi triển khai của báo cáo này.

Đã cưỡng chế và có fixture đối kháng cho 16 mã trong [module-boundaries](module-boundaries.md): phân tách browser/server, contracts, miền chung, hướng nền tảng, feature isolation/public entry, API dependency/public file, đăng ký module, giải quyết đường dẫn, giới hạn source, import literal, public workspace subpath và vòng.

Hướng dẫn cần review: tính thuần thật của hàm, lớp controller/service, quyền truy cập, transaction, snapshot isolation, chấm điểm, ownership state, không lộ đáp án và toàn bộ yêu cầu trình bày câu hỏi. Không nhận import checker là chứng minh các hợp đồng hành vi này. Hồi quy quyền/chấm/ma trận đã chạy, nhưng chưa có bộ DB isolation đầy đủ cho từng snapshot; C3-01 xử lý trước refactor rủi ro cao.

## Bằng chứng kiểm chứng

Chi tiết từng lệnh tại [verification](verification.md). Lint/format/checker/typecheck/build frontend/API/contracts đều đạt. Hồi quy chọn lọc API: 60/60 đạt. API toàn phần: 175 đạt, 11 lỗi, 14 bị bỏ qua; giữ nguyên lỗi baseline. Các fixture import hợp lệ được chấp nhận và vi phạm bị từ chối, không để fixture lại.

Thân thuật toán và blueprint được đối chiếu mốc Git; danh mục có cùng SHA-256 trước/sau. Kiểm tra dry-run lockfile đạt. Không chạy thêm suite rộng khi không có thay đổi mới cần chứng minh.

## Nợ kỹ thuật còn lại

| Vấn đề                                                                        | Rủi ro         | Gói                                                              |
| ----------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| Fixture THCS/THPT và kỳ vọng pause còn lệch; 11 test lỗi, một setup suite lỗi | Cao            | C3-01                                                            |
| Thiếu hồi quy DB chuyên sâu cho isolation snapshot và đồng thời               | Cao            | C3-01                                                            |
| Component giáo viên/quản trị/lớp học lớn, điều phối state lẫn UI              | Trung bình     | Tách tiếp sau các helper pilot; cần gói riêng khi có test bảo vệ |
| Projection/report nằm chung I/O service                                       | Cao khi sửa    | C3-04                                                            |
| IRT/validation frontend/server gần giống nhưng chưa chứng minh tương đương    | Trung bình     | Chưa hợp nhất; cần nghiên cứu hợp đồng trước                     |
| JSX chưa typecheck ngữ nghĩa, API chưa strict                                 | Trung bình     | Migration riêng sau baseline; không bật hàng loạt                |
| Cấu hình deploy còn tham chiếu Math cũ                                        | Cao nếu deploy | C3-05                                                            |
| CJS danh mục có thể làm tăng bundle nhỏ; declaration phải đi cùng runtime     | Thấp           | Hash/compatibility test và build bảo vệ                          |

## Kế hoạch bàn giao Antigravity

An toàn cho Antigravity: C3-02 và C3-03, mỗi gói có tệp riêng và shim, không sửa công thức/UI/persistence. Chúng có thể thực hiện độc lập nhưng phải đối chiếu thay đổi song song hiện có để tránh làm lại C3-02.

Cần Codex: C3-01, C3-04 và C3-05 do liên quan hợp đồng nghiệp vụ, dữ liệu, quyền hoặc đích triển khai. Không cho agent yếu tự mở rộng phạm vi hay sửa policy.

## Tiến độ migration

- Hoàn thành: khảo sát nền tảng, baseline, target architecture, enforcement, ba bước di chuyển an toàn, fixture đối kháng, tài liệu và gói bàn giao.
- Hoàn thành một phần: phân tách tính năng frontend/service và kiểm chứng toàn sản phẩm.
- Chờ: baseline xanh đầy đủ, isolation snapshot bằng DB, C3-02/03 theo trạng thái công việc song song, projection, cấu hình deploy C3 riêng.

## Rủi ro và giới hạn

Chưa chạy workflow hosted hoặc browser end-to-end, chưa smoke test production. Không thể dùng test helper hoặc build để kết luận mọi workflow người dùng an toàn. Full API và `verify` chưa xanh; không giảm test/validation để che lỗi.

Không thay schema, không sửa đáp án ngân hàng và không deploy. Chỉ có snapshot ban đầu đã được push theo yêu cầu; commit nền tảng được giữ trên nhánh refactor để review trước khi đưa vào main.
