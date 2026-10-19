# Rà soát giao diện Soft Pastel Bento — 19/10/2026

## Thay đổi

- Tiếp tục hệ token và component hiện có trong `src/pastel-bento.css`, `src/components/BentoUI.jsx` và `src/pastel-pages.css`; không thêm thư viện giao diện.
- Đồng bộ ôn tập, lộ trình và nhiệm vụ: mint, pink, lavender, warm yellow; font Poppins với font dự phòng; card 24px, input 16px, spacing 8px và shadow nhẹ.
- Nhiệm vụ có bố cục Bento bất đối xứng ở desktop và một cột trên mobile.
- Đồng bộ focus bàn phím, phản hồi khi nhấn và disabled; input radio/checkbox giữ kích thước riêng.
- Sửa vỏ danh sách lớp và nút chỉnh sửa câu hỏi lavender; giữ nút ở từng câu.
- Ẩn vùng lượt ôn khi chưa có nội dung, tránh thẻ trắng rỗng.
- Giữ nguyên ô đáp án xanh viền đen, các lựa chọn A–D có khung riêng, vòng Đ/S và ngữ nghĩa chấm bài.
- Không đổi API, quyền sở hữu, snapshot bài giao, revision, audit, nội dung học liệu hoặc cơ sở dữ liệu.

## Kiểm chứng

`npm run build`: đạt.

`node scripts/verify-pastel-pages.mjs`: kiểm tra fixture giao diện bằng Chrome headless ở 1440px, 768px và 390px. Kết quả chi tiết ở `docs/evidence/pastel-pages/results.json`; ảnh desktop/mobile ở cùng thư mục.

Phạm vi: thư viện đề có dữ liệu, danh sách lớp, bốn tab báo cáo (kết quả, phân tích, đề và đáp án, thiết lập), soạn đề, năm trang quản trị, nhiệm vụ, lộ trình, ôn tập, lớp học sinh, chờ duyệt giáo viên, onboarding, phiên đăng nhập, đổi mật khẩu, pháp lý, kết quả bài làm, trang không tìm thấy, loading và kho chuyên đề. Bổ sung trạng thái trống hồ sơ năng lực và sổ lỗi.

Kiểm tra thao tác: tìm kiếm thư viện lọc đúng bài; ba dạng câu hiển thị đầy đủ; bốn lựa chọn A–D, bốn vòng Đ/S và ô trả lời ngắn viền đen vẫn hiện; nút chỉnh sửa mở trường chỉnh sửa; focus bàn phím hiện rõ.

axe-core theo WCAG 2 A/AA và 2.1 AA trên thư viện, đề và đáp án, nhiệm vụ, ôn tập: không phát hiện vi phạm tự động. Kết quả này không thay thế kiểm tra khả năng tiếp cận thủ công toàn bộ hệ thống.

## Giới hạn

Các API được mô phỏng chỉ trong kiểm thử, không dùng dữ liệu giả trong ứng dụng. Không coi kiểm tra fixture là kiểm chứng đăng nhập, lưu/chấm lại bài hoặc phân quyền với máy chủ thật. Trang quản trị chủ yếu được kiểm tra trạng thái trống; báo cáo và thư viện có dữ liệu fixture. Font từ Google bị chặn trong bài kiểm tra để kết quả không phụ thuộc mạng; bố cục dùng font dự phòng. Dashboard và đăng nhập đã có bộ kiểm tra trước đó, không nằm trong lần chạy fixture này.

Web xem tại http://127.0.0.1:3027/. Chưa triển khai lên hosting.
