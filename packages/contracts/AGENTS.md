# Quy tắc cho contracts

- Không import API, UI, Prisma, NestJS hoặc browser global. Dữ liệu công khai không chứa secrets hay dữ liệu cá nhân.
- Runtime danh mục hiện là `curriculum.js` CommonJS; khai báo tương ứng tại `curriculum.d.ts`. Đây là nguồn duy nhất của danh mục THPT cho hai runtime.
- Giữ grade, ID, chuỗi hiển thị và trạng thái pause khi chỉ refactor. Không tự sửa nội dung toán hoặc bổ sung dữ liệu ngân hàng.
- DTO gốc vẫn ở `src/index.ts`; không chuyển toàn ứng dụng sang ESM để thay một contract.
- Chạy root `npm run architecture:check`, `npm run typecheck`, kiểm thử compatibility và build cả frontend/API.
