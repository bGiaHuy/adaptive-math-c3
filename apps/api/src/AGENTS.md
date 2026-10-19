# Quy tắc cho mã API

Đọc root AGENTS, ARCHITECTURE và module-boundaries trước khi sửa.

- Dùng policy trong `scripts/architecture/policy.mjs`; không thêm cạnh liên module hoặc public file để né checker.
- Quy tắc toán dùng chung đặt tại `common/domain` hoặc `modules/question`; Prisma/session/HTTP ở adapter hoặc service.
- Giữ controller/DTO/guard và payload hiện có. Không đổi schema, thuật toán chấm, đáp án nguồn hoặc cơ chế session trong task cấu trúc.
- Sửa bài giao chỉ ghi snapshot, điểm liên quan, revision và audit của bài giao thuộc teacher; giữ khóa transaction và kiểm tra ownership/revision, preview và giới hạn sau khi có người bắt đầu.
- Chạy test liên quan trước/sau, `npm run architecture:check`, `npm run typecheck`, `npm run build:api` từ root. Báo đầy đủ lỗi baseline; không xóa/skip assertion để báo xanh.
- Hàm mới có I/O phải ghi rõ chủ sở hữu side effect trong review. Kiểm tra import không chứng minh an toàn bảo mật hoặc transaction.
