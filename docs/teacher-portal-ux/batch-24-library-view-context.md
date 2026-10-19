# Batch24 — Giữ cách xem thư viện khi quay lại
P1 repeated-use friction: TeacherLibrary giữ view local nên mở report unmount rồi về mặc định grid, dù người dùng vừa chọn list. Đưa libraryView lên TeacherWorkspace cùng search/page/pageSize; view controlled, không lưu browser storage hay thay mặc định toàn sản phẩm.
Files TeacherLibrary.jsx, TeacherWorkspace.jsx, verify-teacher-library-density.mjs.
Chrome fixture1440×900,820×1000,390×844: chọn Danh sách, mở đề và quay lại giữ class tl-view-list, filter và pageSize; bài cuối trang8 vẫn tới được. Build và script exit0, không pageerror/overflow. Evidence teacher-library-density/verification.json. Layout không thay nên không có cặp ảnh mới; batch này là interaction state.
Còn lại: yêu cầu tổng thể chưa đủ before/after cho một số batch, cần final review phần báo cáo đề dài và các controls sticky trên bản mới. Không suy toàn goal hoàn tất từ một kiểm tra context. Goal active.
