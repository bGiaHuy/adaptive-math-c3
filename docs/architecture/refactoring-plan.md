# Kế hoạch chuyển đổi an toàn

## Ranh giới hoàn thành hiện tại

Giai đoạn A hoàn tất kiểm kê nền tảng và baseline; B hoàn tất thiết kế phù hợp repo; C hoàn tất checker/lint/format/typecheck/CI nền tảng; D hoàn tất ba thay đổi quyền sở hữu có shim; E hoàn tất gói bàn giao; F hoàn tất fixture đối kháng và chạy kiểm tra cuối.
Toàn bộ migration sản phẩm mới hoàn tất một phần: UI/service lớn và test cũ vẫn còn. Dừng ở ranh giới nền tảng có thể kiểm chứng, không viết lại nghiệp vụ để đạt cảm giác hoàn tất.

## Trình tự còn lại

1. C3-01 (Codex): sửa baseline THPT và test integration sau khi xác định hợp đồng grade/pause, thêm bảo vệ snapshot thật.
2. C3-02 (Antigravity): tách phần trình bày báo cáo, không chuyển controller state trong bước này.
3. C3-03 (Antigravity): chuyển helper sắp xếp đề sang feature với shim, không đổi dữ liệu hiển thị.
4. C3-04 (Codex): tách read projection khỏi TeacherWorkspaceService sau khi C3-01 đạt.
5. C3-05 (Codex): xác minh cấu hình triển khai C3, không tự nối repo mới vào hạ tầng Math cũ.

C3-02 và C3-03 có tập tệp không chồng lấn nên có thể làm song song. C3-01 và C3-04 tuần tự, không chạy đồng thời các thay đổi test cùng file. Không tự sinh task mới để lách phạm vi.

## Điều kiện trước mỗi thay đổi

Đọc AGENTS và policy; liệt kê consumer; chạy test liên quan trước; ghi nhận lỗi có sẵn; thêm characterization khi chạm nghiệp vụ chưa có bảo vệ. Làm một commit cho một thay đổi có thể revert. Không gộp việc sửa toán, UI, DB hoặc deploy vào refactor.

## Điều kiện nghiệm thu

Checker và test đối kháng đạt; typecheck/build đạt; test liên quan không giảm bảo vệ hoặc tăng failure. Báo cáo suite toàn phần chính xác ngay cả khi đỏ. Không cho phép giảm test hoặc sửa grade/pause một cách cơ học để báo xanh. Tệp mới theo Prettier; vùng legacy chỉ format khi có task riêng.

Rollback bằng revert đúng commit, giữ shim đến khi mọi consumer được xác minh. Không reset cứng hoặc xóa nháp người dùng. Không có rollback DB vì đợt nền tảng không thay schema/data.
