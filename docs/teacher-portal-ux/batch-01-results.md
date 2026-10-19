# Đợt 01 — Báo cáo kết quả hỗ trợ quyết định

Ngày: 18/10/2026. Phạm vi: màn báo cáo bài giao, phân tích và công bố điểm.

## Vấn đề đã xác định

| Mức | Màn | Nguyên nhân | Ảnh hưởng |
| --- | --- | --- | --- |
| P0 | Kết quả | Danh sách toàn bộ học sinh không phân trang, chỉ tìm tên | Giáo viên phải tự đọc từng dòng để tìm em cần hỗ trợ |
| P1 | Tổng quan điểm | Chỉ hiển thị trung bình và thanh phân bố | Tỷ lệ dưới 5 và mức độ cần can thiệp không nổi bật |
| P1 | Kết quả / phân tích | Số câu sai không nối với câu và kiến thức cụ thể | Khó tìm nguyên nhân và phần cần ôn |
| P1 | Công bố | Hành động cập nhật trực tiếp, không có bước rà soát | Khó phát hiện bài thiếu điểm hay vấn đề cần kiểm tra |
| P1 | Điều hướng báo cáo | Bộ lọc cục bộ có thể mất khi chuyển tab | Lặp lại tìm kiếm khi đi xem nguyên nhân rồi quay lại |

## Thay đổi

- Kết quả: làm nổi tỷ lệ dưới 5 trên số bài có điểm; không coi bài đang làm/chưa làm/thiếu điểm là 0.
- Tổng quan chỉ xem trước tối đa 3 câu có từ 50% chưa đúng; chọn câu đi sang tab phân tích và mở chi tiết.
- Bảng 10 dòng mặc định, tùy chọn 15; tìm không dấu, lọc trạng thái/điểm/thời gian, sắp xếp, tiêu đề cố định trong vùng cuộn.
- Sai/một phần và bỏ trống được tách riêng; bỏ các câu loại khỏi điểm hoặc cho điểm toàn bộ khi xác định nội dung cần hỗ trợ.
- Phân tích: gợi ý tối đa 3 kiến thức theo bằng chứng câu trả lời; tìm/lọc câu, phân trang 10 câu, xem đáp án sai phổ biến. Không suy diễn đây là chẩn đoán mức thành thạo.
- Chi tiết học sinh tiếp tục sử dụng màn xem bài riêng, giữ bộ lọc khi đóng.
- Giữ bộ lọc/trang trong báo cáo khi chuyển tab.
- Công bố: xem trạng thái điểm, học sinh chưa nộp, câu cần rà soát và đề/đáp án trước khi xác nhận. Các trường hợp chưa có điểm, điểm còn thiếu, đáp án nhiều lựa chọn không hợp lệ, đề nháp hoặc chỉnh sửa chưa áp dụng được chỉ rõ.
- Chỉ gửi trường `published` khi xác nhận; không âm thầm lưu thiết lập đang sửa hay bật lời giải. Lỗi lưu giữ hộp thoại và cho thử lại.
- Thời gian cần xem lại được định nghĩa minh bạch: dưới 1/3 trung vị của ít nhất 5 bài có thời gian, hoặc vượt thời lượng hơn 1 phút; không kết luận gian lận.

## Thành phần thay đổi

- `src/components/TeacherWorkspace.jsx`: ghép luồng và giữ trạng thái bộ lọc theo báo cáo.
- `AssignmentResultsPanel.jsx`, `AssignmentAnalyticsPanel.jsx`, `ReportPublishReview.jsx`: ranh giới tổng quan, tìm nguyên nhân, rà soát công bố.
- `assignmentReportInsights.js`: tính tỷ lệ, phân loại, lọc/sắp xếp dựa trên dữ liệu hiện có.
- `assignment-report.css`: bố cục và thành phần báo cáo, không thay hệ thống thương hiệu.

## Bằng chứng

- `docs/evidence/assignment-report-ux/verification.json`.
- 1440×1000: `results-desktop.png`, `analytics-desktop.png`, `publish-review.png`.
- 820×1000 và 390×844: `results-tablet.png`, `results-mobile.png`.
- `no-submissions.png`: chưa có bài nộp.
- Trước thay đổi: ảnh người dùng cung cấp; chưa có ảnh baseline tự chụp ở kích thước trùng khớp cho đợt này. Các đợt tiếp theo phải chụp baseline trước sửa.
- Bộ dữ liệu kiểm thử 35 học sinh, 31 bài nộp, 19 bài dưới 5. Chỉ dùng trong trình duyệt kiểm thử; không thêm dữ liệu vào sản phẩm hay công bố điểm thật.
- Trình duyệt xác minh phân trang, lọc, tìm không dấu, xem bài, nối tổng quan–phân tích, phục hồi lỗi công bố, quyền chỉ xem, thiếu điểm, đáp án lỗi và trạng thái điểm hiện tự động.
- Axe không phát hiện vi phạm trong phạm vi kết quả, phân tích và hộp thoại công bố được quét; không phải chứng nhận toàn sản phẩm.
- 6 kiểm thử tính toán và 4 kiểm thử điều hướng đạt; bản dựng production đạt.

## Giới hạn và rủi ro

- Chưa thử nghiệm với giáo viên thật; quy tắc thời gian là gợi ý rà soát có giải thích.
- Kiểm thử trình duyệt của đợt này dùng phản hồi API có kiểm soát, không phải xác minh lại API sản xuất hoặc nghiệp vụ chấm điểm máy chủ.
- Không tự phát hiện lỗi đáp án từ tỷ lệ sai; yêu cầu giáo viên đối chiếu.
- Chưa rà soát đầy đủ toàn bộ các màn quản lý lớp, thư viện và soạn đề trong mục tiêu Teacher Portal mới.

## Đợt tiếp theo

P0/P1: audit thực tế tất cả màn Teacher Portal và các trạng thái lồng nhau; chuẩn hóa nền tảng CSS/component dựa trên nhận diện hiện có; ưu tiên quản lý lớp/bài giao/soạn đề theo độ ảnh hưởng. Không đổi ma trận, chấm điểm hoặc quyền truy cập trong các cải thiện bố cục.
