# Toán THPT Việt Nam — khung tổ chức học liệu

Ngày đối chiếu: 19/10/2026. Phạm vi: lớp 10, 11, 12; Chương trình GDPT 2018; bộ Kết nối tri thức với cuộc sống.

## Cách dùng kết quả

Chương trình quốc gia là chuẩn yêu cầu cần đạt; SGK Kết nối tri thức là chuẩn tổ chức chương/chủ đề của sản phẩm. Danh mục hiện tại gồm **9 + 9 + 6 = 24 chương SGK** và 3 chuyên đề học tập lựa chọn mỗi lớp. Các nhóm kiến thức trong catalog là cách tổ chức phục vụ sản phẩm, không tuyên bố chép chính xác mọi tên bài hoặc số tiết của sách. Mã KNTT là mã danh mục, không phải khóa ngoại database.

Ba mạch nội dung: Đại số và một số yếu tố giải tích; Hình học và đo lường; Thống kê và xác suất. Gắn năng lực tư duy/lập luận, mô hình hóa, giải quyết vấn đề, giao tiếp toán học và sử dụng công cụ; không đồng nhất mức nhận thức với độ khó.

## Danh mục

Nguồn dữ liệu dùng chung frontend/backend: `apps/api/src/modules/curriculum/thpt-catalog.ts`. Đã tách SGK chính và sách Chuyên đề học tập. Đặc biệt: tổ hợp thuộc lớp 10; mũ/lôgarit, giới hạn và đạo hàm cơ bản thuộc lớp 11; tích phân và xác suất có điều kiện thuộc lớp 12. Không đưa số phức từ chương trình cũ vào danh mục chính. Không dùng câu tuyển sinh lớp 10 làm câu THPT chỉ vì tiêu đề chứa “lớp 10”.

## Nguồn nghiên cứu và giới hạn kiểm chứng

1. Bộ GDĐT, Chương trình tổng thể GDPT 2018, bản hợp nhất: https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1483/vbhn-chuong-trinh-tong-the.pdf — căn cứ phân biệt THPT và chuyên đề lựa chọn; không dùng thay toàn bộ phụ lục yêu cầu môn Toán.
2. NXBGDVN, cổng tập huấn Toán 10: https://taphuan.nxbgd.vn/tap-huan/chi-tiet-sach/toan-10-tap-mot-939983973.939983973 — đầu mối SGK/SGV và tài liệu tập huấn.
3. Tài liệu giới thiệu Toán 10 của bộ Kết nối (bản lưu tại Iseebooks): https://api.iseebooks.vn/upload/Tap%20huan/Bo%20ket%20noi/Lop%2010/toan/slide.pdf — ba mạch kiến thức và cấu trúc sách. Nội dung giới thiệu của tác giả/NXB là nguồn gốc tài liệu, máy chủ lưu bản sao.
4. NXBGDVN, giới thiệu Toán 12: https://hcm.nxbgd.vn/bai-viet/infographic-gioi-thieu-sach-giao-khoa-toan-12-bo-sach-ket-noi-tri-thuc-voi-cuoc-song — nguồn nhà xuất bản.
5. NXBGDVN, cổng bộ sách: https://www.nxbgd.vn/chuyen-muc/bo-sach-ket-noi-tri-thuc-voi-cuoc-song — đối chiếu bộ sách, không thay chứng cứ từng bài.
6. Mục lục và bản giới thiệu sách chuyên đề 10/11/12 lưu tại TOANMATH: https://toanmath.com/2022/01/chuyen-de-hoc-tap-toan-10-ket-noi-tri-thuc-voi-cuoc-song.html ; https://toanmath.com/2022/12/chuyen-de-hoc-tap-toan-11-ket-noi-tri-thuc-voi-cuoc-song.html ; https://toanmath.com/2024/02/chuyen-de-hoc-tap-toan-12-ket-noi-tri-thuc-voi-cuoc-song.html — nguồn trung gian, cần xác nhận lại trên bản sách chính thức trước khi nhập câu.

Kết quả là khung phân loại ban đầu. Chưa xác minh toàn bộ trang mục lục của sáu tập SGK trên bản phát hành đang dùng năm học 2026–2027; một số PDF/cổng NXB không đọc được toàn bộ qua công cụ web. Antigravity phải ghi phiên bản, trang chứng cứ và báo mọi sai khác trước khi thu học liệu. Không suy diễn sách có thay đổi hay không chỉ từ ngày crawl của trang web.

## Form đề và dữ liệu cũ

Giữ form sản phẩm 22 câu: 12 lựa chọn + 4 đúng/sai + 6 trả lời ngắn; giữ hệ thống chấm, snapshot và audit. Đây là quyết định giữ form sản phẩm, không phải kết luận mọi bài kiểm tra THPT phải theo ma trận đó. Ma trận nội dung chẩn đoán cũ còn mã MATH9, bị tạm ngưng; cần xây dựng ma trận THPT và kiểm chứng riêng trước khi mở lại.

Kho THCS tạm ẩn bằng cờ LEGACY_BANK_PAUSED, không xóa bản ghi. API duyệt kho trả danh sách rỗng; API lấy đề ngẫu nhiên và khởi tạo luyện/chẩn đoán từ chối rõ ràng. Các đề đã giao tiếp tục qua luồng bài giao hiện có. Nhập đề thủ công/tài liệu vẫn giữ form. Chưa seed SkillNode THPT hoặc import đề mới.
