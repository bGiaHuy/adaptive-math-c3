# Kiểm tra và nhập câu Antigravity — 19/10/2026

Đã rà 56 ứng viên revision-03. Chuẩn bị 26 câu sau đối chiếu ảnh nguồn và giải độc lập; nhập mới 25 câu, bỏ qua 1 nguồn đã có. 30 câu được cách ly, xem audit.json. Không thay nội dung/đáp án/nhãn của câu cũ.

## Web thật

- URL: https://adaptivemath-blush.vercel.app
- 25 câu PUBLISHED: 12 nhiều lựa chọn, 2 đúng/sai (8 ý), 11 trả lời ngắn.
- API ngân hàng giáo viên xác nhận trả đủ 25 câu mới với chuyên đề, mức nhận thức và độ khó.
- Bổ sung danh mục: Tứ giác nội tiếp và đa giác đều; Đường tròn ngoại tiếp và nội tiếp tam giác.
- 50 kiểm tra chấm đúng/sai đạt ở local và production. 510 câu Toán 9 cũ đối chiếu không đổi ở production.
- Dữ liệu nội dung cập nhật trực tiếp nên không cần triển khai lại frontend/backend. Web local không bật lại.

## Các sửa lỗi tiêu biểu

- SLOT02-04/05/06: khôi phục phương trình/phương án theo ảnh nguồn.
- SLOT11-02: khôi phục bảng điểm và phương án; đáp án đúng A=6.
- SLOT17-01: khôi phục biểu thức căn, giải lại được 12 thay vì đáp án AI 24.
- SLOT20-03: nguồn chỉ phủ giấy mặt xung quanh, diện tích làm tròn 754 cm², không phải 1156.
- SLOT13-01: khóa đúng/sai Đ–S–Đ–Đ; mô tả tăng thêm phải phân biệt với tổng sản phẩm.
- Lời giải ghi MODEL_GENERATED, lưu bản trích xuất trước chỉnh trong source.originalExtraction.

## Giới hạn

- Nhãn biên soạn do trợ lý rà soát, chưa ghi là được giáo viên phê duyệt hoặc độ khó thực nghiệm đã hiệu chuẩn.
- Không ép câu vào ma trận: bài Viète công thức trực tiếp giữ Thông hiểu; các câu đúng/sai có ý vận dụng gắn Vận dụng, không gán Thông hiểu.
- Ma trận đầu vào production vẫn thiếu tổ hợp; không tuyên bố đã phát được đề mới.
- Bản sao dữ liệu trước nhập nằm trong .math-adaptive-qa/antigravity-import-2026-10-19 (không xuất thông tin riêng tư vào báo cáo).

## Hồ sơ

- batch.json: lô nội dung đã sửa và nhãn.
- audit.json: quyết định cho cả 56 ứng viên.
- production-result.json: ID các câu và mục chuyên đề mới.
- production-verification.json: chấm điểm và bảo toàn câu cũ.
- web-verification.json: xác nhận qua API giáo viên.

## Bổ sung theo yêu cầu đưa lên toàn bộ

- 30 ứng viên còn lại đã được đưa vào ngân hàng quản trị dưới dạng DRAFT, source.reviewStatus và classification.status đều là NEEDS_REVIEW. Không đánh dấu đáp án đã xác minh.
- Những câu này không xuất hiện trong ngân hàng giáo viên thông thường, không vào bài chẩn đoán hoặc đề học sinh. Quản trị xem bằng bộ lọc Nháp.
- Chuyên đề bổ sung: Đo góc và ứng dụng thực tế; Diện tích hình phẳng tổng hợp; Đường tròn giao nhau và hệ thức dây cung.
- Toàn bộ 56 ứng viên đã được xử lý: 25 câu mới đã xuất bản, 30 bản nháp chờ rà soát, 1 câu nguồn đã có được bỏ qua để tránh trùng.
- Hồ sơ kết quả: production-drafts-result.json.
