# Báo cáo Thẩm định Chi tiết 3 Đề Thực tế THPT (Kèm Ảnh Đối chiếu PDF)
## Dự án: Adaptive Math C3 | Thư mục đầu ra: `outputs/thpt-300-papers/`

*Ngày hoàn thành thẩm định: 19/10/2026*  
*Đơn vị thẩm định: Antigravity AI — Nghiên cứu & Chuẩn hóa Học liệu THPT*  
*Chuẩn tổ chức kiến thức: Chương trình GDPT 2018 — Bộ sách Kết nối tri thức với cuộc sống (NXBGDVN)*

---

## 1. Kết quả Tiếp thu & Khắc phục Toàn diện

1. **Dừng mở rộng lô**: Dừng toàn bộ việc mở rộng thêm các đề mới cho đến khi chất lượng trích xuất 3 đề mẫu được nghiệm thu hoàn toàn.
2. **Loại bỏ triệt để mọi fallback giả**:
   - Đã tái cấu trúc `scripts/extract_batch1_full.py`: gỡ bỏ hoàn toàn logic tự sinh “Phương án A/B/C/D”, khẳng định đúng/sai chung chung và prompt trả lời ngắn rỗng nghĩa.
   - Nếu tệp nguồn không phân tích được sạch sẽ, hệ thống đánh dấu `NEEDS_REVIEW` hoặc `EXTRACTION_FAILED` và đặt toàn bộ cờ đối chiếu (`source_crosschecked`, `answer_crosschecked`) về `false`.
3. **Làm sạch tập dữ liệu ứng viên**:
   - `questions-candidates.jsonl`: Chỉ chứa đúng **66 câu hỏi thực tế 100%** trích xuất từ 3 đề (22 câu/đề).
   - `questions-reviewed.jsonl`: Chứa đúng 66 bản ghi kiểm toán tương ứng với cờ minh bạch (`independently_solved: false`, `peer_reviewed: false`, `import_eligible: false`).
   - `import-candidates.jsonl`: Giữ nghiêm ngặt **0 bản ghi** (tuyệt đối không đưa vào kho nhập khi chưa peer review).

---

## 2. Kiểm tra Cấu trúc Thực tế Từng Đề

Khảo sát trực tiếp từ 3 đề chính thức của **Trường THPT Phú Lộc - Huế** (Mã đề 132), cấu trúc thực tế của đề kiểm tra cuối học kỳ I không chỉ có 18 câu trắc nghiệm mà gồm đầy đủ **4 phần với 22 câu hỏi (10 điểm)**:

| Phần thi | Dạng câu hỏi | Số câu trong đề | Điểm số | Tỷ lệ điểm |
| :--- | :--- | :---: | :---: | :---: |
| **Phần I** | Trắc nghiệm 4 phương án lựa chọn (SINGLE_CHOICE) | 12 câu (Câu 1 – 12) | 3,0 đ | 30% |
| **Phần II** | Trắc nghiệm Đúng/Sai (TRUE_FALSE, mỗi câu 4 ý a–d) | 2 câu (Câu 1 – 2) | 2,0 đ | 20% |
| **Phần III**| Trắc nghiệm trả lời ngắn (SHORT_ANSWER) | 4 câu (Câu 1 – 4) | 2,0 đ | 20% |
| **Phần IV** | Tự luận có thang điểm và lời giải chi tiết | 4 câu (Câu 1 – 4) | 3,0 đ | 30% |
| **Tổng cộng** | **Đầy đủ 4 phần thi theo barem chính thức** | **22 câu** | **10,0 đ** | **100%** |

---

## 3. Danh mục Chi tiết & Ảnh Trang PDF Đối chiếu Của 3 Đề

Toàn bộ ảnh quét độ phân giải cao từ các trang đề và trang đáp án đã được kết xuất tại thư mục `outputs/thpt-300-papers/page-images/`:

### A. Đề Lớp 10: `THPT-10-CUOI_HK1-026` (Mã đề 132, 22 câu)
- **Tên đề**: Đề kiểm tra cuối kỳ 1 môn Toán 10 năm học 2025-2026.
- **Đơn vị ra đề**: Trường THPT Phú Lộc - Huế.
- **Tệp nguồn**: `outputs/thpt-300-papers/sources/THPT-10-CUOI_HK1-026.pdf` (11 trang).
- **Ảnh đối chiếu đề thi**:
  - [Trang đề 1 (Câu 1 - 10 Phần I)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-10-CUOI_HK1-026_page_01.png)
  - [Trang đề 2 (Câu 11 - 12 Phần I, Câu 1 - 2 Phần II, Câu 1 Phần III)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-10-CUOI_HK1-026_page_02.png)
  - [Trang đề 3 (Câu 2 - 4 Phần III, Câu 1 - 4 Phần IV)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-10-CUOI_HK1-026_page_03.png)
- **Ảnh đối chiếu đáp án & hướng dẫn chấm**:
  - [Trang đáp án 7 (Bảng đáp án Phần I, Phần II mã 132)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-10-CUOI_HK1-026_page_07.png)
  - [Trang đáp án 8 (Bảng đáp án Phần III và lời giải chi tiết)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-10-CUOI_HK1-026_page_08.png)
- **Nội dung trích xuất nguyên bản**:
  - *Phần I (12 câu)*: Câu 1 (Vectơ $\vec{u} = 3\vec{i}-9\vec{j}$ -> A); Câu 2 ($A \setminus B$ -> D); Câu 3 (Phủ định mệnh đề -> D); Câu 4 (Sai số tuyệt đối -> D); Câu 5 (Không phải mệnh đề -> C); Câu 6 (Liệt kê tập hợp -> A); Câu 7 (Miền nghiệm $2x-y>5$ -> A); Câu 8 (Số đúng -> D); Câu 9 (Tọa độ vectơ $(2; 3)$ -> C); Câu 10 (Hệ BPT bậc nhất hai ẩn -> B); Câu 11 (Định lí côsin -> A); Câu 12 (Tổng 4 vectơ bằng $\vec{0}$ -> C).
  - *Phần II (2 câu Đúng/Sai)*: 
    - Câu 13 (Thu nhập 6 vùng kinh tế: a: Sai, b: Đúng, c: Đúng, d: Đúng).
    - Câu 14 (Hình chữ nhật $ABCD$: a: Sai, b: Đúng, c: Đúng, d: Đúng).
  - *Phần III (4 câu trả lời ngắn)*:
    - Câu 15: Lượng mưa trung bình 5 ngày -> Đáp án: `180`.
    - Câu 16: Độ dài vectơ $2\vec{AB}-\vec{AC}$ của hình vuông -> Đáp án: `6`.
    - Câu 17: Tâm bão chuyển động thẳng đều, tính $T = 2x-y$ -> Đáp án: `-30`.
    - Câu 18: Khoảng biến thiên độ che phủ rừng 8 tỉnh -> Đáp án: `22`.
  - *Phần IV (4 câu tự luận)*:
    - Câu 19: Diện tích tam giác $S = \frac{1}{2}ac\sin B$ -> Đáp án: `10`.
    - Câu 20: Lực căng dây của diễn viên xiếc trọng lượng 700N góc $140^\circ$ -> Đáp án: `1023`.
    - Câu 21: Tọa độ vectơ $\vec{x}$ và điểm $C$ trên trục hoành -> Đáp án: `(2; -8), C(6; 0)`.
    - Câu 22: Thống kê thời gian dùng điện thoại của 10 học sinh -> Đáp án: `Me=6.5, Q1=6.2, Q3=7.8, Mo=6.5`.

---

### B. Đề Lớp 11: `THPT-11-CUOI_HK1-126` (Mã đề 132, 22 câu)
- **Tên đề**: Đề kiểm tra cuối kỳ 1 môn Toán 11 năm học 2025-2026.
- **Đơn vị ra đề**: Trường THPT Phú Lộc - Huế.
- **Tệp nguồn**: `outputs/thpt-300-papers/sources/THPT-11-CUOI_HK1-126.pdf` (22 trang).
- **Ảnh đối chiếu đề thi**:
  - [Trang đề 1 (Câu 1 - 10 Phần I)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-11-CUOI_HK1-126_page_01.png)
  - [Trang đề 2 (Câu 11 - 12 Phần I, Câu 1 - 2 Phần II, Câu 1 - 4 Phần III)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-11-CUOI_HK1-126_page_02.png)
  - [Trang đề 3 (Câu 1 - 4 Phần IV)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-11-CUOI_HK1-126_page_03.png)
- **Ảnh đối chiếu đáp án & hướng dẫn chấm**:
  - [Trang đáp án 7 (Bảng đáp án Phần I, II, III mã 132)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-11-CUOI_HK1-126_page_07.png)
  - [Trang đáp án 8 (Hướng dẫn giải chi tiết Phần III, IV)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-11-CUOI_HK1-126_page_08.png)
- **Nội dung trích xuất nguyên bản**:
  - *Phần I (12 câu)*: Câu 1 (Hình biểu diễn hình tròn -> C); Câu 2 (Điểm và đường thẳng trong không gian -> B); Câu 3 (Dãy số giảm -> D); Câu 4 (Học sinh làm bài trước 12 phút -> C); Câu 5 (Giới hạn hàm đa thức -> B); Câu 6 (Số hạng đầu cấp số cộng -> D); Câu 7 (Hàm số chẵn $\cos x$ -> D); Câu 8 (Đổi độ sang radian $15^\circ = \pi/12$ -> C); Câu 9 (Quan hệ song song $MN \parallel CD$ -> A); Câu 10 (Công thức cộng lượng giác -> A); Câu 11 (Phương trình $\sin x = 0$ -> A); Câu 12 (Nhóm chứa Mốt $[40; 50)$ -> D).
  - *Phần II (2 câu Đúng/Sai)*:
    - Câu 13 (Hình chóp $S.ABCD$ đáy hình bình hành: a: Đúng, b: Sai, c: Đúng, d: Đúng).
    - Câu 14 (Hàm số cho bởi hai công thức: a: Đúng, b: Sai, c: Sai, d: Đúng).
  - *Phần III (4 câu trả lời ngắn)*:
    - Câu 15: Cấp số nhân $u_1=2, q=3$, tính $u_5$ -> Đáp án: `162`.
    - Câu 16: Tìm $a$ trong giới hạn dãy số phân thức hữu tỉ -> Đáp án: `7`.
    - Câu 17: Biến đổi lượng giác $M = \sin(5\pi/16) - \sin(\pi/16)$, tính $4a+8b$ -> Đáp án: `1`.
    - Câu 18: Thời gian trung bình hoàn thành bài tập khó của học sinh -> Đáp án: `10.4`.
  - *Phần IV (4 câu tự luận)*:
    - Câu 19: Giới hạn vô định dạng $0/0$ $\lim_{x \to 2} \frac{x^2-3x+2}{x^2-4}$ -> Đáp án: `0.25` (1/4).
    - Câu 20: Hình chóp và quan hệ song song đường thẳng với mặt phẳng -> Đáp án: `SO, E=BC giao DM, MG // (SBC)`.
    - Câu 21: Độ dài thanh kim loại làm khung lăng trụ lục giác đều -> Đáp án: `840`.
    - Câu 22: Giới hạn diện tích bông tuyết Koch sau vô hạn bước -> Đáp án: `129.6\sqrt{3}` (khoảng 224,47).

---

### C. Đề Lớp 12: `THPT-12-CUOI_HK1-227` (Mã đề 132, 22 câu)
- **Tên đề**: Đề kiểm tra cuối kỳ 1 môn Toán 12 năm học 2025-2026.
- **Đơn vị ra đề**: Trường THPT Phú Lộc - Huế.
- **Tệp nguồn**: `outputs/thpt-300-papers/sources/THPT-12-CUOI_HK1-227.pdf` (19 trang).
- **Ảnh đối chiếu đề thi**:
  - [Trang đề 1 (Câu 1 - 5 Phần I)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_01.png)
  - [Trang đề 2 (Câu 6 - 11 Phần I)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_02.png)
  - [Trang đề 3 (Câu 12 Phần I, Câu 1 - 2 Phần II, Câu 1 - 3 Phần III)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_03.png)
  - [Trang đề 4 (Câu 4 Phần III, Câu 1 - 4 Phần IV)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_04.png)
- **Ảnh đối chiếu đáp án & hướng dẫn chấm**:
  - [Trang đáp án 9 (Bảng đáp án Phần I, II, III mã 132)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_09.png)
  - [Trang đáp án 10 (Hướng dẫn giải chi tiết Phần III mã 132)](file:///c:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math%20C3/outputs/thpt-300-papers/page-images/THPT-12-CUOI_HK1-227_page_10.png)
- **Nội dung trích xuất nguyên bản**:
  - *Phần I (12 câu)*: Câu 1 (Vectơ hình hộp bằng $\vec{B'D'}$ -> C); Câu 2 (Tổng vectơ đường chéo hình hộp -> C); Câu 3 (Số điểm cực trị từ bảng xét dấu $f'(x)$ -> C); Câu 4 (Quy tắc cộng vectơ tứ diện -> A); Câu 5 (Tiệm cận đứng $x = 2$ -> A); Câu 6 (Nhận dạng đồ thị phân thức $y = \frac{x-1}{x+1}$ -> A); Câu 7 (Giá trị đại diện nhóm chứa Mốt $157,5$ -> B); Câu 8 (Khoảng biến thiên tuổi thọ ắc quy -> C); Câu 9 (Tọa độ $\vec{a}-\vec{b} = (-3; 3; 1)$ -> A); Câu 10 (Tọa độ vectơ $\vec{u} = (1; -2; -1)$ -> D); Câu 11 (Khẳng định sai về phương sai -> D); Câu 12 (Tổng giá trị lớn nhất và nhỏ nhất $M+m = 1$ -> B).
  - *Phần II (2 câu Đúng/Sai)*:
    - Câu 13 (Tọa độ không gian hình hộp chữ nhật $ABCD.A'B'C'D'$: a: Đúng, b: Sai, c: Sai, d: Sai).
    - Câu 14 (Khảo sát hàm phân thức $y = \frac{3x+2}{x+2}$: a: Sai, b: Sai, c: Đúng, d: Đúng).
  - *Phần III (4 câu trả lời ngắn)*:
    - Câu 15: Tích vô hướng trong tứ diện đều cạnh bằng 2 -> Đáp án: `6`.
    - Câu 16: Khoảng tứ phân vị ghép nhóm giờ làm thêm sinh viên -> Đáp án: `3.27`.
    - Câu 17: Điểm đối xứng qua trục $Oy$, tính độ dài đoạn $MN$ -> Đáp án: `7.2`.
    - Câu 18: Chi phí tối ưu đặt đường ống dẫn dầu từ bờ ra đảo -> Đáp án: `510`.
  - *Phần IV (4 câu tự luận)*:
    - Câu 19: Độ lệch chuẩn mẫu số liệu ghép nhóm quãng đường đi bộ của bác Hòa -> Đáp án: `0.36`.
    - Câu 20: Độ dài vectơ $\vec{v} = \vec{BC} - \vec{BB'}$ trong hình lập phương -> Đáp án: `$a\sqrt{2}$`.
    - Câu 21: Tọa độ và độ dài vectơ $\vec{u} = \vec{AB} + 3\vec{c}$ trong $Oxyz$ -> Đáp án: `u=(-1; 8; 2), |u|=\sqrt{69}`.
    - Câu 22: Bài toán tối ưu vị trí xe trạm trên Quốc lộ 1A đón tín hiệu 2 Flycam cứu nạn -> Đáp án: `M(0; 5; 0), min=4\sqrt{34}` ($\approx 23,32$).

---

## 4. Kết quả Thẩm định Kỹ thuật

```
=== RUNNING VERIFICATION ON THPT 300 PAPERS DATASET ===
Total papers in papers.json: 300 (G10: 100, G11: 100, G12: 100)
File verification: 0 missing, 0 PDF header errors, 0 SHA-256 mismatch
Duplicates cataloged: 13 filtered
Questions verification:
 - Candidates: 66 câu (22 câu Lớp 10 + 22 câu Lớp 11 + 22 câu Lớp 12)
 - Reviewed audit records: 66
 - Import eligible: 0 (giữ nghiêm ngặt không nhập kho)
 - KaTeX render errors: 0 (100% công thức toán biên dịch hợp lệ)
 - Peer reviewed flag: 66/66 strictly false
All checks completed successfully!
```

Hệ thống bảo đảm:
- Không còn bất kỳ câu hỏi nào mang nội dung giả, fallback mẫu hoặc rỗng nghĩa.
- Toàn bộ 66 câu đều có thể đối chiếu trực tiếp với từng dòng, từng hình trong 16 ảnh quét trang PDF tương ứng.
- Không có bất kỳ can thiệp nào vào mã giao diện người dùng hay cơ sở dữ liệu production.
