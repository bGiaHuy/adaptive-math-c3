# Yêu cầu Antigravity khắc phục bộ câu hỏi THPT

Đọc outputs/thpt-independent-audit/README.md, summary.json, findings.json và source-audit.json trước khi làm. Bộ 90 câu hiện chưa nghiệm thu; không tiếp tục tuyên bố “100% hoàn tất” hoặc “84 câu chuẩn” dựa trên nhãn tự gán.

1. Giữ nguyên bộ gốc trong outputs/thpt-content-research để đối chiếu. Ghi bản sửa và nhật ký riêng vào outputs/thpt-content-repaired. Không sửa UI, không đụng database, không mở LEGACY_BANK_PAUSED.
2. Với từng nguồn, truy cập trang thật và liên kết PDF thật từ trang. Lưu tài liệu được phép tải, thời điểm truy cập và log HTTP; tính SHA-256 từ byte tệp đã tải, không tự viết chuỗi hash. Mã tệp rỗng hay hash sai độ dài phải loại khỏi bằng chứng.
3. Đối chiếu từng câu với số trang PDF, mã đề, phần, số câu và trang đáp án. Câu không khớp nguồn không được gắn VERIFIED hoặc gán lại cho trường/Bộ theo phỏng đoán. Nếu thực chất là câu tự soạn, ghi AI_GENERATED và bỏ xuất xứ giả; đưa vào diện chờ giáo viên duyệt riêng.
4. Ghi chứng cứ quyền tái sử dụng cụ thể. Khi chưa có, chỉ bàn giao metadata/đường dẫn trong danh sách nguồn, không tự gán PUBLIC_EDUCATIONAL_USE chỉ vì công khai.
5. Giải lại từng câu và từng ý đúng/sai; lưu phép tính và kết quả thực tế, so với key, explanation và bản gốc. Đặc biệt KNTT11-PILOT-TF02 ý c có u25=99 nhưng isCorrect=false. Không chỉ sửa lời giải rồi để key sai. Ghi đề xuất sửa ở bản riêng, không sửa âm thầm dữ liệu gốc.
6. Xem lại KNTT10-PILOT-SA05 về phân số/làm tròn; KNTT12-PILOT-SC01 về bảng biến thiên và giả thiết liên tục; KNTT12-PILOT-SC18 về điều kiện xác suất của biến cố điều kiện.
7. Kiểm tra sự khớp kiến thức với topic thực tế, không chỉ việc mã topic tồn tại. Rà toàn bộ phương án nhiễu và tính duy nhất của đáp án. Giải thích vì sao cả 54 key đều A; giữ nguyên thứ tự nếu là bản trích nguồn, chỉ đổi thứ tự trong bản biên soạn riêng có truy vết.
8. Chạy KaTeX thực sự trên mọi trường công thức, kiểm tra schema/tolerance/phân số/chính sách chấm. Không gọi kiểm tra đếm dấu $ là kiểm chứng KaTeX hay giải độc lập.
9. Tạo questions-reviewed.jsonl, review-required.csv và evidence.json, nêu rõ câu nào đã đối chiếu nguồn, đã giải lại, đã có quyền, câu nào chưa. Chỉ xuất import-candidates.jsonl cho câu đủ cả ba, vẫn chưa phải dữ liệu đã được người dùng duyệt nhập.
10. Dựng lại bộ tuyển 12 lựa chọn + 4 đúng/sai + 6 trả lời ngắn chỉ từ câu đủ điều kiện, gắn ADAPTED_SELECTION. Nếu thiếu thì báo thiếu, không bịa để đủ. Không thay form đề và không trình bày form này là bắt buộc cho mọi kiểm tra lớp 10/11.

Bàn giao số lượng thật và giới hạn còn tồn tại. Không chạy migrate, seed, import hay deploy. Không gửi tin nhắn hoặc liên hệ tác giả thay người dùng.
