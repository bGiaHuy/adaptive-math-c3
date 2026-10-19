# Đợt 05 — Tìm lại bản nháp và dùng lại đề

## Vấn đề UX

P1: bản nháp trình duyệt tồn tại nhưng sau khi Quay lại, giáo viên không có lối mở tiếp trong thư viện. Root cause: chỉ draft ID trong URL mở được editor; danh sách thư viện chỉ có bài máy chủ. Tác động: dễ tạo đề mới hoặc tưởng mất nội dung.

## Thay đổi

TeacherLocalDrafts hiển thị “Tiếp tục đề đang soạn” ở thư viện và tổng quan. Phân biệt rõ bản nháp ở trình duyệt chưa giao cho học sinh; hiển thị tên, lớp và số câu đã thêm. Phân trang 5 bản nháp, chỉ đọc namespace của tài khoản đang đăng nhập. Bản nháp rỗng/hỏng không làm hỏng trang. Nút Soạn tiếp mở đúng ID hiện có, không sao chép hay xóa dữ liệu. Sau lưu/giao thành công, bản nháp đã dọn không còn xuất hiện.

Files: TeacherLocalDrafts.jsx, TeacherWorkspace.jsx, teacher-foundation.css. Không đổi API, quyền truy cập hay quy tắc chấm.

## Verification

- scripts/verify-teacher-draft-reuse.mjs: actual browser React + API fixture. Chọn bài thư viện → dùng lại → 22 câu/tên gốc → đổi tên/lớp → review → quay lại → tìm thấy bản mới → mở/tải lại giữ nội dung. Đề gốc còn tên cũ, không có request ghi. Bản nháp tài khoản khác và JSON hỏng không hiện.
- scripts/verify-teacher-composer-flow.mjs: thư viện mở lại bản nháp; lưu lỗi vẫn giữ bản nháp; lưu thành công mới dọn và ẩn khỏi danh sách.
- Evidence: docs/evidence/teacher-draft-reuse/verification.json, reuse-desktop.png 1440×900, reuse-tablet.png 820×1000, reuse-mobile.png 390×844. Không tràn ngang, không lỗi JavaScript.
- 10 kiểm thử điều hướng/chuẩn hóa câu đạt. Build đạt.

## Giới hạn / tiếp theo

Bản nháp vẫn thuộc thiết bị/trình duyệt hiện tại, chưa đồng bộ máy chủ; UI nói rõ điều đó. Bộ kiểm thử dùng dữ liệu có kiểm soát, không kiểm tra server reuse/publication thật. Chưa bổ sung quản lý xóa bản nháp vì không cần để phục hồi công việc và tránh thêm thao tác phá hủy.

Goal active. Tiếp: P1 chỉnh đề/đáp án và preview/tính lại điểm; AI/JSON/manual populated, loading/error/recovery; completion audit theo từng yêu cầu goal.
