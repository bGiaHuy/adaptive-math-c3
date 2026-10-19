# Kiểm tra độc lập bộ câu hỏi Antigravity — 19/10/2026

Kết luận: chưa nghiệm thu bộ câu hỏi này để nhập kho THPT. Nhãn VERIFIED do Antigravity tự gán không đủ làm chứng cứ kiểm chứng.

## Kết quả có thể tái chạy

Chạy `node scripts/audit-thpt-antigravity.mjs`.

- Có 90 câu ứng viên, trong đó 84 câu tự gán VERIFIED; 54 lựa chọn, 18 đúng/sai, 18 trả lời ngắn.
- Cả 54 câu lựa chọn có đáp án A. Đây là bất thường chất lượng bộ đề; tự nó không chứng minh câu bị bịa.
- Chạy KaTeX thật trên prompt, phương án, phát biểu, lời giải và quy tắc trả lời: không có lỗi cú pháp phát hiện trong các đoạn công thức được phân cách. Mã topic đều tồn tại trong catalog; điều này không xác nhận câu được phân loại đúng về ngữ nghĩa.
- 5/18 SHA-256 sai độ dài (SRC-12-02 tới SRC-12-06). SRC-10-01 dùng SHA-256 của dữ liệu rỗng. Các checksum nằm trong mã nguồn tạo manifest, không có tài liệu tải kèm để tái tính đối chiếu. Các checksum còn lại chưa được chứng minh là hash của tài liệu thật.
- 90 câu thiếu vị trí trang cụ thể trong metadata câu; chưa có chứng cứ đối chiếu từng câu với PDF, mã đề và đáp án.
- Các nhãn PUBLIC_EDUCATIONAL_USE/OFFICIAL_PUBLIC_DOMAIN trong manifest chưa kèm chứng cứ quyền tái sử dụng. Không được suy ra quyền từ việc tài liệu tải công khai.
- Ba bộ tuyển đúng số lượng 12/4/6, nhưng bộ lớp 11 chứa câu sai đáp án dưới đây. Cấu trúc đủ số lượng không đồng nghĩa nội dung đạt.

## Lỗi toán và yêu cầu xem xét

1. **KNTT11-PILOT-TF02, ý c — lỗi chấm xác định.** Với u1=3, d=4 thì u_n=4n−1; u25=99. Phát biểu “99 là một số hạng” phải Đúng nhưng isCorrect=false. Lời giải gốc cũng kết luận true; dữ liệu và lời giải mâu thuẫn. Câu này có trong bộ đề tuyển lớp 11.
2. **KNTT10-PILOT-SA05 — chính sách đáp án không nhất quán.** Đề yêu cầu phân số tối giản, trong khi hướng dẫn và TEXT acceptedAnswers cho phép cả 0.47. Xác suất chính xác là 7/15; cần thống nhất cách nhập và quy tắc làm tròn trước khi chấm.
3. **KNTT12-PILOT-SC01 — cần xem bảng biến thiên/giả thiết.** Chỉ biết dấu đạo hàm ở hai phía chưa đủ kết luận cực đại tại điểm nếu không có giả thiết liên tục/giá trị tại điểm đó. Đề nhắc bảng nhưng không đính kèm bảng. Không tự sửa đề nguồn.
4. **KNTT12-PILOT-SC18 — cần làm rõ điều kiện.** Công thức dùng P(A|B_i) cần xác suất B_i dương; kiểm tra định nghĩa nhóm biến cố đầy đủ và điều kiện nguồn trước khi duyệt.

## Đối chiếu nguồn thực tế

Đã tìm được [trang đề Văn Lang công bố 03/01/2025](https://toanmath.com/2025/01/de-cuoi-hoc-ky-1-toan-10-nam-2024-2025-truong-van-lang-quang-ninh.html) và [PDF 7 trang](https://toanmath.com/toanmath-pdf/de-cuoi-hoc-ky-1-toan-10-nam-2024-2025-truong-van-lang-quang-ninh.pdf). Manifest đưa URL khác, tháng 12/2024 và dải trang đáp án 5–10. Câu 1 mã 101 trong PDF hỏi độ chính xác phép đo; câu 1 mã 102 hỏi biểu diễn tập hợp. Chúng không khớp câu phủ định mệnh đề KNTT10-PILOT-SC01 mà bộ dữ liệu gán cho nguồn này. Chưa thể xác nhận xuất xứ đã khai. Không mặc định đổi URL rồi coi là đã xác thực.

## Đầu ra

- summary.json: thống kê kiểm tra.
- findings.json: phát hiện theo mã câu.
- source-audit.json: vấn đề manifest từng nguồn.
- question-status.json: 90 câu ở trạng thái QUARANTINED, importEligible=false.
- import-approved.jsonl: rỗng, phản ánh chưa có câu được nghiệm thu nhập ở lần này.
- ANTIGRAVITY-REPAIR-PROMPT.md: yêu cầu khắc phục có thể giao lại.

Giữ nguyên bộ Antigravity để đối chiếu, không sửa dữ liệu nguồn, không import/seed/migrate, không đổi giao diện hay cờ tạm ẩn kho cũ trong đợt kiểm tra này. “Cách ly” ở đây là kết quả kiểm tra trong thư mục riêng; không phải thay đổi trạng thái cơ sở dữ liệu hoặc chặn import trong backend.

Giới hạn: chưa xác thực riêng 17 nguồn còn lại; chưa tuyên bố giải và chứng nhận toán học toàn bộ 90 câu. Không coi việc cách ly cả lô là kết luận cả 90 câu sai. Cần tài liệu gốc và đối chiếu từng câu trước khi kết luận xuất xứ.
