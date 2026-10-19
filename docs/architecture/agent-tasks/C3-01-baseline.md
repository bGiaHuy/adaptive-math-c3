# C3-01 — Khôi phục baseline và bảo vệ snapshot

- Người thực hiện: Codex; rủi ro cao, không giao mù cho Antigravity.
- Mục tiêu: phân loại và sửa fixture THCS/THPT không còn phù hợp, thêm kiểm thử regrade isolation trước refactor sâu.
- Tệp được sửa: `apps/api/test/assignment.integration.spec.ts`, `apps/api/test/e2e-scenarios.integration.spec.ts`, `apps/api/test/diagnostic-resilience.integration.spec.ts`, `apps/api/test/math-learning.integration.spec.ts`, `apps/api/test/classroom.integration.spec.ts`, `apps/api/test/diagnostic.integration.spec.ts`, `apps/api/test/thpt-transition.spec.ts`; tạo `apps/api/test/assignment-snapshot-isolation.spec.ts`.
- Được phép: đối chiếu DTO/catalog hiện hành, dùng fixture có chủ đích cho thuật toán legacy, tạo mock/DB test kiểm tra ownership, preview không ghi, revision cũ bị từ chối, apply ghi đúng assignment và audit. Phân biệt test đường phân phối THPT thực tế với test thuật toán cũ.
- Cấm: sửa mã sản phẩm để hợp thức hóa fixture grade 9; xóa/skip test; bật/tắt `LEGACY_BANK_PAUSED`; đổi đáp án nguồn; thay schema hoặc sử dụng production DB.
- Hợp đồng: quyền teacher/admin/student, transaction, snapshot isolation, source question ID, đề khác/teacher khác bất biến, ba loại chấm điểm, idempotency và kết quả cũ.
- Phụ thuộc: nền tảng; chạy trước C3-04.
- Nghiệm thu: giải thích từng failure cũ; toàn suite đạt hoặc nêu rõ blocker và không đổi hợp đồng khi chưa được duyệt; test snapshot bắt được việc ghi nhầm source bank và bài giao khác.
- Lệnh: `npm run lint`; `npm run architecture:check`; `npm run typecheck`; `npm test`; `npm run test:frontend`; `npm run build:api`.
- Báo cáo: ID, commit, từng lỗi baseline/nguyên nhân, fixture thay đổi, chứng cứ quyền/isolation, kết quả từng lệnh và việc chưa xác minh.
- Rollback: revert commit gói, không rollback DB dùng chung; xóa chỉ fixture DB thuộc run của mình trong cleanup.
