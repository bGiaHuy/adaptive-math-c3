# Nhãn kiến thức và độ khó cho toàn bộ ngân hàng

Đã áp dụng local ngày 17/10/2026. Chưa triển khai production.

## Kết quả dữ liệu

- Kiểm kê toàn bộ 365 bản ghi, bao gồm bản nháp và câu đã xuất bản. 308 câu có nội dung toán được gắn chuyên đề, nhóm kiến thức, mức nhận thức và độ khó theo tiêu chí biên soạn. Đây là nhãn tạm, chưa phải tham số độ khó thực nghiệm đã hiệu chuẩn hoặc kết quả giáo viên thẩm định.
- 57 bản ghi nội dung chỉ là `Mixed SC`, `Mixed TF`, `Mixed SA` không có câu toán. Chuyển nhãn sang nhóm chờ phân loại và trạng thái phân loại `NEEDS_REVIEW`. Nhãn EASY còn lại ở các bản ghi này chỉ là nhãn kỹ thuật tạm để tương thích dữ liệu, không phải đánh giá độ khó; không được coi là câu toán đã phân loại. Chặn xuất bản trước khi rà soát.
- 246 bản ghi đổi ít nhất một trường chuyên đề/độ khó/mức nhận thức. Tất cả bản ghi có ghi chú phân loại trong `source.classification`.
- Sửa các câu phương trình và lượng giác gắn nhầm vào căn bậc hai. Tách hàm số bậc hai/đồ thị khỏi phương trình bậc hai, góc nội tiếp khỏi nhóm đường tròn chung; bổ sung nhóm cực trị đại số cho câu không có căn thức.
- Đã đối chiếu tự động với bản trước cập nhật: nguyên nội dung, lời giải, phương án/đáp án, quy tắc chấm, trạng thái xuất bản. Không chấm lại bài hay ghi lại điểm cũ. Việc sửa nhãn có thể thay đổi tên chuyên đề hoặc nhãn được hiển thị khi đọc lại câu cũ; mô hình hiện dùng chung bản ghi câu hỏi.

## Quy tắc thêm/sửa câu

- Lưu câu mới từ quản trị hoặc đề giáo viên phải có chuyên đề tồn tại và độ khó hợp lệ; đề giáo viên phải khớp khối lớp. Bỏ việc tự gán câu giáo viên vào kỹ năng đầu tiên của khối.
- Preview AI/JSON có thể chưa chọn chuyên đề; trước khi lưu đề phải chọn nhãn cho từng câu. Nhãn đã có được giữ qua bước xem trước/chuẩn hóa. Phiếu đề gốc cũng chỉnh nhãn ở danh sách câu đã soạn.
- Import nguồn mới bắt buộc có `skillCode` và `difficulty`; các JSON nguồn cũ chưa thêm difficulty cần bổ sung nhãn trước khi chạy lại importer. Import không suy diễn độ khó từ loại câu.
- Giao diện ngân hàng có nhãn nhóm kiến thức, chuyên đề, độ khó và trạng thái cần rà soát; lọc theo chuyên đề, phân trang truy cập toàn bộ ngân hàng.
- Admin hoặc tác giả chỉnh chuyên đề/độ khó qua API labels. Không sửa câu của người khác; không chuyển sang chuyên đề sai khối. Cập nhật nhãn cùng metadata phân loại trong transaction, ghi audit trước/sau; không làm mất nguồn VERIFIED.

## Kiểm chứng

- 36 kiểm thử backend liên quan và 6 kiểm thử helper đạt; kiểm tra kiểu dữ liệu và build frontend đạt.
- Lần chạy rộng các kiểm thử không dùng database có 133 đạt, 1 lỗi ở `authorization-policy.spec.ts`: kỳ vọng chỉ PUBLISHED trong khi code hiện có trả PUBLISHED/CLOSED. Phần truy vấn này là thay đổi sẵn có của workspace, ngoài phạm vi sửa nhãn. Chưa chạy toàn bộ kiểm thử tích hợp database.
- Dữ liệu sau cập nhật: EASY 207 (gồm 57 mẫu cần rà soát), MEDIUM 134, HARD 18, VERY_HARD 6. Các nhãn không được điều chỉnh để ép đủ ma trận đầu vào; audit ma trận đã chạy lại và vẫn còn vị trí thiếu.

## Tệp kiểm toán và khôi phục

- `docs/math-import/bank-classification-plan.json`: kế hoạch từng ID, nhãn trước/sau, SHA-256 nội dung và lý do phân loại.
- `docs/evidence/math-question-types/bank-label-review-input.json`: dữ liệu đầu vào rà soát gồm nội dung/đáp án.
- `docs/evidence/math-question-types/bank-labels-before.json`: bản nhãn/metadata trước cập nhật; không bị ghi đè khi chạy lại.
- `docs/evidence/math-question-types/bank-classification-applied.json`: tổng kết áp dụng.
- `docs/evidence/math-question-types/bank-label-verification.json`: đối chiếu dữ liệu trước/sau.
- Script áp dụng chỉ cho localhost, kiểm tra tập ID và hash nội dung, chống ghi đè sửa đồng thời, dùng transaction. Chạy từ `apps/api`: `node --env-file=.env -r ts-node/register scripts/apply-question-classification.ts --apply`; bỏ `--apply` để kiểm tra mà không ghi.
