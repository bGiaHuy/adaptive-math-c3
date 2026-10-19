# Học liệu THPT trên web cục bộ — 19/10/2026

Địa chỉ: http://127.0.0.1:3027/#/teacher-bank

## Nội dung đã đưa lên

- 300 tài liệu PDF thực tế, phân loại 100 tệp/lớp 10, 11, 12; tổng 3.829 trang. Có cả đề và tuyển tập (6 tệp có tiêu đề tuyển tập/bộ đề), không tuyên bố đây là 300 bộ câu hỏi độc lập đã được duyệt toán học.
- Mỗi tệp được mở bằng bộ đọc PDF, kiểm tra SHA-256 theo manifest và lưu số trang thực tế. Các bản metadata cũ có số trang sai được thay bằng kết quả đọc PDF trong catalog xuất bản, không sửa bộ nghiên cứu gốc.
- Tìm theo tên đề/trường, tìm không dấu, lọc lớp/kỳ/năm học/trang đáp án, phân trang.
- Bộ đọc trang nguyên bản trên web và liên kết mở PDF; giữ hình, bảng và cấu trúc phần tự luận. Trang đáp án được nhận diện qua tiêu đề trong PDF (218 tài liệu); đây không phải kết quả kiểm chứng đáp án.
- Danh mục 24 chương và 9 chuyên đề lựa chọn Kết nối tri thức.
- 66 câu trích nguyên bản từ 3 đề Phú Lộc, mã 132: 36 nhiều lựa chọn, 6 đúng/sai, 12 trả lời ngắn, 12 tự luận. 69 đoạn ảnh lấy trực tiếp từ PDF; giữ số câu gốc trong từng phần, các đoạn qua trang và nguồn đối chiếu. Các câu không bị biến đổi thành câu chấm tự động. Đáp án, lời giải, barem mở từ tài liệu gốc của trường.
- Đã thay màn hình chờ học liệu bằng thư viện thực, giữ kho chấm tự động tách riêng trong lúc dữ liệu cần thẩm định.

## Kiến trúc và dữ liệu

- `content/thpt-materials/catalog.json`: catalog xuất bản, chứa metadata và trạng thái trung thực.
- `content/thpt-materials/text/`: văn bản đọc từ PDF để kiểm tra, không dùng làm đáp án; PDF scan có thể không có lớp văn bản.
- `content/thpt-materials/questions.json`, `question-images/`: câu trích hình ảnh nguyên bản; không lấy từ các bản AI chép sai trước đó.
- PDF gốc vẫn ở `outputs/thpt-300-papers/sources/`, không tạo bản sao 235 MB trong thư mục public.
- API `/api/v1/curriculum/materials` và các tuyến tài liệu/ảnh yêu cầu phiên đăng nhập và vai trò hợp lệ. Không công khai PDF hoặc môi trường cấu hình dưới dạng static file.
- Bộ nhớ đệm ảnh trang ở `.cache/materials-pages/`, định danh theo SHA-256 PDF. Ảnh câu trích có hash riêng để thay bản cắt mà không bị trình duyệt giữ bản cũ.
- Không thay schema database, không tạo SkillNode giả, không nhập các đáp án chưa kiểm chứng vào kho PUBLISHED, không đổi các snapshot bài giao.

## Kiểm chứng đã chạy

- `npm run build:api`: đạt.
- `npm run build`: đạt.
- `npm run test --workspace=@adaptivemath/api -- test/learning-materials.spec.ts`: 2 kiểm thử đạt, gồm phân quyền và từ chối đường dẫn/trang không hợp lệ.
- `npm run materials:verify`: kiểm tra thật qua API đang chạy và Chrome với một phiên kiểm thử tạm của giáo viên đã xác minh. Phiên được thu hồi khi kết thúc.
- Tất cả 300 tuyến PDF trả đúng dung lượng/MIME; PDF hỗ trợ byte range; không đăng nhập bị 401; ID/trang sai bị 404.
- Toàn bộ 69 ảnh câu trích tải được và có PNG hợp lệ. Số lượng 66, 12 ESSAY và cờ automaticGrading=false được kiểm tra.
- Bộ đọc tải được ảnh trang thực; đổi lớp, tìm không dấu, lọc tự luận, phân trang và câu đồ thị hai đoạn đã kiểm tra trên UI thật.
- Kiểm tra 1440, 1024, 768, 390px: không tràn ngang. Không có lỗi JavaScript trong phiên kiểm tra.
- axe-core A/AA trên màn hình danh mục được kiểm tra: không phát hiện lỗi tự động. Không coi đây là chứng nhận toàn bộ nội dung PDF hoặc khả năng đọc công thức ảnh bằng trình đọc màn hình.
- Bằng chứng: `docs/evidence/learning-materials/verification.json` và ảnh cùng thư mục.

## Khởi động và cập nhật

- `npm run dev:local`: kiểm tra và khởi động web + API + database hiện có, chạy nền và lưu log ở `.cache/local-web/`. Không tạo lại dữ liệu, không chạy migrate/seed.
- `npm run materials:prepare`: kiểm tra tài liệu, dựng catalog và xuất câu trích từ 3 PDF mẫu. Script câu trích kiểm tra đúng chuỗi 22 câu mỗi đề, không tạo nội dung dự phòng nếu không tìm thấy.
- `npm run materials:verify`: kiểm tra lại bản đang chạy.

## Phân biệt trạng thái học liệu

Bản đọc nguyên gốc đã dùng được trên web. Việc chuẩn hóa và xác minh đáp án từng câu trên toàn bộ 300 tài liệu là bước khác; không được tuyên bố hoàn tất bước đó chỉ vì PDF tải được. Các bản gán vòng lặp và bản chép 66 câu có diễn giải sai của Antigravity không được đưa vào luồng chấm tự động.

Nguồn chưa có chứng cứ quyền tái xuất bản không được gán PUBLIC_DOMAIN trong catalog mới. Lần bàn giao này chỉ phục vụ trên máy cục bộ theo yêu cầu người dùng, không triển khai lên website công khai.
