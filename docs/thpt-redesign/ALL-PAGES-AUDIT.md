# Rà soát toàn bộ giao diện — Soft Pastel Bento

Ngày: 19/10/2026. Đã kiểm tra các trang và trạng thái được liệt kê dưới đây; giao diện đang cập nhật tại web cục bộ 3017.

## Thay đổi chính

- Thống nhất token màu, Poppins, spacing, card 16–24px, shadow nhẹ, nút bo tròn và focus ring qua pastel-pages.css. Các component được tải muộn dùng cùng hợp đồng thiết kế thay vì quay về CSS cũ.
- Thư viện đề: nhóm trạng thái lavender, bộ lọc trong card, thẻ bài giao pastel, tiến độ mint, thao tác chính/phụ có phân cấp; giữ chuyển dạng thẻ/danh sách và bộ lọc.
- Kết quả và phân tích: bốn khối số liệu mint/yellow/lavender/pink, vùng cần xử lý warm yellow, card biểu đồ và bảng điểm rõ ràng; giữ ngữ nghĩa đúng/sai/chưa nộp và cách tính điểm.
- Lớp học, học sinh, sổ điểm, tiến độ kỹ năng, mã mời, form tạo lớp dùng cùng surface và bộ điều khiển.
- Soạn đề: đồng bộ năm cách tạo, vùng nhập, sidebar ma trận, thiết lập, xem lại; đưa thanh lưu về luồng trang để không che ô nhập.
- Preview câu đã chọn, preview đang soạn và xem lại đề trước khi giao dùng QuestionDisplay, luôn hiện đủ nội dung/đáp án/lời giải, không giấu câu hỏi sau accordion.
- Chọn lớp, mục tiêu, thời gian, ngày thi, tự đánh giá, chủ đề và xác nhận trong 8 bước onboarding được kiểm tra; sửa độ tương phản ghi chú.
- Đồng bộ trang quản trị, trạng thái chờ duyệt/từ chối, hộp thoại phiên đăng nhập/đổi mật khẩu/chính sách, gia sư, trang không tìm thấy và tải dữ liệu. Thêm tên truy cập cho hai select quản trị và focus cho bảng cuộn.

## Quy tắc giữ nguyên

Không thay dữ liệu ngân hàng, đáp án nguồn, snapshot bài giao, ownership, API regrade, revision/audit hoặc quy tắc khóa nội dung khi đã có lượt làm. Các ô trả lời ngắn xanh/viền đen, mỗi phương án A–D có box riêng, vòng Đ/S xanh/viền đen và nút chỉnh sửa từng câu phía phải được giữ. Kiểm tra paper fixture có 3 câu hiện đủ, 0 câu nằm trong details và 3 nút chỉnh sửa riêng.

## Kết quả kiểm thử

- 47 màn hình/trạng thái ở 1074px và 390px (94 kiểm tra bố cục): không tràn ngang; không lỗi runtime hoặc trường hợp render thất bại.
- axe-core WCAG 2A/2AA/2.1AA: không phát hiện vi phạm trong các trạng thái được kiểm tra sau sửa.
- Trang chào mừng/đăng nhập/đăng ký được kiểm tra riêng tại 1440, 1074, 768, 390px, không tràn ngang, không lỗi axe. Dashboard/ngân hàng được kiểm tra lại ở 5 chiều rộng từ 375 đến 1440px.
- 6 kiểm thử frontend chuẩn hóa câu hỏi + 17 kiểm thử backend chấm/luồng giáo viên: 23/23 đạt. Build frontend đạt.

## Danh sách kiểm tra

| Màn hình / trạng thái | Desktop / mobile | Runtime | axe |
|---|---|---|---|
| Thư viện đề có dữ liệu | Đạt | Đạt | Không phát hiện lỗi |
| Kết quả bài giao | Đạt | Đạt | Không phát hiện lỗi |
| Phân tích từng câu | Đạt | Đạt | Không phát hiện lỗi |
| Đề và đáp án ba loại câu | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập bài giao | Đạt | Đạt | Không phát hiện lỗi |
| Danh sách lớp | Đạt | Đạt | Không phát hiện lỗi |
| Tổng quan lớp | Đạt | Đạt | Không phát hiện lỗi |
| Danh sách học sinh | Đạt | Đạt | Không phát hiện lỗi |
| Sổ điểm | Đạt | Đạt | Không phát hiện lỗi |
| Tiến độ kỹ năng | Đạt | Đạt | Không phát hiện lỗi |
| Hộp thoại tạo lớp | Đạt | Đạt | Không phát hiện lỗi |
| Chỉnh đáp án trong bài giao | Đạt | Đạt | Không phát hiện lỗi |
| Kiểm tra công bố điểm | Đạt | Đạt | Không phát hiện lỗi |
| Bài làm từng học sinh | Đạt | Đạt | Không phát hiện lỗi |
| Lớp học học sinh | Đạt | Đạt | Không phát hiện lỗi |
| Dashboard học sinh | Đạt | Đạt | Không phát hiện lỗi |
| Hộp thoại gia sư | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 1 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 2 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 3 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 4 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 5 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 6 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 7 | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập hồ sơ bước 8 | Đạt | Đạt | Không phát hiện lỗi |
| Tổng quan quản trị | Đạt | Đạt | Không phát hiện lỗi |
| Tài khoản quản trị | Đạt | Đạt | Không phát hiện lỗi |
| Nhật ký kiểm toán | Đạt | Đạt | Không phát hiện lỗi |
| Hồ sơ giáo viên chờ duyệt | Đạt | Đạt | Không phát hiện lỗi |
| Hồ sơ giáo viên cần cập nhật | Đạt | Đạt | Không phát hiện lỗi |
| Phiên đăng nhập | Đạt | Đạt | Không phát hiện lỗi |
| Đổi mật khẩu | Đạt | Đạt | Không phát hiện lỗi |
| Chính sách và điều khoản | Đạt | Đạt | Không phát hiện lỗi |
| Kết quả học sinh | Đạt | Đạt | Không phát hiện lỗi |
| Không tìm thấy trang | Đạt | Đạt | Không phát hiện lỗi |
| Đang tải | Đạt | Đạt | Không phát hiện lỗi |
| Danh mục THPT | Đạt | Đạt | Không phát hiện lỗi |
| Soạn đề bằng AI | Đạt | Đạt | Không phát hiện lỗi |
| Soạn từ kho đang tạm ngưng | Đạt | Đạt | Không phát hiện lỗi |
| Soạn thủ công | Đạt | Đạt | Không phát hiện lỗi |
| Tải đề từ tệp | Đạt | Đạt | Không phát hiện lỗi |
| Nhập JSON | Đạt | Đạt | Không phát hiện lỗi |
| Giám sát lớp học quản trị | Đạt | Đạt | Không phát hiện lỗi |
| Thiết lập giao bài trước khi lưu | Đạt | Đạt | Không phát hiện lỗi |
| Xem lại đề trước khi giao | Đạt | Đạt | Không phát hiện lỗi |
| Màn hình làm bài | Đạt | Đạt | Không phát hiện lỗi |
| Xác nhận nộp bài | Đạt | Đạt | Không phát hiện lỗi |

## Phạm vi và giới hạn bằng chứng

Bộ rà soát dùng các component thật với dữ liệu kiểm thử tách biệt, chặn mọi mutation API. Không tự tạo tài khoản, giao bài, sửa điểm hay công bố kết quả thật. Kết quả này xác nhận bố cục/render/truy cập trong các trạng thái đã liệt kê, không thay thế regression nghiệp vụ với database thật, kiểm tra bằng người dùng khuyết tật hoặc mọi tổ hợp dữ liệu có thể có.

Các route học tự động đang tạm ngưng (profile/learning-path/diagnostic/missions/mistakes/review/practice) hiện dùng chung CurriculumExplorer đã kiểm tra. Những màn hình cũ sau cờ tạm ngưng không được tuyên bố đã chạy lại với học liệu THPT; khi mở kho cần kiểm thử riêng.

Chứng cứ: docs/evidence/pastel-all-pages/report.json và ảnh <mode>-1074.png / <mode>-390.png. Script: node scripts/audit-all-pastel.mjs. Harness scripts/pastel-audit.html chỉ là công cụ phát triển, không phải trang sản phẩm hay dữ liệu production.

Bổ sung: docs/evidence/pastel-thpt/report.json, entry-refinement-report.json.
