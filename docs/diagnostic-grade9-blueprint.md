# Ma trận đầu vào tổng hợp Toán 9

Phiên bản `math9-comprehensive-v1`, ngày 17/10/2026.

## Căn cứ và phạm vi

Theo yêu cầu: mỗi tài khoản lấy ngẫu nhiên 12 câu nhiều lựa chọn, 4 câu đúng/sai (mỗi câu 4 ý), 6 câu trả lời ngắn. Đề phải lấy mẫu tất cả các nhóm chuyên đề Toán 9, cùng cơ cấu mức nhận thức và độ khó.

Nguồn tham khảo đã tìm:

- [Ma trận cuối kỳ I Toán 9, Phòng GDĐT Củ Chi, 2023–2024](https://file.giaitoan.edu.vn/file-pdf/bo-de-tham-khao-cuoi-ky-1-toan-9-nam-2023-2024-phong-gd-dt-cu-chi-tp-hcm.pdf): bản được lập chỉ mục thể hiện tỷ lệ điểm nhận biết/thông hiểu/vận dụng/vận dụng cao 40/30/20/10. Đây là nguồn cũ tham khảo cách phân hóa, không dùng làm danh mục chương trình hiện hành.
- [Ma trận cuối kỳ II Toán 9, Phòng GDĐT Bình Thạnh, 2024–2025](https://thcs.toanmath.com/2025/04/de-tham-khao-cuoi-ki-2-toan-9-nam-2024-2025-phong-gddt-binh-thanh-tp-hcm.html): danh mục gồm hàm số bậc hai, Viète, thống kê, mô hình hóa, tứ giác nội tiếp, đa giác đều, các hình khối. Ghép với các chủ đề học kỳ I trong chương trình của ứng dụng để xây dựng phạm vi cả năm.

Đây là ma trận thiết kế cho sản phẩm, không phải một ma trận Toán 9 thống nhất do Bộ ban hành. Cơ cấu 12–4–6 theo yêu cầu của người dùng. Phân bổ 9/7/4/2 là số **câu lớn**, gần tỷ lệ 40/30/20/10; không khẳng định đó là tỷ lệ điểm. Chưa thay đổi cách tính điểm hiện tại. Bốn ý của câu đúng/sai chưa có nhãn nhận thức riêng; mức ghi trong ma trận là mức của cả câu.

22 câu không thể kiểm tra mọi yêu cầu cần đạt của cả năm; ma trận bảo đảm lấy mẫu các nhóm chuyên đề. Một lượt kiểm tra không đủ chứng minh thành thạo toàn bộ kiến thức của mỗi chuyên đề.

## Cơ cấu chung

| Phần | Nhận biết | Thông hiểu | Vận dụng | Vận dụng cao | Tổng |
|---|---:|---:|---:|---:|---:|
| Nhiều lựa chọn | 9 | 3 | 0 | 0 | 12 |
| Đúng/sai | 0 | 4 | 0 | 0 | 4 |
| Trả lời ngắn | 0 | 0 | 4 | 2 | 6 |
| Tổng | 9 | 7 | 4 | 2 | 22 |

## Ma trận từng vị trí

| Vị trí | Dạng | Nội dung | Mức nhận thức | Nhãn độ khó |
|---:|---|---|---|---|
| 1 | TN | Hệ phương trình bậc nhất hai ẩn | Nhận biết | EASY |
| 2 | TN | Phương trình quy về bậc nhất | Nhận biết | EASY |
| 3 | TN | Bất đẳng thức và bất phương trình | Nhận biết | EASY |
| 4 | TN | Căn bậc hai | Nhận biết | EASY |
| 5 | TN | Căn bậc ba | Nhận biết | EASY |
| 6 | TN | Hàm số y = ax² và đồ thị | Nhận biết | EASY |
| 7 | TN | Phương trình bậc hai | Thông hiểu | MEDIUM |
| 8 | TN | Lượng giác và tam giác vuông | Nhận biết | EASY |
| 9 | TN | Đường tròn, góc, cung, tiếp tuyến | Nhận biết | EASY |
| 10 | TN | Tứ giác nội tiếp, đa giác đều | Thông hiểu | MEDIUM |
| 11 | TN | Thống kê, tần số, tần số tương đối | Nhận biết | EASY |
| 12 | TN | Hình trụ, hình nón, hình cầu | Thông hiểu | MEDIUM |
| 13 | Đ/S | Mô hình hóa bằng phương trình và hệ | Thông hiểu | MEDIUM |
| 14 | Đ/S | Biến đổi căn thức | Thông hiểu | MEDIUM |
| 15 | Đ/S | Quan hệ hình học đường tròn | Thông hiểu | MEDIUM |
| 16 | Đ/S | Đọc và phân tích dữ liệu | Thông hiểu | MEDIUM |
| 17 | Ngắn | Viète và ứng dụng | Vận dụng | HARD |
| 18 | Ngắn | Bất phương trình | Vận dụng | HARD |
| 19 | Ngắn | Xác suất | Vận dụng | HARD |
| 20 | Ngắn | Diện tích, thể tích thực tiễn | Vận dụng | HARD |
| 21 | Ngắn | Căn thức tổng hợp và cực trị | Vận dụng cao | VERY_HARD |
| 22 | Ngắn | Hình học nội tiếp tổng hợp | Vận dụng cao | VERY_HARD |

## Quy tắc chọn

- Khớp đồng thời mã kỹ năng, loại câu, mức nhận thức và nhãn độ khó tại từng vị trí; không dùng lịch sử mastery để thay đổi đề.
- Hai kỹ năng cần phân biệt thêm trong ngân hàng: `MATH9-QUADRATIC-FUNCTIONS` (hàm số, đồ thị) và `MATH9-CYCLIC-POLYGONS` (nội tiếp, đa giác đều). Không coi câu phương trình bậc hai tự động là câu đồ thị, hoặc mọi câu đường tròn là câu nội tiếp.
- Chọn bằng thứ tự băm SHA-256 theo mã lượt làm bài, vị trí và ID câu; ổn định khi tiếp tục lượt làm bài, ngẫu nhiên khác nhau giữa các lượt. Có thể trùng một số câu giữa hai tài khoản; không cam kết đề của mọi tài khoản khác hoàn toàn.
- Không trùng ID/nội dung trong một đề. Danh sách được lưu khi bắt đầu; tiếp tục bài lấy lại danh sách đã lưu.
- Không đủ một vị trí thì trả lỗi có danh sách vị trí thiếu, không thay câu dễ hơn, sai chuyên đề hay phát hành đề thiếu câu.
- Phiên đã có danh sách cố định giữ nguyên; phiên cũ đã có câu chấm nhưng chưa có danh sách tiếp tục theo quy tắc tương thích, không đổi câu đã làm. Ma trận áp dụng cho lượt mới.
- Nhãn khó hiện là nhãn biên soạn tạm thời; đồng nhất ma trận và nhãn không chứng minh độ khó thực nghiệm bằng nhau. Cần rà soát nội dung/nhãn bởi giáo viên, và hiệu chuẩn bằng dữ liệu trả lời để đánh giá tương đương thực nghiệm.

## Kiểm chứng và tình trạng ngân hàng

**Cập nhật 19/10/2026:** Đã bổ sung 20 câu tự soạn có lời giải và nguồn minh bạch vào production. Kiểm kê hiện đủ cả 22 vị trí, không còn thiếu tổ hợp nhãn. Đã thử 100 đề và luồng mở–lưu–khôi phục–nộp bài 22 câu trên web thật. Xem [báo cáo bổ sung](math-import/diagnostic-completion-2026-10-19/README.md). Các số thiếu bên dưới là lịch sử kiểm kê trước cập nhật này. Nhãn độ khó vẫn là nhãn biên tập cần giáo viên rà soát và hiệu chuẩn.

- 16 kiểm thử liên quan đạt; gồm 100 lượt làm bài giả lập có cùng ma trận tại từng vị trí, khác danh sách câu, không trùng nội dung; kiểm tra khôi phục bài, ẩn đáp án và không tạo lượt khi thiếu câu. Kiểm tra kiểu dữ liệu đạt.
- Kiểm kê ban đầu (trước đợt gắn nhãn toàn ngân hàng): 251 câu đủ điều kiện trạng thái/nguồn, nhưng thiếu câu **đúng tổ hợp nhãn** cho 13/22 vị trí: 6, 10, 12–22. Một số câu có thể đã tồn tại về mặt nội dung nhưng đang thiếu/sai nhãn nhận thức; chưa tự động đổi nhãn.
- Chi tiết: `docs/evidence/math-question-types/diagnostic-blueprint-audit.json`. Lệnh kiểm kê từ `apps/api`: `node --env-file=.env -r ts-node/register scripts/audit-diagnostic-blueprint.ts`.
- Tại lần kiểm kê ban đầu, lượt đầu vào mới bị chặn bởi kiểm tra thiếu câu. Cần bổ sung hoặc rà soát đúng 13 tổ hợp trước khi ngân hàng có thể phát đề mới theo ma trận. Chưa triển khai production, chưa sửa nhãn, chưa tạo/xuất bản câu hỏi.


## Sau đợt gắn nhãn toàn ngân hàng

Đã sửa nhãn theo nội dung thực, không ép nhãn cho khớp ma trận. Kiểm kê lại còn thiếu 10 vị trí: 2, 10, 11, 13, 14, 15, 16, 17, 20, 22. Chi tiết đợt cập nhật ở [nhãn ngân hàng](question-bank-classification.md). Lượt mới vẫn cần bổ sung câu phù hợp trước khi mở.


## Áp dụng chung cho mọi nguồn tạo đề

Từ cập nhật tiếp theo ngày 17/10, cùng ma trận được kiểm tra ở đầu vào, AI, ngẫu nhiên, tự soạn, JSON, tệp và phát hành nháp. Định nghĩa và quy trình đánh nhãn bắt buộc xem [workflow biên soạn](QUESTION_AUTHORING_WORKFLOW.md). Không suy mức nhận thức từ nhãn độ khó; không suy vận dụng cao từ từ khóa.
