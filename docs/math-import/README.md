# Ngân hàng Toán9: nhập có kiểm chứng

## Dữ liệu chuẩn bị

99 câu chính đã đối chiếu ảnh nguồn và đáp án, gồm71 nhiều lựa chọn,10 đúng/sai (40 ý),18 trả lời ngắn. Agent chính đã áp dụng thành công cả6 lô vào database local, tổng99 câu DRAFT; chưa xuất bản. Nguồn VERIFIED chỉ nghĩa nội dung/đáp án đã đối chiếu, không có nghĩa đã xuất bản. Chi tiết apply/idempotency và kiểm tra số lượng database do báo cáo tích hợp của agent chính ghi nhận.

| Lô | Số câu | Nhiều lựa chọn | Đúng/sai | Ngắn |
|---|---:|---:|---:|---:|
| pilot.json |3|1|1|1|
| batch-002.json |30|25|1|4|
| batch-003.json |1|0|0|1|
| batch-004-hai-phong.json |22|12|4|6|
| batch-005-quan-toan.json |22|12|4|6|
| batch-006-specialist-samples.json |21|21|0|0|

Hưng Yên mã9101 đủ34 câu, Hải Phòng mã101 đủ22, Quán Toan mã901 đủ22. Không nhập các mã đảo câu trùng nội dung. Bảy chuyên đề lấy3 mẫu mỗi nguồn; phần còn lại nằm trong danh sách cần đối chiếu, không được coi hàng nghìn trang là đã nhập.

## Quy trình và bằng chứng

- Các script prepare-*.py ghi lại bản chép đã đọc trực quan; không phải OCR tự động tin cậy.
- PDF giữ nguyên, source-inventory.json có SHA256, số trang, trang từng dạng, mẫu văn bản. source-XX-overview.png phục vụ kiểm kê; ảnh chuyên đề supplement-source-X.png đủ nét đọc câu mẫu.
- Hưng Yên: trang1–4 đề, trang5 đáp án mã9101. Hải Phòng: trang1–4 đề, trang9 đáp án mã101. Quán Toan: trang1–2 mã901, bảng đáp án tách ngang trang5–6, lấy hàng đầu tiên901; trang3–4 là mã903 không nhập lại.
- Hình minh họa cắt từ ảnh nguồn, không vẽ lại. Bản dùng web nằm public/math-import-assets khi agent chính tích hợp.
- Công thức dùng LaTeX, kiểm tra bằng KaTeX throwOnError và chặn lệnh bị escape hai lần; giữ dấu xuống dòng hợp lệ trong cases/matrix.
- Importer mặc định dry-run, tối đa30 câu/lô; apply chỉ localhost và --confirm-local, author hiện có đúng vai trò. Transaction đảm bảo lô lỗi không ghi một phần. ID ổn định theo tệp/trang/số câu; chạy lại không nhân bản; câu khác nội dung cùng nguồn bị từ chối ghi đè.
- source lưu externalId, contentHash, answerEvidence, reviewNotes. Có6 kỹ năng mới grade9 được chốt rõ; chỉ tạo khi thiếu, không sửa kỹ năng cũ.
- --repair-source-format chỉ sửa escape TeX thừa trong options/statements của DRAFT cùng nguồn, giữ nguyên đáp án/main content/type và mọi bài làm/điểm; không phải quyền ghi đè tổng quát.

## Những phần cần rà soát

| Nguồn | Đã xử lý | Phần còn lại và lý do cụ thể |
|---|---|---|
|1 Phương trình/hệ hai ẩn294tr|MC1,4,5 trang5|Trang5 MC2 có phương án B cũng rút gọn thành tuyến tính, không lấy đáp án đỏ máy móc. TF trang10 có đồ thị, cần cắt hình+đối chiếu từng ý; SA trang12 không in đáp án tại câu, phải tìm lời giải liên kết. Các bài khác chưa đối chiếu từng câu.|
|2 Phương trình/bất phương trình431tr|MC3,4,8 trang16|MC2 trang16 phương án đỏ nói “và” khi giải tích cần “hoặc”, không nhập. TF trang23 phân thức/tổng nghiệm; SA trang30 cần nối lời giải. Các trang còn lại chưa đối chiếu.|
|3 Hàm số/bậc hai398tr|MC1,2,4 trang8|TF trang12 có biểu thức/radical và đồ thị; SA trang15 có số đo, ảnh tháp/rơi tự do, cần nối đáp án. Chưa đối chiếu ngoài3 mẫu.|
|4 Đường tròn459tr|MC1,4,5 trang5|MC2 trang5 A và D có thể cùng đúng theo cách diễn đạt, bỏ. TF trang10 phụ thuộc hình; SA trang13 cần đáp án riêng và hình dựng.|
|5 Ngoại/nội tiếp334tr|MC1,2,3 trang7|MC4 trang7 hình góc nội tiếp nhưng phương án đỏ C phủ nhận: mâu thuẫn hình/đáp án, bỏ. TF trang16 và SA trang21 cần bảo toàn hình và xác minh lời giải.|
|6 Căn thức333tr|MC3,4,6 trang203|MC1 trang203 không tô đáp án đỏ, không đoán. TF trang216 nhiều phân số/căn bị mất bố cục khi lấy text; SA trang223 bài hình cần hình và đáp án.|
|7 Lượng giác240tr|MC1,3,4 trang108|TF trang117 có tam giác và làm tròn nhiều mức; SA trang126 cần hình và quy tắc làm tròn/đáp án. Chưa nhập phần chưa đối chiếu.|
|8 Hưng Yên6tr|Đủ34 mã9101|MC11 cách phát biểu tuổi B/D cần giáo viên xem lại trước xuất bản; giữ đáp án chính thứcC. Trang6 chỉ nguồn liên quan.|
|9 Hải Phòng9tr|Đủ22 mã101|Trang5–8 mã khác có câu trùng đảo thứ tự nên không nhập lặp. Câu TF4 có phương trình ýb cố ý sai, giữ nguyên.|
|10 Quán Toan7tr|Đủ22 mã901|Trang3–4 mã903 đảo câu, không nhập lại. Trang5–6 key tách đôi phải ghép đúng hàng901.|
|11 Tây Sơn2tr scan|Kiểm tra trực quan cả2tr|Trang1 có SC1–4, TF5 đủ4ý, SA6–9; trang2 tự luận. Không có đáp án trong2tr, không tự suy đoán/import câu hoàn chỉnh. Cần đáp án giáo viên hoặc nguồn bổ sung và OCR đối chiếu.|
|12 Nguyễn Văn Linh2tr scan|Kiểm tra trực quan cả2tr|Trang1 SC1–4, TF5 đủ4ý, SA6–7; trang2 tự luận. Không có đáp án trong2tr; chờ nguồn đáp án/OCR đối chiếu.|

Hai nguồn scan có đủ3 loại; cờFalse trong CSV cũ chỉ do không có text layer, không phải thiếu dạng câu. Cập nhật này được ghi trong review inventory, giữ nguyên bộ nguồn cũ.

## Antigravity và tìm bổ sung

Không có công cụ Antigravity trong phiên; prompt đã lưu PROMPT-ANTIGRAVITY-BO-SUNG.txt. Đã tìm thêm [HK2 Hưng Yên2025–2026](https://thcs.toanmath.com/2026/04/de-cuoi-hoc-ky-2-toan-9-nam-2025-2026-so-gddt-hung-yen.html): trang nguồn nêu26MC+2TF+6SA và có đáp án; PDF12tr được lưu thư mục03_Bo_sung. Tài liệu mới để tham khảo/chờ đối chiếu, chưa đưa vào99 câu VERIFIED.
