# Batch33 — Danh sách nhiều lớp
P1 scalability/density: class directory render mọi lớp liên tục. Tái sử dụng TeacherPagination10/page khi>10; tìm/lọc resetpage, clamp khi số kết quả giảm. Dữ liệu ít<=10 không thêm pager dư. Không bỏ lớp, số thành viên hoặc hành động mở lớp/tạo lớp.
Files TeacherClassDirectory.jsx; verify-teacher-class-directory.mjs.
Chrome fixture23classes tại1440×900/820×1000/390×844: đủ10/10/3; search không dấu từpage3 ra đúng9A23; không overflow/pageerror. Build đạt. Evidence teacher-class-directory/verification.json và search-*.png. Chưa có baseline cùng23classes cho before/after nên không đo chiều cao giảm. Không ghi máy chủ. Goal vẫnactive; đây là phần class-list density thuộc scope gốc, không thay quyền/API.
