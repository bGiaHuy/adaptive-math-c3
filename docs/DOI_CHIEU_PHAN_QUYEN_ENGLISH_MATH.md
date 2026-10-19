# Phân quyền Adaptive Math — giáo viên tự chủ, Admin quan sát

Cập nhật: 17/10/2026 (Asia/Saigon), theo chỉ đạo trực tiếp của chủ dự án. Chính sách này thay thế việc cấp quyền Admin can thiệp lớp học trong lần đối chiếu trước.

Tài liệu tham khảo: `Adaptive English/docs/BAO_CAO_PHAN_QUYEN_WEBSITE.md`. Không sao chép quyền Admin quản lý workflow từ English vì chủ dự án đã chốt chính sách khác.

## Nguyên tắc

Giáo viên phụ trách tự quyết định hoạt động trong lớp của mình. Các thao tác được sản phẩm hỗ trợ không có bước chờ Admin duyệt. Giáo viên khác không được quản lý chéo lớp. Admin quan sát hoạt động lớp, không thay giáo viên hoặc học sinh thực hiện workflow.

| Thao tác hiện có | Giáo viên phụ trách | Học sinh | Admin |
|---|---|---|---|
| Tạo lớp | Có, không chờ duyệt | Không | Không |
| Liệt kê và xem lớp/thành viên | Lớp của mình | Qua API học sinh theo phạm vi hiện có | Mọi lớp, chỉ xem |
| Sinh/thu hồi mã mời | Có | Không | Không |
| Tham gia lớp bằng mã | Không | Có, mã hợp lệ | Không |
| Tạo bài từ ngân hàng/câu tự soạn/JSON | Có, không chờ duyệt | Không | Không |
| Xem danh sách bài | Lớp của mình | Bài đã phát hành ở lớp đã tham gia | Mọi lớp, chỉ xem |
| Xem bảng điểm/phân tích | Lớp của mình | Kết quả của mình qua API riêng | Mọi lớp, chỉ xem |
| Xóa bài tập | Có, bài phải thuộc lớp của mình | Không | Không |
| Nộp bài | Không | Chính mình, theo điều kiện bài/lớp/hạn nộp | Không |
| Tự học/luyện tập | Theo vai trò hiện tại | Dữ liệu của mình | Không làm thay học sinh |

Đăng ký giáo viên đang tự cấp quyền TEACHER và trạng thái VERIFIED trong AuthService, không có bước phê duyệt thủ công của Admin. Guard vẫn kiểm tra trạng thái hợp lệ; trạng thái này không tạo hàng đợi Admin trong luồng đăng ký hiện tại. Học sinh tham gia lớp qua mã hợp lệ trực tiếp. Câu hỏi tự soạn cho bài lớp được dùng trực tiếp, không cần đi qua duyệt ngân hàng học liệu chung.

Phạm vi “toàn quyền trong lớp” là quyền thực hiện các chức năng lớp học đã có. Lần này không bổ sung chức năng mới như sửa/xóa lớp, loại thành viên, chấm thủ công hoặc công bố điểm thủ công. Quyền quản trị tài khoản và biên soạn/thẩm định ngân hàng học liệu toàn hệ thống được giữ riêng; không trở thành bước bắt buộc trong quy trình dạy/học của lớp.

## Thực thi

- API ghi lớp/bài chỉ cho TEACHER; service cũng từ chối Admin trước khi thao tác dữ liệu.
- API xem cho Admin vượt phạm vi sở hữu, không có quyền ghi tương ứng.
- Giao diện Admin dùng mục “Quan sát lớp học”, hiện thông báo chỉ xem và vô hiệu hóa thao tác thay đổi; handler ghi cũng chặn.
- Giữ kiểm tra assignment thuộc đúng classId khi xóa; giữ bảo vệ membership, đáp án và bài nộp của học sinh.
- Giữ các sửa đổi đã có trong working tree trước phiên này, gồm cơ chế tự cấp quyền giáo viên.

## Kiểm chứng

40 kiểm thử đạt ở `authorization-policy.spec.ts`, `classroom.integration.spec.ts`, `assignment.integration.spec.ts`, `frontend-client-routing.spec.ts`. Kiểm thử tích hợp xác nhận Admin xem lớp/bảng điểm được nhưng tạo lớp, sinh/thu hồi mã mời, tạo/xóa bài và nộp bài đều nhận 403. Kiểm thử service xác nhận gọi trực tiếp vẫn không cho Admin ghi. Luồng giáo viên tạo bài và học sinh nộp/xem kết quả tiếp tục đạt.

Typecheck API và build giao diện thành công. Chưa kiểm thử trình duyệt với đăng nhập thực tế, chưa phát hành production, chưa kiểm thử cạnh tranh đóng bài/nộp bài đồng thời.
