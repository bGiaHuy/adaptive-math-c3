# Batch 13 — Phục hồi báo cáo từ đường dẫn trực tiếp

P1: effect tải báo cáo chỉ đặt lỗi chung, khi chưa có report màn cha hiển thị danh sách bài giao. Giáo viên không biết còn ở báo cáo hay danh sách và thiếu retry theo ngữ cảnh.
Thêm reportError/reportRetry và màn loading/error riêng khi reportId đã xác định trong assignments. Giữ URL/tab hiện tại, có thử lại và quay lại danh sách. Giữ cancellation của effect để response cũ không ghi vào báo cáo mới. Không đổi dữ liệu/quyền hay API.
Files: src/components/TeacherWorkspace.jsx; scripts/verify-teacher-report-recovery.mjs.
Chrome fixture desktop1440×900/tablet820×1000/mobile390×844: direct analytics report trả503 hiện recovery thay vì danh sách; retry phục hồi đúng analytics/tab; không overflow hoặc pageerror. docs/evidence/teacher-report-recovery/verification.json và error-{desktop,tablet,mobile}.png. Build đạt; verify-assignment-report-ux chạy lại đạt bao gồm filters, publish recovery và axe.
Không có baseline cùng trạng thái lỗi, không tuyên bố before/after. Test fixture chỉ chứng minh UI, không uptime API. Cần tiếp tục đối chiếu coverage, trạng thái reportId không tồn tại và kiểm tra lỗi chuyển ngữ cảnh. Goal active.
