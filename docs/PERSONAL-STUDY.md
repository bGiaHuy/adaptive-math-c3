# Ôn kiến thức Math

Học sinh mở **Ôn kiến thức**, thêm câu từ sổ lỗi vào lịch ôn. Mức nhớ tính cho câu đã luyện, không thay thế điểm IRT hoặc chứng minh thành thạo toàn bộ dạng toán. Thống kê lỗi nhóm theo skill của câu hỏi, lấy tối đa 1.000 câu từ mỗi nguồn kiểm tra chẩn đoán đã hoàn thành / bài lớp đã nộp trong 30 ngày. Góp ý AI dựa trên câu ôn, cách suy nghĩ học sinh và nhóm lỗi thật; không fine-tune.

Lịch dùng ts-fsrs 5.4.2, retention 0.9, không fuzz, tối đa 365 ngày. “Nhớ vững”: tối thiểu ba lượt nhớ, trạng thái Review, stability ≥ 7 ngày và retrievability ≥ 0.8. “Hay quên”: từng có ít nhất hai lượt Again. Sai đáp án bắt buộc Again. Review có phiên bản và hạn 20 phút, ngăn ghi trùng. Chưa tối ưu tham số FSRS riêng theo người học và chưa đồng bộ Anki.

## Triển khai

1. Đảm bảo database đang có đầy đủ schema Math hiện hữu, gồm ClassroomAssignment / AssignmentSubmission / SubmissionAnswer. Lịch sử migration cũ chưa mô tả hết schema này; không chạy reset hoặc dùng db push vào database khách hàng để giải quyết chênh lệch. Cần đối chiếu và baseline trước khi dùng migrate deploy nếu site trước đó được triển khai bằng db push.
2. Áp dụng migration `20261006183000_math_review` (chỉ thêm AiRequest, MathReviewCard, MathReviewLog), generate Prisma, build API/web. Database local test đã cập nhật; database deploy chưa thay đổi.
3. Khai báo các biến AI trong `apps/api/.env.example` ở môi trường backend. MWAPI dùng `AI_PROVIDER=mwapi`, `ANTHROPIC_AUTH_TOKEN` và đơn giá hiệu dụng của tài khoản; endpoint cố định `/v1/messages`. Không đưa khóa vào VITE hoặc frontend. Mặc định AI tắt; lịch ôn và lời giải vẫn dùng được.
4. Math có ledger ngân sách riêng. Nếu cùng khóa trả trước với English, chia tổng hạn mức lifetime của hai site sao cho không vượt số dư (ví dụ 45 USD mỗi site cho ngân sách sử dụng 90 USD). Các hạn mức từng site không tự biết chi tiêu của site kia hoặc ứng dụng khác; nên đặt giới hạn chung phía provider.

Các endpoint mới chỉ cho học sinh xem thẻ/lượt của chính mình. Sổ lỗi, ôn tập và AI tạm khóa khi có diagnostic IN_PROGRESS trên server. Chưa có cơ chế khóa phiên bài lớp đang làm ở schema Math hiện tại; muốn áp dụng tương tự phải bổ sung session bài lớp đáng tin cậy ở server. LLM chỉ gọi khi học sinh bấm góp ý sau khi mở đáp án; token/cost được ghi nhận và admission budget được khóa transaction.

Tham khảo: [Anki FSRS](https://docs.ankiweb.net/deck-options.html), [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs).
