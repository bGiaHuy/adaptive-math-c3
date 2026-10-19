# Đợt 02 — Danh sách và nền tảng dùng chung

## UX issues

P1: thư viện render toàn bộ bài, sổ điểm/thành viên render toàn bộ học sinh; ngân hàng 30 câu/trang; lỗi tải lớp dễ bị hiểu nhầm là không có lớp. Root cause là thiếu cơ chế danh sách dùng chung và ranh giới trạng thái.

## Implemented

TeacherPagination thống nhất 10 mục/trang, tên nút rõ và vùng bấm 44px. TeacherStudentList dùng chung tìm không dấu/phân trang cho thành viên và sổ điểm. Thư viện tìm không dấu, phân trang và xóa lọc khi trống. Preview của bài đã chọn lên trước danh sách ở tablet/mobile. Ngân hàng 10 câu/trang. Lỗi tải lớp có thông báo và thử lại riêng.

Thêm teacher-foundation.css với token scoped ba lớp; xem design-system.md. Không đổi nhận diện, ma trận đề, dữ liệu, quyền hoặc logic chấm. Xuất CSV vẫn lấy toàn bộ dữ liệu, không chỉ trang hiện tại.

## Verification

Baseline và after: docs/evidence/teacher-portal-product/{before,after}.json và ảnh cùng tên/kích thước 1440×900, 820×1000, 390×844. Browser dùng fixture qua interception, không ghi dữ liệu máy chủ. Kiểm tra tương tác tại list-interactions.json: trang trước/sau thư viện, tìm không dấu + lọc trạng thái, tìm học sinh, phân trang sổ điểm và ngân hàng. Regression báo cáo tại docs/evidence/assignment-report-ux/verification.json. Build đạt.

Lưu ý baseline ban đầu có một số ảnh mobile bắt vào trạng thái đang tải thay vì populated. Không dùng các ảnh đó để khẳng định giảm chiều dài. Script after đã bổ sung chờ render nội dung và thành viên/sổ điểm. Các số desktop baseline có nội dung đã render cho thấy thư viện 5038px, sổ điểm 3400px, ngân hàng 3845px. Dùng after.json mới nhất để đối chiếu.

## Remaining / next

Tiếp tục P1 soạn đề theo từng phương thức: populated, nhập sai, upload lỗi, giữ bản nháp, bước giao và dùng lại đề. Rà đề/đáp án và chỉnh sửa/tính lại điểm vẫn cần kiểm tra chi tiết. Goal toàn Teacher Portal còn active; không kết luận hoàn tất chỉ từ build hay các kiểm tra đợt danh sách.
