# Teacher Portal — UX foundation

## Phạm vi và nhận diện

Giữ Manrope, xanh #087f62, nền #f3f6f3 và chữ #20372d hiện có. Không thêm framework/dependency. Foundation nằm tại `src/components/teacher-foundation.css`; token chỉ có scope `.teacher-workspace`.

## Ba lớp token

Primitive `--tp-green-700`, `--tp-space-4`, `--tp-text-body` → semantic `--tp-action`, `--tp-surface`, `--tp-border` → component `--tp-panel-padding`, `--tp-control-height`, `--tp-list-gap`. Alias `--tw-*` giữ tương thích CSS hiện tại. Thành phần mới dùng token thay vì thêm root toàn cục.

## Ranh giới component

- TeacherWorkspace: route, tải dữ liệu, quyền và thao tác API.
- TeacherListControls: pager dùng chung, tìm không dấu; không tải dữ liệu hoặc thay quyền.
- TeacherStudentList: tìm và phân trang thành viên/sổ điểm, nhận columns/renderRow để tái sử dụng; xuất CSV ở cha luôn gồm toàn bộ dữ liệu.
- AssignmentResultsPanel: tổng quan + danh sách bài nộp.
- AssignmentAnalyticsPanel: tìm nguyên nhân theo câu/kiến thức.
- ReportPublishReview: kiểm tra trước hành động ghi.
- TeacherExamComposer: chọn nguồn và quản lý câu; không thay ma trận hay logic chấm trong thay đổi UX.

## Luồng và bố cục

Tổng quan → lớp → bài giao → báo cáo → bài học sinh. Thư viện → mở kết quả/đáp án trực tiếp trên từng bài; “Thao tác khác” chứa thiết lập, dùng lại và xóa. Tạo đề → nguồn câu hỏi → thiết lập lớp nhận → xem trước → xác nhận giao.

Desktop 1440: danh sách và vùng thao tác cạnh nhau. Tablet 820: preview bài đang chọn trước danh sách, không phải ở cuối trang dài. Mobile 390: một cột, folder cuộn ngang; preview tự vào vùng nhìn khi chọn bài. Bảng rộng có vùng cuộn riêng; tiêu đề và tên học sinh cố định trong vùng cuộn. Không khóa cuộn trang để giả vờ giảm độ dài.

## Quy ước danh sách

10 mục/trang, reset về trang 1 khi đổi tìm kiếm/bộ lọc; thông báo khoảng hiện tại và tổng số; nút trang trước/sau 44px, nhãn hỗ trợ đọc màn hình. Trạng thái không có kết quả có cách xóa lọc; trạng thái lỗi tải có thử lại, không hiển thị như dữ liệu trống. Mọi chức năng vẫn truy cập được qua trang tiếp theo.

## Trạng thái và khả năng tiếp cận

Primary: xanh, chữ trắng; secondary: surface và border; destructive: nhãn/hộp xác nhận rõ hậu quả; disabled giải thích điều kiện cạnh hành động. Focus ring 3px, thông báo lỗi role=alert, tiến độ role=status. Dialog đóng bằng Escape và giữ Tab nội bộ. Số liệu chưa có hiển thị —, không gán 0. Dữ liệu thử nghiệm chỉ ở tests/fixtures và browser interception.

## Giới hạn đang xử lý

CSS cũ vẫn còn hardcode và override; chưa tuyên bố đã migrate toàn bộ. Theme light/dark/system là mặc định cho site mới trong persona, không tự thêm vào portal hiện hữu ở đợt UX này. Kiểm tra soạn đề populated/error/upload/reuse và các trạng thái report edit/regrade cần đợt tiếp theo trước khi hoàn tất mục tiêu toàn Teacher Portal.

## Cập nhật component hiện tại
TeacherOverview dành cho công việc gần đây và lớp; TeacherClassDirectory tìm/lọc lớp; TeacherLibrary hiển thị bài và hành động trực tiếp. TeacherWorkspace giữ state tìm kiếm, page và pageSize thư viện để report/back không mất ngữ cảnh. Mặc định5 trên điện thoại/10 trên màn lớn, cho chọn5/10/20. Danh sách thiếu dữ liệu phải nói “chưa tải đủ”, không giả định chưa tồn tại.

## Lệnh hồi quy giao diện
`node scripts/verify-teacher-regression.mjs` chạy36 nhóm tuần tự và ghi `docs/evidence/teacher-regression/latest.json`. Cần dev server3000 hoạt động; các endpoint được intercept fixture, không thay thế kiểm chứng backend hoặc dữ liệu thật. Lỗi ở bất kỳ nhóm nào làm lệnh exit1; manifest có stdout/stderr và thời gian để xác minh kết quả.

Kiểm tra bổ sung hộp mật khẩu: `node scripts/verify-teacher-password-recovery.mjs` (API auth được intercept, không đổi mật khẩu thật). Kết luận bàn giao: completion-audit.md.
