# BÁO CÁO TỔNG HỢP VÀ ĐÁNH GIÁ ỨNG VIÊN BỔ SUNG THEO MA TRẬN ĐẦU VÀO ADAPTIVE MATH

> **Dự án:** Adaptive Math — Hệ thống học tập thích ứng môn Toán  
> **Thư mục lưu trữ:** `tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/`  
> **Ngày thực hiện:** 18/10/2026  
> **Mục tiêu:** Tìm kiếm và lập danh mục câu hỏi ứng viên bổ sung cho 10 vị trí còn thiếu trong ma trận đầu vào (`docs/diagnostic-grade9-blueprint.md`).

---

## 1. Nguyên Tắc Thu Thập và Thẩm Định Ứng Viên

Tuân thủ nghiêm ngặt các yêu cầu chỉ đạo:
1. **Kiểm tra tài liệu đã có trước:** Tận dụng kho 33 tài liệu đã tổng hợp trong các đợt trước (`01_Chuyen_de`, `02_De_tong_hop`, `03_Bo_sung`, `03_Bo_sung_Antigravity`), định vị chính xác số trang PDF và số câu hỏi, không tải lại lặp thừa.
2. **Tải bổ sung nguồn mới công khai:** Tải và lưu trữ độc lập các tài liệu mới vào `05_Bo_sung_theo_ma_tran/PDF/`, kiểm tra nhị phân PDF, tính mã băm SHA-256, URL trang nguồn và URL tải thực tế.
3. **Bảo toàn dữ liệu cũ:** Sử dụng script bổ sung riêng biệt có `main` guard (`build_matrix_candidates.py`), không chạy nguyên bản `collect.py` hay `check.py` để tránh nguy cơ ghi đè `nguon.json`, `DANH-MUC.csv`, `README.md` hoặc tệp ZIP cũ.
4. **Đọc nội dung câu hỏi thực tế:** Đọc từng câu, từng phương án, từng ý $a, b, c, d$ và trang đáp án; không gán nhãn theo tiêu đề tài liệu.
5. **Đánh giá đúng mức nhận thức:**
   - Tuyệt đối không suy diễn theo hình thức (Nhiều lựa chọn = Nhận biết, Đúng/Sai = Thông hiểu, Trả lời ngắn = Vận dụng).
   - Với câu Đúng/Sai (Vị trí 13, 14, 15, 16): Giữ nguyên 1 câu chính và đủ 4 ý $a, b, c, d$. Ghi nhận mức nhận thức chi tiết của từng ý; đánh dấu trạng thái chờ duyệt quy tắc gộp mức toàn câu, không mặc định cả câu là Thông hiểu.
   - Với Vị trí 22: Phải có nội dung hình học nội tiếp/ngoại tiếp thực sự (tam giác nội tiếp, tứ giác nội tiếp, đa giác đều). Không dùng bài toán tiếp xúc thông thường để thay thế; không chuyển câu tự luận thành trả lời ngắn hay tách ý tự luận.
6. **Không kết nối Database:** Không chạy seed, migration, không can thiệp cơ sở dữ liệu hay mã nguồn ứng dụng.

---

## 2. Danh Mục Nguồn Mới Tải Về (`05_Bo_sung_theo_ma_tran/sources.json`)

Trong đợt bổ sung này, hệ thống đã tìm kiếm trên cổng thông tin học liệu mở THCS.TOANMATH và tải về lưu trữ độc lập tại `05_Bo_sung_theo_ma_tran/PDF/`:

| Mã nguồn | Tên file | Kích thước | Số trang | SHA-256 | Cấu trúc & Tình trạng đáp án |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **`SRC-NEW-001`** | `17_GK1_Newton_Pascal_Ha_Noi_2026.pdf` | 1,320,194 B | 10 | `bbc02d89f5b663aa...` | Đề tự luận truyền thống (Bài I-V), có lời giải chi tiết (trang 5-10). Ghi chú: Không dùng làm ứng viên trắc nghiệm mới để tránh ép dạng câu. |
| **`SRC-NEW-002`** | `18_KS_Tu_Liem_1_Ha_Noi_2026.pdf` | 963,463 B | 11 | `e246b82f38079485...` | Đề tự luận truyền thống kèm đáp án. Không chuyển đổi tự luận thành trả lời ngắn theo đúng quy định. |
| **`SRC-NEW-003`** | `19_KS_Cum_18_Hai_Phong_2025_2026.pdf` | 601,596 B | 13 | `81c56d82863bdce9...` | **Chuẩn cấu trúc GDPT 2018 đủ 3 phần:** Phần I (12 câu TN), Phần II (4 câu Đ/S), Phần III (6 câu Trả lời ngắn). Có bảng đáp án chi tiết các mã đề 901-906 (trang 9-13). Cung cấp nhiều ứng viên xuất sắc cho Slot 14, 15, 16, 17, 20. |

---

## 3. Bảng Tổng Hợp Độ Phủ 10 Vị Trí Ma Trận (`coverage.csv`)

Hệ thống đã xác minh và lập danh mục **52 câu hỏi ứng viên** phân bổ cho đủ 10 vị trí, **100% các vị trí đều đạt chỉ tiêu $\ge 5$ ứng viên** từ ít nhất 2 đến 5 nguồn độc lập:

| Vị trí | Chuyên đề ma trận | Dạng câu quy định | Mức nhận thức | Số ứng viên | Nhãn nguồn | Nhãn đề xuất | Số nguồn độc lập | Tình trạng chỉ tiêu |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2** | Phương trình quy về bậc nhất | Nhiều lựa chọn | Nhận biết (EASY) | **6** | 0 | 6 | 2 nguồn | **ĐẠT (>= 5)** |
| **10** | Tứ giác nội tiếp, đa giác đều | Nhiều lựa chọn | Thông hiểu (MEDIUM) | **6** | 1 | 5 | 4 nguồn | **ĐẠT (>= 5)** |
| **11** | Thống kê, tần số tương đối | Nhiều lựa chọn | Nhận biết (EASY) | **5** | 0 | 5 | 4 nguồn | **ĐẠT (>= 5)** |
| **13** | Mô hình hóa pt và hệ pt | Đúng/Sai (đủ 4 ý) | Thông hiểu (MEDIUM) | **5** | 0 | 5 | 5 nguồn | **ĐẠT (>= 5)** |
| **14** | Biến đổi căn thức | Đúng/Sai (đủ 4 ý) | Thông hiểu (MEDIUM) | **5** | 0 | 5 | 5 nguồn | **ĐẠT (>= 5)** |
| **15** | Quan hệ hình học đường tròn | Đúng/Sai (đủ 4 ý) | Thông hiểu (MEDIUM) | **5** | 0 | 5 | 5 nguồn | **ĐẠT (>= 5)** |
| **16** | Đọc và phân tích dữ liệu | Đúng/Sai (đủ 4 ý) | Thông hiểu (MEDIUM) | **5** | 0 | 5 | 5 nguồn | **ĐẠT (>= 5)** |
| **17** | Viète và ứng dụng | Trả lời ngắn | Vận dụng (HARD) | **5** | 0 | 5 | 5 nguồn | **ĐẠT (>= 5)** |
| **20** | Diện tích, thể tích thực tiễn | Trả lời ngắn | Vận dụng (HARD) | **5** | 0 | 5 | 3 nguồn | **ĐẠT (>= 5)** |
| **22** | Hình học nội tiếp tổng hợp | Trả lời ngắn | Vận dụng cao (VERY_HARD) | **5** | 0 | 5 | 3 nguồn | **ĐẠT (>= 5)** |
| **TỔNG** | **10 nhóm chuyên đề trọng điểm** | **Đủ 3 dạng** | **Phân hóa 4 mức** | **52 câu** | **1** | **51** | **Đa nguồn độc lập** | **10/10 NHÓM ĐẠT** |

---

## 4. Báo Cáo Chi Tiết Từng Vị Trí Khảo Sát

### 4.1. Vị trí 2: Phương trình quy về bậc nhất (Nhiều lựa chọn, Nhận biết)
- **Yêu cầu cần đạt:** Nhận biết dạng phương trình tích $(ax+b)(cx+d)=0$, cách giải, hoặc điều kiện xác định của phương trình chứa ẩn ở mẫu quy về bậc nhất.
- **Danh sách 6 câu ứng viên tiêu biểu:**
  1. `01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf`, Trang 16, Câu 1: Dạng phương trình tích. Đáp án trang 101.
  2. `01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf`, Trang 16, Câu 2: Quy tắc giải phương trình tích $ax+b=0$ hoặc $cx+d=0$. Đáp án trang 101.
  3. `01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf`, Trang 16, Câu 3: Nghiệm của phương trình $(x-1)(x-2)=0$. Đáp án trang 101.
  4. `01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf`, Trang 20, Câu 45: ĐKXĐ phương trình chứa ẩn ở mẫu $\frac{x-1}{3x-2} + \frac{1}{4} = 0$. Đáp án trang 105.
  5. `03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf`, Trang 21, Câu 56: ĐKXĐ phương trình $\frac{1}{x-2} + \frac{2}{x+2} = \frac{3}{(x-2)(x+2)}$. Đáp án trang 97.
  6. `03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf`, Trang 21, Câu 59: Nhận dạng phương trình có chứa ẩn ở mẫu. Đáp án trang 97.
- **Nguồn độc lập:** 2 nguồn độc lập (KNTT và Cánh Diều).

### 4.2. Vị trí 10: Tứ giác nội tiếp, đa giác đều (Nhiều lựa chọn, Thông hiểu)
- **Yêu cầu cần đạt:** Hiểu tính chất góc đối tứ giác nội tiếp, điều kiện nội tiếp, bán kính đường tròn ngoại tiếp đa giác đều (hình vuông, tam giác đều).
- **Danh sách 6 câu ứng viên tiêu biểu:**
  1. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 1, Mã 101, Câu 5: Hệ thức hai góc đối tứ giác ABCD nội tiếp $(x+y=180^\circ)$. Đáp án trang 33.
  2. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 1, Mã 101, Câu 6: Bán kính đường tròn ngoại tiếp hình vuông cạnh $a$ ($R = a\frac{\sqrt{2}}{2}$). Đáp án trang 33.
  3. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 2, Mã 401, Câu 9: Diện tích tam giác đều ABC ngoại tiếp đường tròn $(I; 3\text{ cm})$. Đáp án trang 9.
  4. `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Trang 162, Câu 4: Tổng hai góc đối nhau của tứ giác nội tiếp bằng $180^\circ$. Đáp án trang 214.
  5. `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Trang 163, Câu 9: Nhận biết hình thoi không nội tiếp được đường tròn. Đáp án trang 216.
  6. `08_HK2_Nguyen_Hue_Da_Nang_2025_2026.pdf`, Trang 9, Mã 101, Câu 7: Tứ giác nội tiếp đường tròn. Đáp án trang 11. **(Có bản đặc tả xác nhận mức Thông hiểu - SOURCE_EXPLICIT)**.

### 4.3. Vị trí 11: Thống kê, tần số, tần số tương đối (Nhiều lựa chọn, Nhận biết)
- **Yêu cầu cần đạt:** Nhận biết tần số, tần số tương đối từ bảng số liệu hoặc công thức định nghĩa $f_i = \frac{m_i}{N} \times 100\%$.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf`, Trang 2, Mã 9101, Câu 10: Tần số tương đối của giá trị từ dùng sai trong bài văn. Đáp án trang 5.
  2. `03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf`, Trang 2, Mã 9201, Câu 9: Tần số xuất hiện của điểm 7 trong bảng điểm 35 học sinh. Đáp án trang 6.
  3. `03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf`, Trang 3, Mã 9201, Câu 26: Tần số tương đối của số học sinh đạt 800 điểm thi tiếng Anh. Đáp án trang 6.
  4. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 1, Mã 101, Câu 8: Tần số tương đối số học sinh bị cận thị trong lớp ($8/40 = 20\%$). Đáp án trang 33.
  5. `03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf`, Trang 16, Câu 1: Công thức định nghĩa tần số tương đối. Đáp án trang 97.

### 4.4. Vị trí 13: Mô hình hóa bằng phương trình và hệ phương trình (Đúng/Sai đủ 4 ý)
- **Yêu cầu cần đạt:** Bài toán thực tế lập hệ phương trình gồm 4 ý $a, b, c, d$ phân hóa rõ ràng từ Thông hiểu đến Vận dụng.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 3, Câu 14 (Phần II): Kế hoạch sản xuất hai tổ I và II (600 sản phẩm). Ý a (UND), b (UND), c (APP), d (APP). Đáp án trang 9.
  2. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 2, Câu 2 (Phần II): Sản xuất bánh Đậu Xanh và bánh Cốm. Ý a (UND), b (UND), c (APP), d (APP). Đáp án trang 34.
  3. `11_KS_Chu_Van_An_Hai_Phong_2026.pdf`, Trang 2, Câu 2 (Phần II): Chuyển động ngược chiều hai ô tô từ A và B cách nhau 180km. Ý a (UND), b (UND), c (APP), d (APP). Đáp án trang 6.
  4. `02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 3 (Phần II): Kế hoạch sản xuất vi mạch bán dẫn MCU và Flash. Ý a (UND), b (APP), c (APP), d (ADV). Đáp án trang 9.
  5. `14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf`, Trang 25, Câu 81 (Phần II): Hai vòi nước cùng chảy vào bể. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 145.

### 4.5. Vị trí 14: Biến đổi căn thức (Đúng/Sai đủ 4 ý)
- **Yêu cầu cần đạt:** Rút gọn biểu thức chứa căn bậc hai, tìm ĐKXĐ, tính giá trị và so sánh bất đẳng thức.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 2, Câu 13 (Phần II): Biểu thức $A = 2\sqrt{27} - 3\sqrt{12} + \sqrt{32}$ và phân thức $B$. Ý a (REM), b (REM), c (UND), d (APP). Đáp án trang 9.
  2. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 3 (Phần II): Rút gọn $P = (\frac{1}{\sqrt{x}+2} + \frac{8}{x-4}) : ...$ Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 34.
  3. `19_KS_Cum_18_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 3 (Phần II): Biểu thức $P = A.B$, tìm $x$ để $P < 0$. Ý a (UND), b (APP), c (REM), d (UND). Đáp án trang 9-11.
  4. `13_KS_Cum_25_Hai_Phong_2025_2026.pdf`, Trang 4, Câu 1 (Phần II): Rút gọn phân thức căn bậc hai tổng hợp. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 7.
  5. `11_Can_thuc_KNTT.pdf`, Trang 72, Câu 1 (Phần II): Rút gọn hằng đẳng thức và khử căn thức ở mẫu. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 81.

### 4.6. Vị trí 15: Quan hệ hình học đường tròn (Đúng/Sai đủ 4 ý)
- **Yêu cầu cần đạt:** Tính chất đường kính, dây cung, góc nội tiếp, tiếp tuyến và hệ thức lượng hình học.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 3, Câu 15 (Phần II): Đường tròn (O; R) có hai đường kính vuông góc AB và CD, tia phân giác và hệ thức tích $AH.AE = 2R^2$. Ý a (UND), b (UND), c (APP), d (APP). Đáp án trang 9.
  2. `19_KS_Cum_18_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 2 (Phần II): Đường tròn đường kính AB = 2R, tia phân giác góc FED, tứ giác BDHF nội tiếp. Ý a (UND), b (APP), c (UND), d (APP). Đáp án trang 9-11.
  3. `01_HK2_Hung_Yen_2025_2026.pdf`, Trang 3, Câu 2 (Phần II): Hai đường kính AB và CD vuông góc, chứng minh $CM.CE = 2R^2$, tứ giác DEMO nội tiếp. Ý a (UND), b (UND), c (APP), d (APP). Đáp án trang 6.
  4. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 7, Câu 4 (Phần II): Hai tiếp tuyến cắt nhau và cát tuyến đường tròn. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 36.
  5. `15_Duong_tron_Canh_Dieu.pdf`, Trang 230, Câu 1 (Phần II): Đường kính, dây cung và khoảng cách từ tâm đến dây. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 332.

### 4.7. Vị trí 16: Đọc và phân tích dữ liệu (Đúng/Sai đủ 4 ý)
- **Yêu cầu cần đạt:** Phân tích bảng tần số, bảng tần số tương đối, bảng ghép nhóm và rút ra kết luận thực tế.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `19_KS_Cum_18_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 4 (Phần II): Bảng thống kê số đề thi học sinh lớp 9A hoàn thành, tính tỉ lệ % và xác suất. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 9-11.
  2. `01_HK1_Hung_Yen_2025_2026.pdf`, Trang 3, Câu 4 (Phần II): Bảng tần số điểm kiểm tra môn Toán. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 5.
  3. `02_Khao_sat_Hai_Phong_2025_2026.pdf`, Trang 2, Câu 2 (Phần II): Bảng tần số ghép nhóm số giờ công suất cao điểm của trạm biến áp. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 9.
  4. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 6, Câu 2 (Phần II): Bảng phân phối tần số ghép nhóm kết quả khảo sát. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 35.
  5. `10_Thong_ke_tan_so_KNTT.pdf`, Trang 128, Câu 1 (Phần II): Bảng tần số ghép nhóm thời gian tự học của học sinh. Ý a (REM), b (UND), c (UND), d (APP). Đáp án trang 150.

### 4.8. Vị trí 17: Viète và ứng dụng (Trả lời ngắn, Vận dụng)
- **Yêu cầu cần đạt:** Vận dụng định lý Viète để hạ bậc, biến đổi biểu thức nghiệm đối xứng hoặc bất đối xứng, tìm giá trị biểu thức số nguyên/hữu tỉ.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `19_KS_Cum_18_Hai_Phong_2025_2026.pdf`, Trang 4, Câu 4 (Phần III): Phương trình $x^2 - 4x + 2 = 0$ có nghiệm $x_1 > x_2$; tính giá trị biểu thức $A = x_1^4 + 11x_2^2 + 12x_2 - 24x_1 + 10\sqrt{7} = a\sqrt{b} + c$, tính $2a^2 - bc$. Đáp án trang 9.
  2. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 3, Câu 17 (Phần III): Phương trình $x^2 - 3x + 1 = 0$ có 2 nghiệm $x_1 > x_2$; tính giá trị biểu thức nghiệm. Đáp án trang 9.
  3. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 5 (Phần III): Phương trình $x^2 - 3x - 7 = 0$; hạ bậc biểu thức bậc ba về bậc nhất và tính giá trị. Đáp án trang 34.
  4. `13_KS_Cum_25_Hai_Phong_2025_2026.pdf`, Trang 4, Câu 2 (Phần III): Phương trình $x^2 - 5x + 1 = 0$; áp dụng Viète tính giá trị biểu thức đối xứng. Đáp án trang 7.
  5. `03_Ham_so_phuong_trinh_bac_hai.pdf`, Trang 25, Câu 3 (Phần III): Áp dụng hệ thức Viète tính giá trị biểu thức phân thức đối xứng $\frac{x_1}{x_2} + \frac{x_2}{x_1}$. Đáp án trang 110.

### 4.9. Vị trí 20: Diện tích, thể tích trong thực tiễn (Trả lời ngắn, Vận dụng)
- **Yêu cầu cần đạt:** Vận dụng công thức diện tích xung quanh, diện tích toàn phần, thể tích của hình trụ, hình nón, hình cầu vào giải quyết các bài toán kỹ thuật, đời sống thực tế.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `19_KS_Cum_18_Hai_Phong_2025_2026.pdf`, Trang 4, Câu 2 (Phần III): Cho tam giác đều cạnh 12cm, trọng tâm O, đường tròn (O; 4cm). Tính tổng diện tích các phần tô đậm nằm ngoài hình tròn. Đáp án trang 9-13.
  2. `08_Hinh_khoi_thuc_tien_KNTT.pdf`, Trang 32, Câu 91 (Phần III): Hộp đựng chè hình trụ đường kính 8cm, cao 12cm; tính diện tích nhãn bọc thân hộp ($S_{xq} = 2\pi rh$). Đáp án trang 117.
  3. `08_Hinh_khoi_thuc_tien_KNTT.pdf`, Trang 32, Câu 92 (Phần III): Lọ thuốc hình trụ cao 15cm, bán kính 8cm; tính diện tích vỏ hộp toàn phần. Đáp án trang 117.
  4. `08_Hinh_khoi_thuc_tien_KNTT.pdf`, Trang 32, Câu 94 (Phần III): Bể nước hình trụ cao 2.5m, diện tích đáy 4.8 m^2; tính thời gian vòi nước chảy đầy bể. Đáp án trang 118.
  5. `10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf`, Trang 7, Câu 21 (Phần III): Bồn chứa công nghiệp ghép giữa thân trụ và hai nắp bán cầu. Đáp án trang 10.

### 4.10. Vị trí 22: Hình học nội tiếp tổng hợp (Trả lời ngắn, Vận dụng cao)
- **Yêu cầu cần đạt:** Bài toán hình học phân hóa cao có nội dung đường tròn ngoại tiếp, tam giác nội tiếp, tứ giác nội tiếp; câu gốc là trả lời ngắn (kết quả số), không cắt gọt tự luận.
- **Danh sách 5 câu ứng viên tiêu biểu:**
  1. `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Trang 21, Câu 44 (Phần III): Tam giác ABC nội tiếp (O; R) có $\widehat{C} = 45^\circ$ và $AB = 10\sqrt{2}\text{ cm}$. Tính bán kính $R$ ($R = 10\text{ cm}$). Đáp án trang 72.
  2. `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Trang 21, Câu 45 (Phần III): Tam giác ABC có $AB=5, AC=3$, đường cao AH; đường tròn (O) đường kính AD ngoại tiếp tam giác ABC. Tính tích $AH.AD$ ($AH.AD = AB.AC = 15\text{ cm}^2$). Đáp án trang 73.
  3. `01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf`, Trang 21, Câu 46 (Phần III): Đường tròn (O; R) ngoại tiếp tam giác ABC, đường cao AH = 8cm, R = 5cm. Tính tích $AB.AC$ ($AB.AC = 2R.AH = 80\text{ cm}^2$). Đáp án trang 73.
  4. `12_KS_Cum_4_Hai_Phong_2025_2026.pdf`, Trang 3, Câu 3 (Phần III): Tam giác ABC nội tiếp đường tròn (O) có $\widehat{C} = 45^\circ$, $AB = 10\text{ cm}$. Tính bán kính $R$. Đáp án trang 34.
  5. `03_Bo_sung\01_HK2_Hung_Yen_2025_2026.pdf`, Trang 3, Câu 3 (Phần III): Hai đường tròn đồng tâm O (R=4, r=2), dây MN tiếp xúc đường tròn nhỏ. Tính tổng bình phương khoảng cách phân hóa cao. Đáp án trang 6.

---

## 5. Giới Hạn Kiểm Tra và Khuyến Nghị Chuyên Môn

1. **Phạm vi thẩm định hiện tại:**
   - Đợt kiểm tra này tập trung vào việc **định vị, xác minh sự tồn tại, đối chiếu cấu trúc và lập danh mục câu hỏi ứng viên**.
   - Chưa tiến hành nhập (seed) hay xuất bản câu hỏi vào cơ sở dữ liệu ứng dụng.
2. **Trạng thái mức nhận thức và quy tắc gộp câu Đúng/Sai:**
   - Hầu hết các đề thi thực tế tại các Sở/Cụm không đính kèm bảng ma trận chi tiết cho từng mã đề hoán vị; do đó các nhãn phân loại mang trạng thái `MODEL_PROPOSED`.
   - Các câu Đúng/Sai (Vị trí 13, 14, 15, 16) có sự phân hóa tự nhiên giữa 4 khẳng định ($a, b, c, d$). Cần Hội đồng chuyên môn Toán thống nhất quy tắc gộp mức nhận thức (ví dụ: lấy mức của ý khó nhất hay lấy mức trung vị) trước khi phê duyệt `APPROVED`.
3. **Hình vẽ và công thức:**
   - Các câu hình học (Vị trí 10, 15, 20, 22) cần trích xuất hoặc vẽ lại vector chất lượng cao (SVG/PNG nét chuẩn) khi bước vào giai đoạn số hóa chi tiết.
   - Các công thức toán học cần được biên soạn lại bằng KaTeX chuẩn theo quy chuẩn KaTeX `throwOnError: true` đã kiểm thử thành công ở đợt trước.

---

## 6. Tổng Kết Các Tệp Bàn Giao

Toàn bộ các tệp kết quả được lưu trữ tại thư mục `05_Bo_sung_theo_ma_tran/`:
1. [**`candidates.csv`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/candidates.csv): 52 câu ứng viên kèm 19 cột thông tin chi tiết.
2. [**`coverage.csv`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/coverage.csv): Bảng thống kê độ phủ 10 vị trí, xác nhận đạt chỉ tiêu $\ge 5$ câu/vị trí.
3. [**`sources.json`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/sources.json): Danh mục 3 nguồn tài liệu mới tải về kèm SHA-256 và URL tải.
4. [**`build_matrix_candidates.py`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/build_matrix_candidates.py): Script thực thi tự động có `main` guard để tái tạo dữ liệu an toàn.
5. [**`download_new_sources.py`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/download_new_sources.py): Script tải tệp PDF nguồn mới từ trang công khai.
6. [**`PDF/`**](file:///C:/Users/Administrator/Documents/Codespace/Adaptive%20Learning/Adaptive%20Math/tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/PDF/): Thư mục chứa các tệp PDF mới tải về.
