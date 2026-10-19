# Mô phỏng lớp 9a1 — hung yen

Dữ liệu trong cơ sở dữ liệu local; lớp của thanhdtnt. Giữ nguyên học sinh và bài nộp gốc. Thêm 34 học sinh tên có hậu tố (Mô phỏng).

- Tổng sĩ số: 35
- Đã nộp: 31, gồm 30 bài mô phỏng
- Đang làm: 2; chưa bắt đầu: 2
- Điểm mô phỏng: 0.5–7.7; trung bình 4.25

## Tài khoản thử

Tài khoản sim9a1_01 đến sim9a1_34; mật khẩu riêng cho dữ liệu thử: Sim9a1!2026.

01–06 cần củng cố; 07–16 trung bình; 17–27 khá; 28–34 tốt. 31–32 có bản nháp; 33–34 chưa bắt đầu. Năng lực mô phỏng là xác suất trả lời theo độ khó, không phải đánh giá năng lực thật.

## Đã kiểm tra

- 35 thành viên; giữ nguyên thành viên và bài làm gốc
- 30 bài mô phỏng chấm qua API; đối chiếu điểm độc lập cả 3 dạng câu
- 2 bản nháp khôi phục được; 2 học sinh chưa bắt đầu
- Đề làm bài không lộ đáp án/lời giải
- Chặn nộp lại và chặn học sinh đọc báo cáo giáo viên
- Ghi nhận sự kiện rời tab; gửi lặp không tạo sự kiện trùng
- Trình duyệt: báo cáo lớp, chi tiết 22 câu, lọc câu sai, mobile, đóng bằng Escape
- Tìm học sinh, phân tích 22 câu và xem chi tiết phân bố đáp án
- Đối chiếu tổng đúng/sai/trống mỗi câu = 31 bài nộp
- Đăng nhập học sinh trên trình duyệt, tiếp tục bài nháp và khôi phục lựa chọn

30 bài được nộp qua API thật và đối chiếu điểm khi tạo; giao diện trình duyệt được kiểm tra trên các tài khoản đại diện. Đây không phải kết luận mọi chức năng đều đã được kiểm thử. Chưa thử áp dụng sửa đáp án/chấm lại hay đổi công bố trên bài gốc để giữ nguyên kết quả hiện có.

## Điểm cần cải thiện

Bài IN_PROGRESS vẫn hiện nút Bắt đầu làm bài ở danh sách học sinh; bấm vào khôi phục đúng bản nháp.

Các ảnh PNG cùng thư mục là bằng chứng kiểm tra giao diện. report.json chứa danh sách học sinh và kiểm tra; teacher-report.json là báo cáo đối chiếu.
