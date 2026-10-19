# Tạo đề AI cho giáo viên

Trong lớp học → Tạo đề kiểm tra mới → Tạo đề bằng AI. Chọn số câu (mặc định 12 nhiều lựa chọn, 4 đúng/sai, 6 trả lời ngắn), tải tài liệu và nhập yêu cầu bổ sung. Giáo viên xem trước, chỉnh sửa từng câu, đáp án, lời giải và hướng dẫn nhập rồi giao lớp. Bài nộp sử dụng bộ chấm tự động hiện có; không gọi AI để quyết định điểm.

## Cấu hình máy chủ

Dùng cấu hình AI hiện có trong apps/api/.env.example: bật AI_ENABLED=true, chọn AI_PROVIDER=anthropic cùng ANTHROPIC_API_KEY, hoặc AI_PROVIDER=mwapi cùng ANTHROPIC_AUTH_TOKEN và giá token của nhà cung cấp. Không đặt khóa trong biến VITE_ hoặc giao diện. Khởi động lại API sau khi cấu hình. Tính năng dùng cùng ngân sách và giới hạn lượt với gia sư AI. Không tự tăng ngân sách. Đề dài có thể cần quản trị viên điều chỉnh hạn mức dự trù cho mỗi tài khoản.

POST /api/v1/assignments/ai-preview chỉ cho TEACHER đã đăng nhập. Multipart gồm file, counts (JSON gồm SINGLE_CHOICE/TRUE_FALSE/SHORT_ANSWER), instructions (tùy chọn). API trả questions để duyệt; không tự phát hành bài.

## Giới hạn

- PDF, DOCX, PPTX tối đa 10 MB, 60.000 ký tự; PDF và slide tối đa 200 trang/slide.
- Tổng 1–60 câu; mỗi loại tối đa 40. AI phải trả đúng số lượng, không trùng câu, đúng cấu trúc và có hướng dẫn câu trả lời ngắn, nếu không toàn bộ kết quả bị từ chối.
- Đọc phần chữ; chưa OCR hay phân tích hình, biểu đồ hoặc công thức chỉ tồn tại trong ảnh. Cần kiểm tra công thức sau trích xuất từ Word/PDF.
- Yêu cầu AI nhận phản hồi streaming, thời hạn tối đa 5 phút. Proxy cần cho phép chờ ít nhất 330 giây; khóa giới hạn đồng thời được giữ 6 phút. Kết quả sai cấu trúc vẫn tính chi phí nếu nhà cung cấp đã xử lý; không gửi lại toàn bộ đề. Nếu AI trả thiếu câu hoặc có câu lỗi, giữ các câu hợp lệ và gọi bổ sung tối đa một lần cho phần còn thiếu; mỗi lượt được dự trù/quyết toán ngân sách riêng, tổng thời gian vẫn tối đa 5 phút.
- NUMERIC nhận số/phân số, dấu chấm/phẩy; không nhận đơn vị hoặc %. Ví dụ 25% cần hướng dẫn nhập 25 hoặc 0,25 theo yêu cầu. TEXT chấm theo đáp án chấp nhận, chuẩn hóa khoảng trắng và tùy chọn phân biệt hoa/thường. Hướng dẫn là thông tin hiển thị; bộ chấm NUMERIC chấp nhận các dạng số tương đương trong sai số, không bắt buộc số ký tự thập phân.
- Học sinh chỉ nhận answerInstructions, không nhận shortAnswer.acceptedAnswers trước khi nộp.

## Kiểm tra

Các bài kiểm tra bao gồm trích xuất ba định dạng, số câu và câu trùng, hướng dẫn bắt buộc, API nhà cung cấp giả lập, xử lý kết quả bị cắt, dự trù/quyết toán ngân sách; kiểm tra tích hợp giao bài, giấu đáp án, lưu nháp và tự chấm.

## Cập nhật quota và tài liệu nhiều môn

Tạo đề giáo viên (`TEACHER_EXAM`) không qua quota lượt, ngân sách hay bộ đếm rate của gia sư học sinh; vẫn ghi nhận usage để theo dõi. Các giới hạn kỹ thuật tệp/số câu trong một yêu cầu giữ nguyên.

Prompt xác định môn từ tài liệu và yêu cầu, không ép tài liệu cơ sở dữ liệu thành đề Toán.

Kiểm tra local: yêu cầu tạo đề từ `Chapter 3.pptx` môn Database Management System với cấu trúc 12/4/6 đã đi qua admission (không trả 429) nhưng MWAPI thất bại sau khoảng 126 giây. Gọi trực tiếp messages ở cả Haiku/Sonnet cũng timeout, trong khi `/v1/models` trả 200. Đây chưa phải xác nhận tính năng sinh đề hoạt động ổn định; không dùng kết quả giả thay thế. Xem `docs/evidence/teacher-composer/database-document-live.json`.

## Chuyên đề khi giáo viên tạo đề

AI chỉ cần dùng chuyên đề có trong tài liệu và yêu cầu giáo viên; không cần phủ chuyên đề cố định của ma trận tổng hợp. Vẫn kiểm tra 22 câu (12/4/6), mức nhận thức, độ khó, chuyên đề hợp lệ thuộc khối 9, đáp án và câu trùng khi xem trước, lưu, giao hoặc cập nhật đề.

Ngân hàng yêu cầu chọn ít nhất một chuyên đề trước khi hiện câu hỏi hoặc lấy đề ngẫu nhiên. API random-preview nhận skillIds là danh sách mã chuyên đề; không tự thêm câu từ ngoài danh sách khi thiếu câu. Bỏ chọn chuyên đề cũng bỏ các câu ngân hàng thuộc chuyên đề đó khỏi đề đang soạn. Bài khảo sát đầu vào tiếp tục dùng ma trận chuyên đề cố định.

## Cập nhật: đề AI linh hoạt

Đề AI không còn được kiểm tra theo ma trận: không ép chuyên đề, mức nhận thức, số lượng hay vị trí của từng độ khó. Giáo viên đặt số câu theo ba loại (tổng 1–60, tối đa 40 mỗi loại). AI tự phân loại mỗi câu thành Dễ, Trung bình, Khó hoặc Rất khó. Chỉ kiểm tra số câu yêu cầu, nội dung không trùng, đáp án hợp lệ và nhãn độ khó; chuyên đề được phân loại để lưu dữ liệu, không yêu cầu phủ toàn bộ danh mục. Khi lưu, giao hoặc cập nhật đề giáo viên cũng không kiểm tra ma trận. Thanh bên hiển thị số câu thực tế theo 4 độ khó.

## Mọi môn học

Tạo AI nhận tài liệu bất kỳ môn học, ví dụ Database Systems. Không kiểm tra chương trình Toán 9, mã chuyên đề hoặc phân bố độ khó. skillId không bắt buộc; câu không phân loại được lưu thành bản nháp do giáo viên sở hữu trong nhóm tài liệu chung (grade 0), ngoài chương trình và khảo sát Toán. Giao diện hiển thị 4 nhóm độ khó.

## Kiểm chứng chạy thật

Ngày 17/10/2026: API cục bộ đã được khởi động lại để nạp bản sửa. Gọi qua http://127.0.0.1:3000/api/v1/assignments/ai-preview với tài liệu Database Systems và MWAPI thật: bộ 3 câu thành công trong 8 giây; bộ 22 câu (12/4/6) thành công trong 30 giây. Kết quả lưu tại docs/evidence/teacher-composer/generated-database-22.json. Không còn cần tải đủ chuyên đề Toán.
