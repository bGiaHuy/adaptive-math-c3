# Batch 10 — Thiết lập, xóa bài và hồi quy

## Findings
- P1, xóa bài: lỗi request ở ngoài overlay nên người dùng khó biết vì sao hộp xác nhận vẫn mở. Hiện lỗi ngay trong dialog; thêm lớp/số bài nộp và trạng thái đang xóa.
- P1, thiết lập: ô nhập vẫn chỉnh được lúc request đang gửi, làm kết quả lưu và nội dung hiển thị lệch nhau. Khóa fieldset trong lúc xử lý; giữ nội dung khi lỗi và đưa focus đến lỗi.
- P2: tùy chọn Sau hạn nộp bị vô hiệu hóa mà thiếu lý do. Bổ sung hạn hiện tại hoặc lời giải thích chưa có hạn. Không đổi chính sách công bố, quyền hay API.

## Changes / files
src/components/TeacherWorkspace.jsx; scripts/verify-teacher-settings.mjs.

## Evidence
Chrome actual React qua API fixture: lưu lỗi giữ title/focus alert, retry cập nhật; đóng/mở chỉ thay trạng thái nhận bài, published vẫn false; CSV đủ 35 học sinh + header; mở/hủy xác nhận không gọi DELETE; xóa lỗi hiện trong modal, retry cập nhật danh sách. 1440×900, 820×1000, 390×844 không tràn ngang. Xem ảnh mobile lỗi xóa. Không pageerror; request ghi được chặn và trả fixture, không xóa bài thật.
Artifacts: docs/evidence/teacher-settings/verification.json; settings-{desktop,tablet,mobile}.png, delete-error-mobile.png.
Build thành công. Chạy lại 7 script hồi quy đều exit 0: assignment-report-ux, teacher-regrade-ux, teacher-composer-flow, teacher-draft-reuse, teacher-manual-json, teacher-generation, teacher-class-management. Báo cáo kết quả/analytics/dialog công bố chạy axe không phát hiện vi phạm trong phạm vi rules đã chạy.

## Remaining / next batch
Chưa có baseline cùng trạng thái cho ảnh mới. Fixture không chứng minh giao dịch/quyền backend; chưa kiểm tra tải CSV bằng ứng dụng bảng tính. Cần kiểm tra keyboard/axe trên các dialog và form còn lại, đối chiếu audit toàn portal và vá các lỗi được tìm thấy trước khi kết luận goal. Không coi hồi quy hiện có là đủ chứng minh hoàn tất sản phẩm.
