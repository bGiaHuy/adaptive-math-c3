# Quy trình biên soạn, đánh nhãn và tạo đề Toán 9

Ngày 17/10/2026. Áp dụng cho đầu vào và đề tạo mới từ AI, ngân hàng ngẫu nhiên, tự soạn, JSON, tệp gốc và tái sử dụng đề. Ma trận `math9-comprehensive-v1`, tiêu chí `math9-authoring-rubric-v1`.

Nguồn định nghĩa vận hành dùng chung trong ứng dụng: `apps/api/src/modules/question/question-label-rubric.ts`. Máy chủ cung cấp cùng tiêu chí cho giao diện và AI qua endpoint ma trận. Tài liệu này giải thích quy trình, không phải văn bản quy định chính thức của Bộ.

## 1. Phân biệt hai loại nhãn

**Mức nhận thức** mô tả thao tác tư duy tối thiểu học sinh phải thực hiện để giải đúng. **Độ khó** đánh giá thách thức của câu trong nhóm học sinh lớp 9 mục tiêu, xét độ quen thuộc, số quan hệ phải kiểm soát, điều kiện, điểm nút và khối lượng xử lý.

Không tự suy nhãn này từ nhãn kia. Trong ma trận hiện tại, mỗi vị trí quy định sẵn cả hai; người biên soạn phải tạo câu đáp ứng đồng thời. Không đổi nhãn một câu sai yêu cầu chỉ để lấp đủ ô.

Nhãn độ khó biên soạn chưa phải kết quả hiệu chuẩn thực nghiệm. Tỷ lệ trả lời đúng/thời gian làm và tham số đo lường có thể dùng để hiệu chỉnh sau khi đủ dữ liệu.

## 2. Định nghĩa mức nhận thức

| Mức | Học sinh thực sự phải làm gì? | Bằng chứng trong lời giải | Ví dụ |
|---|---|---|---|
| Nhận biết — REMEMBERING | Nhớ hoặc nhận ra định nghĩa, ký hiệu, tính chất, công thức; phép tính trực tiếp quen thuộc, chưa chọn chiến lược | Chủ yếu truy xuất kiến thức hoặc thay số trực tiếp vào công thức đã rõ | Căn bậc hai số học của 81 là 9; nhận ra dạng phương trình bậc nhất hai ẩn |
| Thông hiểu — UNDERSTANDING | Giải thích ý nghĩa/quan hệ, chuyển biểu diễn, xác định điều kiện, phân biệt trường hợp; thực hiện quy trình quen thuộc khi quan hệ cần dùng đã rõ | Có bước giải thích hoặc liên hệ điều kiện với kiến thức; không chỉ chép công thức | Căn(2x−6) xác định khi 2x−6 ≥ 0, nên x ≥ 3 |
| Vận dụng — APPLYING | Tự lựa chọn kiến thức/phương pháp trong tình huống cụ thể; thiết lập mô hình/phương trình hoặc kết nối quan hệ để tìm và kiểm tra kết quả | Chỉ rõ bước chọn mô hình/phương pháp và diễn giải kết quả; không phải chỉ thay số vào mô hình đã cho | Từ tổng tiền gửi, hai lãi suất và tổng tiền lãi, tự lập hệ để tìm số tiền ở mỗi ngân hàng |
| Vận dụng cao — ADVANCED_APPLYING | Xử lý tình huống không quen thuộc với điểm nút suy luận: quan hệ ẩn, biểu diễn phụ, phối hợp kiến thức, điều kiện/tham số, chứng minh hoặc tối ưu | Phải nêu được điểm nút vượt quy trình thường gặp, kiểm soát điều kiện và chứng minh kết quả có thể đạt | Với x ≥ 16, max căn(x−16)/(3x): đặt t = căn(x−16); dùng t²+16 ≥ 8t; max 1/24 tại x=32, đồng thời xét t=0 |

Không xếp mức chỉ vì đề chứa các từ “tính”, “giải thích”, “chứng minh”, “tham số”, “lớn nhất”. Một bài cực trị nếu quy trình đã chỉ dẫn đầy đủ có thể đòi hỏi mức thấp hơn. Câu dài/nhiều số liệu hay nhiều bước tính lặp lại không tự động là vận dụng cao. Dạng trắc nghiệm hay trả lời ngắn không quyết định mức nhận thức.

## 3. Định nghĩa độ khó biên soạn

| Nhãn | Tiêu chí |
|---|---|
| EASY — Dễ | Dữ kiện rõ, thao tác ngắn và quen thuộc, ít ràng buộc, không có điểm nút đáng kể |
| MEDIUM — Trung bình | Cần lựa chọn/hiểu quy trình quen thuộc, kiểm tra điều kiện, biến đổi hoặc đọc dữ liệu; lộ trình tương đối rõ |
| HARD — Khó | Phải liên kết quan hệ, tự lập mô hình hoặc quản lý nhiều điều kiện và kiểm tra nghiệm; có nguy cơ sai về bản chất |
| VERY_HARD — Rất khó | Có điểm nút không hiển nhiên, phối hợp ý tưởng, phân trường hợp/tham số hoặc tối ưu/chứng minh; không chỉ kéo dài phép tính |

Đánh giá trong nhóm lớp 9 mục tiêu, không theo năng lực riêng của từng tài khoản. Không dùng kết quả một học sinh để thay ma trận đề của tài khoản đó.

## 4. Quy tắc theo dạng câu

- **Nhiều lựa chọn:** đúng một đáp án; phương án nhiễu hợp lý; kiểm tra xem lựa chọn đáp án có tạo lối tắt khiến mức thực tế thấp hơn nhãn không.
- **Đúng/sai:** giải và rà soát từng ý a–d. Mức cả câu là mức cao nhất thật sự cần cho ít nhất một ý bắt buộc. Ma trận hiện quy định cả bốn câu này ở THÔNG HIỂU: không được cài ý vận dụng hoặc vận dụng cao rồi vẫn ghi nhãn thông hiểu. Phân bổ 9–7–4–2 tính theo 22 câu lớn, không theo 34 lệnh hỏi (12 + 16 + 6). Hiện chưa lưu nhãn riêng từng ý; việc rà soát từng ý là yêu cầu biên soạn.
- **Trả lời ngắn:** đáp án phải khớp định dạng nhập, đơn vị, phần trăm, làm tròn và sai số. Những yêu cầu định dạng không được gây khó ngoài kiến thức mục tiêu.
- **Đề từ tệp:** tải tệp không có nghĩa đã kiểm tra ma trận. Phải có nội dung thật và nhãn từng câu; không chấp nhận nội dung chỉ “Câu n trong đề gốc.” để phát hành đề mới.

## 5. Quy trình bắt buộc

1. **Nhận ma trận từ máy chủ:** 12 nhiều lựa chọn, 4 đúng/sai, 6 ngắn; tổng mức nhận thức 9–7–4–2. Dùng chuyên đề, mức nhận thức và độ khó ở từng vị trí theo [ma trận 22 câu](diagnostic-grade9-blueprint.md).
2. **Lập kế hoạch theo từng vị trí:** xác định yêu cầu cần đạt, dữ liệu nguồn và mã kỹ năng. Không dùng một câu không cùng chuyên đề để lấp vị trí thiếu.
3. **Biên soạn và giải đầy đủ:** kiểm tra đủ dữ kiện, đáp án đúng/duy nhất, điều kiện, quy tắc chấm. Lời giải phải thể hiện thao tác tư duy cần dùng, đặc biệt điểm nút vận dụng cao.
4. **Đánh nhãn sau khi giải:** đối chiếu các định nghĩa ở trên. Với đúng/sai, rà từng ý. Nếu câu không đạt vị trí yêu cầu thì sửa hoặc thay câu, không chỉ sửa nhãn. AI nhận cùng bộ tiêu chí và được yêu cầu thực hiện bước này.
5. **Kiểm tra tự động:** đối chiếu đủ 22 vị trí, loại câu, chuyên đề giải quyết từ danh mục máy chủ, khối 9, mức nhận thức, độ khó, trùng ID/nội dung, cấu trúc câu và đáp án. Báo vị trí thiếu/sai; không tự thay mức, bù câu ngoài ma trận hay giảm số lượng.
6. **Rà soát nội dung:** người phụ trách đọc lời giải và kiểm tra nhãn có đúng thao tác thực tế, nguồn có đáng tin và từng ý đúng/sai có vượt mức hay không. Kết quả AI là đề xuất, chưa phải thẩm định nội dung độc lập. Máy chủ kiểm tra cấu trúc/nhãn không chứng minh được mọi câu do AI viết thực sự đúng toán học hoặc đúng độ khó thực nghiệm.
7. **Lưu/phát hành:** máy chủ kiểm tra lại cả khi không gửi questionCounts, không tin chuyên đề do client tự khai nếu không khớp skillId trong database. Lưu thứ tự ma trận, phiên bản và bản chụp câu hỏi; kiểm tra lần cuối trước khi đóng băng câu trong đề.
8. **Chỉnh sửa/tái sử dụng:** tạo lại đề hoặc phát hành bản nháp phải kiểm tra lại. Không dùng đường phát hành bản nháp để bỏ qua quy tắc. Giữ nguyên bài đã làm; chỉnh đáp án/chấm lại trên đề cũ vẫn theo giới hạn bảo toàn dữ liệu hiện có, không tự đổi bài đã nộp để ép thành ma trận mới.

## 6. Các cổng áp dụng trong ứng dụng

- Đầu vào: chọn theo từng vị trí ma trận và giữ danh sách khi tiếp tục.
- Lấy ngẫu nhiên: lấy theo toàn bộ ma trận; không dùng bộ lọc một chuyên đề/mức độ để thay khung đề. Bộ lọc chỉ phục vụ xem/chọn câu thủ công.
- AI: nhận 22 vị trí kèm skillId hợp lệ, cùng bộ tiêu chí; tài liệu/yêu cầu thêm không được ghi đè ma trận. Tài liệu khác môn hoặc thiếu phạm vi phải báo không tạo được đề. Kiểm tra cấu trúc và nhãn sau sinh, kiểm tra lần nữa khi lưu.
- Tự soạn/JSON/tệp/hỗn hợp/tái sử dụng: cùng cổng tạo assignment; không có tùy chọn tắt ma trận, kể cả bản nháp mới.
- Phát hành qua settings: kiểm tra lại các câu được giao, ưu tiên bản chụp đã đóng băng.
- Mẫu JSON và prompt sao chép: lấy danh mục/ma trận hiện hành từ máy chủ; mẫu trống phải điền nội dung thật trước khi dùng.

## 7. Kiểm chứng và giới hạn

Đã kiểm thử đề đúng 22 câu nhưng sai chuyên đề/mức/độ khó vẫn bị chặn; không gửi số lượng vẫn không bỏ qua; không tin chuyên đề giả trong source; chặn câu trùng, sai khối, chờ rà soát và câu chỉ tham chiếu tệp; đề hợp lệ lưu đúng thứ tự và phiên bản; phát hành nháp không hợp lệ bị chặn. Kiểm thử AI xác nhận yêu cầu gửi đi chứa 22 vị trí và cùng tiêu chí đánh nhãn.

Ngân hàng thực tế còn thiếu tổ hợp câu cho một số vị trí. Kiểm tra nghiêm ngặt sẽ tiếp tục báo thiếu đến khi bổ sung đúng nội dung và nhãn, không tự hạ chuẩn. Đề cũ đang làm/đã nộp không bị thay đổi tự động.

## Tài liệu tham khảo

Bộ định nghĩa trên là tiêu chí vận hành được cụ thể hóa cho sản phẩm, tham khảo cách tách mức và yêu cầu cần đạt trong [bản đặc tả cuối HKII Toán 9 Bình Thạnh 2024–2025](https://file.giaitoan.edu.vn/file-pdf/de-tham-khao-cuoi-ki-2-toan-9-nam-2024-2025-phong-gd-dt-binh-thanh-tp-hcm.pdf) và [bản đặc tả HKI Toán 9 Củ Chi 2023–2024](https://file.toan12.edu.vn/file-pdf/bo-de-tham-khao-cuoi-ky-1-toan-9-nam-2023-2024-phong-gd-dt-cu-chi-tp-hcm.pdf). Không gán các ví dụ và quy tắc sản phẩm thành trích dẫn nguyên văn hay yêu cầu thống nhất của Bộ.
