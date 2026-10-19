# AdaptiveMath — đặc tả đánh giá và học thích ứng

Cập nhật 09/10/2026. Phạm vi Math; thay thế đặc tả cộng/trừ theta trước đây.

## Chẩn đoán

Chỉ dùng câu PUBLISHED thuộc khối lớp học sinh. Mỗi phiên chọn tối đa tám kỹ năng, ưu tiên chưa đánh giá rồi đến yếu, lưu danh sách kỹ năng để tiếp tục phiên. N/H/V/T tương ứng REMEMBERING/UNDERSTANDING/APPLYING/ADVANCED_APPLYING.

Mỗi kỹ năng bắt đầu ở mức thấp nhất có câu. Đúng thì lên mức; sai lần đầu cần câu khác cùng mức để xác minh; sai lần hai dừng kỹ năng. Thiếu câu xác minh thì dừng nhánh, không kết luận đã xác minh. Ưu tiên kỹ năng có ít câu trả lời; trong mức phù hợp chọn thông tin Fisher cao, tie-break theo phiên để tải lại ổn định. Không lặp câu. Giới hạn mặc định 24 câu, DIAGNOSTIC_MAX_QUESTIONS từ 1–64; hết nhánh có câu sẽ kết thúc sớm, không cam kết đã đủ bằng chứng.

## IRT và độ chắc chắn

3PL: P(theta) = c + (1-c)/(1+exp(-a*(theta-b))). Theta ban đầu 0; MAP prior N(0,4), Fisher scoring tối đa 60 bước, bước tối đa 0,75, theta trong [-4,4]. Sai số chuẩn dùng thông tin Fisher cộng prior.

Câu có thể lưu irtA/irtB/irtC. Mặc định a=1,2; b=-1,5/-0,5/0,5/1,5 theo mức; c=0,25. Tham số **tạm, chưa hiệu chuẩn** với học sinh; API ghi PROVISIONAL. Không khẳng định hiệu quả giáo dục đã được thực nghiệm.

Điểm kỹ năng sau chẩn đoán pha trộn tỷ lệ đúng và dự báo MAP với trọng số quan sát min(n/5,1). Không có trả lời thì null, không phải 0. Dưới năm bằng chứng là chưa đủ dữ liệu.

## Luyện và lộ trình

Chủ đề cần ít nhất ba câu đã duyệt. Buổi tối đa chín câu: khởi động/luyện/kiểm tra nhanh 2/5/2 nếu đủ kho. Khởi động ưu tiên dễ. Luyện ưu tiên câu mới gần MAP; hai đúng liên tiếp tăng độ khó, hai sai giảm. Câu kiểm tra được giữ riêng, ưu tiên mới gần theta chẩn đoán +0,3.

BKT ngoài khởi động: pT=0,15, pG=0,25, pS=0,10. Câu mới tăng evidenceCount; đúng câu đã gặp không tăng điểm/bằng chứng; sai câu cũ vẫn điều chỉnh kiến thức. BKT chưa hiệu chuẩn; điểm BKT và chẩn đoán là chỉ báo vận hành, chưa chứng minh là thang đo tương đương.

Ngưỡng mục tiêu: cơ bản 75%, cuối kỳ 80%, vào lớp 10 85%, nâng cao/HSG 95%, đồng thời ít nhất năm bằng chứng. Đây là ngưỡng sản phẩm. Lộ trình ưu tiên khoảng cách năng lực, phân biệt chưa đánh giá và lỗ hổng, tính lại theo tiến độ, ngân sách 15–240 phút/ngày, tối đa hai chủ đề/ngày, dành thời gian ôn đến hạn và ngày ôn mỗi bốn ngày. Dùng ngày Việt Nam. Chưa tối ưu quan hệ tiên quyết.

Câu sai được lưu sổ lỗi và tạo thẻ FSRS bằng dịch vụ Math review hiện hữu. FSRS theo câu không thay thế đánh giá toàn chủ đề.

## Lưu trữ

Máy chủ giữ câu hiện tại, lịch sử, trạng thái, kết quả; chỉ chủ sở hữu truy cập, đáp án/lời giải chỉ trả sau trả lời. Transaction khóa theo học sinh, chống ghi trùng khi gửi/nộp lại. Chẩn đoán và luyện không mở đồng thời. Nộp chẩn đoán cập nhật điểm và sổ lỗi nguyên tử; kết quả chỉ mở sau nộp.

Câu luyện đang gửi được giữ tạm theo tài khoản trên thiết bị; gửi lại cùng payload khi mất phản hồi. Chưa học hoàn toàn offline hoặc đồng bộ nhiều thiết bị mất mạng. Lịch hoạt động lấy phiên hoàn thành và thời gian trả lời trên máy chủ; không tạo lịch sử/streak mẫu, chưa tính thời gian đọc lý thuyết. Không tự dùng API giả khi lỗi; demo chỉ bật trong development bằng VITE_MATH_DEMO=true.

Kiểm chứng và giới hạn: [MATH-ADAPTIVE-UPDATE.md](MATH-ADAPTIVE-UPDATE.md). Kiểm thử phần mềm không thay thế hiệu chuẩn và thực nghiệm KHKT.