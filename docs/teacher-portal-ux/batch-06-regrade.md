# Batch 06 — Sửa đáp án và xem trước ảnh hưởng

## Vấn đề và thay đổi
- P1: 22 câu chỉnh sửa mở cùng lúc làm việc tìm câu chậm. Thu gọn từng câu, mở câu đầu và thêm chọn câu để chuyển thẳng đến vị trí sửa.
- P1: bảng xem trước trải dài khiến giáo viên khó nhận diện học sinh bị ảnh hưởng. Thêm tổng số tăng/giảm/giữ điểm, lọc, tìm tên không dấu và phân trang 10 bài.
- P1: thay đổi dữ liệu khi yêu cầu đang chạy có thể khiến xem trước không còn khớp. Khóa trường chỉnh sửa trong thời gian gửi yêu cầu; sửa câu hoặc lý do tiếp tục hủy bản xem trước như trước.
- Phân biệt rõ xem trước và áp dụng, nhắc phạm vi lần giao và trạng thái công bố. Giữ nguyên hợp đồng API, quyền và cách chấm phía máy chủ.

## Files
- src/components/RegradeImpact.jsx
- src/components/TeacherWorkspace.jsx
- src/components/teacher-foundation.css
- scripts/verify-teacher-regrade-ux.mjs

## Kiểm chứng
Build thành công. Chrome thực tế với API fixture: 22 câu, thu gọn/nhảy câu, khóa nội dung đề đã có người làm, xem trước lỗi giữ lý do; xem trước không áp dụng; lọc/phân trang; áp dụng lỗi giữ bản xem trước và thử lại thành công. Không có pageerror. Không ghi dữ liệu thật.
Viewport 1440×900, 820×1000, 390×844 không tràn ngang trang. Ảnh và kết quả tại docs/evidence/teacher-regrade. Chưa có ảnh baseline cùng trạng thái editor nên không tuyên bố so sánh ảnh trước/sau cho batch này.

## Còn lại
Chưa kiểm chứng máy chủ thật về tính điểm/giao dịch hay xung đột revision trong batch này; các kết quả điểm kiểm thử được kiểm soát bằng fixture. Cần tiếp tục các phương thức soạn đề có nội dung thực, trạng thái lỗi và thao tác lớp học. Goal toàn Teacher Portal vẫn đang thực hiện.
