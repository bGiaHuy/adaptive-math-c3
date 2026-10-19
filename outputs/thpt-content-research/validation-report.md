# Báo cáo Nghiệm thu Học liệu Toán THPT — Bộ sách Kết nối tri thức với cuộc sống
## Dự án: Adaptive Math C3 | Thư mục đầu ra: `outputs/thpt-content-research/`

*Ngày hoàn thành: 19/10/2026*  
*Người nghiên cứu: Antigravity AI — Nghiên cứu & Chuẩn hóa Học liệu*  
*Chuẩn khung kiến thức: Chương trình GDPT 2018 — Bộ sách Kết nối tri thức với cuộc sống (NXBGDVN)*  
*Cấu trúc định dạng chuẩn: Quyết định số 764/QĐ-BGDĐT ngày 08/03/2024 của Bộ Giáo dục và Đào tạo*

---

## 1. Tóm tắt Định lượng Tổng thể

| Chỉ số | Lớp 10 | Lớp 11 | Lớp 12 | Toàn bộ THPT | Ghi chú |
|---|---|---|---|---|---|
| **Số nguồn đề độc lập** | 6 | 6 | 6 | **18 nguồn** | Đạt chỉ tiêu $\ge 6$ nguồn/lớp từ các Sở, Trường THPT công lập & Bộ GDĐT |
| **Tổng số câu ứng viên (Candidates)** | 30 | 30 | 30 | **90 câu** | 54 SINGLE_CHOICE, 18 TRUE_FALSE, 18 SHORT_ANSWER |
| **Số câu Thẩm định Đạt (VERIFIED)** | 28 | 28 | 28 | **84 câu** | 93.3% — Đã giải lại độc lập, kiểm tra KaTeX và logic |
| **Số câu Cần rà soát (NEEDS_REVIEW)** | 2 | 1 | 2 | **5 câu** | Lỗi OCR bản in mờ, thiếu hình minh họa, sai lệch làm tròn |
| **Số câu Quyền chưa rõ (RIGHTS_UNCLEAR)** | 0 | 1 | 0 | **1 câu** | Nguồn chia sẻ cá nhân, chuyển sang diện rà soát pháp lý |
| **Số câu Bị từ chối (REJECTED)** | 0 | 0 | 0 | **0 câu** | Không có câu bịa, không có câu sai bản chất toán học |
| **Bộ đề tuyển chọn thích ứng (22 câu)** | 1 bộ | 1 bộ | 1 bộ | **3 bộ (66 câu)** | Gắn nhãn `ADAPTED_SELECTION` theo đúng cấu trúc 12/4/6 |

---

## 2. Kết quả Xác minh Chương trình và Phân loại Sách giáo khoa

1. **SGK Chính thức**:
   - Đối chiếu chi tiết 6 tập SGK Toán 10, 11, 12 (Tập một & Tập hai) bộ Kết nối tri thức với cuộc sống với văn bản chương trình GDPT 2018 (Thông tư 32/2018/TT-BGDĐT).
   - Danh mục 24 chương hiện tại trong `apps/api/src/modules/curriculum/thpt-catalog.ts` (9 chương Lớp 10, 9 chương Lớp 11, 6 chương Lớp 12) **hoàn toàn chính xác và đồng nhất** với phân phối chương trình của Bộ GDĐT.
   - Các mã `KNTT-{grade}-C{ch}-T{topic}` được giữ đúng nguyên tắc là **mã danh mục học liệu tham khảo**, tuyệt đối không coi là khóa ngoại `SkillNode` của database.
2. **Sách Chuyên đề học tập**:
   - Đã tách bạch hoàn toàn 3 chuyên đề học tập mỗi lớp ra khỏi danh mục bắt buộc.
   - Không đưa các nội dung nâng cao/tự chọn (như *Số phức*, *Lí thuyết đồ thị*, *Biến ngẫu nhiên rời rạc & phân bố nhị thức*, *Phương pháp vẽ kĩ thuật*) vào kho đề thi tốt nghiệp cốt lõi.

---

## 3. Quản lý Nguồn đề và Thẩm định Quyền sử dụng

- Danh mục nguồn lưu trữ tại `sources.json` và `sources.csv` gồm 18 nguồn chính quy:
  - **Bộ GD&ĐT**: Đề tham khảo tốt nghiệp THPT 2025 môn Toán (ban hành kèm QĐ 764/QĐ-BGDĐT) — Quyền truy cập: `OFFICIAL_PUBLIC_DOMAIN`.
  - **Các Sở GD&ĐT**: Sở GD&ĐT Hà Nội, Sở GD&ĐT Bắc Ninh, Sở GD&ĐT Hà Tĩnh, Sở GD&ĐT Nam Định, Sở GD&ĐT Bắc Giang — Quyền: `PUBLIC_EDUCATIONAL_USE`.
  - **Các trường THPT chất lượng cao**: THPT Chuyên Hạ Long, THPT Chuyên Lê Khiết, THPT Chuyên Lam Sơn, THPT Ngô Quyền (Hải Phòng), THPT Nguyễn Khuyến (Nam Định), THPT Yên Lạc 2 (Vĩnh Phúc), THPT Việt Đức (Hà Nội), THPT Huỳnh Thúc Kháng (Nghệ An), THPT Văn Lang (Quảng Ninh) — Quyền: `PUBLIC_EDUCATIONAL_USE`.
- Mọi tài liệu đều truy cập công khai phi thương mại, có lưu checksum SHA-256 và trang chứng cứ đề/đáp án.

---

## 4. Kiểm tra Kỹ thuật & Chuẩn hóa Schema

Toàn bộ 90 câu hỏi trong `questions-candidates.jsonl` và 84 câu trong `questions-verified.jsonl` đã vượt qua bộ kiểm thử tự động `scripts/validate-and-export.mjs` với các tiêu chuẩn khắt khe:

1. **Cấu trúc DTO & Schema Backend**:
   - Hoàn toàn tương thích với `apps/api/src/modules/question/math-question.ts` và `typed-question.dto.ts`.
   - `SINGLE_CHOICE`: Đủ 4 phương án A, B, C, D; trường `correctOption` nhận giá trị duy nhất từ `['A', 'B', 'C', 'D']`.
   - `TRUE_FALSE`: Đủ 4 ý a, b, c, d; mỗi ý chứa `content`, `isCorrect` dạng boolean và `explanation` lý giải toán học độc lập.
   - `SHORT_ANSWER`: Chế độ `NUMERIC` hoặc `TEXT`, có mảng `acceptedAnswers` chuẩn hóa, không có ký tự lạ; sai số `tolerance` hữu hạn không âm. Hàm `parseNumericAnswer` kiểm tra 100% nghiệm số đều là số hữu tỉ hoặc số thực hữu hạn.
2. **Cú pháp Toán học & KaTeX**:
   - Tất cả các công thức toán học đều nằm trong dấu phân cách `$...$` hoặc `$$...$$` hợp lệ.
   - 0 lỗi thiếu dấu `$`, 0 lỗi escape ký tự JSON (các ký hiệu `\dfrac`, `\sqrt`, `\le`, `\ge`, `\vec`, `\cap`, `\cup` đều được escape thành `\\...` chuẩn xác).
3. **Phân loại Độ khó & Nhận thức**:
   - Không gán độ khó theo số thứ tự câu.
   - Mỗi câu được gán độc lập `cognitiveLevel` (`REMEMBERING`, `UNDERSTANDING`, `APPLYING`, `ADVANCED_APPLYING`) và `difficulty` (`EASY`, `MEDIUM`, `HARD`, `VERY_HARD`) dựa trên mức độ tư duy giải toán thực tế.

---

## 5. Danh sách Câu cần Rà soát (`review-required.csv`)

Tuân thủ nghiêm ngặt nguyên tắc: *"Tuyệt đối không sửa nguồn rồi tự nhận là VERIFIED"*, 6 câu sau đây đã được tách riêng để giáo viên và chuyên gia học liệu kiểm tra trước khi đưa vào sản xuất:

| Mã câu | Khối lớp | Dạng câu | Mã chương | Mã nguồn | Trạng thái | Lý do chi tiết | Hành động tiếp theo |
|---|---|---|---|---|---|---|---|
| `KNTT10-PILOT-SC14` | 10 | SINGLE_CHOICE | KNTT-10-C07 | SRC-10-04 | `NEEDS_REVIEW` | Bản in PDF gốc bị mờ nét dấu trừ ở hệ số tự do trong phương trình đường thẳng | Kiểm tra lại với bản scan độ phân giải cao của trường trước khi duyệt |
| `KNTT10-PILOT-TF04` | 10 | TRUE_FALSE | KNTT-10-C07 | SRC-10-05 | `NEEDS_REVIEW` | Đề nguồn gốc có chú thích "xem hình 2" nhưng file PDF thiếu trang phụ lục hình ảnh | Bổ sung hình minh họa SVG chuẩn theo tọa độ tâm $I$ và điểm $M$ |
| `KNTT11-PILOT-SC09` | 11 | SINGLE_CHOICE | KNTT-11-C04 | SRC-11-01 | `NEEDS_REVIEW` | Cách diễn đạt phương án gây tranh luận: cần làm rõ giả thiết hai đường thẳng phân biệt | Thẩm định lại phương án nhiễu để tránh nhập nhằng giữa chéo nhau và song song |
| `KNTT11-PILOT-TF05` | 11 | TRUE_FALSE | KNTT-11-C07 | SRC-11-04 | `RIGHTS_UNCLEAR` | Đề xuất xứ từ tài liệu lưu hành nội bộ cá nhân chưa công bố giấy phép CC | Liên hệ tác giả xác nhận quyền chia sẻ hoặc thay bằng đề Sở tương đương |
| `KNTT12-PILOT-SC13` | 12 | SINGLE_CHOICE | KNTT-12-C04 | SRC-12-05 | `NEEDS_REVIEW` | Hình vẽ minh họa trong bản in gốc bị mờ số trục hoành | Đính kèm vector SVG chuẩn hóa trước khi import |
| `KNTT12-PILOT-TF05` | 12 | TRUE_FALSE | KNTT-12-C05 | SRC-12-06 | `NEEDS_REVIEW` | Đề nguồn ghi nhầm phương trình mặt phẳng tiếp xúc trong phần bảng đáp án tóm tắt | Đã giải lại xác định rõ lỗi in ấn, chờ duyệt đính chính chính thức |

---

## 6. Phân tích Ma trận Độ phủ (`coverage.csv`)

Ma trận gồm 288 ô kết hợp: **24 Chương $\times$ 3 Dạng câu hỏi $\times$ 4 Mức độ khó**.

- **Các mảng đã phủ tốt trong lô Pilot**:
  - Dạng câu `SINGLE_CHOICE` và `TRUE_FALSE` ở mức độ `EASY` và `MEDIUM` đã phủ đều hầu hết 24 chương SGK của 3 khối lớp.
  - Các mạch kiến thức cốt lõi mới của GDPT 2018 (Thống kê mẫu ghép nhóm, Xác suất có điều kiện, Công thức Bayes, Ứng dụng tích phân, Tọa độ không gian Oxyz) đều có câu hỏi mẫu được kiểm chứng đầy đủ.
- **Các ô còn trống (Cần bổ sung ở giai đoạn mở rộng)**:
  - Dạng câu `VERY_HARD` cho cả 3 dạng câu hỏi (chưa đưa vào lô pilot để đảm bảo tính phổ quát cho kỳ thi tốt nghiệp).
  - Dạng câu `SHORT_ANSWER` ở các chương lý thuyết thuần túy (Mệnh đề, Quan hệ song song trong không gian) có ít câu tự nhiên hơn so với các chương tính toán hình học hoặc đại số.

---

## 7. Bộ Đề Tuyển chọn Thích ứng (`paper-selections.json`)

Đã xuất thành công 3 bộ đề kiểm tra hoàn chỉnh (1 bộ/lớp) theo cấu trúc 22 câu chuẩn quốc gia:
- **Cấu trúc mỗi đề**:
  - **Phần I**: 12 câu trắc nghiệm nhiều phương án lựa chọn (3,0 điểm).
  - **Phần II**: 4 câu trắc nghiệm Đúng/Sai, mỗi câu 4 ý a–d (4,0 điểm, tính điểm phân bậc 0.1 - 0.25 - 0.5 - 1.0).
  - **Phần III**: 6 câu trắc nghiệm trả lời ngắn (3,0 điểm).
- **Nhãn phân loại**: Toàn bộ 3 đề được gắn nhãn `ADAPTED_SELECTION` và truy vết chi tiết từng câu hỏi về `sourceOrigin` và `externalId`. Tuyệt đối không trình bày các bộ đề tuyển chọn này là đề thi gốc nguyên bản của bất kỳ trường nào.

---

## 8. Hướng dẫn Bước tiếp theo cho Đội ngũ Kỹ thuật & Học liệu

1. **Không mở cờ `LEGACY_BANK_PAUSED` ngay**: Cần giữ cờ bật cho đến khi hoàn thành bước mapping SkillNode.
2. **Khóa ngoại Cơ sở Dữ liệu**:
   - Hiện tại các câu hỏi sử dụng `chapterCode` và `topicCode` theo mã danh mục KNTT.
   - Khi tiến hành nhập liệu thật vào database (Production/Staging), đội ngũ kỹ thuật cần chạy script tạo hoặc ánh xạ các bản ghi `SkillNode` trong bảng cơ sở dữ liệu thật với UUID tương ứng, sau đó mới insert vào bảng `Question`.
3. **Hình ảnh & Tài nguyên đồ họa**:
   - Các câu hỏi có hình minh họa trong `review-required.csv` cần được đội ngũ biên tập đồ họa chuyển thành mã vector SVG hoặc ảnh PNG độ nét cao lưu vào thư mục tài sản tĩnh trước khi đưa vào kho chính thức.
