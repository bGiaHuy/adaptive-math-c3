# AdaptiveMath — Route-level Wireflow & UX State Spec

**Tài liệu:** Route-level Wireflow and Comprehensive UX State Specification  
**Phiên bản:** 1.0  
**Tác giả:** Antigravity (Product Discovery & UX Lead)  
**Mục đích:** Loại bỏ toàn bộ các điểm đội ngũ Kỹ thuật (OpenCode) phải tự suy đoán về hành vi giao diện (UI/UX Behaviors), các trạng thái ngoại lệ (Edge States), kiểm tra tính khả dụng (Accessibility) và tiêu chuẩn nội dung (Copywriting Standards).  
**Tài liệu liên quan:**
- `docs/PRD-AdaptiveMath.md` (Mục 7, 8, 9, 14)
- `docs/product/GATE-0-DECISION-PACK.md`
- `docs/product/TARGET-JOURNEYS.md`

---

## 1. Nguyên tắc Thiết kế Trạng thái Giao diện (State Matrix Principles)

Mọi màn hình trong AdaptiveMath phải có đặc tả rõ ràng cho **8 trạng thái cơ bản**:
1. **Initial / Idle State:** Trạng thái khi vừa tải trang xong dữ liệu.
2. **Loading & Skeleton State:** Trạng thái khi đang fetch dữ liệu; ưu tiên Skeleton placeholder mờ, tránh màn hình trắng hoặc spinner che khuất toàn trang.
3. **Empty State:** Trạng thái khi chưa có dữ liệu (Chưa có bài tập, Chưa vào lớp, Sổ tay còn trống, v.v.).
4. **Validation & Error State:** Báo lỗi tại chỗ (Inline errors) sát cạnh ô input, có icon và màu sắc đạt chuẩn tương phản WCAG 2.1 AA.
5. **Disabled State:** Nút bấm bị vô hiệu hóa khi form chưa hợp lệ hoặc đang xử lý request; có cursor `not-allowed` và độ mờ 50%.
6. **Network Interrupted & Retry State:** Khi mất kết nối, hiển thị toast/banner màu vàng hổ phách có nút *"Thử lại"* và tự động retry backoff.
7. **Timeout & Auto-recovery State:** Xử lý khi đồng hồ làm bài hết giờ hoặc phiên làm việc hết hạn.
8. **Permission Denied State (401 / 403):** Thông báo lý do từ chối quyền truy cập rõ ràng, hướng dẫn hành động tiếp theo, không để màn hình trắng hay lỗi raw JSON.

---

## 2. Đặc tả Chi tiết Flow 1: Học sinh Onboarding → Chẩn đoán → Kết quả → Buổi học đầu tiên

```
[/register] ──> [/student/onboarding] ──> [/student/diagnostic] ──> [/student/diagnostic/result] ──> [/student/dashboard]
```

### 2.1 Màn hình: Đăng ký tài khoản (`/register`)

#### Thông tin cốt lõi
- **Primary Action:** Nút *"Tạo tài khoản"* (Submit form).
- **Entry Condition:** Khách truy cập từ Landing page hoặc truy cập trực tiếp URL.
- **Exit Condition:** Chuyển sang màn hình chuyển cảnh `/loading` sau khi API trả về `201 Created`.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Idle** | Thẻ *"Học sinh"* được chọn mặc định (viền xanh `#10b981`, nền `#f0fdf4`, có dấu tick). Các ô input hiển thị placeholder rõ nét. Nút submit sẵn sàng. |
| **Validation / Error** | - Họ tên trống: Hiển thị chữ đỏ dưới input *"Vui lòng nhập họ và tên của bạn"*.<br>- Email sai định dạng: *"Email không hợp lệ (VD: ten@domain.com)"*.<br>- Mật khẩu < 8 ký tự: *"Mật khẩu cần ít nhất 8 ký tự, gồm cả chữ và số"*.<br>- Email/Username đã tồn tại: Báo lỗi banner đỏ *"Tài khoản này đã tồn tại. Bạn có muốn Đăng nhập không?"*. |
| **Loading (Submitting)** | Nút *"Tạo tài khoản"* chuyển sang trạng thái disabled, icon `Loader2` quay tròn, nhãn đổi thành *"Đang xử lý..."*. Khóa toàn bộ input để chống double-click. |
| **Network Error** | Banner nổi góc trên: *"Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền."* kèm nút *"Thử lại"*. |
| **Accessibility** | - Hỗ trợ phím Tab tuần tự: Role selector ➔ Họ tên ➔ Email ➔ Mật khẩu ➔ Nút Submit.<br>- Thông báo lỗi có thuộc tính `aria-live="polite"` và `aria-describedby` trỏ tới ID của input lỗi. |
| **Copy Guardrail** | **Tuyệt đối không dùng:** *"Đảm bảo đỗ 100% vào lớp 10"*. **Dùng:** *"Hệ thống học Toán THCS thích ứng bám sát chương trình GDPT 2018"*. |

---

### 2.2 Màn hình: Quy trình Khảo sát Hồ sơ 8 bước (`/student/onboarding`)

#### Thông tin cốt lõi
- **Primary Action:** Nút *"Tiếp tục →"* (Bước 1–7) và *"Bắt đầu kiểm tra →"* (Bước 8).
- **Secondary Action:** Nút *"← Quay lại"* (Trở về bước trước đó).
- **Entry Condition:** Học sinh mới đăng ký tài khoản thành công chưa có hồ sơ.
- **Exit Condition:** Hoàn thành Bước 8, lưu hồ sơ thành công và chuyển thẳng sang `/student/diagnostic`.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Progress Bar** | Thanh tiến trình màu xanh ngọc chạy dọc mép trên Navbar: Bước 1: 12.5% ➔ Bước 8: 100%. Hiển thị nhãn text góc trên card: `Bước X / 8`. |
| **Bước 2 (Chọn lớp)** | 4 Card (Lớp 6, 7, 8, 9). Theo Gate 0 D-01: Lớp 9 được đánh dấu viền xanh nổi bật. Nếu bấm Lớp 6–8: Hiển thị tooltip *"Chương trình Lớp 9 đang mở đợt thử nghiệm đầu tiên. Bạn vẫn có thể trải nghiệm nội dung Lớp 9."*. |
| **Bước 3 (Mục tiêu)** | Chọn 1 trong 4 mục tiêu. Khi chọn *"Ôn thi vào lớp 10"*, tự động xuất hiện khung chú thích: *"Mức thành thạo mục tiêu: 85% cho mỗi chủ đề."*. |
| **Bước 5 (Mốc thi)** | - Input định dạng `dd/mm/yyyy`. Tích hợp datepicker popup.<br>- Khi chọn ngày hợp lệ trong tương lai: Hiện tag xanh *"Còn [X] ngày"* và nút *"Xoá ngày"* màu đỏ.<br>- Nếu chọn ngày trong quá khứ: Báo lỗi inline *"Ngày thi phải ở tương lai"*. |
| **Bước 7 (Chủ đề yếu)** | Checklist danh mục theo từng chương Toán 9. Học sinh có thể chọn 0 hoặc nhiều chủ đề (đa chọn). Chip chuyển nền xanh đậm khi được chọn kèm icon checkmark. |
| **Bước 8 (Xác nhận)** | Hiển thị bảng tổng kết tóm tắt toàn bộ 7 bước trước. Có thể bấm trực tiếp vào từng dòng để quay lại sửa bước đó. |
| **Network Failure** | Khi bấm *"Bắt đầu kiểm tra"* mà rớt mạng: Lưu state vào LocalStorage, nút hiện spinner *"Đang kết nối lại..."*, tự động submit khi có mạng. |

---

### 2.3 Màn hình: Bài kiểm tra Chẩn đoán Thích ứng (`/student/diagnostic`)

#### Thông tin cốt lõi
- **Primary Action:** Nút *"Trả lời"* (Gửi đáp án).
- **Secondary Actions:** Nút *"Bỏ qua"* (Skip), Nút *"Dừng bài"* (Pause/Exit).
- **Entry Condition:** Đã hoàn thành Onboarding hoặc bấm làm bài kiểm tra từ Dashboard.
- **Exit Condition:** Trả lời đủ số câu chẩn đoán hoặc học sinh chủ động dừng bài.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Trạng thái Mở đầu (Intro)** | Card trắng nổi bật trên nền xanh bạc hà. 3 Thẻ số liệu: `24 Chủ đề` \| `≤ 50 Câu hỏi` \| `90–180s Mỗi câu`. Nút *"Bắt đầu"* màu xanh lá lớn. |
| **Giao diện Làm bài (Active Quiz)** | - Thanh Status bar trên cùng: `Câu X`, `Chủ đề xong: Y/24`, `θ = 0.XX`, Đồng hồ đếm ngược `01:30`.<br>- Breadcrumb chuyên đề: *Căn bậc hai và căn bậc ba > Biến đổi và phép tính với căn thức*.<br>- Nhãn phân loại: `[Nhận biết]`, `[Trắc nghiệm]`, nguồn SGK GDPT 2018.<br>- Đề bài hiển thị công thức KaTeX sắc nét (VD: $\sqrt{245}$).<br>- 4 Lựa chọn A, B, C, D to, rõ ràng, hover đổi màu nền nhạt, click chọn viền xanh đậm. |
| **Hết giờ (Timeout)** | Khi đồng hồ về `00:00`: Hệ thống **KHÔNG tự reset âm thầm**. Tự động ghi nhận câu hiện tại là `TIMEOUT`, lưu vào database và chuyển sang câu tiếp theo kèm thông báo nhỏ: *"Đã hết thời gian cho câu này, chuyển sang câu kế tiếp."*. |
| **Bỏ qua (Skip)** | Bấm *"Bỏ qua"*: Modal xác nhận nhỏ *"Bạn chưa trả lời câu này. Hệ thống sẽ ghi nhận và chuyển câu khác?"* ➔ Bấm đồng ý: Lưu trạng thái `SKIPPED`. |
| **Dừng bài (Pause & Exit)** | Bấm *"Dừng bài"*: Hệ thống lưu vị trí câu hiện tại (`lastQuestionIndex`), lưu attempt state, hiển thị thông báo *"Tiến trình của bạn đã được lưu an toàn. Bạn có thể tiếp tục bất cứ lúc nào."* và đưa về Dashboard. |
| **Accordion Giải thuật** | Nút bấm *"▶ Vì sao câu này được chọn?"*: Khi click mở rộng panel xám nhạt bên dưới, hiển thị bảng tiêu chí phân loại IRT để tăng tính minh bạch giải thích được (Explainability). |
| **Lỗi tải Công thức (KaTeX Error)** | Nếu KaTeX render lỗi: Hiển thị raw string trong thẻ `<code>` an toàn, không làm crash toàn bộ cây DOM React (Sử dụng React Error Boundary bọc quanh MathRenderer). |
| **Accessibility** | Cho phép dùng phím số `1, 2, 3, 4` hoặc `A, B, C, D` trên bàn phím để chọn đáp án; phím `Enter` để gửi câu trả lời. |

---

### 2.4 Màn hình: Báo cáo Năng lực & Trang chính (`/student/dashboard`)

#### Thông tin cốt lõi
- **Trạng thái Chưa có kết quả:** Menu *"Hồ sơ năng lực"* và *"Lộ trình học"* hiển thị Empty state với hình minh họa trang giấy/cuốn sách và nút kêu gọi *"Làm bài kiểm tra"*.
- **Trạng thái Đã có kết quả:**
  - Tiêu đề cá nhân hóa: *"Xin chào, học sinh Lớp 9!"*.
  - Subtitle: *"Sẵn sàng cho 45 phút học hôm nay để đến gần hơn tới mục tiêu ôn thi vào lớp 10 chứ?"*.
  - Thẻ BƯỚC TIẾP THEO: Hiển thị Node bài học số 1 cần học (*"Phương trình bậc nhất hai ẩn"*), nút *"Bắt đầu bài 1"*.
  - Widget Lịch luyện tập: Đánh dấu các ngày học liên tục (Streak).

---

## 3. Đặc tả Chi tiết Flow 2: Giáo viên Đăng ký → Duyệt → Tạo lớp → Mời học sinh → Can thiệp

```
[/register] ──> [/teacher/pending] ──> [/teacher/classes] ──> [/teacher/classes/new] ──> [/teacher/classes/:id]
```

### 3.1 Màn hình: Chờ phê duyệt Giáo viên (`/teacher/pending`)

#### Thông tin cốt lõi
- **Role của User:** `TEACHER_APPLICANT`.
- **Primary Action:** Bấm *"Nộp lại minh chứng"* hoặc *"Liên hệ hỗ trợ"*.
- **Cấm tuyệt đối:** Không có quyền truy cập route `/teacher/classes/new` hoặc gọi API tạo lớp.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Pending Review** | Banner màu vàng: *"Hồ sơ giáo viên của bạn đang được Ban Quản trị thẩm định (thời gian xử lý: 24h làm việc)."*. Cho phép xem trước ngân hàng câu hỏi mẫu ở chế độ Read-only. |
| **Rejected** | Banner màu đỏ cảnh báo: *"Hồ sơ chưa được phê duyệt. Lý do: [rejectionReason]"*. Kèm nút bấm *"Cập nhật hồ sơ & Nộp lại"* để tải lại ảnh thẻ giáo viên. |
| **Cố tình vượt quyền** | Nếu người dùng gõ URL `/teacher/classes/new` trực tiếp trên trình duyệt: Chặn lại, hiển thị thông báo lỗi `403 Forbidden`: *"Bạn cần hoàn tất xác minh giáo viên để sử dụng tính năng này."*. |

---

### 3.2 Màn hình: Quản lý & Tạo Lớp học (`/teacher/classes`)

#### Thông tin cốt lõi
- **Role của User:** `TEACHER` (Đã có `verificationStatus = 'VERIFIED'`).
- **Primary Action:** Nút *"Tạo lớp mới"* (Mở modal tạo lớp).

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Empty State (Chưa có lớp)** | Hiển thị hình minh họa ngôi trường, tiêu đề *"Bạn chưa tạo lớp học nào"*, nút bấm lớn *"Tạo lớp đầu tiên"*. |
| **Modal Tạo lớp mới** | Form gồm: Tên lớp (*Bắt buộc, 3–50 ký tự*), Khối lớp (*Lớp 9*), Năm học (*2026-2027*), Mô tả (*Tùy chọn*). Bấm *"Lưu & Mở lớp"*. |
| **Hiển thị Mã lớp (Invite Code Card)** | Mã 8 ký tự Crockford (VD: `KTR2-QX79`), font chữ to đậm monospace. Có nút: *Copy mã*, *Bật chế độ Toàn màn hình (để chiếu máy chiếu)*, nút *Thu hồi mã (Revoke)*. |
| **Cảnh báo Mã hết hạn** | Nếu mã hết hạn: Dòng chữ đỏ *"Mã đã hết hạn lúc [HH:mm dd/MM]"* kèm nút *"Gia hạn thêm 7 ngày"*. |

---

### 3.3 Màn hình: Chi tiết Lớp học & Dashboard Can thiệp (`/teacher/classes/:id`)

#### Thông tin cốt lõi
- **Primary Action:** Nút *"Giao bài tập mới"*.
- **Dữ liệu hiển thị:** Bảng danh sách học sinh và Thẻ cảnh báo can thiệp sư phạm.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Empty Students** | Thẻ thông báo: *"Chưa có học sinh nào tham gia lớp. Hãy chia sẻ mã KTR2QX79 cho học sinh."*. |
| **Thẻ Cảnh báo Can thiệp (Intervention Alert)** | Khung viền đỏ/vàng trên cùng: *"⚠️ Phát hiện 6 học sinh chưa đạt kỹ năng: Rút gọn biểu thức chứa căn thức"*. Bấm vào tự động lọc danh sách 6 học sinh đó kèm gợi ý: *"Giao bài tập ôn tập riêng cho nhóm này"*. |
| **Danh sách Học sinh (Student Table)** | Cột: `Họ tên`, `Username`, `Ngày tham gia`, `Trạng thái bài tập gần nhất`, `Mức thành thạo chung`. **Tuyệt đối không hiển thị:** Lỗi sai riêng tư ngoài giờ học của học sinh (Tuân thủ Gate 0 D-04). |

---

## 4. Đặc tả Chi tiết Flow 3: Content Admin Soạn thảo → Review độc lập → Xuất bản

```
[/admin/content/questions/new] ──> [/admin/content/review-queue] ──> [/admin/content/questions/:id]
```

### 4.1 Màn hình: Biên soạn Câu hỏi mới (`/admin/content/questions/new`)

#### Thông tin cốt lõi
- **Role:** `CONTENT_AUTHOR`.
- **Primary Action:** Nút *"Gửi duyệt (Submit for Review)"*.
- **Secondary Action:** Nút *"Lưu bản nháp (Save Draft)"*.

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Editor Split View** | Chia 2 nửa màn hình: Bên trái là ô nhập Markdown/LaTeX, bên phải là khung Preview render thời gian thực qua KaTeX. |
| **Validation Lỗi KaTeX** | Nếu gõ sai cú pháp LaTeX (VD: `\sqrt{` thiếu dấu ngoặc đóng): Khung preview hiển thị viền đỏ và thông báo inline: *"Cú pháp LaTeX chưa đóng ngoặc"* ➔ Nút "Gửi duyệt" bị disabled. |
| **Gắn Metadata bắt buộc** | Phải chọn đủ: Khối lớp (Lớp 9), Môn (Toán), Chương, Chuyên đề, Mức độ nhận thức (*Nhận biết / Thông hiểu / Vận dụng*), Thang bẫy tư duy (*Misconception Type*). Thiếu một trường không cho submit. |

---

### 4.2 Màn hình: Hàng đợi Thẩm định Độc lập (`/admin/content/review-queue`)

#### Thông tin cốt lõi
- **Role:** `CONTENT_REVIEWER`.
- **Ràng buộc Maker-Checker:** Người duyệt **không thể** là người tạo câu hỏi (`authorId !== currentUserId`).

#### Bảng ma trận trạng thái (State Spec)
| Trạng thái | Hành vi giao diện (UI Behavior) |
| :--- | :--- |
| **Danh sách chờ duyệt** | Bảng danh sách câu hỏi trạng thái `IN_REVIEW`. Hiển thị: Tên người tạo, Thời gian nộp, Chuyên đề, Mức độ nhận thức. |
| **Self-Approval Guard** | Nếu tác giả cố tình mở câu hỏi của chính mình: Nút *"Phê duyệt (Approve)"* bị ẩn hoặc disabled kèm nhãn: *"Bạn là tác giả câu hỏi này, cần người khác duyệt theo quy chuẩn Maker-Checker"*. |
| **Từ chối duyệt (Reject Modal)** | Khi bấm *"Từ chối (Reject)"*: Bắt buộc mở modal yêu cầu nhập lý do chi tiết (*"Sai công thức tính sin ở đáp án C"*) ➔ Câu hỏi quay về trạng thái `REVISION_REQUIRED`. |
| **Phê duyệt thành công (Approve)** | Câu hỏi chuyển sang `PUBLISHED`, khóa bất biến phiên bản hiện tại (`versionNumber = 1`), ghi nhận log kiểm toán. |

---

## 5. Tiêu chuẩn Khả năng Tiếp cận (Accessibility Spec - WCAG 2.1 AA)

1. **Độ tương phản màu sắc (Color Contrast):**
   - Màu chữ chính `#062e24` và `#1e293b` trên nền trắng đạt tỷ lệ tương phản `> 7:1` (Vượt chuẩn AA 4.5:1).
   - Màu nút bấm xanh ngọc `#10b981` phối hợp nền chữ trắng `#ffffff` phải dùng sắc độ đậm `#059669` để đạt tỷ lệ tương phản tối thiểu `4.6:1`.
2. **Trạng thái Không phụ thuộc Màu sắc (Color Independence):**
   - Không được chỉ dùng màu đỏ/xanh để phân biệt câu đúng/sai. Bắt buộc luôn đi kèm **Icon** (Checkmark cho đúng, Chữ X cho sai) và nhãn văn bản giải thích.
3. **Điều hướng Bàn phím (Keyboard Navigation):**
   - Mọi nút bấm, input, modal đều phải focus được bằng phím `Tab`.
   - Vòng focus (Focus ring) hiển thị rõ nét màu xanh ngọc: `outline: 2px solid #10b981; outline-offset: 2px;`.
   - Modal popup phải bẫy focus (Focus trap): Không cho phép tab ra ngoài nền mờ phía sau modal.

---

## 6. Quy chuẩn Nội dung & Copywriting Guardrails

| Màn hình | Nội dung CẤM (Overclaim / Dark Pattern) | Nội dung CHUẨN (Accurate & Empathetic) |
| :--- | :--- | :--- |
| **Landing Page** | *"Hệ thống AI số 1 cam kết đỗ lớp 10 chuyên"* | *"Học Toán THCS đúng chỗ bạn còn yếu theo chương trình GDPT 2018"* |
| **Diagnostic Test** | *"Xác định chính xác 100% chỉ số thông minh toán học"* | *"Bài kiểm tra chẩn đoán giúp xác định các chủ đề bạn đang vững và chủ đề cần ưu tiên củng cố"* |
| **Kết quả Năng lực** | *"Bạn bị hổng kiến thức nghiêm trọng"* | *"Chủ đề [Căn thức] đang cần bạn dành thêm thời gian luyện tập"* |
| **Lớp học của GV** | *"Thầy cô sẽ theo dõi từng giây phút học của bạn"* | *"Thầy cô xem được mức độ thành thạo các kỹ năng để hỗ trợ bạn khi gặp bài khó"* |
