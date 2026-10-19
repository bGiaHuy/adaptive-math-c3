# Đợt 03 — Điều kiện chuyển bước và phiếu đáp án chưa áp dụng

## Vấn đề

P1 — Soạn đề: bước xác nhận có thể mở trước khi thời lượng/hạn nộp đáp ứng điều kiện hiện có. Người dùng chỉ thấy nút xác nhận bị vô hiệu ở cuối, khó hiểu cách sửa.

P1 — Tải đề từ tệp: phiếu trả lời đang chỉnh nhưng chưa áp dụng ở state cục bộ; đổi phương thức hoặc tải trang có thể mất nội dung chưa áp dụng.

## Thay đổi

- Kiểm tra lớp còn hoạt động, thời lượng nguyên 0–360, hạn nộp khi chọn hiện điểm sau hạn, ngày hợp lệ trước bước xác nhận và trước gửi lưu. Không đổi các điều kiện nghiệp vụ vốn có.
- Hiện thông báo cụ thể tại bước thiết lập, đưa focus tới thông báo khi phù hợp; footer hiển thị điều kiện còn thiếu.
- Phiếu đáp án từ tệp dùng bản nháp theo draftKey, tách khỏi câu đã áp dụng. Không tự áp dụng phiếu, không biến thay đổi chưa xác nhận thành đáp án giao học sinh.
- Lỗi lưu trình duyệt được hiển thị cho người dùng.

## Kiểm tra

`scripts/verify-teacher-composer-flow.mjs` chạy actual React app với API fixture: thời lượng -1 giữ bước thiết lập và giải thích; AFTER_DUE thiếu hạn không cho chuyển; thiết lập hợp lệ mở review, giữ tên/câu; đáp án chưa áp dụng thay B thành C giữ sau reload. Không có request ghi máy chủ.

Bằng chứng: `docs/evidence/teacher-composer-flow/verification.json`, `review-desktop.png` (1440×900), `review-tablet.png` (820×1000), `review-mobile.png` (390×844). Không tràn ngang trong ba viewport. Build production đạt.

Baseline giao diện phương thức tương ứng ở `docs/evidence/teacher-portal-product/before-composer-*.png`; kiểm tra hành vi chuyển bước là kiểm tra có kiểm soát, không có ảnh before đúng trạng thái lỗi -1. Không tuyên bố đã xác minh upload/AI thực hoặc API giao đề qua bộ này.

## Còn lại

Đợt tiếp theo cần kiểm tra upload lỗi/thay tệp, khôi phục bản nháp và chuyển nguồn với câu đã nhập; luồng dùng lại đề, lưu/giao thành công và lỗi; chỉnh sửa đề/tính lại điểm và bảng câu dài. Goal toàn Teacher Portal vẫn đang thực hiện.
