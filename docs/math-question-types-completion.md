# Bàn giao ba dạng câu hỏi — local, 17/10/2026

## Đối chiếu yêu cầu

| Yêu cầu | Bằng chứng |
|---|---|
| SINGLE_CHOICE bốn phương án, TRUE_FALSE bốn ý, SHORT_ANSWER và chuẩn hóa số/phân số | math-question.ts; math-question-types.spec.ts; 118 kiểm thử backend đạt |
| Giáo viên soạn/chọn đủ ba dạng, lọc và xem trước | TeacherExamComposer.jsx; teacher-question-helpers.test.mjs (5 đạt); giáo viên tạo và giao đề Web từ ngân hàng qua UI |
| Mặc định 12–4–6, nhập số, mũi tên dọc, khôi phục mặc định, kiểm tra đủ số câu | UI desktop đã kiểm tra; UI mobile kiểm tra tăng trả lời ngắn 6→7 và reset; teacher-mobile-defaults.png; API đề 22 câu |
| Học sinh làm, tự lưu, khôi phục, đồng hồ và nộp/chấm | UI đề Web tải lại giữ SC/TF/SA và thời gian; nộp 7.5/10 khớp đáp án; API lưu/resume và chặn nháp sau nộp |
| Mobile ba dạng và phân số | UI QA Mobile trả lời SC, bốn ý TF và -12/2; kết quả 10/10, 3/3; student-mobile-taking.png, student-mobile-full-score.png |
| Giáo viên xem điểm trong lớp; không lộ đáp án trước nộp | Bảng điểm UI nhận 7.5/10; api.json kiểm tra student bank403, giáo viên lớp khác403, result trước nộp404 và take loại đáp án |
| Tương thích câu cũ, không tác động tiếng Anh | Migration additive; bộ118 tests gồm legacy; các pool thích ứng tiếp tục chỉ SINGLE_CHOICE; không đổi nội dung tiếng Anh |
| Nhập thử nguồn thật và các lô tối đa30 | 6 lô 3/30/1/22/22/21; provenance trang/câu và đáp án; dry-run/idempotency; api-default22.json |
| Mọi tài liệu có trạng thái hoặc lý do | math-import/source-inventory.json, review-queue.json và README.md: đủ12 nguồn gốc; không coi phần chưa đối chiếu là đã nhập |
| Local, không reset và không production | Importer giới hạn localhost; không chạy deploy; PostgreSQL khởi động lại cluster hiện có bằng pg_ctl |
| Build và kiểm thử cuối | 17/10: frontend/backend build đạt; backend18 files/118 tests đạt; teacher helpers5 đạt; git diff --check đạt |

## Ngân hàng và giới hạn bàn giao

Truy vấn database cuối xác nhận99 câu VERIFIED về nguồn, trạng thái DRAFT:71 SINGLE_CHOICE,10 TRUE_FALSE (40 ý),18 SHORT_ANSWER. Chưa xuất bản. Ba đề nguồn có đáp án được nhập; bảy chuyên đề nhập mẫu đã đối chiếu; hai bản scan thiếu đáp án và phần còn lại ghi rõ phạm vi cần rà soát. Không có số câu chính xác cho các trang chưa đối chiếu; không suy từ số trang.

Chấm mỗi câu chính trọng số bằng nhau, TF0.25 mỗi ý, điểm quy về10. Không áp dụng tỷ trọng3–4–3 của một số đề nguồn. Diagnostic/practice/review thích ứng giữ SINGLE_CHOICE cho đến khi hiệu chỉnh riêng. Không có connector Antigravity; prompt bổ sung đã lưu, tài liệu bổ sung chưa kiểm chứng vẫn ngoài ngân hàng.

Bằng chứng nằm docs/evidence/math-question-types. Frontend http://127.0.0.1:3000 và backend4000 đang chạy local. Dữ liệu học tập cũ được giữ nguyên. Thay đổi chưa commit được giữ trong checkout tích hợp; không tự commit/push/deploy.
