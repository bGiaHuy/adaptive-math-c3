# Batch 12 — Mật độ danh sách câu trên mobile

P1: mặc định 10 thẻ phân tích/ngân hàng trên điện thoại khiến phải cuộn dài để tới phân trang. Thêm useTeacherPageSize và TeacherPageSize dùng chung: mặc định 5 ở <=650px, 10 trên màn lớn; giáo viên chọn 5/10/20. Đổi số lượng reset trang, giữ nguyên bộ lọc và chi tiết. Bộ lọc analytics hai cột trên mobile, ô tìm kiếm toàn hàng. P1 bổ sung: lỗi tải ngân hàng không có retry; thêm retry tại trang, tách lỗi tải khỏi trạng thái rỗng.

Files: TeacherListControls.jsx, AssignmentAnalyticsPanel.jsx, QuestionBankView.jsx, teacher-foundation.css; scripts/verify-teacher-density.mjs.

Chrome fixture tại 1440×900,820×1000,390×844: mặc định đúng, chọn20, trang sau, tìm không kết quả/reset, mở/đóng chi tiết giữ danh sách; lỗi ngân hàng không hiện empty và retry phục hồi. Không pageerror/overflow; axe theo wcag2a/2aa/21aa không có vi phạm ở 6 màn được kiểm tra. Không ghi dữ liệu thật. Build chạy cùng batch.

Before: docs/evidence/teacher-portal-product/accessibility-after-{bank,report-analysis}-mobile.png và accessibility-after.json. After: docs/evidence/teacher-density/{bank,analysis}-mobile.png và verification.json. Cùng390×844/dữ liệu: bank2601→1957px (-644); analytics3900→2827px (-1073). Đã xem ảnh full-page analytics sau: chủ đề ưu tiên, bộ lọc, câu hỏi và pager đều còn; trang vẫn cần cuộn do cấu trúc thông tin, chưa tuyên bố đạt UX toàn portal chỉ bằng chiều cao.

Còn lại: cần tổng hợp coverage theo requirement, đối chiếu bản hiện tại và trạng thái dữ liệu thật được phép kiểm tra. Không coi axe là kiểm chứng screen reader hay backend. Goal active.
