# Không gian giáo viên Math

## Phạm vi đã triển khai

- Menu: Tổng quan, Lớp học, Thư viện đề, Ngân hàng câu hỏi.
- Tạo lớp, chuyển lớp, quản lý mã mời và thu hồi mã.
- Trong lớp: Tổng quan, Bài tập, Học sinh, Sổ điểm, Tiến độ kỹ năng.
- Danh sách bài có tìm kiếm, trạng thái, thư mục/chuyên đề, tiến độ nộp và bảng thông tin bài được chọn.
- Trình soạn ba bước dùng lại ngân hàng, soạn thủ công, AI từ tài liệu và nhập JSON hiện có. Lưu nháp trên máy chủ, phát hành và dùng lại đề cho một lớp khác.
- Báo cáo bài: danh sách học sinh, phổ điểm, thời gian, chi tiết bài làm và xuất CSV.
- Phân tích từng câu: sắp xếp đúng/sai nhiều nhất, đúng/sai/bỏ trống, phân bố A–D, từng ý đúng/sai, các câu trả lời ngắn và danh sách học sinh tương ứng.
- Sổ điểm tổng hợp bài đã giao; bấm điểm mở bài làm học sinh. Tiến độ kỹ năng là tỷ lệ quan sát từ bài giao, không phải ước lượng thành thạo.
- Hệ thống tự chấm. Điểm và đáp án/lời giải có quyền hiển thị riêng. Có công bố ngay, sau hạn nộp hoặc giáo viên chủ động công bố; đóng nhận bài độc lập với công bố.
- Sửa đề/đáp án của lần giao, xem trước điểm cũ–mới, xác nhận chấm lại và lưu lịch sử. Cho phép thay trọng số, cho toàn bộ điểm câu lỗi hoặc loại câu và quy đổi thang 10.
- Nội dung đề bị khóa khi có người bắt đầu. Snapshot bảo vệ đề đã giao khỏi thay đổi ở ngân hàng/lớp khác. Sửa đáp án vẫn được; mọi bài nộp tiếp theo dùng đáp án mới.
- Bài kiểm tra ghi nhận trang bị ẩn/hiện, tách tải lại trang, lưu sự kiện lên máy chủ và đếm idempotent. Có hàng đợi cục bộ để thử lại khi lỗi mạng. Nhật ký có thời điểm và thời lượng; lượt chưa quay lại được đánh dấu. Đây là dữ liệu tham khảo, không kết luận gian lận.

## Kiểm tra

- `npm run build`, `npm run build:api`, `npm run typecheck`.
- 6 kiểm tra frontend helpers, 11 kiểm tra chấm ba dạng câu, 5 kiểm tra quy tắc workspace, 12 kiểm tra tích hợp assignment hiện có đều đạt.
- `node scripts/verify-teacher-workspace.mjs` tạo database QA UTF-8 riêng trên Postgres local, áp dụng toàn bộ migrations, tạo giáo viên/học sinh thử nghiệm và kiểm tra API + Chrome desktop/mobile.
- Browser QA kiểm tra sửa đáp án → xem trước → áp dụng từ UI, chuyển tab thật và tải lại bài của học sinh; không dùng dữ liệu API giả. Kết quả tại `docs/evidence/teacher-workspace/report.json`.
- Kiểm tra accessibility bằng axe cho màn thư viện: không có vi phạm theo phạm vi kiểm tra. Các màn khác được kiểm tra thao tác và hiển thị, không coi là đã audit accessibility toàn bộ.

## Dữ liệu và vận hành

- Migration: `20261017090000_teacher_workspace`. Bổ sung settings/revision cho lần giao, snapshot cho câu trong đề và activityEvents cho bài làm. Migration backfill snapshot từ dữ liệu hiện có.
- Schema local `adaptivemath_test` trước đó không có lịch sử Prisma migrations. Đã áp dụng riêng SQL của migration mới bằng transaction, giữ nguyên dữ liệu hiện có. Không chạy lại migration này bằng tay trên cùng database.
- API local đã được khởi động lại; frontend ở `http://127.0.0.1:3000`. Chưa triển khai production.
- Công bố hoặc tính lại điểm chỉ cho giáo viên phụ trách. Admin chỉ xem. Học sinh không đọc được báo cáo giáo viên hoặc điểm chưa công bố qua list/submit/result.

## Phần chưa triển khai trong đợt này

- Giao đồng thời nhiều lớp trong một thao tác, giao theo nhóm/cá nhân và tự tạo bài củng cố theo nhóm.
- Thêm/xóa cấu trúc câu trong đề đã lưu: có thể dùng lại đề để tạo bản mới; màn sửa tại chỗ giữ nguyên số lượng/loại câu.
- Chấm tự luận/ảnh, lịch học, trợ giảng, bảng tin và thông báo đẩy.
- Nhật ký trình duyệt không phát hiện được ứng dụng khác hoặc thiết bị thứ hai. Độ tin cậy vẫn phụ thuộc sự kiện trình duyệt/kết nối; dữ liệu không dùng để tự trừ điểm.

## Bổ sung theo phản hồi giao diện

- Radio chọn đáp án cố định 18px; ô nhập phương án chiếm phần rộng còn lại, đã kiểm tra ở viewport 866px.
- Tab **Đề từ tệp** nhận PDF, DOCX, PNG, JPEG, WebP tối đa 10 MB. Tệp được lưu riêng trong database, kiểm tra quyền theo giáo viên và thành viên lớp, không dùng đường dẫn công khai.
- Giáo viên tạo phiếu trả lời theo số lượng từng dạng câu và khai báo đáp án. Bấm **Áp dụng phiếu trả lời**, rồi thiết lập và giao bài như đề thông thường. Thay đổi đáp án chưa áp dụng sẽ vô hiệu hóa việc tiếp tục để tránh lưu đáp án cũ.
- Học sinh xem đề gốc bên trái và trả lời bên phải; trên điện thoại hai phần xếp dọc. Word chuyển thành HTML được lọc và hiển thị trong iframe sandbox. PDF phù hợp hơn nếu cần giữ chính xác bố cục và công thức.
- Migration `20261017100000_exam_documents` tạo kho tệp riêng. Đã áp dụng trên database local.
- MWAPI đã cấu hình bằng biến riêng `MATH_MWAPI_AUTH_TOKEN`, tránh token của công cụ lập trình ghi đè. Credential chỉ nằm trong file môi trường được gitignore. Hạn mức ngân sách hiện có vẫn giữ.
- Kiểm tra AI thực tế đã tạo đúng 3 câu thuộc ba dạng, HTTP 200, khoảng 6 giây; bằng chứng `docs/evidence/teacher-composer/ai-live.json`. Không tự phát hành đề thử.
- Giá token 1/5 USD mỗi triệu token trong cấu hình local là hệ số dự toán ngân sách theo model, chưa xác nhận là giá thanh toán của gói MWAPI.
