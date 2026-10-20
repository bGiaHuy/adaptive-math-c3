# Đánh giá và năm học THPT

- Hồ sơ lớp 10, 11, 12 nhận bài đánh giá của chính khối đó: 12 câu trắc nghiệm, 2 câu đúng/sai, 4 câu trả lời ngắn; 45 phút. Chọn từ câu PUBLISHED hoặc DRAFT đã VERIFIED; đồng thời nhận bản nháp chia sẻ theo whitelist batch đã SOURCE_KEY_AND_SOLUTION_CHECKED, loại nhãn NEEDS_REVIEW, không lặp nội dung. Bốc ngẫu nhiên trong từng ô ma trận cố định bên dưới. Đây là đánh giá hỗ trợ học tập, không phải đề thi quốc gia chuẩn hóa.
- Khi thiếu dữ liệu, hệ thống xác định đúng số vị trí thiếu theo loại câu/mức nhận thức/độ khó rồi gọi AI hiện có để tạo bù và giải kiểm tra độc lập. Kho đủ hoặc đang làm tiếp không gọi AI. Không tự công bố bản nháp, lấy câu lớp khác hoặc thay mức độ để bù.
- Lần xác thực đầu tiên khởi tạo mốc khối hiện tại bằng audit STUDENT_GRADE_ANCHOR. Tài khoản cũ không bị suy đoán khối từ ngày đăng ký. Đổi khối trong thiết lập tạo mốc mới.
- Mỗi request xác thực cập nhật khối theo mốc 00:00 ngày 05/09, Asia/Ho_Chi_Minh; bắt kịp nhiều năm vắng mặt và dừng ở lớp 12. Đây là cập nhật khi truy cập, không cần cron/deployment mới. Audit và hồ sơ được ghi trong transaction có khóa cùng học sinh. Không thay lớp học của giáo viên, điểm hay lượt làm bài cũ; xóa ngày thi cũ khi lên khối.
- Biểu đồ và lộ trình lọc theo khối hiện tại; kết quả lớp trước không bị xóa. Lượt đang làm tiếp tục được giữ nguyên. Bài đã hoàn thành ở khối cũ không chặn việc làm bài mới.
- Lịch kết thúc kỳ thi phải cấu hình từng năm bằng biến môi trường THPT_EXAM_COMPLETION_DATES, dạng JSON, ví dụ `{"2026":"2026-06-13"}`: hiện lời chúc từ 00:00 ngày sau ngày thi cuối cùng. Năm 2026 thi 11–12/06 theo Bộ GDĐT: https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/ket-thuc-coi-thi-ky-thi-tot-nghiep-thpt-nam-2026-an-toan-nghiem-tuc-trong-boi-canh-nhieu-thach-thuc-moi-273.html
- Không ngoại suy ngày năm sau. Khi chưa có lịch chính thức, tiếp tục ôn lớp 12. Cập nhật cấu hình sau mỗi công bố chính thức; ứng dụng không tự crawl website. Lời chúc hoàn thành kỳ thi không khẳng định đã được công nhận đỗ tốt nghiệp.
- Giao diện làm mới hồ sơ khi chuyển trang, trở lại cửa sổ và mỗi phút trong phiên học sinh.

## Ma trận đầu vào thpt-entry-matrix-v1

Mỗi lượt mới dùng UUID lượt làm làm hạt giống bốc câu, không dùng mã học sinh làm đề cố định. Danh sách câu đã chọn được lưu để tải lại và làm tiếp giữ nguyên đề. Ma trận dự án theo dữ liệu đã rà soát; không tự suy lại ma trận khi kho thay đổi và không dùng để so sánh trực tiếp điểm giữa các lớp.

| Khối | Loại câu | Mức nhận thức | Độ khó | Số câu |
| --- | --- | --- | --- | --- |
| 10 | Trắc nghiệm | Thông hiểu | Dễ | 4 |
| 10 | Trắc nghiệm | Thông hiểu | Trung bình | 8 |
| 10 | Đúng/sai | Thông hiểu | Trung bình | 2 |
| 10 | Trả lời ngắn | Thông hiểu | Trung bình | 1 |
| 10 | Trả lời ngắn | Vận dụng | Trung bình | 2 |
| 10 | Trả lời ngắn | Vận dụng | Khó | 1 |
| 11 | Trắc nghiệm | Thông hiểu | Dễ | 4 |
| 11 | Trắc nghiệm | Thông hiểu | Trung bình | 8 |
| 11 | Đúng/sai | Thông hiểu | Trung bình | 2 |
| 11 | Trả lời ngắn | Vận dụng | Trung bình | 4 |
| 12 | Trắc nghiệm | Thông hiểu | Trung bình | 12 |
| 12 | Đúng/sai | Thông hiểu | Trung bình | 2 |
| 12 | Trả lời ngắn | Vận dụng | Trung bình | 3 |
| 12 | Trả lời ngắn | Vận dụng | Khó | 1 |

## Kiểm chứng ngày 20/10/2026

- Kiểm tra read-only DB bằng `node scripts/audit-thpt-diagnostic.cjs` từ `apps/api`: cả ba khối tạo được đề 18 câu. Số câu đủ điều kiện trước lọc trùng/nghi vấn theo thứ tự trắc nghiệm / đúng-sai / trả lời ngắn: lớp 10 = 83/10/20; lớp 11 = 24/2/4; lớp 12 = 12/2/4. Lớp 12 hiện vừa đủ một tập câu, vì vậy các lượt có thể lặp lại tập câu; không tuyên bố mỗi lượt là một đề mới hoàn toàn.
- Lint, format:check, architecture:check, typecheck, build frontend/API đạt. 50/50 kiểm thử frontend đạt. 24/24 kiểm thử chọn đề, chấm hỗn hợp, lưu/tiếp tục và vòng đời THPT đạt.
- Kiểm tra trình duyệt bằng API fixture riêng: màn hình 1366px và 390px mở được bài theo lớp, không tràn ngang; lời chúc hoàn thành kỳ thi lớp 12 hiển thị; không có lỗi JavaScript. Kiểm tra này xác nhận giao diện, không thay thế kiểm tra dữ liệu thật ở trên.
- Toàn bộ API: 182 đạt, 9 lỗi, 17 bị bỏ qua do setup suite lỗi. Những lỗi còn lại cũng xuất hiện khi đối chiếu bằng bản sao các service trước thay đổi lần này: `assignment.integration` và `classroom.integration` vẫn gửi grade 9; `diagnostic.integration` và ba ca `diagnostic-resilience.integration` vẫn dùng luồng Toán 9 bị khóa; `e2e-scenarios.integration` có một ca onboarding grade 9 và hai ca login admin mẫu 401; `math-learning.integration` thiếu author fixture (null.id); `thpt-transition` giả định AdminService không truy cập DB, trong khi thay đổi kho học liệu hiện hữu đã sử dụng DB. Không bỏ assertion, skip test hoặc đổi policy để làm xanh.
- Bản sao baseline có thêm ba lỗi đường dẫn do vị trí sao chép (`legacy-importer`, `math-provider-stream`, `english.service`); chúng không xuất hiện ở cây mã chính và không được tính là lỗi sản phẩm. Các thư mục bản sao đã được xóa sau đối chiếu.

### Bổ sung chọn ngẫu nhiên đúng ma trận

26 kiểm thử liên quan đạt: đúng số lượng từng ô, cùng lượt không đổi đề, lượt mới có thể khác câu, thiếu mức nhận thức/độ khó bị từ chối, không lộ đáp án khi tiếp tục. Toàn bộ API: 184 đạt, 9 lỗi baseline như trên, 17 bị bỏ qua do setup suite lỗi. Nhãn mức nhận thức và độ khó lấy nguyên từ dữ liệu; không tự đổi nhãn để lấp ma trận. Kho đã rà soát chưa có đủ nhóm Nhận biết/Vận dụng cao cho cả ba lớp, nên phiên bản này không tuyên bố đo riêng hai nhóm đó.

### Tạo bù có điều kiện bằng API AI

- `DiagnosticSupplementService` kiểm tra ma trận trước. Không thiếu thì không gọi cấu hình AI, không giữ ngân sách và không gọi provider. Lượt đang làm giữ nguyên danh sách câu, cũng không gọi AI.
- Chỉ tạo số câu thiếu đúng slot, gắn chuyên đề thật của đúng lớp; loại sai cấu trúc, trùng nội dung, sai mức, đáp án không hợp lệ. Kiểm tra độc lập không được xem đáp án hoặc lời giải của lượt tạo; đáp án độc lập phải khớp bộ chấm. Đầu ra sai được tái tạo tối đa một lần trong thời hạn chuẩn bị 180 giây.
- Câu sinh thêm là DRAFT riêng theo `authorId` và `source.studentId`, trạng thái riêng `AI_DIAGNOSTIC_CHECKED`, có phiên bản ma trận, model và provenance `humanReviewed:false`. Không ghi VERIFIED/PUBLISHED hay sửa câu nguồn. Câu riêng đã lưu được tái sử dụng để không gọi AI lặp lại khi retry hoặc ở lượt sau nếu kho đã đủ.
- Giữ cấu hình provider/model, khóa và hạn mức của `AiBudgetService`; một reservation bao trùm cả tạo và giải kiểm tra, không dùng ngoại lệ ngân sách dành cho đề giáo viên. Khoản chưa chắc chắn đã bị tính phí được giữ trong ledger. Không gửi danh tính học sinh hay khóa API cho model/browser.
- Network AI chạy ngoài transaction. Khi ghi chỉ khóa ngắn cùng học sinh, kiểm tra lại khối/phiên luyện/lượt kiểm tra và ghi draft + audit. Timer chỉ bắt đầu sau khi đề sẵn sàng và được mở bằng luồng hiện hữu.
- Client dành tối đa 210 giây cho mở đề, hiển thị trạng thái chờ có phản hồi, chống bấm lặp và cho thử lại tại cùng màn hình. Nếu provider hoặc ngân sách không khả dụng, không dùng câu chưa kiểm tra hoặc giảm ma trận để giả vờ thành công; trạng thái học và đáp án cũ không bị xóa.
- Cạnh `diagnostic → ai` được ghi trong ADR 0002, kèm fixture kiểm tra public/private; không thay schema hoặc deployment.
- Kiểm chứng bổ sung: 36/36 kiểm thử API liên quan đạt, 52/52 kiểm thử frontend/kiến trúc đạt; lint, định dạng, architecture:check, typecheck và build frontend/API đạt. Toàn bộ API có 194 ca đạt, 9 lỗi baseline và 17 ca bỏ qua do setup suite lỗi như các lượt trước.
- Trình duyệt với API fixture trên màn hình 390px xác nhận trạng thái chờ, chống bấm lặp chỉ một POST, thử lại ngay tại chỗ sau 503, không có timer trước khi đề sẵn sàng và bắt đầu đủ 45 phút. Không phát sinh lỗi giao diện hoặc tràn ngang.
- Kết nối AI hiện có đã bật; kiểm thử thiếu câu dùng provider giả lập, không cố tình gọi AI thật khi kho đủ chỉ để chạy thử.


### Hoàn thiện phạm vi THPT và xử lý kiểm thử bị bỏ qua (20/10/2026)

- Tài khoản mới mặc định lớp 10, ôn cuối kỳ. Mục tiêu ôn đại học chỉ hiển thị và được server chấp nhận ở lớp 12. Hồ sơ cũ được chuẩn hóa khi đăng nhập/xác thực, có audit; bài THCS dang dở được lưu trạng thái ABANDONED, giữ nguyên nội dung và câu trả lời.
- Biểu đồ năng lực và lộ trình đọc kỹ năng của lớp hiện tại; lên lớp không xóa lịch sử. Mục tiêu ôn đại học dùng ngưỡng 85%. Lớp 10/11 không nhận mục tiêu tuyển sinh/đại học qua API.
- Kho danh mục hiển thị kỹ năng thật và trạng thái theo số câu đủ điều kiện. Luyện tập nhận được cả câu nháp đã kiểm tra đúng quyền sở hữu, thay vì chọn được rồi từ chối khi trả lời.
- Sổ lỗi/ôn hỗ trợ đủ ba dạng. Câu riêng trong bài giao chỉ ôn sau khi chính học sinh đã nộp và kết quả được công bố, dùng snapshot của bài giao, không sửa nguồn. Câu xuất hiện trong bài đang làm được ẩn đáp án. Tài liệu giáo viên mới gắn kỹ năng theo lớp của lớp học; dữ liệu grade 0 cũ chỉ hiển thị trong ngữ cảnh bài THPT đã trả kết quả.
- Gia sư dùng ngữ cảnh THPT và lớp hiện tại. Tạo đề AI cho giáo viên có thời gian chờ trình duyệt 330 giây, bao phủ giới hạn server 300 giây; không tự gửi lại POST.
- Nguyên nhân 17 test bị bỏ qua là beforeAll lỗi: 14 ca của assignment dùng lớp 9 bị DTO từ chối; 3 ca math-learning thiếu tài khoản tác giả. Global setup nay tạo schema kiểm thử riêng có admin và ngân hàng THPT tối thiểu, tự xóa schema của lượt đó. Các assertion ownership, chống giả mạo, chấm điểm, snapshot, cạnh tranh và chống phát lại vẫn chạy.
- Migration `20261020090000_thpt_defaults` chỉ đổi default cho bản ghi mới; chưa áp dụng lên môi trường triển khai. Không xóa hoặc sửa đáp án ngân hàng lịch sử.
- Kiểm tra UI bằng fixture trên Chrome: danh sách mục tiêu lớp 10/11/12 và đặt lại mục tiêu khi đổi lớp, trả lời/chấm/lưu mức nhớ cho cả ba dạng, desktop/mobile bài đầu vào, chuẩn bị câu bù/retry/không chạy đồng hồ trước khi sẵn sàng. Không có lỗi JavaScript trong các luồng này. API integration riêng kiểm tra dữ liệu thật trên schema thử nghiệm, bao gồm private drafts, snapshot giáo viên, quyền xem, lên lớp và giữ lịch sử.
