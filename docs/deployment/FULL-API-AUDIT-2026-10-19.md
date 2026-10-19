# Báo cáo kiểm tra API và kết nối production

Hoàn tất kiểm tra: đêm 18, rạng sáng 19/10/2026 (giờ Việt Nam).
Website: https://adaptivemath-blush.vercel.app
Bản sửa đang chạy: `85312edbfc75945e40bc819f9053c1c7d498accf`.

## Kết quả

- Lập danh mục 98 endpoint từ 11 controller và kiểm tra tất cả qua tên miền production. 186 lượt gọi bao gồm không đăng nhập, đăng nhập giáo viên/học sinh, quyền truy cập và dữ liệu không hợp lệ. Không có HTTP 500. Năm endpoint công khai trả thành công là health, ba endpoint curriculum và English topics; các endpoint riêng yêu cầu xác thực.
- 20 lượt kiểm tra vòng đời tài khoản QA: đăng ký, đăng nhập hai phiên, cập nhật hồ sơ giáo viên, thu hồi phiên khác, đổi mật khẩu, cookie cũ bị vô hiệu, mật khẩu cũ bị từ chối, đăng xuất mọi phiên và thiết lập hồ sơ học sinh đều đạt.
- 191/191 bài kiểm thử trong 29 nhóm đạt trên database PostgreSQL tương thích được tạo mới trong bộ nhớ, bao gồm quyền quản trị, Maker–Checker, chẩn đoán đầy đủ, chống giả mạo câu hỏi, nộp đồng thời, khôi phục bài, luyện tập ba pha, ôn tập, tài liệu, AI provider và ngân sách. Dữ liệu mẫu chỉ được nạp khi NODE_ENV=test và database là loopback. Không dùng ngân hàng production để làm giả kết quả kiểm thử.
- Kiểm tra production thật: giao đề 22 câu; lưu nháp, khôi phục, nộp bài, báo cáo giáo viên và công bố điểm đều đạt. Nút xác nhận trên giao diện được bấm thật. PDF Hưng Yên 1.1 MB tải lên và tải lại khớp SHA-256, giao đề kèm PDF thành công.
- Luyện tập production: bắt đầu phiên, lưu đáp án, gửi lặp không ghi trùng, khôi phục và kết thúc phiên đạt.
- Kết nối AI production: gia sư SSE trả sự kiện done, lịch sử đọc/xóa được; AI đọc DOCX và tạo một câu trắc nghiệm hợp lệ thành công. Chỉ dùng yêu cầu QA nhỏ.
- 12 trang chính đã mở trên web thật sau khi tải xong dữ liệu; không gặp lỗi JavaScript hoặc API 500. Gia sư AI mở/đóng và nằm dưới bên phải trên desktop/điện thoại.
- Nhật ký Render trong khoảng kiểm tra không có Unhandled API error mới.

## Lỗi đã sửa và thay đổi kiểm thử

Lỗi lưu đề ban đầu là Prisma P2028 do giao dịch 5 giây bị hết hạn khi ghi từng câu và từng snapshot. Bản production đã dùng ghi theo lô và giao dịch giới hạn 30 giây; vẫn lưu nguyên tử. Không đổi nhãn ngân hàng để vượt ma trận.

Cập nhật các fixture kiểm thử cũ theo yêu cầu nhãn độ khó, ma trận chẩn đoán 22 câu và thao tác ghi theo lô. Bổ sung runner cô lập `scripts/verify-all-api.mjs`; dữ liệu kiểm thử không được nạp vào production. Không thay đổi thêm mã xử lý production trong lượt rà soát này vì không tìm thấy lỗi kết nối hay 500 mới.

## Hạn chế vẫn tồn tại

1. Bắt đầu chẩn đoán Toán 9 trả 400 `DIAGNOSTIC_BLUEPRINT_INSUFFICIENT`: ngân hàng chưa đủ đúng tổ hợp chuyên đề / loại câu / mức nhận thức / độ khó. Cần giáo viên bổ sung hoặc rà soát nội dung và nhãn; chưa tự xuất bản đề giả hoặc ép nhãn để vượt rào. Đây là một luồng người dùng chưa dùng được, không được mô tả là toàn bộ web đã hoàn hảo.
2. Xếp lớp tiếng Anh trả 400 vì chưa đủ ít nhất 6 câu trắc nghiệm ở 2 mức bài học. English topics trả 200; đây là module nội dung khác, không phải mất kết nối database.
3. Các thao tác quản trị làm thay đổi tài khoản/nội dung được kiểm tra dương tính trong môi trường cô lập. Production chỉ kiểm tra hàng rào phân quyền cho chúng; không khóa, đổi quyền hay reset mật khẩu tài khoản thật.
4. Kiểm thử hữu hạn không bảo đảm không thể phát sinh lỗi trong tương lai. Chưa kiểm thử tải đồng thời quy mô lớn hay toàn bộ chất lượng học thuật của ngân hàng.

## Dữ liệu và bằng chứng

Bằng chứng được lưu tại `docs/evidence/full-api-audit-2026-10-18/` và `docs/evidence/assignment-timeout-hotfix/`. Không lưu session cookie, mật khẩu hoặc khóa dịch vụ trong báo cáo. Các lớp, tài khoản và đề QA có nhãn riêng; các bản giao dư tạo để kiểm tra nút xác nhận đã được xóa. Mẫu QA dùng truy vết vẫn được giữ riêng.

Cơ chế duyệt tự động từ chối việc xuất toàn bộ ngân hàng và danh tính tài khoản quản trị ra tệp. Lượt kiểm tra đã chuyển sang thống kê tổng hợp và kiểm tra API bằng dữ liệu QA; không thực hiện xuất bị từ chối. Các thống kê ngân hàng là chẩn đoán, không thay thế việc rà soát học thuật.

## Tắt máy

Người dùng đã yêu cầu tắt máy sau khi xong. Báo cáo này và các bằng chứng đã được ghi xuống đĩa. Lệnh shutdown.exe trả lỗi môi trường 203 cả trong sandbox và khi chạy có quyền ngoài sandbox; đang thử tắt theo giao diện Windows. Không ép đóng ứng dụng hoặc bỏ dữ liệu chưa lưu. Trạng thái cuối được ghi trong `power-action.json` nếu thao tác có kết quả xác định.
