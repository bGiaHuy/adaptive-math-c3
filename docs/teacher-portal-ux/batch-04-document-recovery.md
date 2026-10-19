# Đợt 04 — Thay tệp và phục hồi lỗi giao đề

## Vấn đề / tác động

P1, DocumentExamComposer: thay tệp thành công giữ rows của phiếu cũ trong component/bản nháp; có thể gắn nhầm đáp án vào tài liệu mới. Tạo lại phiếu xóa đáp án ngay lập tức, không có xác nhận.

## Thay đổi

- Khi có phiếu, chọn tệp mới mở xác nhận nêu tên tệp, hậu quả và phương án giữ lại.
- Tải thất bại giữ nguyên đề/phiếu, thông báo lỗi và cho thử lại.
- Chỉ sau tải thành công mới xóa phiếu cũ, bỏ câu từ phiếu đã áp dụng và hướng dẫn tạo phiếu mới. Không bỏ các câu nguồn khác.
- Tạo lại phiếu yêu cầu xác nhận xóa đáp án đang nhập.
- Tệp không thuộc định dạng đã hỗ trợ hoặc trên 10MB được báo tại chỗ; có thể chọn lại cùng tệp sau lỗi.

Files: DocumentExamComposer.jsx, exam-document.css; mở rộng verify-teacher-composer-flow.mjs.

## Bằng chứng

Browser actual React app, API interception hoàn toàn có kiểm soát. verification.json tại docs/evidence/teacher-composer-flow: hủy thay giữ C; upload lỗi giữ tệp De.pdf và C; retry thành công đổi Thay-de.pdf và xóa phiếu cũ; lưu giao đề lỗi giữ custom draft; retry thành công gửi 22 câu PUBLISHED và dọn bản nháp. Không có request ghi tới API thật. Các request ghi trong báo cáo là payload được tool interception chặn và trả kết quả fixture.

Ảnh: replace-upload-error-mobile.png, save-error-mobile.png (390×844); ảnh review desktop/tablet/mobile từ cùng bộ kiểm tra. Build đạt; regression composer/settings/document draft đạt. Đây không phải kiểm thử xử lý file PDF/DOCX máy chủ hoặc giao đề sản xuất.

## Còn lại / đợt tiếp

P1: đầy đủ luồng dùng lại đề từ thư viện, chỉnh sửa/tính lại điểm và tìm bản nháp đang dở từ trang chủ. Rà nguồn AI/JSON/manual populated và upload success/error ở server được cô lập trước khi chứng minh toàn Teacher Portal hoàn tất. Chưa có thử nghiệm giáo viên thật. Goal tiếp tục active.
