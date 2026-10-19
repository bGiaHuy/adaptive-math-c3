# Batch 11 — Keyboard và kiểm tra accessibility rộng

## Phạm vi / issues
Quét React render tại 69 trạng thái của overview/classes/library/class tabs/bank/report tabs/dialog tạo lớp/composer các phương thức/empty/error/loading ở 1440×900, 820×1000, 390×844. Axe chỉ kiểm tra subtree teacher-workspace theo wcag2a/wcag2aa/wcag21aa; không tuyên bố tuân thủ toàn bộ WCAG hay kiểm chứng screen reader thực.
- P1, hộp tạo lớp: autoFocus chạy trước khi hook ghi trigger khiến đóng hộp mất tiêu điểm. Bỏ autofocus xung đột, để hook quản lý vòng focus.
- P1, modal: nền còn cuộn và trường hợp không còn control enabled có thể thoát focus. Hook khóa/khôi phục body scroll, fallback focus dialog và trap Tab khi controls trống.
- P1, tài liệu composer: small text contrast 4.37:1 ở desktop/tablet, dưới 4.5. Dùng token màu chữ phụ của portal.

## Changes
src/components/TeacherWorkspace.jsx; src/components/teacher-foundation.css; scripts/audit-teacher-portal-product.mjs thêm mode accessibility; scripts/verify-teacher-keyboard.mjs.
Không thay quyền hoặc nghiệp vụ.

## Evidence
Trước: docs/evidence/teacher-portal-product/accessibility.json và accessibility-*.png. Sau: accessibility-after.json và accessibility-after-*.png, cùng viewport/state.
Kiểm tra keyboard: create dialog Tab/Shift+Tab tuần hoàn, Escape trả trigger và scroll; delete Escape trả trigger không mutation; source radiogroup Home/End/arrows với một tab stop. docs/evidence/teacher-keyboard/verification.json.
Build và keyboard script exit 0. Quét 69 trạng thái sau không tràn ngang hoặc pageerror. Xem dữ liệu violations trong accessibility-after.json để kết luận phạm vi axe.

## Remaining / next
Bản audit chỉ chụp trạng thái ban đầu của một số form và không thay thế các kiểm thử populated batch khác. Còn trang dài trên mobile: bank 2601px, results 2714px, analytics 3900px. Cần đánh giá mật độ và vị trí điều khiển của toàn trang; có ảnh hiện trạng cùng viewport để so sánh batch kế tiếp. Backend/AI thật và screen reader thật không được chứng minh qua fixture. Goal vẫn active.
