# ADR 0001 — Nền tảng module và tương thích

Trạng thái: đã áp dụng ở nhánh refactor ngày 19/10/2026.

## Bối cảnh

Ứng dụng đã có NestJS modules và frontend React thuần. Cấu trúc UI còn phẳng, nhưng việc chuyển hàng loạt dễ làm sai quyền, snapshot, chấm điểm và persistence. Baseline API còn lỗi cũ; không đủ cơ sở cho refactor sâu.

## Quyết định

1. Giữ stack, cấu trúc DB, endpoint, DTO, guard và transaction; không bổ sung repository/event bus/DI ở frontend.
2. Thuật toán thích ứng thuộc `common/domain`; ma trận dùng chung thuộc `question`; danh mục dùng ở hai runtime thuộc contracts.
3. Giữ shim đường dẫn cũ và kiểm thử identity export để bảo toàn consumer; production chuyển về chủ sở hữu mới.
4. Danh mục runtime dùng CommonJS JavaScript kèm declaration, vì API compile CommonJS còn Vite tiêu thụ package CommonJS. Chỉ danh mục đổi chỗ, không đổi chuỗi/ID/thuật toán map. Không thêm bước codegen cho catalogue nhỏ; `.d.ts` và test là phần phải cập nhật cùng nhau.
5. Checker dùng AST TypeScript đã có, policy theo module và tệp public cụ thể; không tạo barrel rộng. Chu trình type-only cũng bị chặn để đơn giản hóa bảo trì agent.
6. Dùng Prettier là dependency phát triển mới duy nhất; khai báo TypeScript trực tiếp ở root vì harness sử dụng nó. Lint cú pháp tối thiểu, chưa cài một hệ plugin ESLint mới khi chưa có cấu hình kế thừa.
7. CI tách job nền tảng khỏi job toàn bộ API; lỗi test cũ vẫn là lỗi thật, không che bằng allowlist/continue-on-error.

## Hệ quả và lựa chọn không dùng

Giảm phụ thuộc giữa feature nhưng chưa tách UI lớn. CJS có thể làm tree-shaking kém hơn so với catalogue TS trực tiếp; build vẫn đạt, chấp nhận chi phí nhỏ để loại đường nối browser/server. Không chuyển cả API sang ESM chỉ vì một dữ liệu dùng chung.
Không bật TypeScript strict toàn API hoặc checkJs toàn frontend trong một lần. Không coi import checker là chứng minh đầy đủ quyền truy cập hoặc độ thuần của hàm.

Đổi policy phải kèm ADR cập nhật, ví dụ đúng/sai và bằng chứng hồi quy; không thêm ngoại lệ tổng quát.
