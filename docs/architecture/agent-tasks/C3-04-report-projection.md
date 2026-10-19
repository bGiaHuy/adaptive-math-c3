# C3-04 — Tách projection báo cáo khỏi I/O

- Người thực hiện: Codex; rủi ro cao.
- Mục tiêu: rút tính toán roster và analytics khỏi phương thức report, giữ nguyên truy vấn và JSON trả về.
- Tệp: `apps/api/src/modules/assignment/teacher-workspace.service.ts`; tạo `apps/api/src/modules/assignment/report-projection.ts`, `apps/api/test/report-projection.spec.ts`.
- Được phép: thêm hàm thuần nội bộ nhận dữ liệu đã load, truyền thời gian nếu có tính thời lượng; giữ report gọi load/audit/document như trước; characterization JSON bao gồm absent/zero/partial/excluded.
- Cấm: sửa phương thức regrade/settings/activity; đổi truy vấn/field công khai, công bố kết quả, ownership, source bank, transaction, DTO, schema hoặc frontend.
- Hợp đồng: projection không I/O, không import feature/module khác ngoài helper assignment; guard/load vẫn trước projection; không lộ đáp án hoặc dữ liệu học sinh cho consumer mới.
- Phụ thuộc: C3-01 phải nghiệm thu; không chạy đồng thời cùng thay đổi teacher-workspace.service.
- Nghiệm thu: JSON trước/sau tương đương trên fixture đại diện; isolation test C3-01 và auth tests đạt; không có đường public API mới.
- Lệnh: `npm run test --workspace=@adaptivemath/api -- test/report-projection.spec.ts test/assignment-snapshot-isolation.spec.ts test/authorization-policy.spec.ts test/teacher-workspace.spec.ts`; `npm run architecture:check`; `npm run typecheck`; `npm test`; `npm run build:api`.
- Báo cáo: ID, consumer, trường JSON đã so sánh, bằng chứng quyền/isolation, toàn bộ lệnh và rủi ro còn lại.
- Rollback: revert commit projection; không sửa dữ liệu đã lưu.
