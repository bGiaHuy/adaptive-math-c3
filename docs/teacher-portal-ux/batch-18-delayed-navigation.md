# Batch18 — Phản hồi cũ khi chuyển báo cáo

Xác minh rủi ro P1 của batch17 bằng phản hồi được giữ chủ động, không dùng timeout suy đoán. scripts/verify-teacher-report-race.mjs giữ request submissions đến khi test giải phóng. Tại1440×900,820×1000,390×844: mở báo cáo đang chờ rồi quay lại; phản hồi cũ về không mở lại report. Mở bài khác khi request cũ còn chờ; giải phóng request cũ không thay h1 bài mới hoặc tự mở học sinh. 6 response đã giải phóng, 6 checks đạt, không pageerror. Không cần thay cancellation logic vì bằng chứng xác nhận đúng.
Evidence docs/evidence/teacher-report-race/verification.json; new-report-{desktop,tablet,mobile}.png. Dữ liệu fixture, không ghi máy chủ. Đây chỉ chứng minh report navigation; không suy rộng ra tất cả async actions. Quét69 trạng thái authoritative đang chạy riêng.

## Quét toàn portal hiện tại
Đã sửa entrypoint mở dialog audit từ overview sang classes vì overview mới dùng nút icon có tên truy cập thay vì text cũ. Rerun accessibility-current hoàn tất69 trạng thái: không overflow/pageerror/axe violations trong subtree/rules đã chọn. JSON/ảnh tại docs/evidence/teacher-portal-product/accessibility-current*.
Kết quả không chứng minh tối ưu UX: thư viện mobile3478px, bài lớp3728px, overview2615px, analytics2996px. Bố cục thư viện mới thay đổi chiều cao, cần xử lý mật độ/paging với ảnh hiện tại làm baseline trước/sau. Không dùng kết quả height cũ làm bằng chứng cho bản mới.
