# Batch 07 — Soạn thủ công và nhập JSON

## Findings
- P1, câu trả lời ngắn: preview lấy mảng đáp án cũ thay vì văn bản đang nhập, gây hiểu nhầm trước khi thêm câu. Preview nay dùng cùng dữ liệu nhập với thao tác thêm; không đổi chuẩn hóa hay luật chấm.
- P1, form dài: lỗi nằm trên đầu form, ngoài tầm nhìn sau khi bấm thêm. Thông báo có thể nhận focus và được đưa vào tầm nhìn khi xuất hiện; dữ liệu được giữ lại.
- P2: thiếu xác nhận thêm/sửa câu. Bổ sung thông báo trạng thái, xóa thông báo thành công cũ khi có lỗi.
- P1, mobile: các phương thức nguồn câu bị cắt trong dải cuộn ngang. Chuyển lựa chọn phương thức dạng gọn sang lưới hai cột, hiện đủ nhãn.

## Validation
Chrome với API fixture tại 1440×900, 820×1000, 390×844. Xác nhận preview đáp án 1/2 và 0,5; thêm câu giữ đúng đáp án; JSON sai giữ nội dung và câu cũ, focus thông báo; JSON hợp lệ thêm câu, JSON trùng không thêm dở; reload giữ hai câu và JSON chưa áp dụng. Không pageerror, không request ghi máy chủ. Ảnh được xem lại trên mobile. Build thành công trước thay đổi CSS cuối; cần chạy build tiếp trong kiểm tra tích hợp kế tiếp.

Artifacts: scripts/verify-teacher-manual-json.mjs; docs/evidence/teacher-manual-json/verification.json và validation-{desktop,tablet,mobile}.png.
Chưa có ảnh baseline cùng trạng thái cho batch; không tuyên bố before/after trực quan. Cần tiếp tục AI/ngẫu nhiên với phản hồi có nội dung, quản lý lớp và kiểm tra tích hợp toàn bộ. Goal vẫn active.
