# Batch 09 — Tạo lớp, mã mời và phục hồi lỗi

## Issues
- P1, tạo lớp: effect chuyển lớp xóa mã mời mới hiển thị một lần. Giáo viên tạo lớp xong không còn mã để chia sẻ.
- P1, thành viên/mã mời: request lỗi vẫn giữ trạng thái loading hoặc hiển thị như không có dữ liệu; thiếu thử lại theo ngữ cảnh.
- P1, thu hồi mã: hành động trực tiếp và trạng thái hết hạn/hết lượt chưa rõ.
- P2, form tạo lớp: có thể đóng và sửa nội dung trong lúc gửi; thiếu gợi ý bước tiếp theo.

## Changes
Mã mời gắn classId và tồn tại qua tải chi tiết đúng lớp; không hiện sang lớp khác. Thêm hướng dẫn chia sẻ, giới hạn sử dụng. Refresh danh sách mã sau tạo thêm, unwrap nhất quán response khi thu hồi. Thêm lỗi tải chi tiết với retry; tách loading/error/empty. Mã hết hạn/hết lượt có nhãn rõ; thu hồi có xác nhận và mô tả tác động thành viên. Mã vừa hiện bị thu hồi sẽ được bỏ nếu trùng id/prefix. Form tạo lớp giữ dữ liệu khi lỗi, khóa khi gửi, giữ Escape/close nhất quán. Không đổi API/quyền hay thời hạn mặc định.
Files: src/components/TeacherWorkspace.jsx; scripts/verify-teacher-class-management.mjs.

## Evidence
Chrome actual React với API fixture tại 1440×900, 820×1000, 390×844. Tạo lỗi giữ tên lớp; retry tạo thành công giữ mã qua tải chi tiết; mã expired/exhausted; xác nhận/hủy không ghi; thu hồi lỗi giữ lựa chọn và retry cập nhật; chuyển lớp gặp lỗi không loading vô hạn, thử lại lấy được thành viên. Không pageerror hoặc ghi ngoài endpoint kiểm thử. Screenshot mobile đã được xem; không overflow ngang. Build đạt trước sửa cuối về ẩn mã thu hồi, cần regression lại sau sửa.
Artifacts: docs/evidence/teacher-class-management/verification.json và invite-{desktop,tablet,mobile}.png.
Không có baseline cùng trạng thái, không tuyên bố before/after ảnh cho batch. Clipboard thật, đồng thời nhiều request và backend thực chưa được kiểm chứng trong fixture này.

## Next
P1: thiết lập bài giao/xóa/xuất báo cáo và kiểm tra accessibility/hồi quy toàn portal. Goal vẫn active.
