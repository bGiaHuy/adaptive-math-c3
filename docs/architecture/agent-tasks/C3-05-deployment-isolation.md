# C3-05 — Tách cấu hình triển khai C3

- Người thực hiện: Codex; rủi ro cao, cần đích hạ tầng do người dùng xác nhận.
- Mục tiêu: loại tham chiếu repo Math cũ khỏi cấu hình triển khai khi đã có dự án hạ tầng C3 riêng.
- Tệp: `render.yaml`, `vercel.json`, `.env.example`, `apps/api/.env.example`; tạo `docs/deployment/C3-ISOLATION.md`.
- Được phép: kiểm kê đích repo, API, frontend, cookie, CORS và DB; chuẩn bị diff cấu hình cho đích C3 được xác nhận; tài liệu smoke test và rollback.
- Cấm: dùng token/DB thật trong Git; đổi schema, nhập câu hỏi, thay secrets hoặc cấu hình cloud của Math cũ; deploy/promote khi người dùng chưa cho phép đích cụ thể.
- Hợp đồng: repo `bGiaHuy/adaptive-math-c3`, dữ liệu/phiên độc lập, không migration production tự động; không tự đổi WEB_URL/CORS theo tên đoán.
- Phụ thuộc: nền tảng; thông tin cloud C3 là blocker thực sự cần xác minh, không tự tạo placeholder thành triển khai thật.
- Nghiệm thu: mỗi đích cấu hình có nguồn xác nhận; local diff review được; khi được cho phép deploy thì health/auth/ownership và không truy cập DB Math cũ được kiểm chứng.
- Lệnh local: `npm run architecture:check`; `npm run typecheck`; `npm run build`; `npm run build:api`. Lệnh cloud phải ghi rõ trong tài liệu sau khi chọn đúng nền tảng và đọc skill tương ứng.
- Báo cáo: ID, đích trước/sau đã che secrets, kiểm chứng local/cloud tách biệt, quyền người dùng đã cấp, phần bị chặn.
- Rollback: revert commit cấu hình; phục hồi đúng deployment C3 nếu đã được phép deploy; không rollback hoặc thay đổi dự án Math cũ.
