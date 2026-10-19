# Batch21 — Hồi quy theo thư viện mới và trạng thái rỗng chưa tải đủ

Cập nhật verifier reuse/keyboard/class-management/partial-load/report-recovery theo TeacherLibrary và TeacherClassDirectory authoritative, không khôi phục selectors/layout cũ. Cùng mục tiêu tương tác cũ vẫn được kiểm tra.
P1: empty state TeacherLibrary mới có thể nói bắt đầu bài đầu tiên dù tải lỗi một phần. Hiện “Danh sách bài chưa tải đầy đủ” và hướng dẫn retry trong trường hợp incomplete; không suy dữ liệu không tồn tại.

Files TeacherLibrary.jsx; scripts/verify-teacher-{draft-reuse,keyboard,class-management,partial-load,report-recovery}.mjs.
Máy chủ dev cũ không còn handle và kết nối3000 refused; đã khởi động lại Vite (không restart từ một timeout quan sát). Các lần connection-refused không tính là UX pass. Sau khi runtime ready, chạy lại5 nhóm report-recovery/class-management/composer-flow/draft-reuse/keyboard đều exit0, không pageerror. Reuse22 câu, lớp mới, draft reload, file replace recovery, save failure/retry, invite create/revoke failure/retry, report503/retry, focus trap được kiểm tra trên React với API fixtures. Không ghi dữ liệu thật; controlled write counts chỉ là mock responses.

Artifacts: thư mục evidence tương ứng và verification.json được cập nhật. Partial-load đã chạy đạt ở turn trước sau selector cập nhật; không gán run mới chưa thực hiện. Cần build cuối cho lời empty mới và audit cuối/coverage requirement; goal vẫn active.
