# ADR 0002 — Tạo bù câu đầu vào khi thiếu ô ma trận

Trạng thái: triển khai theo yêu cầu sản phẩm ngày 20/10/2026.

## Bối cảnh

Học sinh cần tiếp tục chuẩn bị bài đầu vào khi kho thiếu câu ở một ô ma trận. Người dùng yêu cầu chỉ gọi API AI khi thực sự thiếu; không thay toàn bộ đề bằng AI.

## Quyết định

- Bổ sung đúng cạnh nghiệp vụ `diagnostic → ai`, dùng hai giao diện public đã có `ai-budget.service.ts` và `ai.config.ts`. Không thêm public file, barrel, ngoại lệ tổng quát hoặc phụ thuộc ngược. Hai cặp fixture CLI mới kiểm tra cạnh được phép và truy cập nội bộ vẫn bị chặn. Đây là thay đổi năng lực sản phẩm, không phải nới checker để che import sai.
- `question` sở hữu hàm thuần ghép ma trận và tính các vị trí thiếu. `diagnostic` sở hữu gọi provider, kiểm tra độc lập, ghi câu riêng học sinh và điều phối trước khi mở lượt. `ai` tiếp tục sở hữu cấu hình, khóa admission ngân sách, ledger và chi phí.
- Chỉ gọi AI sau khi kiểm tra kho và không có lượt đang làm. Kho đủ hoặc làm tiếp không gọi AI. Cùng tiến trình gộp các yêu cầu chuẩn bị của cùng học sinh; ledger RESERVED giữ admission xuyên instance trong cả tạo và kiểm tra.
- Provider được gọi ngoài transaction/khóa học sinh. Chỉ sau khi kiểm tra xong mới khóa ngắn để kiểm tra lại khối, phiên đang làm và kho, rồi ghi các bản DRAFT riêng học sinh. Không cập nhật câu nguồn, không ghi VERIFIED/PUBLISHED, không thay ma trận hay đáp án đã có.
- Câu mới phải đúng từng slot, đủ nội dung, đáp án hợp lệ và không trùng; lần gọi độc lập không được xem đáp án/lời giải dự kiến, tự giải rồi so bằng bộ chấm hiện tại. Đây là kiểm tra AI, không phải chứng nhận của người duyệt; provenance luôn có `humanReviewed:false`.
- Không thay schema, endpoint, auth hoặc snapshot bài giao. Chỉ bắt đầu đồng hồ sau khi đề đầy đủ được lưu qua luồng mở lượt hiện có. Client chờ có phản hồi, chống bấm trùng và thử lại tại chỗ; không giảm số câu hay thay mức để giả vờ hoàn thành khi API/ngân sách không sẵn sàng.

## Kiểm chứng bắt buộc

Test kho đủ/làm tiếp không gọi AI; tạo đúng ô thiếu; kiểm tra mù; loại sai đáp án/mức độ/nội dung trùng; tái tạo tối đa một lần; giữ hạn mức và khoản phí chưa chắc chắn; gộp yêu cầu song song; chỉ insert draft riêng và audit; không tạo lượt/khởi động đồng hồ trước khi đủ đề.
