> Đợt UX đã hoàn tất kiểm chứng theo phạm vi trong [completion-audit.md](completion-audit.md), ngày2026-10-18. Các mục “còn lại” bên dưới ghi trạng thái lịch sử; đối chiếu completion audit để xem kết luận và giới hạn cuối.

# Đối chiếu yêu cầu và bằng chứng — 2026-10-18

Phạm vi giữ nguyên: toàn bộ Teacher Portal, các luồng lồng nhau và trạng thái quan trọng. Goal đang thực hiện. Đây là đối chiếu bằng chứng, không phải tuyên bố hoàn tất.

| Yêu cầu gốc | Bằng chứng hiện tại | Đánh giá và giới hạn |
|---|---|---|
| Audit toàn portal, IA, hierarchy, density | backlog.md; 69 trạng thái trong docs/evidence/teacher-portal-product/accessibility-gate-20261018.json | Đã đọc kết quả: 0 pageerror, 0 tràn trang, 0 phát hiện axe trong rules/subtree chạy. Không bao phủ mọi tổ hợp lỗi endpoint. |
| Workflow-first và actionable analytics | AssignmentResultsPanel, AssignmentAnalyticsPanel; verify-assignment-report-ux | Kết quả tổng quan, phân tích câu và chi tiết học sinh có vai trò riêng; 19/31 dưới 5 được tính từ fixture, không phải dữ liệu sản xuất. |
| Progressive disclosure và mật độ | batch25/30/33/35; paper-navigation, question-roster, class-directory, overview-priority | Đề 22 câu thu gọn/jump; roster tìm/phân trang; công việc cần xử lý trước lịch sử. Có browser evidence riêng. |
| Design system, giữ thương hiệu | design-system.md; teacher-foundation.css; TeacherListControls.jsx | Tokens có scope, component dùng chung, không dependency mới. CSS cũ chưa chuyển toàn bộ; cần review nhất quán cuối. |
| Soạn/giao đề end-to-end | composer-flow, draft-reuse, manual-json, generation | Validation, các nguồn, lỗi và giữ bản nháp được intercept kiểm chứng; không chứng minh AI/upload thật. |
| Quản lý lớp | class-management, class-directory | Tạo lỗi/retry, mã mời, trạng thái, thu hồi, tìm và giữ trang được kiểm chứng. Clipboard hệ điều hành chưa có kiểm tra riêng. |
| Ngân hàng câu hỏi | bank-labels; batch27–29/37 | Lỗi tải kỹ năng độc lập, chỉnh nhãn lỗi/retry, quyền UI, cập nhật lọc và response shape. Backend quyền chỉ được đối chiếu nguồn, không coi là integration test. |
| Quản lý bài, chấm và công bố | settings, regrade-ux, publish-review-navigation | Giữ form khi lỗi; preview trước regrade; xác nhận công bố; CSV kiểm tra đủ 35 dòng. Chưa mở CSV bằng ứng dụng bảng tính. |
| Navigation và dữ liệu bất đồng bộ | report-navigation, report-race, independent-loads, partial-load | Loại response cũ; quay lại giữ context; tải lỗi một phần không làm mất phần thành công. Timing test independent-loads chỉ desktop, không gán 3 viewport. |
| Account dialogs | account, sessions; batch38–39 | Escape xóa/mask mật khẩu; phiên lỗi/retry/rỗng, lỗi thu hồi, hủy logout. Success revoke phiên khác, logout phiên hiện tại và logout tất cả đã kiểm chứng fixture riêng ở batch41/44. |
| Responsive, keyboard, accessibility | 69-state audit; keyboard; mobile-overlays; các script workflow | Desktop1440×900, tablet820×1000, mobile390×844; một số kiểm tra360×640. Axe không thay thế screen reader; cần review trực quan toàn interface cuối. |
| Before/after cùng viewport | before.json; accessibility-final.json; baseline-pair-coverage.json | Đã kiểm tra 69/69 cặp theo trang/trạng thái/viewport và kích thước PNG thực. Đây là coverage audit gốc; một số microstate bổ sung về sau vẫn thiếu ảnh trước riêng, không dựng lại ảnh quá khứ. |
| Không đổi nghiệp vụ/quyền/ma trận, không mất tính năng | source components + suite fixture + báo cáo từng batch | Chưa có bằng chứng đủ để khẳng định mọi khả năng không regression. Không ghi dữ liệu thật trong browser suite. |
| Báo cáo từng batch P0/P1/P2 | backlog.md; batch01–39 | Đã có finding, thay đổi, kiểm chứng và giới hạn; chi tiết mức độ không đồng đều. |

## Việc còn lại theo ưu tiên

1. Account success và accessibility đã có kiểm chứng ở batch41/44; đối chiếu các capability và nested views còn thiếu bằng chứng.
2. Review trực quan cuối các trang chính, report, soạn đề và dialog trên ba viewport, đối chiếu hierarchy/overlap/sticky; không suy chất lượng trực quan chỉ từ assertion.
3. Đối chiếu danh mục capability với UI hiện tại; cập nhật backlog đóng/mở rõ ràng và báo cáo bàn giao. Ghi thiếu baseline lịch sử như hạn chế chưa giải quyết.

Bộ hồi quy hiện gồm 35 script; kết quả có thời gian và stdout/stderr tại docs/evidence/teacher-regression/latest.json. Chỉ dùng manifest đã kết thúc để báo số nhóm đạt.

## Cập nhật sau batch48

- Skills không có câu đủ điều kiện tổng hợp: empty-state riêng, ảnh trước/sau và browser checks ba viewport (batch46).
- Student review: nhật ký thu gọn không mất30 lượt, bộ lọc không kết luận tất cả đúng từ bài chờ chấm, tám trạng thái đáp án và điều hướng câu đã kiểm chứng (batch45/47/48).
- Student dialog: tăng tương phản hướng dẫn và thời điểm nộp; ba scoped axe scans đạt sau sửa. Đã xem ảnh toàn viewport desktop/tablet/mobile của bài hỗn hợp; không suy kiểm chứng tính điểm từ fixture trình bày.
- Danh mục chức năng hiện tại và giới hạn bằng chứng ở capability-inventory.md.
