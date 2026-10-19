> Đợt UX đã hoàn tất kiểm chứng theo phạm vi trong [completion-audit.md](completion-audit.md), ngày2026-10-18. Các mục “còn lại” bên dưới ghi trạng thái lịch sử; đối chiếu completion audit để xem kết luận và giới hạn cuối.

# Teacher Portal — Backlog UX

Baseline: 69 trạng thái render tại 1440×900, 820×1000, 390×844. Dữ liệu fixture có kiểm soát, không ghi máy chủ. Bằng chứng: docs/evidence/teacher-portal-product/before.json.

| Ưu tiên | Màn / nguyên nhân | Ảnh hưởng | Giải pháp / trạng thái |
|---|---|---|---|
| P0 | Báo cáo: bảng dài, thiếu nối số liệu với hành động | Khó tìm học sinh và kiến thức cần hỗ trợ | Đợt 01 đã sửa và kiểm tra; xem batch-01-results.md |
| P1 | Thư viện: render 36 bài liên tục; preview nằm cuối ở màn nhỏ | Trang dài 5038px, chọn bài nhưng khó thấy thao tác | Phân trang 10 bài, đưa preview đang chọn cạnh/ trước danh sách trên màn nhỏ |
| P1 | Sổ điểm: render tất cả học sinh × bài giao | 3400px; khó tìm một học sinh | Tìm học sinh, phân trang, vùng cuộn có tiêu đề và tên cố định |
| P1 | Thành viên lớp: không tìm kiếm/phân trang | Tốn thời gian tìm tài khoản để hỗ trợ | Thành phần danh sách có tìm không dấu, phân trang |
| P1 | Ngân hàng: 30 câu/trang, metadata dài | 5651px trên mobile | 10 câu/trang, pager và trạng thái trống/thử lại thống nhất |
| P1 | Lỗi tải lớp: có thể hiện empty-state gây hiểu nhầm | Người dùng tưởng dữ liệu không tồn tại | Tách lỗi tải và trống, có Thử lại |
| P1 | CSS có nhiều lớp override toàn cục | Thay một component có thể ảnh hưởng cha | Token Teacher Portal và component bố cục/phân trang có scope rõ |
| P1 | Soạn đề: cần rà từng phương thức và bước giao | Có thể mất ngữ cảnh, dài hoặc khó biết điều kiện tiếp tục | Audit picker/bank/manual/document/JSON/AI đã có baseline; tiếp tục kiểm tra populated/validation/recovery |
| P2 | Các badge/form/table chưa có spec trạng thái chung | Khó duy trì nhất quán | Ghi design-system và component contracts, giữ thương hiệu xanh hiện tại |

Không thay ma trận, quy tắc chấm, dữ liệu hay quyền API. Chưa thêm theme toggle: yêu cầu mặc định của persona áp dụng site mới; đây là nâng cấp portal có sẵn, ưu tiên hoàn thành UX lõi và bảo toàn nhận diện.

## Đợt kiểm chứng bổ sung
- Batch 03–05: điều kiện tiếp tục/giao bài, tải và thay tài liệu, khôi phục bản nháp và dùng lại đề. Xem báo cáo tương ứng.
- Batch 06: sửa đáp án có xem trước tăng/giảm/giữ điểm, phân trang và khôi phục lỗi.
- Batch 07–08: preview đáp án thủ công, JSON sai/trùng, AI bổ sung không xóa câu đang sửa; xác nhận thay đề ngẫu nhiên.
- Batch 09: mã mời tạo lớp không biến mất, lỗi tải thành viên có retry, trạng thái mã và xác nhận thu hồi.

## Chưa đủ bằng chứng để kết thúc goal
- Chưa có before/after cùng trạng thái cho một số batch mới; cần ghi rõ lỗ hổng bằng chứng, không dựng ảnh baseline giả.
- Kiểm chứng rộng accessibility/keyboard cho các workflow còn lại và kiểm tra hồi quy chung sau các batch.
- Thiết lập/xóa/CSV và chuyển ngữ cảnh đã có kiểm chứng tương tác trong settings/report-navigation/report-race; xem requirements-evidence.md để phân biệt phần đạt và giới hạn còn lại.
- Browser fixture không chứng minh dịch vụ AI, thuật toán chọn câu, tính điểm và quyền máy chủ; không thay logic này trong công việc UX.

## Cập nhật kiểm chứng 2026-10-18
25/25 nhóm hồi quy UI đạt sau batch39 (latest.json có timestamp/stdout/stderr). Bao gồm account và sessions. Audit69 trạng thái không phát hiện pageerror, tràn trang hoặc vi phạm axe trong phạm vi chạy. Chưa đủ chứng minh hoàn tất toàn sản phẩm; ưu tiên tiếp: success revoke/logout fixture, account accessibility và review trực quan cuối.
