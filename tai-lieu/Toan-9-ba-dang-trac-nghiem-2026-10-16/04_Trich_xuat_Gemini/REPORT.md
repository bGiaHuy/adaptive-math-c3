# BÁO CÁO TRÍCH XUẤT CÂU HỎI MẪU TOÁN 9 – DỰ ÁN ADAPTIVE MATH

> **Thời điểm thực hiện:** 17/10/2026  
> **Trạng thái quy trình:** Hoàn thành đợt làm mẫu 10 câu chính theo yêu cầu Bước 2. **Dừng quy trình để người dùng kiểm tra; chưa xử lý trích xuất hàng loạt.**

## 1. Kiểm kê tài liệu (Bước 1)

- **Tổng số tài liệu trong kho lưu trữ:** **33 tệp PDF**.
- **Phân bố tài liệu:**
  - `01_Chuyen_de`: 7 tệp (Toán 9 KNTT & Cánh Diều)
  - `02_De_tong_hop`: 5 tệp (Đề thi HK1 & Khảo sát Hải Phòng/Hưng Yên/Đà Nẵng)
  - `03_Bo_sung`: 1 tệp (Đề HK2 Hưng Yên)
  - `03_Bo_sung_Antigravity/Chuyen_de`: 10 tệp (Chuyên đề KNTT, Cánh Diều, CTST)
  - `03_Bo_sung_Antigravity/De_tong_hop`: 10 tệp (Đề GK2, HK2, Khảo sát & Ôn thi vào 10)
- Toàn bộ danh mục nguồn tài liệu kèm SHA-256, URL tải, URL nguồn, số trang, bộ sách đã được lưu tại [`sources.json`](sources.json).

## 2. Kết quả đợt trích xuất mẫu (Bước 2)

Tài liệu mẫu được chọn: **[02_Khao_sat_Hai_Phong_2025_2026.pdf](../02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf)** (Mã nguồn: `SRC009`).
- **Tiêu đề:** Khảo sát chất lượng học sinh lớp 9 năm học 2025-2026 – Cụm chuyên môn số 24 Hải Phòng.
- **Đặc điểm:** Biên soạn chuẩn 100% định dạng trắc nghiệm mới GDPT 2018; có bảng đáp án tổng hợp đối chiếu tại trang 9.

### Thống kê số lượng câu trích xuất mẫu:

- **Tổng số câu hỏi chính:** **10 câu**.
  - **Nhiều lựa chọn (`MULTIPLE_CHOICE`):** **4 câu** (Câu 1, 4, 5, 7 - Phần I).
  - **Đúng/Sai (`TRUE_FALSE`):** **3 câu chính** (Câu 1, 2, 3 - Phần II).
  - **Trả lời ngắn (`SHORT_ANSWER`):** **3 câu** (Câu 4, 5, 6 - Phần III).
- **Tổng số ý đúng/sai riêng biệt:** **12 ý** ($3\text{ câu} \times 4\text{ ý/câu}$, độc lập boolean). *Không cộng gộp các ý vào số câu chính.*
- **Số câu có đáp án từ nguồn (`answerOrigin = SOURCE_KEY`):** **10/10 câu** ($100\%$).
- **Số câu thiếu đáp án:** **0 câu**.
- **Số câu có hình vẽ gốc trích xuất từ PDF:** **2 câu** (Câu 5 Phần I và Câu 4 Phần III; lưu nguyên bản tại thư mục `assets/`).
- **Số câu nghi trùng (`duplicateCandidateOf`):** **0 câu** (10 câu khảo sát các chủ đề và ngữ cảnh khác biệt hoàn toàn).
- **Số câu gắn cờ cần kiểm tra (`issues`):** **2 câu** (Chủ yếu cờ nhắc kiểm tra hiển thị hình vẽ trên giao diện).

## 3. Bảng đối chiếu 10 câu hỏi mẫu

| Mã câu hỏi | Dạng | Câu gốc | Trang đề | Trang đáp án | Đáp án trích xuất | Hình đính kèm | Trạng thái đối soát |
|---|:---:|:---:|:---:|:---:|---|:---:|:---:|
| `SRC009-P001-Q001` | `MULTIPLE_CHOICE` | Câu 1 | Trang 1 | Trang 9 | `{"correctOption": "A"}` | Không | **Khớp 100%** |
| `SRC009-P001-Q004` | `MULTIPLE_CHOICE` | Câu 4 | Trang 1 | Trang 9 | `{"correctOption": "B"}` | Không | **Khớp 100%** |
| `SRC009-P001-Q005` | `MULTIPLE_CHOICE` | Câu 5 | Trang 1 | Trang 9 | `{"correctOption": "C"}` | `assets/SRC009-P001-Q005.png` | **Khớp 100%** |
| `SRC009-P001-Q007` | `MULTIPLE_CHOICE` | Câu 7 | Trang 1 | Trang 9 | `{"correctOption": "A"}` | Không | **Khớp 100%** |
| `SRC009-P002-Q001` | `TRUE_FALSE` | Câu 1 | Trang 2 | Trang 9 | `{"a": true, "b": false, "c": false, "d": true}` | Không | **Khớp 100%** |
| `SRC009-P002-Q002` | `TRUE_FALSE` | Câu 2 | Trang 2 | Trang 9 | `{"a": true, "b": true, "c": false, "d": false}` | Không | **Khớp 100%** |
| `SRC009-P003-Q003` | `TRUE_FALSE` | Câu 3 | Trang 3 | Trang 9 | `{"a": false, "b": false, "c": true, "d": true}` | Không | **Khớp 100%** |
| `SRC009-P004-Q004` | `SHORT_ANSWER` | Câu 4 | Trang 4 | Trang 9 | `{"raw": "24", "normalized": "24", "unit": null, "rounding": null}` | `assets/SRC009-P004-Q004.png` | **Khớp 100%** |
| `SRC009-P004-Q005` | `SHORT_ANSWER` | Câu 5 | Trang 4 | Trang 9 | `{"raw": "239", "normalized": "239", "unit": null, "rounding": null}` | Không | **Khớp 100%** |
| `SRC009-P004-Q006` | `SHORT_ANSWER` | Câu 6 | Trang 4 | Trang 9 | `{"raw": "0,64", "normalized": "0.64", "unit": null, "rounding": "Hàng phần trăm"}` | Không | **Khớp 100%** |

## 4. Danh mục tệp kết quả tạo ra

Tất cả các tệp đầu ra được lưu độc lập tại thư mục `04_Trich_xuat_Gemini/`, giữ nguyên vẹn toàn bộ cấu trúc kho lưu trữ cũ:

- [`sources.json`](sources.json): Danh mục kiểm kê 33 tài liệu Toán 9 kèm mã định danh `SRC001` - `SRC033`.
- [`questions.jsonl`](questions.jsonl): Dữ liệu 10 câu hỏi mẫu (chuẩn JSONL, mỗi dòng là một JSON object độc lập).
- [`review.csv`](review.csv): Bảng phân tích trạng thái phục vụ người kiểm tra qua Excel (UTF-8 BOM).
- [`assets/`](assets/): Thư mục lưu trữ hình ảnh gốc cắt trích xuất trực tiếp từ PDF (`SRC009-P001-Q005.png`, `SRC009-P004-Q004.png`).
- [`REPORT.md`](REPORT.md): Báo cáo tổng kết đợt mẫu.

## 5. Giới hạn và các vấn đề cần người dùng xem xét, quyết định

1. **Định dạng hiển thị hình ảnh (`assets`):**
   - Các hình vẽ được trích xuất ở độ phân giải gốc của vector/bitmap nhúng trong file PDF. Cần người dùng kiểm tra tỷ lệ hiển thị và nhãn điểm trên trình xem câu hỏi của ứng dụng Adaptive Math.
2. **Cấu trúc dữ liệu JSONL:**
   - Cấu trúc `answer` hiện tại (`correctOption` cho trắc nghiệm 4 lựa chọn, `a, b, c, d` boolean cho đúng/sai, `raw/normalized/unit/rounding` cho trả lời ngắn) là schema trung gian phục vụ kiểm duyệt chuẩn mực, chưa phải schema database của ứng dụng. Sau khi duyệt, sẽ có script mapping vào database schema.
3. **Chính sách đối với câu hỏi tự luận:**
   - Trong đề gốc và các chuyên đề có phần Tự luận (chiếm 3-5 điểm trong một số đề). Theo chỉ đạo, các câu tự luận này không bị tự tiện chuyển đổi thành trả lời ngắn. Chúng tôi đề xuất tách riêng phân loại `ESSAY` hoặc giữ nguyên dạng bài toán tự luận nhiều bước giải.
4. **Kế hoạch triển khai đợt tiếp theo:**
   - Sau khi người dùng duyệt đợt mẫu 10 câu này, hệ thống sẵn sàng mở rộng trích xuất toàn bộ 12 câu trắc nghiệm nhiều lựa chọn, 4 câu đúng/sai và 6 câu trả lời ngắn của Mã đề 101, tiếp tục sang các đề thi thử vào 10 và các chuyên đề Kết Nối Tri Thức trọng tâm.

> **Lưu ý:** Đợt làm việc này tuân thủ nguyên tắc cách ly dữ liệu: không kết nối database, không thực thi seed/migration, không sửa code ứng dụng và không xuất bản câu hỏi.