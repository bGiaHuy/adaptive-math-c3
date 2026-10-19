# BÁO CÁO KIỂM CHỨNG VÀ HIỆU CHÍNH ĐỢT MẪU (REVISION 01)
## Đề Khảo Sát Toán 9 Năm Học 2025 – 2026 — Cụm Chuyên Môn Số 24 Hải Phòng (Mã đề 101)

> **Trạng thái thẩm định:** `NEEDS_REVIEW` (toàn bộ 10 câu mẫu giữ nguyên trạng thái chờ người dùng duyệt, không tự động duyệt hay xuất bản).  
> **Nguyên tắc đối chiếu:** Kiểm tra trực quan từ các trang PDF được render chất lượng cao (Trang 1, 2, 3, 4, 9), kết hợp kiểm tra toán học và kiểm tra tự động cấu trúc dữ liệu. Không kết nối database, không chạy migration/seed.

---

## 1. Tổng quan các thay đổi chính giữa Bản gốc và Revision 01

| Hạng mục | Bản gốc (`04_Trich_xuat_Gemini`) | Bản sửa (`revision-01`) | Rationale / Căn cứ |
|---|---|---|---|
| **Thư mục lưu trữ** | Thư mục gốc `04_Trich_xuat_Gemini/` | Thư mục cách ly `revision-01/` | Giữ nguyên bản gốc đối chiếu độc lập, không ghi đè dữ liệu lịch sử. |
| **Trường bổ sung mỗi câu** | Thiếu `examCode`, `section`, `explanationOrigin`, `explanationPages`, `verificationNotes` | Đã bổ sung đầy đủ: `examCode: "101"`, `section`, `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`, `verificationNotes` | Phân định rõ ràng giữa đáp án nguồn và lời giải tự động do mô hình viết. |
| **Nguồn gốc lời giải** | Không nêu rõ, dễ gây hiểu nhầm là lời giải từ tác giả | Minh định rõ: `answerOrigin: "SOURCE_KEY"`, `explanationOrigin: "MODEL_GENERATED"` | Trang 9 PDF chỉ chứa "BẢNG ĐÁP ÁN TỔNG HỢP", không có hướng dẫn giải chi tiết. |
| **Hình vẽ minh họa (`assets/`)** | Trích xuất ảnh nhúng thô (`get_images()`) | Crop vector ở độ phân giải 300 DPI từ trang render PDF | Bảo toàn 100% nhãn đỉnh ($A, B, C, D, O, P, Q, R$), nét vẽ hình học và ký hiệu cung góc. |
| **Metadata `sources.json`** | Gán mặc định "Ban chuyên môn" cho SRC008–SRC012; gán nhầm SRC032 là Sở Hưng Yên | Chuẩn hóa theo văn bản thực tế trong PDF; SRC011 và SRC012 scan được xác minh có đủ 3 dạng; SRC032 tác giả Giang Sơn; bổ sung `isDuplicate`, `duplicateOf`, `metadataIssues` | Tránh heuristic sai lệch, bảo toàn tính trung thực của dữ liệu nguồn. |
| **Tuyên bố chất lượng** | Từng dùng từ ngữ cảm tính "chuẩn 100% của Bộ" | Đã loại bỏ hoàn toàn các tuyên bố quảng bá không có căn cứ | Chỉ ghi nhận khách quan: Đề bám sát định dạng cấu trúc đề thi khảo sát môn Toán 9 GDPT 2018 của Cụm CM 24 Hải Phòng. |

---

## 2. Kiểm toán và Hiệu chỉnh `sources.json`

Toàn bộ 33 tệp PDF trong kho tài liệu đã được tính toán lại mã băm SHA-256 từ tệp nhị phân trên đĩa và đối chiếu với nội dung thực tế:
- **Trùng lặp:** 33 tệp PDF trên đĩa đều có mã SHA-256 riêng biệt (0 nhóm tệp trùng hash). Trường `isDuplicate: false` và `duplicateOf: null` được thiết lập đồng bộ.
- **Các sửa đổi cụ thể trong `revision-01/sources.json`:**
  1. `SRC008` (`01_HK1_Hung_Yen_2025_2026.pdf`): Chuẩn hóa `schoolOrAuthor` từ `"Ban chuyên môn"` thành `"Sở GD&ĐT Hưng Yên"`. Căn cứ dòng tiêu đề trang 1: *"SỞ GIÁO DỤC VÀ ĐÀO TẠO HƯNG YÊN - ĐỀ CHÍNH THỨC"*.
  2. `SRC009` (`02_Khao_sat_Hai_Phong_2025_2026.pdf`): Chuẩn hóa `schoolOrAuthor` từ `"Ban chuyên môn"` thành `"Cụm chuyên môn số 24 Hải Phòng"`. Căn cứ dòng tiêu đề trang 1: *"CỤM CHUYÊN MÔN SỐ 24 - KHẢO SÁT CHẤT LƯỢNG HỌC SINH LỚP 9 NĂM HỌC 2025-2026"*.
  3. `SRC010` (`03_HK1_Quan_Toan_2025_2026.pdf`): Chuẩn hóa `schoolOrAuthor` từ `"Ban chuyên môn"` thành `"Trường THCS Quán Toan – Hải Phòng"`. Căn cứ dòng tiêu đề trang 1: *"UBND PHƯỜNG HỒNG AN - TRƯỜNG THCS QUÁN TOAN"*.
  4. `SRC011` (`04_HK1_Tay_Son_2025_2026.pdf`): Chuẩn hóa `schoolOrAuthor` thành `"Trường THCS Tây Sơn – Đà Nẵng"`. Tệp là bản scan không có text layer, trước đây bị đánh dấu thiếu 3 dạng (`verifiedThreeTypes: false`). Qua đối chiếu ảnh trang 1 render, xác nhận rõ:
     - Phần I. Trắc nghiệm nhiều lựa chọn (Câu 1 đến Câu 4);
     - Câu 5: Trắc nghiệm đúng/sai gồm 4 ý a, b, c, d;
     - Câu 6 đến Câu 9: Trắc nghiệm trả lời ngắn (*"Hãy viết kết quả cho các câu hỏi sau..."*).  
     Do đó cập nhật `verifiedThreeTypes: true`.
  5. `SRC012` (`05_GK1_Nguyen_Van_Linh_2025_2026.pdf`): Chuẩn hóa `schoolOrAuthor` thành `"Trường THCS Nguyễn Văn Linh – Đà Nẵng"`. Tệp scan không có text layer, trước đây bị đánh dấu `verifiedThreeTypes: false`. Qua đối chiếu ảnh trang 1 render, xác nhận rõ:
     - Phần 1. Câu trắc nghiệm nhiều phương án lựa chọn (Câu 1 đến Câu 4);
     - Phần 2. Câu hỏi trắc nghiệm đúng sai (Câu 5 gồm 4 ý a, b, c, d);
     - Phần 3. Câu hỏi trắc nghiệm trả lời ngắn (Câu 6 và Câu 7).  
     Do đó cập nhật `verifiedThreeTypes: true`.
  6. `SRC032` (`14_10_De_GK1_Hung_Yen_2026.pdf`): Tệp mang tiêu đề *"10 ĐỀ KIỂM TRA KIẾN THỨC GIỮA HỌC KỲ I TOÁN 9 CẤU TRÚC TỈNH HƯNG YÊN"*. Bản ghi cũ gán nhầm đơn vị ban hành là `"Sở GD&ĐT Hưng Yên"` và năm học `"2026-2027"`. Kiểm tra trang 1 tài liệu cho thấy đây là tài liệu tham khảo biên soạn bởi tác giả độc lập: *"CREATED BY GIANG SƠN (TRẦN LÃM – THÁNG 10/2026)"*. Đã chuẩn hóa `schoolOrAuthor: "Giang Sơn (Trần Lãm)"` và đặt `schoolYear: null` vì không phải kỳ thi của một năm học chính thức.

---

## 3. Kiểm toán chi tiết 10 câu hỏi mẫu (Đối chiếu trực quan với Mã đề 101)

### Câu 1: `SRC009-P001-Q001`
- **Phần / Số câu:** Phần I — Câu 1 | **Mã đề:** 101 | **Dạng câu:** `MULTIPLE_CHOICE`
- **Trang câu hỏi:** Trang 1 | **Trang đáp án:** Trang 9 (`BẢNG ĐÁP ÁN TỔNG HỢP`)
- **Nội dung câu chính:** Trong tam giác vuông, nếu cạnh góc vuông đối diện với một góc nhọn bằng nửa cạnh huyền thì góc nhọn đó có số đo là:
- **Phương án lựa chọn:**
  - A. $30^\circ$
  - B. $60^\circ$
  - C. $45^\circ$
  - D. $50^\circ$
- **Đáp án nguồn (Trang 9):** `A` (`answerOrigin: "SOURCE_KEY"`)
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"` (nguồn không có lời giải chi tiết, `explanationPages: []`).
- **Ghi chú đối chiếu trực quan:** Đã đối chiếu từng chữ và công thức với Trang 1 cột 1; đối chiếu với bảng đáp án Trang 9: Câu 1 - A. Bước giải lượng giác $\sin \alpha = \frac{1}{2} \Rightarrow \alpha = 30^\circ$ do mô hình giải, khớp kết quả.

### Câu 2: `SRC009-P001-Q004`
- **Phần / Số câu:** Phần I — Câu 4 | **Mã đề:** 101 | **Dạng câu:** `MULTIPLE_CHOICE`
- **Trang câu hỏi:** Trang 1 | **Trang đáp án:** Trang 9
- **Nội dung câu chính:** Phương trình $x^2 - 3x - 5 = 0$ có hai nghiệm $x_1, x_2$ ($x_1 > x_2$). Khi đó $T = 2x_1 + x_2$ bằng
- **Phương án lựa chọn:**
  - A. $\frac{3 + \sqrt{29}}{2}$
  - B. $\frac{9 + \sqrt{29}}{2}$
  - C. $\frac{3 - \sqrt{29}}{2}$
  - D. $\frac{9 - \sqrt{29}}{2}$
- **Đáp án nguồn (Trang 9):** `B` (`answerOrigin: "SOURCE_KEY"`)
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Đã đối chiếu trực quan Trang 1: kiểm tra điều kiện $x_1 > x_2$, phân số và dấu căn $\sqrt{29}$. Đáp án bảng tổng hợp Trang 9 ghi nhận Câu 4 - B. Lời giải tính $x_1, x_2$ qua công thức nghiệm và rút gọn $T$ do mô hình giải, kết quả trùng khớp.

### Câu 3: `SRC009-P001-Q005`
- **Phần / Số câu:** Phần I — Câu 5 | **Mã đề:** 101 | **Dạng câu:** `MULTIPLE_CHOICE`
- **Trang câu hỏi:** Trang 1 | **Trang đáp án:** Trang 9
- **Nội dung câu chính:** Cho đường tròn tâm $O$ và $3$ điểm $A, B, C$ thuộc đường tròn (tham khảo hình vẽ). Biết $\widehat{BAC} = x - 10^\circ$ và $\widehat{BOC} = 4x - 80^\circ$. Giá trị của $x$ bằng (đơn vị: độ)
- **Phương án lựa chọn:**
  - A. $20^\circ$
  - B. $45^\circ$
  - C. $30^\circ$
  - D. $40^\circ$
- **Hình vẽ đính kèm:** `assets/SRC009-P001-Q005.png` (Crop ở 300 DPI từ Trang 1 PDF, hiển thị rõ tâm $O$, các điểm $A, B, C$, các cung tô màu xanh và nhãn góc $x - 10^\circ$, $4x - 80^\circ$).
- **Đáp án nguồn (Trang 9):** `C` (`answerOrigin: "SOURCE_KEY"`)
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Hình ảnh gốc trước đây được thay bằng ảnh crop nét cao không bị lẹm viền hay mất chữ. Phương trình quan hệ góc ở tâm và góc nội tiếp: $4x - 80^\circ = 2(x - 10^\circ) \Leftrightarrow 2x = 60^\circ \Leftrightarrow x = 30^\circ$. Khớp đáp án C.

### Câu 4: `SRC009-P001-Q007`
- **Phần / Số câu:** Phần I — Câu 7 | **Mã đề:** 101 | **Dạng câu:** `MULTIPLE_CHOICE`
- **Trang câu hỏi:** Trang 1 | **Trang đáp án:** Trang 9
- **Nội dung câu chính:** Một cửa hàng thống kê số lượng các loại nước giải khát bán được trong một ngày như sau: Tổng cộng $50$ ly nước, trong đó có $15$ ly trà sữa, $25$ ly nước ép và còn lại là trà trái cây. Tần số tương đối của loại nước trà trái cây bán được trong ngày hôm đó là
- **Phương án lựa chọn:**
  - A. $20\%$
  - B. $15\%$
  - C. $30\%$
  - D. $10\%$
- **Đáp án nguồn (Trang 9):** `A` (`answerOrigin: "SOURCE_KEY"`)
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Đã đối chiếu các con số thống kê ($50, 15, 25$) trên Trang 1. Số ly trà trái cây là $50 - 40 = 10$, tần số tương đối $\frac{10}{50} = 20\%$. Khớp đáp án A.

### Câu 5: `SRC009-P002-Q001`
- **Phần / Số câu:** Phần II — Câu 1 | **Mã đề:** 101 | **Dạng câu:** `TRUE_FALSE`
- **Trang câu hỏi:** Trang 2 | **Trang đáp án:** Trang 9
- **Nội dung ngữ cảnh:** Một gia đình lắp đặt một ống thoát nước hình trụ dài $10\text{ m}$, có đường kính $0{,}2\text{ m}$. Để chống thấm, người ta quét một lớp keo đặc biệt lên mặt xung quanh của ống. Biết mỗi hộp keo quét được $3\text{ m}^2$, giá mỗi hộp là $50\,000$ đồng (lấy $\pi \approx 3{,}14$). Xét các khẳng định sau:
- **Các khẳng định và đáp án nguồn:**
  - a. Diện tích cần quét keo lên ống thoát nước hình trụ là diện tích xung quanh của hình trụ có chiều cao $h = 10\text{ m}$ và bán kính đáy $r = 10\text{ cm}$. $\rightarrow$ **ĐÚNG** (`true`)
  - b. Diện tích xung quanh của ống là $628\text{ m}^2$. $\rightarrow$ **SAI** (`false`) (thực tế là $6{,}28\text{ m}^2$)
  - c. Nếu mua $2$ hộp keo thì đủ để quét hết bề mặt ống. $\rightarrow$ **SAI** (`false`) (2 hộp chỉ quét được $6\text{ m}^2 < 6{,}28\text{ m}^2$)
  - d. Số tiền tối thiểu cần chi để mua keo là $150\,000$ đồng. $\rightarrow$ **ĐÚNG** (`true`) (cần mua 3 hộp $\times 50\,000 = 150\,000$)
- **Đáp án nguồn (Trang 9):** `{"a": true, "b": false, "c": false, "d": true}` (trang 9 ghi: `1. a: Đ, b: S, c: S, d: Đ`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Đối chiếu từng câu chữ trên Trang 2 cột 1; 4 ý đúng sai khớp 100% với khóa đáp án phần II của Mã đề 101.

### Câu 6: `SRC009-P002-Q002`
- **Phần / Số câu:** Phần II — Câu 2 | **Mã đề:** 101 | **Dạng câu:** `TRUE_FALSE`
- **Trang câu hỏi:** Trang 2 | **Trang đáp án:** Trang 9
- **Nội dung ngữ cảnh:** Một cửa hàng tiện lợi thống kê số lượng khách hàng ghé thăm mỗi giờ trong suốt $24$ giờ của một ngày (bảng gồm 4 nhóm: $[10; 20): 5$; $[20; 30): 10$; $[30; 40): 6$; $[40; 50): 3$). Giờ cao điểm tính từ 30 khách trở lên.
- **Các khẳng định và đáp án nguồn:**
  - a. Trong ngày, số giờ có từ $20$ đến dưới $30$ khách chiếm thời gian nhiều nhất. $\rightarrow$ **ĐÚNG** (`true`)
  - b. Tổng số giờ cao điểm của cửa hàng trong ngày hôm đó là $9$ giờ. $\rightarrow$ **ĐÚNG** (`true`) ($6 + 3 = 9$)
  - c. Tỉ lệ số giờ vắng khách (dưới $20$ khách) chiếm hơn $25\%$ thời gian trong ngày. $\rightarrow$ **SAI** (`false`) ($\frac{5}{24} \approx 20{,}83\% < 25\%$)
  - d. Nếu mỗi giờ cao điểm cửa hàng phải chi thêm $50\,000$ đồng tiền thuê nhân sự bổ sung, thì tổng số tiền chi thêm cho việc này trong ngày hôm đó là $500\,000$ đồng. $\rightarrow$ **SAI** (`false`) ($9 \times 50\,000 = 450\,000 \ne 500\,000$)
- **Đáp án nguồn (Trang 9):** `{"a": true, "b": true, "c": false, "d": false}` (trang 9 ghi: `2. a: Đ, b: Đ, c: S, d: S`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Bảng số liệu và các tiêu chí phân nhóm được so sánh chuẩn xác với ảnh Trang 2; đáp án khớp hoàn toàn với bảng đáp án Trang 9.

### Câu 7: `SRC009-P003-Q003`
- **Phần / Số câu:** Phần II — Câu 3 | **Mã đề:** 101 | **Dạng câu:** `TRUE_FALSE`
- **Trang câu hỏi:** Trang 3 | **Trang đáp án:** Trang 9
- **Nội dung ngữ cảnh:** Sản xuất chip vi điều khiển (MCU) và chip nhớ (Flash) qua 2 tuần với sự thay đổi định mức thời gian và chi phí nguyên liệu.
- **Các khẳng định và đáp án nguồn:**
  - a. Nếu sản xuất $300$ chip MCU thì quỹ thời gian còn lại không đủ để sản xuất $200$ chip Flash. $\rightarrow$ **SAI** (`false`) ($300 \times 2 + 200 \times 3 = 1\,200$ giờ, vừa đủ)
  - b. Số lượng chip sản xuất trong tuần 1 là $x = 160$ và $y = 360$. $\rightarrow$ **SAI** (`false`) (nghiệm hệ là $x = 360, y = 160$, khẳng định ghi ngược)
  - c. Nếu giữ nguyên sản lượng như tuần 1, thì tổng thời gian sản xuất trong tuần 2 là $1\,008$ giờ. $\rightarrow$ **ĐÚNG** (`true`) ($1{,}6 \times 360 + 2{,}7 \times 160 = 1\,008$)
  - d. Nếu muốn tăng sản lượng mỗi loại thêm $15\%$ trong tuần 2 thì nhà máy không cần bổ sung thêm quỹ thời gian. $\rightarrow$ **ĐÚNG** (`true`) ($1\,008 \times 1{,}15 = 1\,159{,}2 \le 1\,200$)
- **Đáp án nguồn (Trang 9):** `{"a": false, "b": false, "c": true, "d": true}` (trang 9 ghi: `3. a: S, b: S, c: Đ, d: Đ`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Hệ phương trình tuần 1 $2x + 3y = 1200$ và $0{,}5x + 0{,}4y = 244$ cho nghiệm $(360, 160)$. Cả 4 ý đối chiếu khớp với Trang 3 và bảng đáp án Trang 9.

### Câu 8: `SRC009-P004-Q004`
- **Phần / Số câu:** Phần III — Câu 4 | **Mã đề:** 101 | **Dạng câu:** `SHORT_ANSWER`
- **Trang câu hỏi:** Trang 4 | **Trang đáp án:** Trang 9
- **Nội dung câu hỏi:** Cho hình vuông $ABCD$ có cạnh bằng $40$. Trong hình vuông vẽ cung tròn $BD$ tâm $A$ bán kính $AB$ và cung tròn $AC$ tâm $B$ bán kính $BA$. Gọi $(O; r)$ là đường tròn tiếp xúc với hai cung tròn $AC, BD$ lần lượt tại $P, Q$ và tiếp xúc với cạnh $AB$ tại $R$. Tính $PQ$.
- **Hình vẽ đính kèm:** `assets/SRC009-P004-Q004.png` (Crop ở 300 DPI từ Trang 4 PDF, giữ nguyên vẹn hình vuông, 2 cung tròn, đường tròn nội tiếp $(O; r)$, các tiếp điểm $P, Q, R$, nhãn đỉnh $A, B, C, D$ và đoạn $PQ$ tô màu đỏ nổi bật).
- **Đáp án nguồn (Trang 9):** `24` (`answerOrigin: "SOURCE_KEY"`, `raw: "24"`, `normalized: "24"`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Hình ảnh vector đã được cắt rõ nét không mất chi tiết. Lời giải hình học áp dụng định lý Pythagore cho tam giác vuông $ARO$: $(40 - r)^2 = 20^2 + r^2 \Rightarrow r = 15$, suy ra $OA = 25$. Tam giác cân $OPQ \sim OBA$ tỉ số $k = \frac{15}{25} = \frac{3}{5} \Rightarrow PQ = \frac{3}{5} \times 40 = 24$. Khớp chính xác với đáp án bảng tổng hợp Trang 9.

### Câu 9: `SRC009-P004-Q005`
- **Phần / Số câu:** Phần III — Câu 5 | **Mã đề:** 101 | **Dạng câu:** `SHORT_ANSWER`
- **Trang câu hỏi:** Trang 4 | **Trang đáp án:** Trang 9
- **Nội dung câu hỏi:** Một lớp học tại Hải Phòng muốn thuê xe ô tô $29$ chỗ để đi chụp ảnh kỷ yếu... Tìm giá trị nguyên lớn nhất của $x$ để việc thuê xe của Công ty B có tổng chi phí thấp hơn Công ty A?
- **Đáp án nguồn (Trang 9):** `239` (`answerOrigin: "SOURCE_KEY"`, `raw: "239"`, `normalized: "239"`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Bất phương trình $18\,000x < 1\,200\,000 + 13\,000x \Leftrightarrow 5\,000x < 1\,200\,000 \Leftrightarrow x < 240$. Giá trị nguyên lớn nhất của $x$ là $239$. Khớp trực quan với Trang 4 và đáp án Trang 9.

### Câu 10: `SRC009-P004-Q006`
- **Phần / Số câu:** Phần III — Câu 6 | **Mã đề:** 101 | **Dạng câu:** `SHORT_ANSWER`
- **Trang câu hỏi:** Trang 4 | **Trang đáp án:** Trang 9
- **Nội dung câu hỏi:** Rút ngẫu nhiên cùng lúc $2$ thẻ từ hộp chứa các thẻ ghi chữ cái của từ HAIPHONG... Tính xác suất có ít nhất một thẻ ghi nguyên âm. (Kết quả làm tròn đến hàng phần trăm).
- **Đáp án nguồn (Trang 9):** `0,64` (`answerOrigin: "SOURCE_KEY"`, `raw: "0,64"`, `normalized: "0.64"`, `rounding: "Hàng phần trăm"`).
- **Nguồn gốc lời giải:** `explanationOrigin: "MODEL_GENERATED"`, `explanationPages: []`.
- **Ghi chú đối chiếu trực quan:** Tính toán biến cố đối: $P(E) = 1 - \frac{C_5^2}{C_8^2} = 1 - \frac{10}{28} = \frac{9}{14} \approx 0{,}642857$. Làm tròn hàng phần trăm là $0{,}64$. Khớp hoàn toàn với Trang 4 và bảng đáp án Trang 9.

---

## 4. Kết quả kiểm tra tính toàn vẹn tự động (`validate_revision.py`)

Kịch bản kiểm thử tự động đã thực hiện quét toàn diện:
1. **Kiểm tra mã định danh (IDs):** 10/10 ID duy nhất, đúng định dạng `SRC009-Pxxx-Qxxx`.
2. **Kiểm tra nguồn (`sources.json`):** Mã `SRC009` tồn tại, các trang câu hỏi [1, 2, 3, 4] và trang đáp án [9] đều nằm trong phạm vi tài liệu (tổng 9 trang).
3. **Kiểm tra tệp đính kèm (`assets/`):** 2/2 tệp hình ảnh (`SRC009-P001-Q005.png`, `SRC009-P004-Q004.png`) tồn tại thực tế trên đĩa, mở được và hiển thị đúng câu hỏi.
4. **Kiểm tra cấu trúc từng dạng câu:**
   - 4 câu `MULTIPLE_CHOICE`: Có đúng 4 options A/B/C/D, statements là null, answer chứa `correctOption`.
   - 3 câu `TRUE_FALSE`: Có đúng 4 statements a/b/c/d, options là null, answer là dictionary chứa 4 giá trị kiểu boolean (`True`/`False`).
   - 3 câu `SHORT_ANSWER`: Options và statements là null, answer chứa `raw`, `normalized`.
5. **Kiểm tra cú pháp công thức LaTeX:** 10/10 câu có các ký tự `$` đóng mở cân bằng, không có lệnh LaTeX gãy vỡ hay lỗi đóng ngoặc nhọn `{}`.
6. **Kiểm tra tệp theo dõi `review.csv`:** Đúng định dạng CSV UTF-8 BOM, 10/10 dòng khớp trường và dữ liệu với `questions.jsonl`.

---

## 5. Giới hạn & Điểm lưu ý cho thẩm định viên

1. **Về nguồn gốc lời giải:** Toàn bộ lời giải chi tiết được gắn thẻ `explanationOrigin: "MODEL_GENERATED"` với `explanationPages: []` vì đề thi gốc của Cụm Chuyên môn số 24 Hải Phòng chỉ cung cấp bảng đáp án tổng hợp (trang 9), không có đáp án chi tiết từng bước giải. Người dùng / giáo viên cần đọc lại lời giải để đảm bảo văn phong sư phạm trước khi đưa vào ứng dụng.
2. **Về trạng thái kiểm duyệt:** Cả 10 câu vẫn giữ nguyên `reviewStatus: "NEEDS_REVIEW"`, sẵn sàng cho đợt kiểm tra trực tiếp của người dùng.
3. **Về phạm vi công việc:** Chưa mở rộng trích xuất đại trà sang các câu còn lại hay các đề khác theo đúng yêu cầu dừng lại sau đợt mẫu đã sửa đổi.
