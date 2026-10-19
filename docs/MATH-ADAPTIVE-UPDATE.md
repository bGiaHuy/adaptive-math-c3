# Bản sửa AdaptiveMath theo định hướng báo cáo

Ngày 09/10/2026. Đã sửa mã nguồn Math tại workspace; chưa triển khai lên site hoặc thay đổi database phục vụ người dùng. Không sửa sản phẩm Adaptive English, cấu trúc bảng English hay tài liệu Word gốc.

## Thay đổi chính

1. Thay cộng/trừ theta bằng 3PL/MAP, thêm sai số chuẩn, cấp vận dụng cao, câu xác minh và lọc theo khối lớp. Kỹ năng chưa đánh giá hiển thị chưa có dữ liệu; thành thạo phải có bằng chứng.
2. Thêm vòng học: lý thuyết/ví dụ → khởi động → luyện thích ứng → kiểm tra nhanh → cập nhật BKT, sổ lỗi và FSRS. Có ghi chú lý thuyết thí điểm cho tám mã kỹ năng; không coi đây là 92 bài hoàn chỉnh.
3. Lộ trình dùng mục tiêu, thời gian/ngày, ngày thi, khoảng cách năng lực, buổi đã làm hôm nay và câu đến hạn. Nút luyện mở đúng chủ đề.
4. Lưu tiến độ trên máy chủ, tiếp tục buổi dở, chống ghi trùng và giữ câu đang gửi khi mất mạng. Lịch hoạt động dùng dữ liệu thật; bỏ lịch sử mẫu và tự dùng API giả khi lỗi.
5. Giao diện desktop/điện thoại; font công thức đóng gói cùng ứng dụng.

## Kiểm tra

- Kiểm tra kiểu dữ liệu, build API và frontend: đạt.
- Phạm vi Math: 13 tệp, 59 kiểm thử đạt; một ca English bỏ qua theo phạm vi. Không tuyên bố bộ English đã đạt.
- Migration thử từ schema cũ trong database cô lập; schema sau thay đổi khớp Prisma; bản ghi English mẫu được giữ nguyên.
- Edge với API thật trên database thử: chẩn đoán, lộ trình, ba pha luyện, hoàn thành, bố cục 390px không tràn ngang, mất mạng/tải lại/gửi lại một lần và không có lỗi JavaScript chưa xử lý.
- Câu QA chỉ thêm trong database cô lập. Ảnh và biên bản: [kiểm tra trình duyệt](evidence/math-adaptive/BROWSER-VERIFICATION.md).

Chạy lại: `npm run typecheck`, `npm run build:api`, `npm run build`, `node scripts/verify-math-adaptive.mjs --browser`. Trình kiểm tra tạo database riêng; browser cần Edge và các thư viện QA tại workspace. Cầu nối PGlite chỉ dùng thử nghiệm, không dùng production.

## Trước khi triển khai

1. Sao lưu và đối chiếu schema đích. Lịch sử migration cũ chưa mô tả toàn bộ Math; nếu từng dùng db push, phải baseline trước. Không reset hoặc tự chạy toàn bộ migrate deploy để xử lý chênh lệch.
2. Áp dụng migration bổ sung `apps/api/prisma/migrations/20261009100000_math_adaptive_loop/migration.sql` sau khi xác nhận schema Math hiện hữu, gồm Math review. Thêm tham số IRT, số bằng chứng, danh sách kỹ năng, mức vận dụng cao và bảng phiên luyện; không chuyển đổi/xóa bảng English.
3. Generate Prisma và triển khai API/frontend cùng phiên bản. Endpoint mới cần schema mới.
4. Kiểm tra kho đã duyệt từng lớp/chủ đề. Seed hiện tại thường chỉ một–hai câu/chủ đề; ít hơn ba câu sẽ báo thiếu nội dung. Nên có ít nhất chín câu, thêm câu xác minh mỗi mức, lời giải rõ và được giáo viên duyệt. Không tự xuất bản câu để đạt số lượng.

## Giới hạn còn lại

- IRT/BKT dùng tham số tạm; cần dữ liệu học sinh và thực nghiệm trước/sau, chưa chứng minh kết luận hiệu quả trong báo cáo.
- Chưa xác nhận đủ 1.472 câu/92 bài; cần hoàn thiện nội dung và kiểm tra chuyên môn.
- Lịch hiện tại ưu tiên theo bằng chứng/ngân sách; chưa có đồ thị tiên quyết hoặc tối ưu lịch toàn chương trình.
- Chưa học hoàn toàn offline, đồng bộ nhiều thiết bị mất mạng hoặc đo thời gian đọc lý thuyết.

Đặc tả: [ASSESSMENT-ALGORITHM-SPEC.md](ASSESSMENT-ALGORITHM-SPEC.md).
