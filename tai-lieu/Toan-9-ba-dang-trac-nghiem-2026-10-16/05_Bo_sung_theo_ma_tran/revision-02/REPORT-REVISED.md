# BÁO CÁO RÀ SOÁT TÍNH TRUNG THỰC VỚI NGUỒN VÀ HIỆU CHỈNH TOÀN DIỆN 52 CÂU HỎI (REVISION-02)

**Thời gian lập:** 18/10/2026  
**Thư mục làm việc:** `tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/`  
**Quy chế tuân thủ:** Không kết nối database, không chạy seed/import, không sửa ứng dụng, không sửa tài liệu gốc, giữ nguyên các bản cũ để đối chứng. 100% câu hỏi giữ trạng thái `NEEDS_REVIEW`.

---

## 1. TỔNG QUAN VỀ LỖI TÍNH TRUNG THỰC Ở BẢN REVISION-01 VÀ BIỆN PHÁP KHẮC PHỤC

Trong đợt rà soát bản `revision-01`, hệ thống đã phát hiện các sai phạm nghiêm trọng về tính trung thực đối với tài liệu nguồn:

1. **Tự ý sửa đổi nội dung và bài toán gốc:**
   - Tại `CAND-SLOT02-01` (Trang 16 file `02_Phuong_trinh_bat_phuong_trinh.pdf`): Câu hỏi gốc là phương trình tích dạng tổng quát chứa tham số $(ax - b)(cx - d) = 0$ với đáp án B. Bản `revision-01` đã tự ý thay thế bằng các phương trình số cụ thể $(2x + 1)(x - 3) = 0$ và đổi đáp án thành A.
   - Tại `CAND-SLOT02-02`: Câu hỏi gốc có phương án D là "$ax + b = 0 \text{ và } cx + d = 0$" và khóa đáp án trong tài liệu là D. Bản `revision-01` đã tự sửa phương án B thành "hoặc" và tự chuyển khóa đáp án thành B, xóa bỏ văn bản nguồn.
   - Tại `CAND-SLOT02-04`: Đề gốc là $\frac{x}{3} - \frac{x-1}{2} + \frac{1}{4} = 0$ (mọi $x \in \mathbb{R}$), `revision-01` tự đổi thành $\frac{x-1}{3x-2} + \frac{1}{4} = 0$.
   - Tại `CAND-SLOT13-05`: Đề gốc là $(1 - 3x)^2 + 9x^2 - 1 = 0$, `revision-01` tự bịa ra bài toán hai vòi nước cùng chảy vào bể cạn.
   - Tại các câu `CAND-SLOT14-01`, `CAND-SLOT14-02`, `CAND-SLOT14-03`: Tự ý sửa đổi biểu thức số học ($\sqrt{32} \to \sqrt{48}$) và cấu trúc phân thức.
2. **Tạo dựng dữ liệu giả mạo (Fabrication) không có trong nguồn:**
   - `CAND-SLOT11-01`: Dẫn chứng trang 1 đề HK1 Hưng Yên Mã 9101 Câu 10. Nhưng câu 10 trong PDF thực tế là bài toán **Hình học góc đồng hồ** (góc $90^\circ$ tại 3 giờ), hoàn toàn không phải Thống kê. `revision-01` đã tự dựng một bảng số liệu thống kê lỗi chính tả.
   - `CAND-SLOT14-04`: Trích dẫn trang 4 đề Cụm 25 Hải Phòng Câu 1. Trong PDF thực tế là câu **Phương trình bậc hai Viète**, không phải Biến đổi căn thức.
   - `CAND-SLOT15-04`: Trang 7 đề Cụm 4 Hải Phòng Câu 4 thực tế là **rút gọn biểu thức đại số $P$**, `revision-01` tự bịa bài toán hình học tiếp tuyến và cát tuyến.
   - `CAND-SLOT16-02`: Trang 3 đề HK1 Hưng Yên không có Câu 4 Đúng/Sai thống kê (chỉ có Phần III Câu 4 tìm GTNN), `revision-01` tự bịa bảng điểm.
   - `CAND-SLOT17-04`: Trang 4 đề Cụm 25 Hải Phòng Câu 2 thực tế là câu Đúng/Sai về căn thức, `revision-01` tự dựng câu trả lời ngắn Viète.
   - Các câu `CAND-SLOT14-05`, `CAND-SLOT15-05`, `CAND-SLOT16-05`, `CAND-SLOT17-05`, `CAND-SLOT20-05` hoàn toàn không có trong các trang PDF được dẫn.
3. **Mâu thuẫn toán học giữa văn bản báo cáo và tệp số liệu:**
   - Báo cáo text ghi "24 câu khớp đầy đủ", nhưng bảng `coverage-revised.csv` lại cộng thành 27 (do ghi nhận 6+6+5+0+0+0+0+5+5+0 = 27). Số liệu không nhất quán.

### Nguyên tắc xử lý triệt để trong Revision-02:
- **Nguyên tắc 1 — Render và trích xuất đúng 100%:** Mở từng trang PDF thực tế, crop ảnh toàn bộ từng câu làm bằng chứng độc lập lưu tại `revision-02/proofs/`. Chép đúng từng từ, số liệu, điều kiện, thứ tự phương án và khóa đáp án của tài liệu gốc. Chỉ chuẩn hóa cú pháp KaTeX, không sửa bài toán.
- **Nguyên tắc 2 — Tách bạch đề xuất biên tập (`editorialProposal`):** Nếu tài liệu nguồn có lỗi in ấn, nhầm lẫn khái niệm (như liên từ "và" thay vì "hoặc" trong `CAND-SLOT02-02`), câu hỏi trích xuất giữ nguyên bản gốc; đề xuất chỉnh sửa được lưu riêng trong trường `editorialProposal` kèm lý do để hội đồng chuyên môn duyệt.
- **Nguyên tắc 3 — Xử lý nghiêm câu không xác minh được nguồn (`UNVERIFIED_SOURCE_TRANSCRIPTION`):** Toàn bộ 10 câu hỏi có vị trí nguồn lệch chuyên đề/dạng câu hoặc không tồn tại trong trang PDF được xếp vào trạng thái `UNVERIFIED_SOURCE_TRANSCRIPTION` và xếp nhóm `LACKING_EVIDENCE`. **Tuyệt đối không tính vào danh sách khớp đầy đủ**.
- **Nguyên tắc 4 — Nguồn lời giải minh bạch:** Chỉ dùng `SOURCE_SOLUTION` khi đã đối chiếu trực tiếp lời giải trong PDF và ghi rõ số trang; toàn bộ lời giải do AI bổ sung được gắn nhãn `MODEL_GENERATED`.
- **Nguyên tắc 5 — Số liệu đồng nhất tuyệt đối:** Toàn bộ bảng ma trận `coverage-revised.csv`, `candidates.csv`, `source-comparison.csv` và văn bản báo cáo này khớp nhau từng con số.

---

## 2. BẢNG TỔNG HỢP ĐỘ PHỦ MA TRẬN CUỐI CÙNG ([`coverage-revised.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/coverage-revised.csv))

| Vị trí | Chuyên đề | Dạng câu | Mức Blueprint | Tổng ứng viên | Khớp đầy đủ | Khớp 1 phần | Thiếu căn cứ | Đã duyệt | Đánh giá kỹ thuật & hiện trạng nguồn |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **02** | PT quy về bậc nhất | Nhiều lựa chọn | Nhận biết | 6 | 6 | 0 | 0 | 0 | Đã phục hồi đúng 100% đề gốc (4 dạng bài, 2 câu trùng tác giả Trương Ngọc Vỹ). |
| **10** | Tứ giác nội tiếp, đa giác đều | Nhiều lựa chọn | Thông hiểu | 6 | 6 | 0 | 0 | 0 | 100% đối chiếu ảnh trang đề, hình vẽ và đáp án gốc chuẩn xác. |
| **11** | Thống kê, tần số tương đối | Nhiều lựa chọn | Nhận biết | 5 | 4 | 0 | 1 | 0 | 4 câu khớp chuẩn; 1 câu (`CAND-SLOT11-01`) là Hình học góc đồng hồ, bị loại. |
| **13** | Mô hình hóa PT & Hệ PT | Đúng/Sai (4 ý) | Thông hiểu | 5 | 0 | 5 | 0 | 0 | 5 câu Đúng/Sai hợp lệ (đa mức UND-APP). `cognitiveLevel=null`, chờ quy tắc gộp. |
| **14** | Biến đổi căn thức | Đúng/Sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 câu Đúng/Sai hợp lệ (chờ quy tắc gộp); 2 câu bị loại (1 lệch PT bậc hai, 1 không có nguồn). |
| **15** | Quan hệ HH đường tròn | Đúng/Sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 câu Đúng/Sai hình học hợp lệ; 2 câu bị loại (1 lệch sang căn thức đại số, 1 không có nguồn). |
| **16** | Đọc & phân tích dữ liệu | Đúng/Sai (4 ý) | Thông hiểu | 5 | 0 | 3 | 2 | 0 | 3 câu Đúng/Sai thống kê hợp lệ; 2 câu bị loại (1 là câu GTNN phần III, 1 không có nguồn). |
| **17** | Viète và ứng dụng | Trả lời ngắn | Vận dụng | 5 | 3 | 0 | 2 | 0 | 3 câu TLN Viète khớp chuẩn; 2 câu bị loại (1 là câu Đúng/Sai căn thức, 1 không có nguồn). |
| **20** | Thể tích, diện tích thực tiễn | Trả lời ngắn | Vận dụng | 5 | 4 | 0 | 1 | 0 | 4 câu hình trụ/khối thực tế khớp chuẩn; 1 câu bị loại (nguồn là hoạ tiết phẳng). |
| **22** | HH nội tiếp & cực trị | Trả lời ngắn | Vận dụng cao | 5 | 0 | 5 | 0 | 0 | **LỆCH MỨC NHẬN THỨC: 0 câu đạt VDC**. Toàn bộ chỉ ở mức Thông hiểu hoặc Vận dụng cơ bản. |
| **TỔNG** | **10 nhóm chuyên đề** | **3 dạng** | **Đủ 4 mức** | **52** | **23** | **19** | **10** | **0** | **0 câu vào CSDL** |

### Kiểm tra tính toán học chặt chẽ:
- **Tổng số ứng viên thu thập:** $23 + 19 + 10 = 52$ câu.
- **Khớp đầy đủ điều kiện chuyên môn:** 23 câu (chiếm 44,2%).
- **Khớp một phần / Chờ quy tắc gộp Đúng-Sai / Lệch mức VDC:** 19 câu (chiếm 36,5%).
- **Thiếu căn cứ nguồn / Lệch mạch kiến thức:** 10 câu (chiếm 19,2%).
- **Đã duyệt đưa vào hệ thống:** **0 câu** (Toàn bộ tiếp tục `NEEDS_REVIEW`).

---

## 3. ĐỐI CHIẾU CHI TIẾT TỪNG CÂU VÀ KẾT QUẢ XÁC MINH ([`source-comparison.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/source-comparison.csv))

Tệp [`source-comparison.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/source-comparison.csv) được khởi tạo đầy đủ 52 dòng ghi nhận chi tiết:

### A. Nhóm câu được phục hồi nguyên bản từ PDF gốc (`ALTERED_IN_REV01_RESTORED` & `VERIFIED_WITH_EDITORIAL_NOTE`):
1. **`CAND-SLOT02-01`**: Phục hồi đề gốc Trang 16: "Phương trình tích có dạng là: A. $(ax+b)-(cx+d)=0$, B. $(ax-b)(cx-d)=0$, C. $(ax-b)+(cx-d)=0$, D. $(ax+b)+(cx+d)=0$". Khóa đáp án B (Trang 101). Ảnh bằng chứng: `proofs/CAND-SLOT02-01_p016_CHUYEN_DE_I_Q1.png`.
2. **`CAND-SLOT02-02`**: Phục hồi đề gốc Trang 16: "Để giải phương trình tích $(ax+b)(cx+d)=0$ ta giải: A. $ax-b=cx-d$, B. $(ax-b)-(cx-d)=0$, C. $(ax-b)+(cx-d)=0$, D. $ax+b=0 \text{ và } cx+d=0$". Khóa nguồn D (Trang 101). Bổ sung `editorialProposal` giải thích quy ước chuẩn SGK dùng liên từ "hoặc". Ảnh: `proofs/CAND-SLOT02-02_p016_CHUYEN_DE_I_Q2.png`.
3. **`CAND-SLOT02-04`**: Phục hồi đề gốc Trang 20: "Điều kiện xác định của phương trình $\frac{x}{3} - \frac{x-1}{2} + \frac{1}{4} = 0$ là: D. mọi $x \in \mathbb{R}$". Khóa nguồn D (Trang 117). Ảnh: `proofs/CAND-SLOT02-04_p020_CHUYEN_DE_I_Q45.png`.
4. **`CAND-SLOT13-05`**: Phục hồi đề gốc Trang 25 Câu 81: Cho phương trình $(1-3x)^2+9x^2-1=0$ (1) với 4 ý đúng sai. Khóa nguồn: Đ S Đ Đ (Trang 145). Ảnh: `proofs/CAND-SLOT13-05_p025_CHUYEN_DE_II_Q81.png`.
5. **`CAND-SLOT14-01`**: Phục hồi biểu thức $A = 2\sqrt{27}-3\sqrt{12}+\sqrt{32}$ và biểu thức $B$ đúng văn bản đề Cụm 2 Hải Phòng. Khóa nguồn: Đ S Đ S (Trang 9). Ảnh: `proofs/CAND-SLOT14-01_p002_401_II_Q13.png`.
6. **`CAND-SLOT14-02`**: Phục hồi nguyên văn 4 ý của biểu thức $P$. Khóa nguồn: Đ Đ S S (Trang 34). Ảnh: `proofs/CAND-SLOT14-02_p003_101_II_Q3.png`.
7. **`CAND-SLOT14-03`**: Phục hồi biểu thức $A = \frac{\sqrt{x}}{\sqrt{x}+2}$ đúng đề Cụm 18 Hải Phòng. Khóa nguồn: Đ S S Đ (Trang 9). Ảnh: `proofs/CAND-SLOT14-03_p003_901_II_Q3.png`.

### B. Nhóm câu không xác minh được nguồn hoặc lệch chuyên đề (`UNVERIFIED_SOURCE_TRANSCRIPTION` - 10 câu):
1. **`CAND-SLOT11-01`**: Trang 1 đề HK1 Hưng Yên thực tế là bài toán góc tạo bởi kim đồng hồ ($90^\circ$), không phải bài toán thống kê. Xếp loại: `LACKING_EVIDENCE`.
2. **`CAND-SLOT14-04`**: Trang 4 đề Cụm 25 Hải Phòng thực tế là Phương trình bậc hai Viète ($x^2-3x-1=0$), không phải Biến đổi căn thức. Xếp loại: `LACKING_EVIDENCE`.
3. **`CAND-SLOT14-05`**: Trang 72 file `11_Can_thuc_KNTT.pdf` không có Câu 1 Đúng/Sai. Xếp loại: `LACKING_EVIDENCE`.
4. **`CAND-SLOT15-04`**: Trang 7 đề Cụm 4 Hải Phòng thực tế là bài toán rút gọn biểu thức đại số $P$, không phải hình học tiếp tuyến. Xếp loại: `LACKING_EVIDENCE`.
5. **`CAND-SLOT15-05`**: Trang 230 file `15_Duong_tron_Canh_Dieu.pdf` không có Câu 1 Đúng/Sai. Xếp loại: `LACKING_EVIDENCE`.
6. **`CAND-SLOT16-02`**: Trang 3 đề HK1 Hưng Yên không có Câu 4 Đúng/Sai thống kê (đề thi chỉ có 2 câu Đúng/Sai). Xếp loại: `LACKING_EVIDENCE`.
7. **`CAND-SLOT16-05`**: Trang 128 file `10_Thong_ke_tan_so_KNTT.pdf` không có Câu 1 Đúng/Sai. Xếp loại: `LACKING_EVIDENCE`.
8. **`CAND-SLOT17-04`**: Trang 4 đề Cụm 25 Hải Phòng Câu 2 thực tế là câu Đúng/Sai căn thức, không phải câu trả lời ngắn Viète. Xếp loại: `LACKING_EVIDENCE`.
9. **`CAND-SLOT17-05`**: Trang 25 file `03_Ham_so_phuong_trinh_bac_hai.pdf` không có Câu 3 Phần III. Xếp loại: `LACKING_EVIDENCE`.
10. **`CAND-SLOT20-05`**: Trang 7-8 đề Cụm 2 Hải Phòng Câu 21 thực tế là bài toán hình vuông phẳng có hoạ tiết trang trí, không phải hình trụ khối bồn chứa. Xếp loại: `LACKING_EVIDENCE`.

### C. Nhóm câu Vị trí 22 — Báo cáo trung thực về sự thiếu hụt mức Vận dụng cao:
Cả 5 câu hỏi Vị trí 22 (`CAND-SLOT22-01` đến `CAND-SLOT22-05`) đều đã được đối chiếu ảnh trang nguồn:
- Câu 44 (Chuyên đề 05): Bán kính đường tròn từ góc $45^\circ \implies \widehat{AOB}=90^\circ \implies R=10$. (2 bước cơ bản $\implies$ Mức Thông hiểu).
- Câu 45 & 46 (Chuyên đề 05): Bổ đề đồng dạng $AB \cdot AC = 2R \cdot AH$. (1 bước thế số $\implies$ Mức Thông hiểu / Vận dụng thấp).
- Câu 3 (Cụm 4 Hải Phòng): Tỉ số $\frac{AB}{MN} = \frac{1}{\cos 45^\circ} = \sqrt{2} \approx 1{,}41$. (3 bước tam giác đồng dạng $\implies$ Mức Vận dụng).
- Câu 3 (HK2 Hưng Yên): Đường tròn đồng tâm tính $AC^2 + AM^2 + AN^2 = 40$. (3 bước $\implies$ Mức Vận dụng; lệch chuyên đề tứ giác nội tiếp).

> **Kết luận Vị trí 22:** Số lượng câu hỏi đạt chuẩn ADVANCED_APPLYING tại Vị trí 22 là **0 câu**. Đã chuyển toàn bộ 5 câu sang nhóm `PARTIALLY_MATCHED` (Trạng thái `SHORTAGE_LEVEL_MISMATCH`).

---

## 4. PHÂN ĐỊNH RÕ RÀNG GIỮA KIỂM TRA KỸ THUẬT VÀ XÁC MINH NỘI DUNG NGUỒN

Bộ kiểm thử tự động [`validate_revision02.py`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/validate_revision02.py) đã thực hiện kiểm định nghiêm ngặt:

1. **Phạm vi kiểm tra kỹ thuật (Đã vượt qua 100%):**
   - Đủ 52/52 dòng JSONL hợp lệ, phân tích cú pháp chuẩn xác.
   - Đối chiếu chéo 1-1 chính xác 52 dòng giữa `candidates.csv`, `source-comparison.csv` và `questions.jsonl`.
   - Mở và kiểm tra cấu trúc 52/52 tệp ảnh bằng chứng trong thư mục `proofs/` bằng thư viện hình ảnh PIL, không có tệp nào rỗng hoặc hỏng.
   - Toàn bộ 448 công thức toán học KaTeX trong bộ câu hỏi được biên dịch thành công với thiết lập khắt khe `throwOnError: true` (0 lỗi).
   - Số liệu thống kê trong `coverage-revised.csv` khớp 100% với từng trường dữ liệu của 52 câu hỏi.
2. **Phạm vi xác minh nội dung nguồn (Cần chuyên môn sư phạm):**
   - Đạt tiêu chuẩn kiểm định kỹ thuật **không đồng nghĩa với việc nội dung toán học đã được phê duyệt để phát hành thi cử**.
   - Bảng so sánh nguồn `source-comparison.csv` đã chỉ rõ 10 câu thiếu hụt nguồn thực tế và 5 câu lệch mức nhận thức VDC.
   - Toàn bộ 52 câu tiếp tục được khóa ở trạng thái `NEEDS_REVIEW` (`approvedCount = 0`), không câu nào được đưa vào cơ sở dữ liệu.

---

## 5. DANH MỤC HIỆN VẬT BÀN GIAO TRONG REVISION-02

Thư mục lưu trữ: `tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/`

1. [`questions.jsonl`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/questions.jsonl): 52 câu hỏi được khôi phục nguyên văn từ tài liệu nguồn, bổ sung trường `sourceAnswer`, `proofImage`, `editorialProposal`, `differencesFromRevision01`, `comparisonResult`.
2. [`candidates.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/candidates.csv): Danh mục 52 ứng viên liên kết nguồn, mã đề, trang đề, trang đáp án, mức nhận thức, ảnh bằng chứng và nhóm phân loại.
3. [`source-comparison.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/source-comparison.csv): Bảng đối soát từng câu ghi rõ vị trí PDF, khóa đáp án gốc, đường dẫn ảnh chứng minh, các điểm đã bị sửa đổi ở revision-01 và kết luận đối chiếu.
4. [`coverage-revised.csv`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/coverage-revised.csv): Bảng thống kê độ phủ 10 vị trí ma trận với số liệu hoàn toàn nhất quán.
5. [`proofs/`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/proofs): 52 tệp hình ảnh crop trực tiếp từ trang PDF độ nét cao (200 DPI), làm căn cứ pháp lý và chuyên môn không thể làm giả.
6. [`validate_revision02.py`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/validate_revision02.py) & [`validate_katex.cjs`](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-02/validate_katex.cjs): Bộ kịch bản kiểm thử toàn vẹn tự động chạy thành công với exit code 0.
