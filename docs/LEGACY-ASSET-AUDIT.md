# Legacy Asset Audit — AdaptiveMath THCS 2026

## Kết luận

Kho `C:\Users\Administrator\Downloads\KHKT_hòa bình` có mã nguồn website cũ và học liệu có thể kế thừa, nhưng không có GraphRAG. “Cây tri thức” trong bản cũ là mô hình hiển thị độ vững theo chủ đề, không phải knowledge graph và không có retrieval, embedding, vector database hay LLM.

## Quyết định theo thành phần

| Thành phần | Nguồn legacy | Quyết định | Cách sử dụng trong kiến trúc hiện tại |
|---|---|---|---|
| IRT 3PL + MAP | `js/core/irt.js` | PORT | Đã chuyển thành ES module `src/lib/irt.js` và dùng để ước lượng θ trong diagnostic prototype. |
| CAT | `js/core/cat.js` | REWRITE | Giữ nguyên nguyên lý chọn câu theo thông tin; triển khai phía API để đảm bảo session, timeout và idempotency. |
| BKT | `js/core/bkt.js` | PORT LATER | Công thức có thể tái sử dụng, nhưng trạng thái mastery phải do backend sở hữu trước khi nối vào UI. |
| SM-2/SRS | `js/core/srs.js` | PORT LATER | Phù hợp cho lịch ôn, cần schema reviewSchedule và timezone rõ ràng. |
| Learning path | `js/core/pathGenerator.js` | REWRITE | Có giá trị tham khảo về trọng số; không bê nguyên vì phụ thuộc localStorage và dữ liệu client. |
| Cây tri thức | `js/core/treeStability.js` | REUSE CONCEPT | Dùng như visualization của mastery/stability; không gọi là GraphRAG. |
| 1.472 câu hỏi / 92 chủ đề | `data/questions.js`, `js/core/topics.js` | MIGRATE AFTER REVIEW | Viết pipeline import, kiểm tra trùng lặp, chuẩn hóa level/IRT và maker-checker trước khi publish. |
| Firebase Auth/Firestore | `js/core/auth.js`, `firestore.rules` | REJECT | Không phù hợp kiến trúc API, session cookie và RBAC mới. |
| Firebase client config | `js/core/firebaseClient.js` | REJECT | Không sao chép credential/config dự án cũ. |

## Rủi ro dữ liệu

- Nhãn `status: ok` chỉ phản ánh kiểm tra kỹ thuật, không chứng minh nội dung đã được giáo viên thẩm định.
- Tham số IRT của ngân hàng cũ được gán theo mức độ, chưa được hiệu chuẩn bằng dữ liệu học sinh thật.
- Trước khi import phải có mapping ID bất biến, báo cáo duplicate, kiểm tra đáp án và trạng thái `DRAFT → IN_REVIEW → PUBLISHED`.
- Không đưa toàn bộ ngân hàng vào bundle frontend. Nội dung đã publish phải được phân trang và phục vụ qua API.

## Phạm vi đã áp dụng

- Port thuật toán IRT 3PL/MAP sang frontend prototype để thay phép cộng/trừ θ cố định.
- Giữ ngân hàng câu hỏi và BKT/SRS ở trạng thái chưa tích hợp cho tới khi backend contract và content review hoàn tất.

