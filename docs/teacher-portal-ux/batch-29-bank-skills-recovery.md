# Batch29 — Phục hồi danh sách chuyên đề độc lập
P1: curriculum skills lỗi chỉ có message chung, không retry; label update có thể xóa lỗi đó, và topic picker không phân biệt thiếu dữ liệu. Thêm skillsError/loading/loadSkills riêng, retry chuyên đề tại trang; chỉ khóa chỉnh topic khi thiếu dữ liệu, vẫn xem câu/đổi difficulty. Giữ quyền tác giả/admin.
QuestionBankView.jsx; verify-teacher-bank-labels.mjs.
Một lần cập nhật nhầm path làm component chứa script tạm thời; đã phát hiện qua rg, khôi phục component đầy đủ trước build/test. Không giữ test code trong sản phẩm. Build đạt sau khôi phục; bank-labels đạt gồm skills503/retry, save retry, quyền và filtered-last-item. Chạy density/axe sau thay đổi để kiểm chứng rendering. No real writes.
Evidence teacher-bank-labels/verification.json. Chưa có baseline screenshots cùng trạng thái skills-error, không tuyên bố before/after. Goal vẫn active, cần review toàn diện cuối và coverage các state còn thiếu.
