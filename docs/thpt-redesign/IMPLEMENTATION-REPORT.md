# Báo cáo triển khai giao diện và chuyển hướng Toán THPT

Ngày: 19/10/2026. Trạng thái: hoàn tất mã nguồn và kiểm thử cục bộ trong phạm vi dưới đây; chưa deploy, chưa nhập đề mới.

## Đã triển khai

- Dashboard học sinh mới theo Soft Pastel Bento: mint, baby pink, lavender, warm yellow; nền xám trắng; card 16–24px; khoảng cách theo 8px; shadow nhẹ; Poppins và font dự phòng tiếng Việt.
- Shell điều hướng sáng cho học sinh/giáo viên; icon cùng kích thước, nút tròn cho lịch và hành động phụ; hiển thị nhãn điều hướng; kiểu active/focus/hover/pressed và disabled.
- Tổng quan giáo viên dùng các khối thống kê pastel và vùng công việc có phân cấp; giữ các thao tác tạo lớp, soạn đề và xem bài giao.
- Bộ component tái sử dụng: BentoCard, BentoStat, RoundButton, BankNotice, CurriculumExplorer. Token và thông số xem DESIGN-SYSTEM.md.
- Danh mục chung 24 chương SGK lớp 10–12, chia chủ đề và tách sách Chuyên đề học tập. Tìm kiếm không dấu, chuyển lớp và thông báo không có kết quả. Danh mục hiện là tham khảo, chưa giả lập khả năng luyện bài.
- Lựa chọn lớp 10/11/12 và mục tiêu tốt nghiệp THPT trong onboarding; DTO backend chấp nhận khối mới; tạo lớp giáo viên cũng chuyển sang khối THPT. Sửa các thông tin giới thiệu còn nhắc THCS/92 bài/1.472 câu.
- Lịch học giữ nguồn dữ liệu tài khoản; bổ sung trạng thái đang tải, lỗi/thử lại; chỉ báo đồng bộ không khẳng định đã tải trước khi có kết quả.

## Tạm ngưng kho cũ và bảo toàn form

Cờ LEGACY_BANK_PAUSED nằm trong thpt-catalog.ts, có thể đảo lại sau khi hoàn thành học liệu. Cờ hiện áp dụng toàn bộ kho dùng chung trong bản C3; chưa tự mở riêng câu THPT mới nhập.

API duyệt kho trả danh sách rỗng, lấy đề ngẫu nhiên và khởi tạo luyện/chẩn đoán bị từ chối trước truy vấn dữ liệu. UI kho giáo viên/quản trị và các luồng học dựa trên câu cũ hiển thị danh mục THPT cùng thông báo tạm ngưng. Không xóa dữ liệu câu hỏi, SkillNode, lịch sử hay snapshot; không chạy seed/migration; đề đã giao tiếp tục qua luồng classroom hiện hữu.

Giữ form mặc định 12 lựa chọn + 4 đúng/sai + 6 trả lời ngắn và cơ chế chấm. Giữ trình soạn thủ công/tài liệu/AI hiện có; không sửa định dạng bài giao hoặc luồng cập nhật/chấm lại có kiểm tra sở hữu. QuestionDisplay và các ô đáp án xanh/viền đen không bị sửa. Mã danh mục KNTT không được gán vào khóa ngoại SkillNode: các mục API tham khảo có persisted:false và bị loại khỏi dropdown gán chuyên đề DB trong trình soạn thủ công.

Ma trận chẩn đoán nội dung MATH9 còn lưu để bảo toàn thuật toán và lịch sử nhưng đang bị ngưng sử dụng. Muốn mở luyện THPT phải nhập SkillNode/câu đã kiểm duyệt, xây ma trận THPT và kiểm tra lại trước khi tắt cờ. Chưa thực hiện bước này.

## Kiểm thử thực hiện

| Kiểm tra | Kết quả |
|---|---|
| npm run build | Đạt |
| npm run typecheck | Đạt sau khi sinh Prisma client từ schema cục bộ |
| 4 tệp unit test backend liên quan | 26/26 đạt |
| Dashboard tại 1440, 1024, 768, 390, 375px | Không tràn ngang |
| Tổng quan giáo viên tại 1440, 768, 390px | Không tràn ngang |
| Chọn lớp 12 / tìm “xac suat” / chuyên đề lựa chọn | Đúng 6 chương / 1 kết quả / 3 chuyên đề |
| Điều hướng tháng lịch và về hôm nay | Đạt |
| Route chẩn đoán và kho giáo viên khi tạm ngưng | Hiển thị danh mục + thông báo, không hiển thị câu cũ |
| Onboarding lựa chọn lớp | Đủ lớp 10/11/12, không còn lớp 9 |
| Runtime lỗi JavaScript trong kịch bản trình duyệt | 0 |
| axe-core WCAG 2A/2AA/2.1AA trên toàn trang dashboard và tổng quan GV | 0 vi phạm phát hiện |
| Focus bàn phím | Có outline hiển thị |

Unit test mới kiểm tra biên validation 9/10/11/12/13, tính duy nhất mã danh mục và chặn phân phối câu cũ mà không truy cập DB. Hai tệp test thuật toán cũ dùng mock cờ false riêng trong test để tiếp tục xác minh form/thuật toán được giữ; thpt-transition.spec.ts xác minh cờ đang bật của sản phẩm.

Chứng cứ: `docs/evidence/pastel-thpt/report.json` và dashboard-*.png, teacher-*.png, onboarding.png. Script chạy lại: `node scripts/verify-pastel-thpt.mjs`, với Vite ở 127.0.0.1:3017.

## Giới hạn cần biết

Kiểm thử trình duyệt dùng response mô phỏng hợp đồng API cho tài khoản/lịch/lớp, không dùng dữ liệu thành tích giả trong mã sản phẩm. Chưa kiểm thử đăng nhập và ghi onboarding/tạo lớp với database thật, chưa chạy toàn bộ integration suite, chưa kiểm chứng regression của mọi form bài giao. Không diễn giải kết quả axe là chứng nhận WCAG toàn bộ sản phẩm. Các trạng thái disabled và reduced motion có trong CSS; không tuyên bố đã kiểm tra bằng người dùng khuyết tật.

Đã kiểm tra trực quan ảnh desktop/mobile và sửa tương phản sidebar/stat giáo viên. Chưa làm lại toàn bộ landing page hay toàn bộ màn hình quản trị; phần thay đổi chính là dashboard/shell/danh mục và cấu hình khối lớp.

Khung chương trình nghiên cứu có nguồn và giới hạn kiểm chứng trong RESEARCH.md: chưa đối chiếu đầy đủ sáu tập SGK theo đúng bản phát hành năm học 2026–2027. Đây là yêu cầu bắt buộc đầu tiên trong prompt Antigravity trước khi thu câu hỏi.

## Bàn giao Antigravity

`docs/thpt-redesign/ANTIGRAVITY-PROMPT.md`: prompt hoàn chỉnh để sao chép sang Antigravity, gồm nguồn ưu tiên, xác minh mục lục/phiên bản, pilot 90 câu, schema nghiên cứu, quyền sử dụng, kiểm chứng đáp án, chống trùng, coverage và danh sách NEEDS_REVIEW. Đây là prompt đã soạn, chưa gửi và chưa chạy Antigravity.


## Cập nhật theo phản hồi trình duyệt: trang vào hệ thống và lỗi nguồn yêu cầu

- Thiết kế lại trang chào mừng bằng Bento pastel; thay phần preview kiến thức THCS bằng thông tin chương trình THPT, bỏ nền lưới, gradient và thông số năng lực minh họa không cần thiết.
- Trang đăng nhập/đăng ký có vùng giới thiệu với thẻ lavender/yellow/pink, form trắng 24px, input 16px, CTA bo tròn không đổ bóng cứng; mobile thu gọn vùng giới thiệu, giữ form và nhãn rõ ràng.
- Thanh ngữ cảnh giáo viên dùng nhãn lavender và ô ngày trắng bo tròn trên nền trang, có responsive và tương phản đã kiểm tra lại.
- Nguyên nhân lỗi “Nguồn yêu cầu không được phép”: frontend 3017 gọi backend cũ 4000 chưa tin cậy nguồn 3017. Đã khởi động backend C3 riêng ở 4017 với danh sách nguồn chính xác 127.0.0.1:3017/localhost:3017, cookie phiên riêng am_c3_session; frontend proxy đọc API_PROXY_TARGET từ env. Không gỡ CSRF/CORS và không sửa backend cũ. Backend C3 dùng kết nối database cục bộ sẵn có; không tạo/migrate/seed database.
- Kiểm tra qua proxy: nguồn hợp lệ nhận 401 INVALID_CREDENTIALS khi thử tài khoản không tồn tại (đã đi qua chặn nguồn); nguồn lạ với cookie vẫn nhận 403 CSRF_ORIGIN_REJECTED; đăng ký payload trống nhận 400 validation, không tạo tài khoản.
- Build frontend/backend đạt. Kịch bản trình duyệt trang chào mừng và đăng nhập tại 1440/1074/768/390px: không tràn ngang; toggle mật khẩu đúng; đăng nhập, đăng ký và trang chào mừng không phát hiện vi phạm axe WCAG 2A/2AA/2.1AA. Không phát sinh tài khoản kiểm thử. Bằng chứng entry-refinement-report.json và *-refined-*.png trong docs/evidence/pastel-thpt.


## Sắp xếp bộ lọc danh mục

Thay checkbox đứng lẻ bằng nhóm nút SGK chính / Chuyên đề học tập trong cùng thẻ bộ lọc với khối lớp và tìm kiếm. Thêm chú thích theo loại sách đang chọn; sửa kế thừa CSS form giáo viên khiến icon tìm kiếm và nhãn bị xếp dọc. Đồng thời sửa điều hướng mobile còn kế thừa position:fixed từ shell cũ, che nút chọn sách khi cuộn. Kiểm tra desktop 1074px/mobile 390px, chuyển qua lại 9 chương/3 chuyên đề, không tràn ngang; axe không phát hiện lỗi trên trang ngân hàng. Xem teacher-bank-filters-*.png và report.json.


## Nền nhận diện chuyên đề

Đã thêm MathTopicBackdrop (SVG vector dựng trực tiếp, không phải ảnh bitmap AI), gồm 33 hình riêng cho 24 chương SGK + 9 chuyên đề lựa chọn. Ví dụ: Venn/tập hợp; miền nửa mặt phẳng/bất phương trình; tam giác; mũi tên vectơ; cột số liệu; parabol; conic; cây tổ hợp; xúc xắc; sin; dãy số; mặt phẳng song song/vuông góc; tiếp tuyến; hộp tứ phân vị; miền diện tích tích phân; hệ trục 3D; cây xác suất có điều kiện. Không dùng ảnh mockup cả thẻ làm background nên chữ vẫn là nội dung HTML và tìm kiếm được.

Hình dùng màu cùng tông pastel, opacity .23 desktop/.19 mobile, nằm dưới nội dung và không nhận pointer/focus; aria-hidden để trình đọc màn hình không đọc công thức trang trí. Mapping theo khối và chỉ số gốc trong catalog nên tìm kiếm không làm đổi hình. Dùng lại tại mọi nơi hiển thị CurriculumExplorer, không đổi dữ liệu chương trình/câu hỏi.

Kiểm tra: build đạt, 33/33 motif duy nhất hiển thị đúng khi đổi lớp/loại sách; ảnh topic-art-grade-10/11/12.png và topic-art-mobile.png; không tràn ngang, không lỗi runtime, axe trang ngân hàng không phát hiện vi phạm. Các hình là biểu tượng gợi nhớ, không phải bài tập hay dữ liệu đáp án.
