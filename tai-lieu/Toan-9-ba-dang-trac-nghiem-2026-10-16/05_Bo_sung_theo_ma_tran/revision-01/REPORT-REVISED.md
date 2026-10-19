# BÁO CÁO RÀ SOÁT VÀ HIỆU CHỈNH 52 ỨNG VIÊN BỔ SUNG THEO MA TRẬN (REVISION-01)

**Thời gian lập:** 18/10/2026  
**Thư mục làm việc:** `tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-01/`  
**Quy chế kiểm soát:** Không kết nối cơ sở dữ liệu, không chạy seed/import, không sửa ứng dụng, không sửa tài liệu gốc.

---

## 1. ĐÍNH CHÍNH QUAN TRỌNG VỀ ĐỘ PHỦ MA TRẬN

Trong báo cáo ban đầu tại thư mục `05_Bo_sung_theo_ma_tran/`, việc ghi nhận "Đạt 52/52 ứng viên theo chỉ tiêu tìm kiếm" đã gây hiểu lầm là ma trận đã được lấp đầy và sẵn sàng sử dụng. 

**Đính chính chính thức:**
1. **"Đạt số lượng ứng viên tìm kiếm" $\ne$ "Đủ câu khớp ma trận đã duyệt".**
   - 52 ứng viên được thu thập là tập dữ liệu ứng viên thô (candidate pool) phục vụ công tác rà soát.
   - Chưa có bất kỳ câu hỏi nào trong 52 câu này được phê duyệt chính thức (`approvedCount = 0`, 100% giữ trạng thái `NEEDS_REVIEW`).
2. **Thiếu hụt thực tế tại Vị trí 22 (ADVANCED_APPLYING):** Cả 5 ứng viên tìm được đều không đạt mức Vận dụng cao theo đúng thao tác tư duy toán học. Số lượng khớp thực tế của Vị trí 22 là **0/5**.
3. **Trạng thái chưa hoàn tất của 4 nhóm Đúng/Sai (Vị trí 13, 14, 15, 16):** Do chưa có quy tắc gộp mức nhận thức cho toàn câu (mỗi ý $a, b, c, d$ có mức nhận thức độc lập từ Nhận biết đến Vận dụng), cả 20 câu Đúng/Sai được giữ ở mức câu chính là `null` và tạm xếp nhóm `PARTIALLY_MATCHED` (chờ quy tắc gộp).

---

## 2. KẾT QUẢ ĐỐI SOÁT CHI TIẾT THEO MA TRẬN (COVERAGE-REVISED)

Bảng tổng hợp chi tiết từ `coverage-revised.csv`:

| Vị trí | Chuyên đề | Dạng câu | Mức yêu cầu | Tổng ứng viên | Khớp đầy đủ | Khớp 1 phần | Thiếu căn cứ | Đã duyệt | Trạng thái kỹ thuật |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **02** | PT quy về bậc nhất | Nhiều lựa chọn | REMEMBERING | 6 | 4 | 2 | 0 | 0 | 2 câu trùng/gần trùng tác giả |
| **10** | Tứ giác nội tiếp, đa giác đều | Nhiều lựa chọn | UNDERSTANDING | 6 | 6 | 0 | 0 | 0 | Đạt yêu cầu ứng viên |
| **11** | Thống kê, tần số tương đối | Nhiều lựa chọn | REMEMBERING | 5 | 4 | 1 | 0 | 0 | 1 câu biến thể đổi số |
| **13** | Mô hình hóa PT & Hệ PT | Đúng/Sai (4 ý) | UNDERSTANDING | 5 | 0 | 5 | 0 | 0 | Chờ quy tắc gộp mức Đ/S |
| **14** | Biến đổi căn thức | Đúng/Sai (4 ý) | UNDERSTANDING | 5 | 0 | 5 | 0 | 0 | Chờ quy tắc gộp mức Đ/S |
| **15** | Hình học đường tròn | Đúng/Sai (4 ý) | UNDERSTANDING | 5 | 0 | 5 | 0 | 0 | Chờ quy tắc gộp mức Đ/S |
| **16** | Đọc & phân tích dữ liệu | Đúng/Sai (4 ý) | UNDERSTANDING | 5 | 0 | 5 | 0 | 0 | Chờ quy tắc gộp mức Đ/S |
| **17** | Viète và ứng dụng | Trả lời ngắn | APPLYING | 5 | 5 | 0 | 0 | 0 | Đạt yêu cầu ứng viên |
| **20** | Diện tích, thể tích thực tế | Trả lời ngắn | APPLYING | 5 | 5 | 0 | 0 | 0 | Đạt yêu cầu ứng viên |
| **22** | HH đường tròn & cực trị | Trả lời ngắn | ADVANCED_APPLYING | 5 | 0 | 5 | 0 | 0 | **LỆCH MỨC: 0 câu đạt VDC** |
| **TỔNG** | **10 nhóm chuyên đề** | **3 dạng** | **Đủ 4 mức** | **52** | **24** | **28** | **0** | **0** | **0 câu vào CSDL** |

---

## 3. RÀ SOÁT CHUYÊN SÂU VỊ TRÍ 22 (HÌNH HỌC ĐƯỜNG TRÒN - VẬN DỤNG CAO)

Yêu cầu chuẩn của Vị trí 22 trong Blueprint: Câu hỏi Trả lời ngắn mức **Vận dụng cao (ADVANCED_APPLYING)**, đòi hỏi học sinh kết hợp từ 3 đến 4 bước tư duy phức hợp (dựng hình phụ, phân tích nhiều trường hợp, kết hợp hệ thức hình học với bất đẳng thức hoặc tìm cực trị hình học).

Rà soát toàn bộ 5 ứng viên đã thu thập:

1. **`CAND-SLOT22-01`** (`01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Q44, Tr. 22):
   - *Nội dung:* Cho góc nội tiếp $\widehat{AMB} = 45^\circ$, dây $AB = 10\sqrt{2}\text{ cm}$. Tính bán kính $R$.
   - *Thao tác tư duy thực tế:* $\widehat{AOB} = 2\widehat{AMB} = 90^\circ \implies \triangle OAB$ vuông cân tại $O \implies AB = R\sqrt{2} \implies R = 10\text{ cm}$.
   - *Đánh giá:* Chỉ cần đúng 2 bước nhận biết - thông hiểu công thức góc ở tâm và định lý Pythagoras. Đây chỉ là mức **Thông hiểu (UNDERSTANDING)** hoặc Vận dụng rất thấp, hoàn toàn không đạt chuẩn Vận dụng cao.
   - *Xếp loại:* `PARTIALLY_MATCHED` (Trạng thái: `SHORTAGE_LEVEL_MISMATCH`).

2. **`CAND-SLOT22-02`** (`01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Q45, Tr. 22):
   - *Nội dung:* Cho $\triangle ABC$ nhọn nội tiếp $(O; R)$, đường cao $AH$. Biết $AB = 6, AC = 8, AH = 4$. Tính đường kính $2R$.
   - *Thao tác tư duy thực tế:* Kẻ đường kính $AD$, chứng minh $\triangle ABH \sim \triangle ADC \implies AB \cdot AC = AH \cdot AD = 2R \cdot AH \implies 2R = \frac{48}{4} = 12$.
   - *Đánh giá:* Đây là bổ đề hình học cơ bản kinh điển từ lớp 8, giải bằng 1 bước tam giác đồng dạng quen thuộc. Mức tư duy tối đa là **Vận dụng thấp (APPLYING - 2 bước)**.
   - *Xếp loại:* `PARTIALLY_MATCHED` (Trạng thái: `SHORTAGE_LEVEL_MISMATCH`).

3. **`CAND-SLOT22-03`** (`01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Q46, Tr. 22):
   - *Nội dung:* Bài toán đảo của Câu 45: Cho $AB = 3, AC = 4, R = 2.5$. Tính đường cao $AH$.
   - *Thao tác tư duy thực tế:* Thay số trực tiếp vào hệ thức quen thuộc $AH = \frac{AB \cdot AC}{2R} = \frac{12}{5} = 2.4$.
   - *Đánh giá:* Bài tập thế số 1 bước, chỉ ở mức **Thông hiểu (UNDERSTANDING)**.
   - *Xếp loại:* `PARTIALLY_MATCHED` (Trạng thái: `SHORTAGE_LEVEL_MISMATCH`).

4. **`CAND-SLOT22-04`** (`12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Phần III Câu 3, Tr. 4):
   - *Nội dung:* Cho $(O; R)$ và điểm $A$ ngoài đường tròn. Hai tiếp tuyến $AB, AC$, cát tuyến $ADE$. Tính tích đoạn thẳng và góc liên quan.
   - *Thao tác tư duy thực tế:* Sử dụng phương tích tiếp tuyến $AB^2 = AD \cdot AE$ và hệ thức lượng trong tam giác vuông. Cần 3 bước biến đổi hình học tiêu chuẩn.
   - *Đánh giá:* Đạt mức **Vận dụng (APPLYING)**, chưa đạt mức phức hợp đa tầng của Vận dụng cao. Đồng thời, nguồn đề gốc Hải Phòng bị in lệch số thứ tự đáp án phần III.
   - *Xếp loại:* `PARTIALLY_MATCHED` (Trạng thái: `SHORTAGE_LEVEL_MISMATCH`).

5. **`CAND-SLOT22-05`** (`01_HK2_Hung_Yen_2025_2026.pdf`, Phần III Câu 3, Tr. 3):
   - *Nội dung:* Cho hai đường tròn đồng tâm $(O; R_1)$ và $(O; R_2)$. Dây của đường tròn lớn tiếp xúc đường tròn nhỏ có độ dài $8\text{ cm}$. Tính diện tích hình vành khăn.
   - *Thao tác tư duy thực tế:* Kẻ đoạn vuông góc $OH \perp AB \implies HA = 4\text{ cm}$. Trong $\triangle OHA$ vuông: $R_1^2 - R_2^2 = HA^2 = 16 \implies S = \pi(R_1^2 - R_2^2) = 16\pi \approx 50.27$.
   - *Đánh giá:* 2 bước tính toán cơ bản về đường tròn đồng tâm. Lệch khỏi trọng tâm kiến thức tứ giác nội tiếp/đường tròn ngoại tiếp của Vị trí 22 và chỉ ở mức **Vận dụng thấp (APPLYING)**.
   - *Xếp loại:* `PARTIALLY_MATCHED` (Trạng thái: `SHORTAGE_LEVEL_MISMATCH`).

> **Kết luận Vị trí 22:** Toàn bộ 5 ứng viên thu thập được đều bị gán ép nhãn Vận dụng cao trong đợt quét đầu. Sau khi phân tích thao tác giải thực tế, **không có câu nào đạt mức ADVANCED_APPLYING**. Đề xuất ghi nhận thiếu hụt 100% tại vị trí này để tìm nguồn đề chuyên/đề học sinh giỏi bổ sung.

---

## 4. XỬ LÝ NHÓM CÂU HỎI ĐÚNG/SAI (VỊ TRÍ 13, 14, 15, 16)

Theo cấu trúc đề thi mới của Bộ Giáo dục & Đào tạo:
- Dạng câu hỏi Đúng/Sai gồm 1 câu dẫn chính và 4 ý phụ ($a, b, c, d$).
- Mỗi ý phụ là một khẳng định độc lập có mức nhận thức riêng biệt (thường ý $a, b$ ở mức Nhận biết/Thông hiểu; ý $c, d$ ở mức Vận dụng).
- Hiện tại, khung Blueprint chẩn đoán chưa ban hành quy tắc tổng hợp (aggregation rule) để xác định một mức nhận thức duy nhất cho toàn bộ câu hỏi Đúng/Sai.

**Giải pháp kỹ thuật chuẩn hóa trong Revision-01:**
1. Thuộc tính `cognitiveLevel` ở cấp câu chính được đặt là `null`.
2. Bổ sung trường `statementLevelDistribution` ghi nhận chính xác cơ cấu mức nhận thức của 4 ý (ví dụ: `{"REMEMBERING": 1, "UNDERSTANDING": 2, "APPLYING": 1}`).
3. Phân loại chi tiết từng ý phụ $a, b, c, d$ với đầy đủ `skillCode`, `cognitiveLevel` và `rationale`.
4. Toàn bộ 20 câu Đúng/Sai được phân loại là `PARTIALLY_MATCHED` với mã trạng thái `PENDING_TF_AGGREGATION_RULE`. Không tính các câu này vào diện đã khớp hoàn toàn (`fullyMatchedCandidates = 0`) cho đến khi có quy tắc gộp chính thức từ hội đồng chuyên môn.

---

## 5. RÀ SOÁT CÂU TRÙNG LẶP VÀ GẦN TRÙNG LẶP (DUPLICATE AUDIT)

Qua đối chiếu chéo nội dung giữa các tài liệu nguồn, phát hiện 3 nhóm câu có tính phụ thuộc lẫn nhau:

1. **Nhóm `DUP-SLOT02-VYY-EQ` (Slot 2):**
   - `CAND-SLOT02-01` (`01_Chuyen_de/02_PT_bac_nhat_hai_an.pdf`, Q45) và `CAND-SLOT02-04` (`03_Bo_sung.../14_100_bai_toan_thuc_te_9_Canh_Dieu.pdf`, Q56).
   - *Bản chất:* Cùng của tác giả Trương Ngọc Vỹ, cùng hỏi về điều kiện xác định của phương trình phân thức $\frac{x}{x-2} = \dots$. Chỉ khác biệt cách trình bày phương án. Hai câu này không thể coi là hai nguồn câu hỏi độc lập.
2. **Nhóm `DUP-SLOT11-HY-SWAP` (Slot 11):**
   - `CAND-SLOT11-04` (Mã đề 9201, Câu 9) và `CAND-SLOT11-05` (Mã đề 9202, Câu 1) từ `01_HK2_Hung_Yen_2025_2026.pdf`.
   - *Bản chất:* Cùng một bài toán thống kê điểm số học sinh, mã đề 9202 chỉ hoán đổi vị trí câu và đảo thứ tự hàng trong bảng phân bố tần số.
3. **Nhóm `DUP-SLOT22-CHORD-LEMMA` (Slot 22):**
   - `CAND-SLOT22-02` (Q45) và `CAND-SLOT22-03` (Q46) trong `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`.
   - *Bản chất:* Là bài toán thuận và nghịch của cùng một hệ thức hình học ($AB \cdot AC = 2R \cdot AH$).

---

## 6. KẾT QUẢ KIỂM THỬ TÍNH TOÀN VẸN (VALIDATION)

Bộ kiểm thử tự động `validate_revision.py` đã thực hiện 6 bước kiểm tra nghiêm ngặt:
1. **Kiểm tra JSONL:** 52/52 dòng JSONL hợp lệ, phân tích cú pháp chuẩn xác.
2. **Kiểm tra dữ liệu phân loại:** Đủ 17 câu trắc nghiệm nhiều lựa chọn, 20 câu Đúng/Sai (80 ý phụ độc lập), 15 câu Trả lời ngắn. Toàn bộ câu Đúng/Sai có `cognitiveLevel = null`.
3. **Kiểm tra đối chiếu Candidates CSV:** Khớp 1-1 chính xác 52 dòng giữa `candidates.csv` và `questions.jsonl`.
4. **Kiểm tra số liệu Ma trận Coverage:** Bảng `coverage-revised.csv` khớp 100% với phân loại chi tiết của 52 câu.
5. **Kiểm tra Assets:** Hình ảnh `assets/SRC-NEW-003-P004-Q002.png` tồn tại, định dạng PNG kích thước chuẩn 708x666, RGB.
6. **Kiểm tra công thức toán học KaTeX (`throwOnError: true`):**
   - Tổng số công thức phân tích từ nội dung câu, phương án, ý phụ và lời giải: **877 công thức**.
   - **Tỷ lệ render thành công: 100% (877/877 công thức)**. Không có bất kỳ lỗi KaTeX nào.

---

## 7. DANH MỤC TỆP BÀN GIAO (REVISION-01)

Tất cả kết quả được lưu độc lập tại:  
`tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-01/`

- `questions.jsonl`: 52 câu hỏi trích xuất đầy đủ stem, options, statements, answer keys, explanations, classifications, auditReview.
- `candidates.csv`: Danh mục 52 ứng viên liên kết nguồn, mã đề, mức nhận thức, mã trùng lặp, nhóm khớp ma trận.
- `coverage-revised.csv`: Thống kê độ phủ ma trận thực tế theo 10 vị trí.
- `REPORT-REVISED.md`: Báo cáo rà soát và đánh giá kỹ thuật chuyên sâu (tệp này).
- `validate_revision.py` & `validate_katex.cjs`: Bộ kiểm thử toàn vẹn dữ liệu và bộ kiểm thử KaTeX nghiêm ngặt.
- `assets/SRC-NEW-003-P004-Q002.png`: Hình ảnh hình học đính kèm được crop chuẩn xác.

---

## 8. KHUYẾN NGHỊ TIẾP THEO CHO HỘI ĐỒNG CHUYÊN MÔN

1. **Tìm kiếm bổ sung thực sự cho Vị trí 22 (Vận dụng cao):**
   - Tìm kiếm từ các tài liệu ôn thi học sinh giỏi lớp 9, đề thi vào lớp 10 chuyên (phần hình học cực trị hoặc bất đẳng thức hình học đường tròn), vì các đề khảo sát 90 phút đại trà hiếm khi đưa bài toán hình học Vận dụng cao vào dạng Trả lời ngắn.
2. **Ban hành quy tắc gộp mức cho dạng Đúng/Sai (Slots 13–16):**
   - Xác định quy tắc tính điểm và gán mức nhận thức: Gán theo ý có mức cao nhất, hay tính theo ngưỡng số ý làm đúng của học sinh.
3. **Giữ nguyên trạng thái:** Không nạp vào database cho đến khi các câu hỏi được duyệt nội dung bởi giáo viên bộ môn.
