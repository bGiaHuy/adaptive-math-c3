# Đầu vào ba dạng, ngân hàng và đề ngẫu nhiên

17/10/2026, chỉ áp dụng local.

- Bài đầu vào nhận SINGLE_CHOICE, TRUE_FALSE bốn ý và SHORT_ANSWER. Giữ chọn câu thích ứng, tối đa24 câu; ưu tiên phủ ba dạng khi pool có đủ. Không ép bài thích ứng thành đề cố định22 câu.
- Pool đầu vào gồm câu PUBLISHED và DRAFT có nguồn VERIFIED đã đối chiếu. Đây là thay đổi phạm vi theo yêu cầu đưa ngân hàng ba dạng vào đầu vào; không đổi trạng thái câu, không lấy bản nháp chưa kiểm chứng.
- TF mỗi ý0.25, năng lực/mastery dùng điểm thành phần. TF180s, dạng khác90s. Không trả đáp án/lời giải trước khi hoàn tất. Đáp án đang chọn lưu trong trình duyệt, câu đã gửi lưu máy chủ; thời gian tiếp tục khi rời bài.
- Question.difficulty: EASY/MEDIUM/HARD/VERY_HARD. Câu cũ khởi tạo từ mức nhận thức. 99 câu nguồn có nhãn gợi ý theo quy tắc nội dung:64 dễ,25 trung bình,10 khó. Đây là nhãn tạm cần giáo viên/thẩm định nội dung rà soát, không phải tham số đo thực nghiệm. Script label-math-bank-difficulty.ts dry-run mặc định, --apply chỉ local. Không tự đặt IRT đã hiệu chuẩn.
- Độ khó dùng làm IRT b tạm khi thiếu irtB; irtB đã có được ưu tiên. Legacy không có nhãn tiếp tục dùng mức nhận thức.
- Màn hình Ngân hàng câu hỏi ở quản lý lớp: tìm nội dung/chuyên đề, lọc loại/độ khó, xem nội dung/đáp án và trạng thái. Admin hoặc tác giả sửa nhãn độ khó; giáo viên không sửa câu của người khác.
- Tạo đề: Lấy đề ngẫu nhiên từ ngân hàng dùng số lượng12–4–6 hoặc cấu hình hiện tại; lọc chuyên đề/mức độ/độ khó. Chọn không trùng nội dung/ID, kiểm tra quyền, báo thiếu câu, chỉ xem trước rồi mới giao. Không ghi hoặc xuất bản câu khi lấy ngẫu nhiên.
- Migration additive20261017010000_diagnostic_bank_difficulty đã kiểm tra host local trước khi áp dụng; dữ liệu cũ không reset.

## Kiểm chứng

- Backend20 files/127 tests đạt; helper5 tests đạt; build frontend/backend đạt.
- API diagnostic-mixed-bank.json: ba dạng xuất hiện ba câu đầu;16 câu,100%; payload câu hỏi/feedback không lộ đáp án; random22 câu12–4–6 không trùng.
- UI: trả lời ngắn30, SC600 triệu, TFbốn ý; rời và khôi phục bằngAPI hoàn tất phiên100% (diagnostic-mixed-bank-ui-resumed.json).
- UI giáo viên: Ngân hàng câu hỏi mở được; lấy ngẫu nhiên hiển thị12/12,4/4,6/6 và cho phát hành. Ảnh question-bank.png, random-composer.png, diagnostic-true-false.png trong docs/evidence/math-question-types.

Không triển khai production. Tài liệu nguồn còn cần rà soát vẫn theo docs/math-import/review-queue.json. Nhãn khó chỉ là gợi ý biên soạn; không tự xuất bản99 câu nguồn.

## Cập nhật hai chế độ và thứ tự phần
- Mọi đề kiểm tra học sinh (đầu vào và giáo viên giao) có Focus / Hiển thị đề, chuyển ngay khi làm; dùng chung đáp án và đồng hồ.
- Thứ tự hiển thị: SINGLE_CHOICE liên tiếp, TRUE_FALSE liên tiếp, SHORT_ANSWER liên tiếp; câu trong từng phần giữ thứ tự.
- Đầu vào cố định danh sách khi bắt đầu, mặc định12/4/6 theo nguồn đủ điều kiện,45phút; không còn thay câu tiếp theo theo đáp án. Năng lực vẫn tính sau nộp. Phiên cũ giữ câu đã nộp và khóa sửa để không mất dữ liệu.
- Migration20261017020000 additive áp dụng local. Endpoint draft lưu toàn bộ đáp án; final chấm câu trống0, chống chấm trùng.
- Kiểm chứng17/10:131 backend tests+6 helper/display tests đạt; frontend/backend build đạt. full-paper-api.json kiểm tra22câu đúng thứ tự, không lộ key, resume và nộp lại idempotent100%.
- UI đã kiểm tra chuyển hai chế độ giữ lựa chọn; đề lớp nộp10/10. Ảnh full-paper-classroom.png và diagnostic-full-paper.png. Lượt kiểm tra cuối browseruse lại tắt; dùng bằng chứng UI trước đó cùng API mới.

## Quy tắc đúng/sai cập nhật
Đúng0/1/2/3/4 ý lần lượt nhận0%/10%/25%/50%/100% điểm câu. Áp dụng qua helper chấm chung cho đề lớp và đầu vào; điểm cũ đã nộp giữ nguyên, không tự chấm lại. 136 backend tests đạt, cả hai build đạt.


## Ma trận tổng hợp Toán 9 cập nhật

Lượt mới phải theo [ma trận 22 câu](diagnostic-grade9-blueprint.md): 12–4–6, mức nhận thức 9–7–4–2, khớp chuyên đề và nhãn khó ở từng vị trí. Không còn lấy ngẫu nhiên chỉ theo loại câu. Kiểm kê local 251 câu cho thấy 13 vị trí thiếu tổ hợp nhãn; lượt mới báo thiếu ngân hàng cho tới khi bổ sung/rà soát, không tự hạ chuẩn. Phiên đã cố định danh sách giữ nguyên. 16 kiểm thử liên quan và typecheck đạt.
