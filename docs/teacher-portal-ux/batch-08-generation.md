# Batch 08 — Bổ sung AI và thay đề ngẫu nhiên

## Findings và xử lý
- P1, mất câu khi đổi phương thức: addQuestions dùng editingId của form thủ công cho cả AI/JSON, nên bổ sung có thể loại câu đang chỉnh. Chỉ thao tác lưu form thủ công mới thay câu theo editingId. AI/JSON luôn bổ sung, không xóa bản câu hiện tại; bản nhập thủ công vẫn giữ khi chuyển phương thức.
- P1, thay đề: nút lấy ngẫu nhiên có thể thay toàn bộ câu và tài liệu khi đã có đề. Thêm xác nhận ngay vùng làm việc, nêu rõ số câu/phạm vi thay và bảo toàn đề khi yêu cầu lỗi. Đề rỗng vẫn tạo trực tiếp. Không đổi ma trận hoặc logic chọn câu máy chủ.
- P2, xem lại đề: 22 câu mặc định đều mở gây trang dài. Mở câu đầu, giữ các câu khác dạng thu gọn có thể mở riêng; không ẩn nội dung hoặc bớt khả năng kiểm tra đáp án.
- Khi thay đề thành công, thoát trạng thái sửa câu cũ để không lưu nhầm câu không còn trong đề.

## Verification
scripts/verify-teacher-generation.mjs chạy Chrome thực, API fixture: AI thêm câu không xóa câu đang sửa; chuyển lại form giữ nội dung; xác nhận thay đề không gửi request sớm; hủy không đổi đề; lỗi giữ hai câu; retry thành công thành 22 câu với một câu mở. 1440×900, 820×1000, 390×844 không tràn ngang trang, không pageerror. Chỉ hai endpoint preview được gọi với dữ liệu giả, không giao đề thật. Ảnh/JSON tại docs/evidence/teacher-generation; đã xem ảnh mobile. Kiểm tra manual/JSON batch07 chạy lại đạt.
Không có baseline cùng trạng thái nên không kết luận bằng ảnh before/after. Chưa chứng minh độ đúng của dịch vụ AI hoặc ma trận backend qua fixture. Cần kiểm tra tích hợp môi trường riêng và tiếp tục luồng quản lý lớp. Goal tổng thể chưa hoàn tất.
