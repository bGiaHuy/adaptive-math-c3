# Rà soát và cải thiện UX AdaptiveMath

Ngày: 18/10/2026. Mục tiêu: giúp người dùng xác định việc tiếp theo, tìm nội dung nhanh, tiếp tục công việc và thoát khỏi các trạng thái bế tắc.

## Các vấn đề và thay đổi

| Vấn đề | Thay đổi | Lợi ích cho người dùng |
| --- | --- | --- |
| Buổi luyện đang dở nằm dưới nội dung khác | Trang chính ưu tiên nút Học tiếp cùng tiến độ đã lưu | Quay lại đúng việc đang làm ngay từ đầu trang |
| Lịch nhiều ngày đẩy danh sách chủ đề xuống xa | Mở hôm nay; gom những ngày tiếp theo trong vùng mở rộng | Ưu tiên việc cần làm ngay, vẫn xem được toàn bộ lịch |
| Khó tìm trong danh sách chủ đề dài | Tìm không dấu, lọc chủ đề luyện được/chưa đánh giá, báo số kết quả, xóa lọc | Tìm chủ đề cụ thể và phục hồi khi không có kết quả |
| Quay lại lộ trình mất bộ lọc | Giữ bộ lọc theo tài khoản trong phiên trình duyệt | Giữ ngữ cảnh khi chuyển màn |
| Điều hướng trên điện thoại chỉ có biểu tượng | Giữ tên mục, cuộn ngang; mục đang chọn tự vào vùng nhìn thấy | Biết mình đang ở đâu và mục nào làm gì |
| Nhiều biểu tượng tài khoản khó hiểu, chiếm thanh đầu | Menu tài khoản có nhãn thao tác đầy đủ | Tìm đổi mật khẩu, phiên đăng nhập và đăng xuất rõ ràng |
| Hộp thoại có thể làm mất điểm focus | Giữ Tab trong hộp thoại, Escape để đóng, trả focus về nơi mở | Dùng được bằng bàn phím, có lối thoát rõ ràng |
| Gia sư tự lấy focus khi trang vừa mở | Chỉ đổi focus khi chủ động mở/đóng gia sư | Không gián đoạn thao tác ban đầu |
| Đăng nhập/đăng ký khó thao tác với nhãn và mật khẩu | Gắn nhãn với ô nhập, chọn vai trò bằng bàn phím, đưa focus tới lỗi đầu, thêm hiện/ẩn mật khẩu đăng nhập | Sửa lỗi và kiểm tra thông tin nhanh hơn |
| Ngân hàng câu hỏi giáo viên lỗi khi mở | Sửa thứ tự khởi tạo bộ lọc; thêm đang tải và không có kết quả | Không còn lỗi làm sập giao diện, biết cách tiếp tục |
| Điều hướng con quản trị không đồng bộ rõ với điều hướng chính | Đồng bộ mục, URL và Back | Không mất ngữ cảnh khi chuyển khu vực |
| Tác giả/thẩm định nhìn thấy mục không có quyền | Chỉ hiện tổng quan và ngân hàng câu hỏi | Giảm các ngõ cụt do phân quyền |
| Màu sắc, khoảng cách và bố cục không nhất quán | Thống nhất nền, màu nhấn, mức chữ, độ rộng nội dung và tương phản | Dễ đọc và nhận diện thao tác giữa các khu vực |

## Phạm vi kiểm tra

23 màn ở 1440×900 và 390×844, tổng 46 trường hợp: trang giới thiệu, đăng nhập, đăng ký, trang không tồn tại; 10 màn học sinh; 4 màn giáo viên; hồ sơ chờ duyệt; 4 màn quản trị.

Bằng chứng: `evidence/site-redesign/final.json` và các ảnh `final-*.png`. Dữ liệu các vai trò học sinh, giáo viên và quản trị lấy từ máy chủ local. Trạng thái hồ sơ chờ duyệt dùng phản hồi vai trò giả lập vì tài khoản mẫu hiện đã được duyệt. Không đổi vai trò tài khoản trên máy chủ để kiểm tra màn này.

Kiểm tra thao tác: `evidence/site-redesign/interactions.json`.

- Biểu mẫu đăng ký: nhãn ô nhập, chọn vai trò bằng bàn phím, báo lỗi khi bỏ trống.
- Menu tài khoản và hộp thoại mật khẩu: Tab, Escape, điều hướng trên điện thoại.
- Lộ trình: lịch hôm nay, tìm không dấu, giữ bộ lọc, xóa lọc khi không có kết quả.
- Trang chính ưu tiên Học tiếp: phản hồi buổi học có kiểm soát, không tạo hay làm bài thật.
- Ngân hàng câu hỏi: mở màn, tìm kiếm, trạng thái trống và xóa bộ lọc.
- Soạn đề: chuyển phương thức, không tràn ở máy tính/điện thoại; không xuất bản đề.
- Quản trị: đồng bộ điều hướng và nút Back.
- Điều hướng tác giả/thẩm định: phản hồi vai trò có kiểm soát; đây không phải kiểm thử quyền truy cập API.

Quét tự động bằng axe theo WCAG 2 A/AA và 2.1 AA tại 7 trạng thái: đăng ký, hộp thoại mật khẩu, lộ trình, trang chính học sinh, ngân hàng câu hỏi giáo viên, tổng quan giáo viên và tổng quan quản trị. Kết quả ghi trong báo cáo thao tác; không đồng nghĩa chứng nhận khả năng tiếp cận toàn web.

Bản dựng production và 10 kiểm thử điều hướng/chuẩn hóa câu hỏi đạt. Màn bài tập học sinh tiếp tục đạt kiểm tra toàn màn hình, hai cột đáp án, giữ đáp án khi chuyển chế độ và chuyển tới câu chưa trả lời ở 1440, 1920 và 390px.

## Giới hạn của kết luận

Đây là rà soát UX chuyên gia cùng kiểm tra tự động trên local, chưa phải thử nghiệm với học sinh/giáo viên thật. Không thực hiện lại toàn bộ nghiệp vụ máy chủ, gửi yêu cầu AI trả phí, nộp bài, xuất bản đề, thay đổi tài khoản hay triển khai production trong đợt này.

Bài kiểm tra soạn đề cũ `verify-composer-redesign.mjs` dừng vì còn chờ phần tử `.tec-bank-choice` của thiết kế ngân hàng cũ; kiểm tra thay thế dùng cấu trúc chọn phương thức hiện tại và được ghi riêng trong báo cáo thao tác.
