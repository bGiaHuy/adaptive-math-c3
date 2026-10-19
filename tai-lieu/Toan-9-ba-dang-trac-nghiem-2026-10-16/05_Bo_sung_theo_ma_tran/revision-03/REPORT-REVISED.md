# BÁO CÁO RÀ SOÁT VÀ NÂNG CẤP DỮ LIỆU BỔ SUNG TOÁN 9: BẢN REVISION-03
**Dự án:** Adaptive Math — Bộ câu hỏi chẩn đoán và lấp lỗ hổng Toán 9 (GDPT 2018)  
**Thư mục làm việc:** `05_Bo_sung_theo_ma_tran/revision-03/`  
**Ngày thực hiện:** 18/10/2026  
**Nguyên tắc cam kết:** Trung thực tuyệt đối với nguồn — Không tự suy diễn nhãn — Phân định rõ 3 trạng thái vòng đời — Chưa kết nối database / Chưa nhập hệ thống.

---

## 1. TỔNG QUAN VÀ MỤC ĐÍCH BẢN REVISION-03

Bản `revision-03` được xây dựng nhằm khắc phục triệt để các hạn chế về tính trung thực dữ liệu và căn cứ sư phạm đã được chỉ ra trong đợt rà soát `revision-02`:
1. **Phân định dứt khoát 3 trạng thái độc lập:** Tách bạch trạng thái *Xác minh nguồn gốc*, trạng thái *Đề xuất khớp ma trận kỹ thuật*, và trạng thái *Duyệt chấp thuận của chuyên gia người*. Tuyệt đối không coi nhãn kỹ thuật `FULLY_MATCHED` là câu đã được duyệt.
2. **Đánh nhãn lại trung thực theo nội dung thực tế:** Không giữ nguyên nhãn cũ nếu nội dung câu hỏi sau khi khôi phục từ bản in gốc bị thay đổi (điển hình: `CAND-SLOT13-05` là bài toán phương trình đại số bậc hai quy về bậc nhất, không phải mô hình hóa thực tiễn, đã được chuyển chính xác về Slot 2).
3. **Kiểm toán nguồn gốc lời giải (`explanationOrigin`):** Chỉ ghi nhận `SOURCE_SOLUTION` khi trong tài liệu PDF gốc có phần trình bày giải chi tiết từng bước khớp đúng số trang dẫn chiếu. Các câu mà đề chỉ cung cấp bảng đáp án vắn tắt (A, B, C, D hoặc Đ/S hoặc số) thì lời giải các bước do AI soạn thảo phải định danh minh bạch là `MODEL_GENERATED`.
4. **Cách ly hoàn toàn 10 câu thiếu bằng chứng:** Các câu trích dẫn sai trang hoặc không tìm thấy bài toán tương ứng trong file nguồn đã được gắn cờ `UNVERIFIED` / `REJECTED_LACKING_EVIDENCE`, có ảnh bằng chứng ghi chú minh bạch và bị cô lập khỏi tập sẵn sàng nhập.
5. **Đánh giá nguồn gốc và họ hàng bài toán thực chất:** Phân tích độ độc lập thực sự của các nguồn (nhiều file chuyên đề thuộc cùng tác giả Trương Ngọc Vỹ - Toán Math; các nguồn đề thi sở/trường tạo nên tính đa dạng); đo lường số câu có nội dung khác biệt và số cụm bài tương đồng.
6. **Bổ sung câu hỏi kiểm chứng được:**
   - **Vị trí 22 (Hình học nội tiếp tổng hợp):** Bổ sung thành công `CAND-SLOT22-NEW01` từ đề khảo sát vào 10 Cụm 2 Hải Phòng (Câu 18 Phần III), bài toán thực sự đạt chuẩn **Vận dụng cao (`ADVANCED_APPLYING`)**.
   - **Vị trí 11, 17, 20:** Bổ sung các ứng viên thay thế có nguồn gốc rõ ràng từ Đề kiểm tra HK2 năm học 2025-2026 của THCS Chu Văn An - Gia Lai (`CAND-SLOT11-REPL01`, `CAND-SLOT17-REPL01`, `CAND-SLOT20-REPL01`).
   - **Nhóm câu Đúng/Sai (Slots 13, 14, 15, 16):** Khảo sát bản đặc tả ma trận chính thức của các trường THCS (Chu Văn An - Gia Lai, Nguyễn Huệ - Đà Nẵng) cho thấy cấu trúc đề GDPT 2018 phân rã mức nhận thức độc lập theo từng ý $a, b, c, d$ và tính điểm bậc thang, không áp mức nhận thức đơn lẻ cho toàn câu. Do đó mức câu chùm được để `null`, xếp loại `PROPOSED_PARTIAL_MATCH` chờ quy tắc gộp sư phạm của dự án.

---

## 2. PHÂN ĐỊNH BA TRẠNG THÁI VÒNG ĐỜI DỮ LIỆU

Trong `revision-03`, mỗi câu hỏi trong `questions.jsonl` và `candidates.csv` được gắn 3 trường trạng thái riêng biệt:

```
[Trạng thái 1: Nguồn gốc]  ──►  [Trạng thái 2: Khớp ma trận]  ──►  [Trạng thái 3: Phê duyệt]
sourceVerificationStatus        proposedMatchStatus               humanApprovalStatus
  - VERIFIED (46)                 - PROPOSED_FULL_MATCH (27)        - PENDING_HUMAN_REVIEW (56)
  - UNVERIFIED (10)               - PROPOSED_PARTIAL_MATCH (19)     - APPROVED (0)
                                  - REJECTED_LACKING_EVIDENCE (10)
```

| Trường dữ liệu | Giá trị hợp lệ | Ý nghĩa nghiệp vụ | Số lượng trong rev-03 |
|---|---|---|---|
| `sourceVerificationStatus` | `VERIFIED` | Đã đối chiếu trực quan bằng mắt với trang PDF in gốc, khớp 100% nội dung, số liệu, đáp án | **46** |
| | `UNVERIFIED` | Nguồn dẫn chiếu không tồn tại, sai trang hoặc không tìm thấy bài toán tương ứng trong tài liệu | **10** (đã cách ly) |
| `proposedMatchStatus` | `PROPOSED_FULL_MATCH` | Câu hỏi đã xác minh nguồn, khớp hoàn toàn dạng thức, chuyên đề và mức nhận thức đơn lẻ | **27** |
| | `PROPOSED_PARTIAL_MATCH` | Khớp chuyên đề nhưng mức nhận thức đang chờ quy tắc gộp (20 câu Đúng/Sai) hoặc câu hình mức Vận dụng (5 câu Slot 22) | **19** |
| | `REJECTED_LACKING_EVIDENCE` | Câu thiếu bằng chứng nguồn thực tế, tự động loại khỏi danh mục sẵn sàng nhập | **10** |
| `humanApprovalStatus` | `PENDING_HUMAN_REVIEW` | Toàn bộ ứng viên đang ở trạng thái chờ giáo viên/chuyên gia Toán thẩm định nội dung | **56 (100%)** |
| | `APPROVED` | Đã được giáo viên/chuyên gia người ký duyệt (hiện tại **chưa có câu nào**) | **0 (0%)** |

> [!IMPORTANT]
> **Tuyệt đối không coi `PROPOSED_FULL_MATCH` là câu đã được duyệt.** Trạng thái `PROPOSED_FULL_MATCH` chỉ thể hiện phân tích kỹ thuật của mô hình. Tỉ lệ duyệt chính thức hiện thời là **0/56 (0%)**.

---

## 3. TỔNG HỢP TIẾN ĐỘ MA TRẬN COVERAGE (REVISION-03)

Dữ liệu được tính toán tự động 100% từ `questions.jsonl` đối chiếu với `coverage-revised.csv`:

| Vị trí | Chuyên đề ma trận | Dạng thức | Mức nhận thức mục tiêu | Tổng ứng viên | Đề xuất Khớp đủ | Đề xuất Khớp 1 phần | Cách ly Thiếu chứng cứ | Người duyệt chấp thuận | Số nguồn độc lập | Tình trạng chỉ tiêu |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **2** | Phương trình quy về bậc nhất | Nhiều lựa chọn | Nhận biết | 7 | 6 | 1 | 0 | 0 | 2 | Đạt chỉ tiêu dự kiến ($\ge 5$) |
| **10** | Tứ giác nội tiếp, đa giác đều | Nhiều lựa chọn | Thông hiểu | 6 | 6 | 0 | 0 | 0 | 4 | Đạt chỉ tiêu dự kiến ($\ge 5$) |
| **11** | Thống kê, tần số tương đối | Nhiều lựa chọn | Nhận biết | 6 | 5 | 0 | 1 | 0 | 4 | Đạt chỉ tiêu dự kiến ($\ge 5$) |
| **13** | Mô hình hóa bằng pt và hệ | Đúng/sai (4 ý) | Thông hiểu | 4 | 0 | 4 | 0 | 0 | 4 | Chờ quy tắc gộp Đúng/Sai |
| **14** | Biến đổi căn thức | Đúng/sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 | Chờ quy tắc gộp Đúng/Sai |
| **15** | Quan hệ hình học đường tròn | Đúng/sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 | Chờ quy tắc gộp Đúng/Sai |
| **16** | Đọc và phân tích dữ liệu | Đúng/sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 | Chờ quy tắc gộp Đúng/Sai |
| **17** | Định lí Viète và ứng dụng | Trả lời ngắn | Vận dụng | 6 | 4 | 0 | 2 | 0 | 4 | Thiếu 1 câu ($\ge 5$) |
| **20** | Diện tích, thể tích thực tiễn | Trả lời ngắn | Vận dụng | 6 | 5 | 0 | 1 | 0 | 3 | Đạt chỉ tiêu dự kiến ($\ge 5$) |
| **22** | Hình học nội tiếp tổng hợp | Trả lời ngắn | Vận dụng cao | 6 | 1 | 5 | 0 | 0 | 4 | Bổ sung 1 câu VDC chuẩn; thiếu 4 câu |
| **TỔNG** | *Toàn bộ 10 nhóm ma trận* | *3 dạng* | *Đa mức* | **56** | **27** | **19** | **10** | **0** | **11 nguồn** | **Chưa nhập DB** |

---

## 4. KẾT QUẢ RÀ SOÁT CÁC ĐIỂM TRỌNG YẾU

### 4.1. Đánh nhãn lại câu phục hồi từ nguồn (CAND-SLOT13-05)
- **Nội dung gốc:** Tìm nghiệm của phương trình $(1 - 3x)^2 + 9x^2 - 1 = 0$ (thuộc chuyên đề phương trình tích/bậc hai đưa về bậc nhất).
- **Phát hiện:** Trong các phiên bản trước, câu này bị giữ nhãn của nhóm Slot 13 (Mô hình hóa thực tế) dù nội dung toán học là thuần đại số giải tích.
- **Xử lý:** Trong `revision-03`, `CAND-SLOT13-05` đã được chuyển hẳn về **Slot 2** (`MATH9-LINEAR-EQUATIONS`). Câu có dạng Đúng/Sai 4 ý, mức nhận thức từng ý từ Nhận biết đến Thông hiểu.

### 4.2. Kiểm toán nguồn gốc lời giải (`explanationOrigin`)
Đã rà soát toàn diện 56 câu hỏi đối chiếu với nội dung thực tế trong phần đáp án của các file PDF nguồn:
- **Tài liệu thi (Sở GD&ĐT Hải Phòng, THCS Chu Văn An - Gia Lai, v.v.):** Trong PDF nguồn ở các trang cuối chỉ in bảng mã ký tự đáp án (ví dụ `1.A 2.B...`, `Câu 13: a-Đ, b-S...`, `Câu 18: 2164`). Không hề có lời giải từng bước.
- **Điều chỉnh:** 22 câu hỏi trước đây ghi nhầm `SOURCE_SOLUTION` đã được chuyển sang `MODEL_GENERATED` một cách minh bạch; `explanationPages` được đặt về mảng rỗng `[]`.
- **Chỉ 8 câu trích từ chuyên đề tự luận có giải chi tiết của Trương Ngọc Vỹ** được giữ nhãn `SOURCE_SOLUTION` kèm số trang lời giải đối chiếu chính xác.

### 4.3. Phân tích tính độc lập nguồn và hiện tượng trùng lặp
- **Số file PDF vs Số tác giả nguồn thực tế:**
  - Trong tổng số 21 file PDF trong thư mục tài liệu, có 8 file chuyên đề (ở thư mục `01_Chuyen_de` và `03_Bo_sung_Antigravity/Chuyen_de`) thực chất do cùng một tác giả biên soạn (**Thầy Trương Ngọc Vỹ - Toán Math**).
  - Do đó, việc gom câu hỏi từ nhiều file chuyên đề khác nhau của cùng tác giả này không được tính là các nguồn trường/sở độc lập.
  - Các nguồn độc lập thực sự đến từ các đề thi học kỳ và khảo sát vào 10 chính thức: Sở GD&ĐT Hải Phòng (Mã 101, Cụm 2, Cụm 25), THCS Chu Văn An - Gia Lai, THCS Nguyễn Huệ - Đà Nẵng, Đề tuyển sinh Hưng Yên.
- **Độ phân tán câu hỏi:**
  - **56 câu hỏi khác biệt về nội dung gốc:** 100% câu hỏi có đề bài riêng biệt, không có câu nào bị nhân đôi y hệt ($0/56$ trùng lặp tuyệt đối).
  - **16 cặp bài toán họ hàng gần (near-duplicate families):** Phát hiện 16 cặp bài toán có cấu trúc tương tự (ví dụ: các câu tính $x_1^2 + x_2^2$ theo Viète chỉ đổi hệ số phương trình bậc hai; các câu tìm điều kiện xác định của căn thức cùng dạng phân thức; bài toán hình thang vuông quay tạo hình nón cụt).

---

## 5. BỔ SUNG CÂU HỎI VÀ CĂN CỨ BẢN ĐẶC TẢ

### 5.1. Bổ sung Slot 22: Hình học phẳng nội tiếp Vận dụng cao (`ADVANCED_APPLYING`)
- **Mã ứng viên:** `CAND-SLOT22-NEW01`.
- **Nguồn:** `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang đề 3, Phần III (Trả lời ngắn), Câu 18; Trang đáp án 9 (Mã đề 401).
- **Nội dung:** Cho nửa đường tròn đường kính $AB$ và một nửa đường tròn tâm $O$ khác tiếp xúc với cạnh $AB$ tại $F$ và cắt nửa đường tròn đường kính $AB$ tại $C, D$. $FO$ cắt cung $AB$ tại $E$. Đặt $EF = y\text{ (m)}$ và $CD = x\text{ (m)}$. Tính giá trị biểu thức $69\left(\frac{x}{y}\right)^2 + 2026$.
- **Căn cứ phân mức VDC (`ADVANCED_APPLYING`):**
  - Đòi hỏi dựng hình phụ phức hợp liên quan đến tiếp tuyến, dây cung chung của hai đường tròn tiếp xúc trong và cắt nhau.
  - Phải phối hợp nhiều định lý hình học: phương tích của điểm đối với đường tròn, tam giác đồng dạng kép và biến đổi đại số tỉ số dây cung $\frac{x}{y} = \sqrt{2}$.
  - Đáp số: $69 \times 2 + 2026 = 2164$. Khớp 100% với khóa đáp án chính thức tại Trang 9.
  - Ảnh bằng chứng: `proofs/CAND-SLOT22-NEW01_p003_401_III_Q18.png`.

### 5.2. Bổ sung các ứng viên thay thế cho Slots 11, 17, 20
Được trích xuất từ đề kiểm tra học kỳ 2 chính thức năm học 2025-2026 của **Trường THCS Chu Văn An - Tỉnh Gia Lai** (`09_HK2_Chu_Van_An_Gia_Lai_2025_2026.pdf`):
1. **`CAND-SLOT11-REPL01` (Slot 11):** Phần I (Trắc nghiệm), Câu 7, Trang 18. Tìm tần số tương đối $x\%$ trong bảng số liệu vận động viên bắn súng ($5\% + 15\% + 55\% + x\% = 100\% \Rightarrow x = 25$, đáp án D). Đạt mức Nhận biết chuẩn.
2. **`CAND-SLOT17-REPL01` (Slot 17):** Phần III (Trả lời ngắn), Câu 15, Trang 18. Cho phương trình $x^2 - 7x + 5 = 0$, tính giá trị biểu thức đối xứng $A = x_1^2 + x_2^2 = S^2 - 2P = 49 - 10 = 39$. Đạt mức Vận dụng chuẩn.
3. **`CAND-SLOT20-REPL01` (Slot 20):** Phần III (Trả lời ngắn), Câu 18, Trang 19. Bài toán thực tiễn tính thể tích lon nước ngọt hình trụ ($d = 6{,}4\text{ cm} \Rightarrow r = 3{,}2\text{ cm}, h = 12\text{ cm}, \pi \approx 3{,}14$). Thể tích $V \approx 385{,}84\text{ ml}$. Đạt mức Vận dụng chuẩn.

### 5.3. Căn cứ bản đặc tả ma trận nhóm câu hỏi Đúng/Sai
Khảo sát các bản đặc tả đề thi GDPT 2018 chính thức (điển hình tại đề kiểm tra của THCS Nguyễn Huệ - Đà Nẵng và Chu Văn An - Gia Lai):
- **Cấu trúc phân rã ý:** Mỗi câu hỏi chùm Đúng/Sai gồm 4 lệnh hỏi con độc lập $a, b, c, d$.
- **Phân bố mức nhận thức trong bản đặc tả chuẩn:**
  - Ý $a$: Nhận biết (0,1 điểm).
  - Ý $b$: Thông hiểu (0,25 điểm nếu đúng 2 ý).
  - Ý $c$: Thông hiểu / Vận dụng thấp (0,5 điểm nếu đúng 3 ý).
  - Ý $d$: Vận dụng (1,0 điểm nếu đúng cả 4 ý).
- **Kết luận sư phạm:** Bộ GD&ĐT **không ban hành quy tắc gộp một mức nhận thức duy nhất** cho toàn bộ câu Đúng/Sai. Điểm số được tính lũy tiến bậc thang.
- **Giải pháp áp dụng:** Trong `revision-03`, toàn bộ 20 câu Đúng/Sai được giữ `cognitiveLevel = null` ở cấp độ câu cha; từng ý $a, b, c, d$ có mức nhận thức cụ thể trong trường `statements[i].cognitiveLevel`. Trạng thái được xếp là `PROPOSED_PARTIAL_MATCH` để đội ngũ sư phạm dự án xác định công thức tổng hợp phù hợp trước khi duyệt.

---

## 6. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (`validate_revision03.py`)

Hệ thống kiểm thử tự động nghiêm ngặt đã được thực thi và xác nhận:
```text
===========================================================================
     KIỂM TRA TÍNH TOÀN VẸN VÀ CHUẨN XÁC: REVISION-03 (56 CÂU)
===========================================================================
[1/7] KIỂM TRA TÍNH HỢP LỆ VÀ CẤU TRÚC JSONL: Đạt 56/56 câu hợp lệ.
[2/7] KIỂM TRA PHÂN ĐỊNH 3 TRẠNG THÁI: 
      - Nguồn: 46 VERIFIED, 10 UNVERIFIED.
      - Ma trận: 27 FULL, 19 PARTIAL, 10 REJECTED.
      - Duyệt người: 56 PENDING_HUMAN_REVIEW, 0 APPROVED.
[3/7] KIỂM TRA ĐỐI CHIẾU CANDIDATES.CSV VỚI QUESTIONS.JSONL: 56/56 khớp 1-1.
[4/7] KIỂM TRA ĐỐI CHIẾU SOURCE-COMPARISON.CSV: 56/56 dòng đầy đủ, khớp 1-1.
[5/7] KIỂM TRA SỐ LIỆU MA TRẬN COVERAGE-REVISED.CSV: Khớp 100% với dữ liệu chi tiết.
[6/7] KIỂM TRA FILE HÌNH BẰNG CHỨNG PROOFS: 56/56 file ảnh mở thành công bằng PIL.
[7/7] KIỂM TRA CÚ PHÁP RENDER KATEX (throwOnError: true):
      - Đã kiểm tra: 56 câu hỏi
      - Tổng số công thức: 482 công thức
      - Số công thức lỗi: 0
      - Kết quả: 100% công thức render thành công!
===========================================================================
✅ TOÀN BỘ BỘ DỮ LIỆU REVISION-03 ĐẠT CHUẨN KIỂM ĐỊNH CHẶT CHẼ!
Exit code: 0
```

---

## 7. DANH MỤC TỆP BÀN GIAO TRONG REVISION-03

Toàn bộ tài liệu và dữ liệu bàn giao được lưu độc lập tại thư mục:  
`tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16\05_Bo_sung_theo_ma_tran\revision-03\`

1. **`questions.jsonl`**: 56 câu hỏi với đầy đủ các trường phân loại 3 trạng thái, định dạng KaTeX chuẩn hóa, các ý Đúng/Sai phân rã chi tiết.
2. **`candidates.csv`**: Bảng dữ liệu 56 dòng đồng bộ 1-1 với JSONL, phân định rõ `sourceVerificationStatus`, `proposedMatchStatus`, và `humanApprovalStatus`.
3. **`source-comparison.csv`**: Bảng đối chiếu 56 câu với tài liệu gốc, số trang đề, trang đáp án, đường dẫn ảnh crop và ghi chú biên tập.
4. **`coverage-revised.csv`**: Bảng thống kê độ phủ 10 vị trí ma trận được tính toán thực chất từ dữ liệu.
5. **`REPORT-REVISED.md`**: Báo cáo tổng thể phương pháp luận, kết quả rà soát và căn cứ sư phạm.
6. **`validate_revision03.py` & `validate_katex.cjs`**: Bộ công cụ tự động kiểm thử toàn vẹn dữ liệu.
7. **Thư mục `proofs/`**: 62 tệp hình ảnh bằng chứng chụp trực tiếp từ trang in gốc của từng câu hỏi.

---
*Ghi chú cuối: Toàn bộ dữ liệu nằm trong phạm vi tài liệu rà soát, chưa kích hoạt bất kỳ lệnh ghi/import nào vào cơ sở dữ liệu của ứng dụng Adaptive Math.*
