# Câu hỏi dùng để soạn bài — đợt Phú Lộc

## Đã có trên web local

- 300 PDF gốc, 100 tài liệu mỗi lớp 10–12, vẫn đọc được trong Học liệu THPT.
- 54 câu khách quan từ ba đề Phú Lộc, mã 132: mỗi lớp có 12 câu nhiều lựa chọn, 2 câu đúng/sai, 4 câu trả lời ngắn.
- Tab **Câu để giao bài** nằm trong Học liệu THPT của giáo viên. Trong **Tạo đề mới → Ngân hàng câu hỏi**, chọn lớp rồi chọn từng câu; số câu theo loại cập nhật theo lựa chọn.
- 12 câu tự luận của ba đề vẫn giữ nguyên trong Câu trích nguyên bản, không chuyển thành câu trả lời ngắn để chấm tự động.

## Phạm vi và trạng thái duyệt

54 câu được lưu **DRAFT**, thuộc giáo viên hiện hữu ghi trong `content/thpt-reviewed/local-import.json`. Giáo viên khác không được dùng bản nháp này. Quản trị viên vẫn xem được theo quyền sẵn có.

Codex đã so sánh dữ kiện/đáp án với PDF và giải kiểm tra, ghi rõ `SOURCE_KEY_AND_SOLUTION_CHECKED`, `peerReviewed: false`. Không có người thứ hai duyệt, không giả lập reviewer và không xuất bản vượt quy tắc maker-checker. Nhãn chuyên đề, độ khó là phân loại tạm của đợt nhập.

Toàn bộ nội dung câu hỏi giữ ảnh từ PDF gốc. Một số bản chép cũ sai tọa độ, dấu, công thức, bảng dữ kiện và vị trí phương án; bản dùng để giao bài có phần đáp án/ý đúng sai đã đối chiếu và lời giải kiểm tra. Các tập tin Antigravity ban đầu không bị ghi đè.

Ảnh câu hỏi dùng tên chứa SHA256, được sao chép chỉ khi chưa tồn tại và kiểm tra trùng byte khi chạy lại. Snapshot đề đã giao trỏ đến ảnh cố định này, không trỏ đến đường dẫn ảnh có thể được cắt lại.

## Cách tái kiểm tra

1. `npm run materials:reviewed:prepare`: dựng đợt từ bảng hiệu chỉnh có kiểm chứng và ảnh gốc.
2. `npm run materials:reviewed:check`: kiểm tra cấu trúc, công thức, đáp án, ảnh, đích cơ sở dữ liệu local và tính lặp lại; không ghi dữ liệu câu hỏi.
3. `node scripts/import-reviewed-thpt.mjs --apply`: thêm bản nháp còn thiếu trong một giao dịch. Không cập nhật câu đã tồn tại, không xuất bản, không thay đề đã giao. Nếu hash đợt thay đổi sau nhập, phải rà soát một phiên bản mới thay vì ghi đè.
4. `npm run materials:reviewed:verify`: kiểm tra quyền API, ảnh trên máy tính/điện thoại, chọn câu trong trình soạn, giao/nộp/chấm ba dạng câu và cách ly sửa snapshot. Lớp và đề thử được xóa sau kiểm tra; phiên xác thực thử được thu hồi.

Bằng chứng: `docs/evidence/reviewed-thpt/verification.json` và ảnh cùng thư mục. Nhập lại cùng đợt không tạo bản sao.

Build giao diện và API thành công. Hai bộ kiểm tra học liệu/quy tắc maker-checker đạt 6 bài kiểm tra. Bộ integration giao bài cũ chưa chạy được qua bước chuẩn bị vì vẫn tạo lớp 9 (API hiện chỉ nhận lớp 10–12); không sửa quy định khối lớp để chiều bộ dữ liệu thử cũ. Luồng giao/nộp/chấm của đợt này được kiểm tra riêng bằng lớp 12 tạm và cả ba dạng câu thực tế như trên.

## Chưa hoàn thành

300 PDF chưa được chuẩn hóa hết thành câu hỏi có thể chấm tự động. 54 câu này không đại diện cho việc đã kiểm duyệt toàn bộ 300 tài liệu. Luyện/kiểm tra tự động toàn hệ thống vẫn chưa mở; ma trận ngẫu nhiên 22 câu của kho cũ vẫn bị chặn. Không thay số câu mặc định bằng cấu trúc riêng của ba đề nguồn.
