# AdaptiveMath — Target Journeys & Service Blueprint

**Tài liệu:** Target User Journeys and Service Blueprint Specifications  
**Phiên bản:** 1.0  
**Tác giả:** Antigravity (Product Discovery & UX Lead)  
**Trạng thái phê duyệt:** DRAFT SPECIFICATION — CHỜ KÝ DUYỆT (Pending Gate 0 & Executive Sign-off)  
**Tài liệu liên quan:**
- `docs/PRD-AdaptiveMath.md` (Mục 7: Trải nghiệm cốt lõi theo vai trò)
- `docs/product/GATE-0-DECISION-PACK.md` (Quyết định D-01 đến D-04 - PENDING)
- `docs/IMPLEMENTATION-PLAN.md` (Security & Guardrail constraints)

> [!NOTE]
> **Ranh giới Pháp lý & Quyết định Mở:** Các điểm chạm liên quan đến `parentEmail`, khối lớp mặc định Lớp 9, hoặc xác minh giáo viên trong các hành trình dưới đây dựa trên Recommendation của Gate 0. Chúng không phải là requirement đã duyệt cho đến khi có chữ ký chính thức tại `DECISION-LOG.md`.

---

## 1. Giới thiệu và Nguyên tắc Service Blueprint

Tài liệu này chuẩn hóa toàn bộ hành trình trải nghiệm của người dùng (User Journeys) và luồng dịch vụ phía sau (Service Blueprint) cho cả 3 vai trò: **Học sinh (Student)**, **Giáo viên (Teacher)**, và **Quản trị viên (Admin)**.

### Mục tiêu kỹ thuật & sản phẩm:
1. **Loại bỏ sự tự suy đoán của Engineering:** Mọi tương tác giao diện đều gắn liền với API Endpoint, trạng thái cơ sở dữ liệu và cơ chế khôi phục lỗi (Error Recovery).
2. **Xác định ranh giới dữ liệu và bảo mật:** Nêu rõ dữ liệu nào được phép đọc/ghi/chia sẻ ở từng bước.
3. **Định hình vai trò vận hành thủ công (Manual Handoff):** Quy định rõ bước nào tự động hóa, bước nào cần sự can thiệp của con người (Teacher / Admin).

---

## 2. Danh mục 6 Hành trình Trọng tâm (Target Journeys)

1. **J-01:** Học sinh tự đăng ký & bắt đầu học cá nhân (*Student Self-Signup & Personal Onboarding*).
2. **J-02:** Học sinh tham gia lớp học qua Mã lớp (*Student Joining Classroom via Invite Code*).
3. **J-03:** Người dùng đăng ký Giáo viên đến khi được Phê duyệt (*Teacher Applicant to Verified Teacher*).
4. **J-04:** Giáo viên tạo lớp, giao bài tập và can thiệp sư phạm (*Teacher Classroom Lifecycle & Intervention*).
5. **J-05:** Tác giả biên soạn nội dung qua quy trình Maker-Checker (*Content Authoring, Review & Versioning*).
6. **J-06:** Quản trị viên xử lý xác minh, khóa tài khoản và kiểm toán (*Platform Admin Governance & Incident Handling*).

---

## Hành trình J-01: Học sinh tự đăng ký & Bắt đầu học cá nhân

```
[Khách truy cập] ──> [Đăng ký HS] ──> [Thiết lập hồ sơ (8 bước)] ──> [Chẩn đoán thích ứng] ──> [Nhận lộ trình] ──> [Học bài đầu tiên]
```

### 1. Trigger & Outcome
- **Trigger:** Học sinh hoặc phụ huynh truy cập Landing Page `https://adaptivemath.vn`, có nhu cầu ôn thi vào 10 hoặc kiểm tra lỗ hổng kiến thức.
- **Outcome:** Tài khoản Học sinh được tạo; hoàn thành khảo sát hồ sơ; hoàn thành bài chẩn đoán đầu vào; nhận bản đồ năng lực $\theta$ và lộ trình bài học cá nhân hóa đầu tiên.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. **Khám phá:** Xem trang chủ, bấm *"Bắt đầu miễn phí →"*.
2. **Đăng ký:** Chọn vai trò *"Học sinh"*; nhập Họ tên, Username (hoặc Email), Mật khẩu; bấm *"Tạo tài khoản"*.
3. **Chuyển cảnh:** Xem màn hình tải dữ liệu *"Đang tải dữ liệu học tập... Sắp xong."*.
4. **Thiết lập hồ sơ (Wizard 8 bước):**
   - Bước 1: Xem giới thiệu lộ trình GDPT 2018.
   - Bước 2: Chọn khối lớp (Mặc định chọn Lớp 9 theo Pilot).
   - Bước 3: Chọn mục tiêu học tập (Mặc định: *Ôn thi vào lớp 10*).
   - Bước 4: Chọn thời gian học mỗi ngày (30m, 45m, 60m, 90m).
   - Bước 5: Nhập ngày thi dự kiến (Ví dụ: `05/06/2027` ➔ hiển thị đếm ngược còn bao nhiêu ngày).
   - Bước 6: Tự đánh giá năng lực ban đầu (Yếu, Trung bình, Khá, Giỏi).
   - Bước 7: Chọn các chuyên đề tự thấy còn yếu (Checklist đa chọn).
   - Bước 8: Kiểm tra lại toàn bộ thông tin đã điền và bấm *"Bắt đầu kiểm tra →"*.
5. **Làm bài chẩn đoán thích ứng (Diagnostic Test):**
   - Xem màn hình giới thiệu cấu trúc bài thi (24 chủ đề, $\le$ 50 câu, 90–180s/câu). Bấm *"Bắt đầu"*.
   - Trả lời từng câu hỏi trắc nghiệm có công thức toán KaTeX. Quan sát đồng hồ đếm ngược, chỉ số năng lực $\theta$.
   - Bấm mở xem *"Vì sao câu này được chọn?"* để hiểu thuật toán.
   - Bấm *"Trả lời"*, câu trả lời được ghi nhận ngay lập tức.
6. **Nhận kết quả & Học tiếp:** Xem báo cáo năng lực chi tiết; hệ thống tự chuyển về Trang chính với lộ trình bài học ưu tiên số 1; bấm *"Bắt đầu bài 1"*.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Auth Service:** Băm mật khẩu bằng Argon2id; tạo bản ghi `User` role `STUDENT`; cấp phát opaque session ID trong cookie `__Host-am_session` (`HttpOnly; Secure; SameSite=Lax`).
- **Profile Service:** Lưu `StudentProfile` gắn với các lựa chọn khảo sát (mục tiêu, thời gian, ngày thi, chuyên đề yếu).
- **Assessment Engine:** Khởi tạo `DiagnosticAttempt` với `status = IN_PROGRESS`. 
  - Chọn câu hỏi đầu tiên dựa trên mức tự đánh giá ở Bước 6.
  - Sau mỗi câu trả lời, ghi nhận `AttemptAnswer`, tính lại $\theta$ theo thuật toán CAT/IRT tạm thời, tự động lưu `lastAnsweredQuestionId` (Autosave).
  - Khi hoàn thành bài, chuyển trạng thái sang `COMPLETED`, tính toán `CompetencyBaseline` cho từng chủ đề.
- **Pathfinder Service:** Sinh `LearningPathway` gồm danh sách các node bài học sắp xếp theo mức độ cấp thiết.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `User`, `Session`, `StudentProfile`, `DiagnosticAttempt`, `AttemptAnswer`, `CompetencyBaseline`, `LearningPathway`.
- **Đọc:** `CurriculumData` (Lớp 9 KNTT), `QuestionBank` (nhãn Nhận biết/Thông hiểu/Vận dụng).
- **Chia sẻ:** Dữ liệu hoàn toàn riêng tư cho Học sinh; chưa chia sẻ cho bất kỳ ai.

### 5. Route & API Endpoints
- Routes: `/`, `/register`, `/student/onboarding`, `/student/diagnostic`, `/student/dashboard`.
- APIs:
  - `POST /api/v1/auth/register-student`
  - `POST /api/v1/student/profile`
  - `POST /api/v1/student/diagnostic/start`
  - `PUT /api/v1/student/diagnostic/submit-answer`
  - `POST /api/v1/student/diagnostic/finish`
  - `GET /api/v1/student/pathway`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Mất mạng khi đang làm bài thi:** Client lưu cache câu trả lời vào `IndexedDB/localStorage`. Khi có mạng trở lại, gửi retry với `clientGeneratedUUID` để đảm bảo Idempotent.
- **Hết giờ làm bài (Timeout):** Client không tự ý reset đồng hồ. Gửi request timeout về server; server ghi nhận `isTimedOut: true` cho câu đó và tự động chuyển câu tiếp theo.
- **Học sinh thoát giữa chừng:** Khi quay lại `/student/diagnostic`, hệ thống kiểm tra còn attempt dở dang thì hiển thị modal: *"Bạn có bài thi chưa hoàn thành, tiếp tục làm từ câu X?"*.

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** Học sinh chỉ truy cập được dữ liệu thuộc `userId` của chính mình.
- **Operational Owner:** Hỗ trợ kỹ thuật người dùng (User Support Level 1).

---

## Hành trình J-02: Học sinh tham gia lớp học qua Mã lớp

```
[Học sinh đăng nhập] ──> [Vào mục Lớp học] ──> [Nhập mã lớp] ──> [Hệ thống xác thực mã] ──> [Xác nhận tham gia] ──> [Đồng bộ vào lớp]
```

### 1. Trigger & Outcome
- **Trigger:** Học sinh nhận được mã lớp (gồm 8 ký tự, ví dụ: `KTR2QX79`) từ giáo viên bộ môn trên lớp.
- **Outcome:** Học sinh trở thành thành viên của lớp học; nhìn thấy tên lớp, tên giáo viên và các bài tập được giao; giáo viên lớp học nhìn thấy học sinh trong danh sách.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. Học sinh bấm vào mục menu *"Lớp học"* trên Sidebar.
2. Thấy giao diện: Ô nhập *"Vào lớp của giáo viên - Nhập mã lớp giáo viên đưa cho bạn (VD: KTR2QX)"*.
3. Nhập mã lớp và bấm *"Tìm lớp"*.
4. Màn hình hiển thị thẻ thông tin lớp học tìm thấy: Tên lớp (*"Toán 9A1 - Thầy Nam"*), Trường học, Năm học, và thông báo minh bạch về ranh giới dữ liệu.
5. Học sinh bấm nút *"Tham gia ngay"*.
6. Giao diện chuyển sang trạng thái đã vào lớp thành công, hiển thị bài tập lớp cần làm.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Validation Engine:** Chuẩn hóa chuỗi mã lớp (viết hoa, loại bỏ khoảng trắng).
- **Security Check:** Tính HMAC digest của mã lớp và truy vấn trong bảng `ClassroomInviteCode`.
  - Kiểm tra xem mã có hết hạn (`expiredAt`), có bị thu hồi (`revokedAt`), hoặc đạt giới hạn số học sinh (`maxUses`) chưa.
  - Áp dụng Rate Limiter: Tối đa 5 lần thử sai trong 15 phút trên mỗi IP/User để chống brute-force mã lớp.
- **Membership Engine:** Thêm bản ghi vào bảng `ClassroomMembership` (`status = ACTIVE`).
- **Audit Log:** Ghi log sự kiện `STUDENT_JOINED_CLASS`.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `ClassroomMembership`.
- **Đọc:** `Classroom` (thông tin cơ bản: tên lớp, tên GV, tên trường).
- **Chia sẻ:** Chia sẻ `fullName`, `username` và `overallMasteryBySkill` của học sinh cho Giáo viên sở hữu lớp. Không chia sẻ nhật ký làm bài riêng tư.

### 5. Route & API Endpoints
- Route: `/student/classroom`.
- APIs:
  - `POST /api/v1/student/classroom/lookup-code` (Payload: `{ code }`)
  - `POST /api/v1/student/classroom/join` (Payload: `{ code }`)
  - `GET /api/v1/student/classroom/my-classes`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Mã không tồn tại hoặc sai ký tự:** Báo lỗi rõ ràng: *"Không tìm thấy lớp học với mã này. Hãy kiểm tra lại với thầy cô của bạn."*.
- **Mã hết hạn hoặc đã bị thu hồi:** Thông báo: *"Mã tham gia này đã hết hạn. Vui lòng xin mã mới từ giáo viên."*.
- **Học sinh đã ở trong lớp:** Báo thông tin: *"Bạn đã là thành viên của lớp này rồi."* và điều hướng thẳng vào lớp.

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** Học sinh chỉ xem được thông tin của lớp mình đã tham gia. Không xem được danh sách bài làm của các bạn học sinh khác trong lớp.
- **Operational Owner:** Giáo viên phụ trách lớp học.

---

## Hành trình J-03: Người dùng đăng ký Giáo viên đến khi được Phê duyệt

```
[Đăng ký vai trò GV] ──> [Tài khoản Applicant] ──> [Nộp hồ sơ minh chứng] ──> [Admin thẩm định] ──> [Kích hoạt quyền GV]
```

### 1. Trigger & Outcome
- **Trigger:** Thầy cô giáo dạy Toán THCS muốn áp dụng AdaptiveMath cho học sinh của mình.
- **Outcome:** Giáo viên được định danh chính xác, có hồ sơ xác minh uy tín; được hệ thống mở khóa toàn quyền tạo lớp và giao bài.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. **Đăng ký:** Tại trang đăng ký, chọn thẻ *"Giáo viên"*; điền Họ tên, Email, Mật khẩu.
2. **Onboarding Giáo viên:** 
   - Sau khi đăng ký, hệ thống thông báo tài khoản ở trạng thái *"Đang chờ xác minh chuyên môn (Teacher Applicant)"*.
   - Giáo viên điền biểu mẫu xác minh: Tên trường công tác, Tỉnh/Thành phố, Số điện thoại liên hệ, Tải lên ảnh chụp Thẻ ngành / Giấy phân công chuyên môn / Mã mời trực tiếp từ BQT.
3. **Trải nghiệm chờ duyệt:** Giáo viên được xem các bài giảng mẫu, ngân hàng câu hỏi mẫu và tài liệu hướng dẫn sư phạm ở chế độ Demo. Nút "Tạo lớp học" bị vô hiệu hóa kèm tooltip giải thích.
4. **Nhận kết quả:** Nhận email thông báo phê duyệt kèm đường link kích hoạt. Đăng nhập lại, toàn bộ tính năng quản trị lớp học được mở khóa.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Auth Engine:** Tạo `User` với role ban đầu là `TEACHER_APPLICANT`.
- **Verification Service:** Lưu bản ghi `TeacherProfile` với `verificationStatus = PENDING_REVIEW`.
- **Admin Dashboard:** Đơn nộp xuất hiện tại Hàng đợi duyệt giáo viên (`/admin/teachers/queue`).
- **Admin Action:** Nhân viên vận hành kiểm tra minh chứng, bấm `Phê duyệt` (hoặc `Từ chối` kèm lý do).
- **Role Upgrade:** Hệ thống cập nhật `User.role = 'TEACHER'`, `verificationStatus = VERIFIED`, tăng `permissionVersion` lên 1 để vô hiệu hóa token/cache cũ, gửi email chúc mừng.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `TeacherProfile`, `TeacherVerificationDocument`, `AuditLog`.
- **Đọc:** Danh sách trường học chuẩn hóa.
- **Chia sẻ:** Hồ sơ minh chứng chỉ Admin có thẩm quyền mới được xem (bảo vệ thông tin cá nhân của giáo viên).

### 5. Route & API Endpoints
- Routes: `/register`, `/teacher/verification-pending`, `/admin/teachers/queue`.
- APIs:
  - `POST /api/v1/auth/register-teacher`
  - `POST /api/v1/teacher/verification/submit-profile`
  - `GET /api/v1/teacher/verification/status`
  - `POST /api/v1/admin/teachers/:id/approve`
  - `POST /api/v1/admin/teachers/:id/reject`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Minh chứng mờ/không hợp lệ:** Admin từ chối kèm lý do cụ thể (*"Ảnh chụp thẻ giáo viên bị lóa, vui lòng chụp lại rõ số hiệu trường"*). Giáo viên nhận thông báo và có nút *"Nộp lại hồ sơ"*.
- **Giáo viên cố tình gọi API tạo lớp bằng công cụ ngoài (Postman):** Backend Guard kiểm tra `verificationStatus !== 'VERIFIED'` lập tức trả về `403 Forbidden` (`TEACHER_NOT_VERIFIED`).

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** `TEACHER_APPLICANT` không thể tương tác với bất kỳ dữ liệu học sinh thật nào.
- **Operational Owner:** Đội ngũ Vận hành Sư phạm (Teacher Community & Operations).

---

## Hành trình J-04: Giáo viên tạo lớp, giao bài tập và can thiệp sư phạm

```
[GV tạo lớp] ──> [Sinh mã lớp Crockford] ──> [Học sinh tham gia] ──> [Giao bài tập/nhiệm vụ] ──> [Xem báo cáo can thiệp]
```

### 1. Trigger & Outcome
- **Trigger:** Giáo viên muốn giao bài tập tuần về chuyên đề "Biến đổi căn thức" và theo dõi học sinh nào đang hổng kiến thức để phụ đạo.
- **Outcome:** Lớp học được tạo; mã lớp an toàn được cấp; học sinh làm bài; giáo viên nhận được bảng ma trận kỹ năng phân nhóm học sinh (Cần hỗ trợ / Đạt / Khá) để can thiệp kịp thời.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. **Tạo lớp:** Giáo viên bấm *"Tạo lớp mới"*, nhập tên lớp (*"Toán 9A1"*), năm học, mô tả.
2. **Quản lý mã mời:** Hệ thống sinh mã lớp 8 ký tự (Ví dụ: `KTR2QX79`). Giáo viên có nút: *Copy mã*, *Chiếu mã lên máy chiếu*, *Thu hồi mã (Revoke)*, hoặc *Gia hạn mã*.
3. **Tạo bài tập (Assignment):**
   - Giáo viên bấm *"Giao bài mới"*.
   - Chọn chủ đề: *Căn bậc hai và Căn bậc ba > Biến đổi và phép tính với căn thức*.
   - Chọn cấu hình: Số lượng câu (10 câu), Mức độ (Nhận biết + Thông hiểu), Thời hạn nộp (Deadline).
   - Chọn trạng thái: *Lưu nháp (Draft)* hoặc *Giao ngay (Publish)*.
4. **Theo dõi & Can thiệp:**
   - Khi học sinh làm bài xong, màn hình Dashboard lớp cập nhật danh sách nộp bài.
   - Thẻ can thiệp cảnh báo: *"Có 6 học sinh chưa vững kỹ năng trục căn thức ở mẫu"*.
   - Bấm vào chi tiết để xem danh sách 6 học sinh đó và xuất danh sách câu hỏi cần chữa bài trên lớp.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Code Generator:** Sinh mã 8 ký tự Crockford Base32 ngẫu nhiên (loại bỏ ký tự dễ nhầm lẫn: `I, L, O, 0, 1`). Lưu mã dưới dạng HMAC digest.
- **Assignment Engine:** Khi bài tập chuyển sang `PUBLISHED`, hệ thống tạo thông báo cho tất cả học sinh trong lớp; khởi tạo `AssignmentInstance`.
- **Aggregation Worker:** Định kỳ hoặc sau mỗi lượt nộp bài, tính toán lại tỷ lệ hoàn thành, điểm trung bình và phân nhóm học sinh theo thuật toán phân loại năng lực của PRD.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `Classroom`, `ClassroomInviteCode`, `Assignment`, `AssignmentSubmission`.
- **Đọc:** `StudentProfile` (tên, username), `QuestionBank`.
- **Chia sẻ:** Toàn bộ học sinh trong lớp xem được đề bài tập được giao; Giáo viên xem được kết quả bài tập của lớp mình. Không cho phép Giáo viên xem dữ liệu lớp của giáo viên khác (Enforce Tenant Scoping).

### 5. Route & API Endpoints
- Routes: `/teacher/classes`, `/teacher/classes/:id`, `/teacher/classes/:id/assignments/new`.
- APIs:
  - `POST /api/v1/teacher/classes`
  - `POST /api/v1/teacher/classes/:id/invite-codes`
  - `DELETE /api/v1/teacher/classes/:id/invite-codes/:codeId`
  - `POST /api/v1/teacher/classes/:id/assignments`
  - `GET /api/v1/teacher/classes/:id/analytics`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Mã lớp bị phát tán ra ngoài trường:** Giáo viên bấm *"Thu hồi mã ngay lập tức"*. Mã cũ bị vô hiệu hóa; học sinh đã vào lớp vẫn giữ nguyên, kẻ lạ không thể vào tiếp.
- **Học sinh nộp bài trễ deadline:** Hệ thống căn cứ cờ `allowLateSubmission` trong Assignment: nếu cho phép thì đánh dấu nhãn *"Nộp muộn"*, nếu không thì khóa nút nộp bài.

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** Mỗi lớp học chỉ có 1 chủ sở hữu (Single Teacher Ownership). Giáo viên A không có quyền gọi API để xem hoặc can thiệp vào lớp của Giáo viên B.
- **Operational Owner:** Giáo viên phụ trách lớp.

---

## Hành trình J-05: Tác giả biên soạn nội dung qua quy trình Maker-Checker

```
[Author tạo câu hỏi] ──> [Trạng thái Draft] ──> [Gửi Review] ──> [Checker độc lập duyệt] ──> [Published] ──> [Bất biến khi có Attempt]
```

### 1. Trigger & Outcome
- **Trigger:** Đội ngũ sư phạm cần bổ sung câu hỏi mới cho chủ đề *Hệ thức lượng trong tam giác vuông*.
- **Outcome:** Câu hỏi chuẩn GDPT 2018 được biên soạn, kiểm tra công thức KaTeX, gắn nhãn nhận thức chính xác, được một người thứ hai (Checker) duyệt độc lập trước khi đẩy vào Production.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. **Soạn thảo (Maker):** Content Author đăng nhập Admin CMS, chọn chuyên đề, nhập nội dung câu hỏi (chứa cú pháp LaTeX `\sqrt{...}`), tạo 4 đáp án A/B/C/D, chọn đáp án đúng, viết lời giải chi tiết, gắn nhãn nhận thức (*Nhận biết*).
2. **Xem trước (Preview):** Author xem preview hiển thị KaTeX trực quan giống hệt màn hình học sinh.
3. **Gửi duyệt:** Bấm *"Gửi phê duyệt (Submit for Review)"*. Trạng thái chuyển sang `IN_REVIEW`.
4. **Thẩm định (Checker):** Một Content Reviewer khác (không phải là người tạo) đăng nhập, vào hàng đợi kiểm duyệt câu hỏi.
5. **Kiểm tra tiêu chí:** Kiểm tra tính chính xác khoa học, công thức toán, khả năng tiếp cận (Accessibility), và bẫy tư duy (Misconception).
6. **Quyết định duyệt:** Reviewer bấm *"Phê duyệt & Xuất bản (Approve & Publish)"*. Câu hỏi chuyển sang `PUBLISHED` và phiên bản (version) được khóa lại.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Maker-Checker Enforcement:** Backend kiểm tra nghiêm ngặt: `authorId !== reviewerId`. Nếu tác giả cố tình tự duyệt câu hỏi của chính mình, API trả về `403 Forbidden` (`CANNOT_APPROVE_OWN_CONTENT`).
- **Versioning Control:** Mỗi câu hỏi có `versionNumber`. Khi câu hỏi đã được dùng trong ít nhất 1 `Attempt` của học sinh, câu hỏi đó trở thành **bất biến (Immutable)**. Mọi chỉnh sửa sau đó bắt buộc phải tạo bản ghi mới với `versionNumber + 1`.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `Question`, `QuestionOption`, `QuestionVersion`, `ContentAuditLog`.
- **Đọc:** `Topic`, `SkillNode`.
- **Chia sẻ:** Chỉ câu hỏi có trạng thái `PUBLISHED` mới được Assessment Engine nạp vào ngân hàng câu hỏi phục vụ học sinh.

### 5. Route & API Endpoints
- Routes: `/admin/content/questions`, `/admin/content/questions/new`, `/admin/content/review-queue`.
- APIs:
  - `POST /api/v1/admin/content/questions` (Tạo Draft)
  - `PUT /api/v1/admin/content/questions/:id` (Sửa Draft)
  - `POST /api/v1/admin/content/questions/:id/submit-review`
  - `POST /api/v1/admin/content/questions/:id/approve`
  - `POST /api/v1/admin/content/questions/:id/reject`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Lỗi cú pháp KaTeX làm vỡ giao diện:** Client CMS tích hợp bộ kiểm tra cú pháp KaTeX thời gian thực (Real-time Syntax Validator). Nếu cú pháp lỗi, vô hiệu hóa nút gửi duyệt.
- **Phát hiện câu hỏi đã publish bị sai đáp án:** Không sửa trực tiếp câu hỏi cũ. Bấm *"Tạo bản sửa đổi (Create Revision)"* ➔ sinh phiên bản mới ➔ duyệt lại ➔ chuyển phiên bản cũ sang `RETIRED`.

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** Yêu cầu quyền `CONTENT_AUTHOR` để tạo và `CONTENT_REVIEWER` để duyệt. Không được gộp hai quyền này cho 1 cá nhân trong cùng 1 vòng đời bài tập.
- **Operational Owner:** Academic Content Lead.

---

## Hành trình J-06: Quản trị viên xử lý xác minh, khóa tài khoản và kiểm toán

```
[Phát hiện bất thường/yêu cầu] ──> [Tra cứu User] ──> [Xem Audit Log] ──> [Khóa tài khoản/Thu hồi Session] ──> [Ghi nhận sự cố]
```

### 1. Trigger & Outcome
- **Trigger:** Hệ thống cảnh báo một tài khoản có hành vi brute-force mã lớp, hoặc nhận được yêu cầu từ phụ huynh về việc tạm ngưng tài khoản học sinh.
- **Outcome:** Tài khoản bị tạm khóa an toàn; toàn bộ phiên đăng nhập lập tức bị vô hiệu hóa; hành động được ghi vết đầy đủ trong Audit Log phục vụ thanh kiểm tra.

### 2. Các bước của Người dùng (Front-stage User Actions)
1. Platform Admin đăng nhập trang quản trị cấp cao với xác thực bắt buộc MFA (TOTP).
2. Vào mục *"Quản trị Người dùng (User Management)"*, tìm kiếm theo Username hoặc Email.
3. Xem thông tin tổng quan: Trạng thái tài khoản, Lịch sử các phiên đăng nhập đang mở, Lịch sử tham gia lớp học.
4. Bấm *"Xem Nhật ký Kiểm toán (View Audit Trail)"* để xem các hành động nhạy cảm đã diễn ra.
5. Bấm *"Khóa tài khoản (Suspend Account)"*, chọn thời gian khóa và nhập lý do bắt buộc.

### 3. Phản hồi Hệ thống & Backstage Processing
- **Session Revocation:** Hệ thống xóa toàn bộ session đang hoạt động của người dùng trong cơ sở dữ liệu; tăng `permissionVersion` của người dùng lên 1.
- **Real-time Invalidation:** Mọi request tiếp theo từ thiết bị của người dùng lập tức nhận mã lỗi `401 Unauthorized` hoặc `403 Account Suspended`.
- **Immutable Audit Logging:** Ghi bản ghi vào bảng `AuditLog`: `{ adminId, targetUserId, action: 'USER_SUSPENDED', reason, timestamp, ipAddress }`.

### 4. Dữ liệu Tạo / Đọc / Chia sẻ (Data Contract)
- **Tạo mới:** `AuditLog`, `AccountSuspensionRecord`.
- **Đọc:** `User`, `Session`, `SecurityEvent`.
- **Chia sẻ:** Dữ liệu nhật ký kiểm toán là bất biến (Read-only), chỉ Super Admin và Security Officer có quyền xem.

### 5. Route & API Endpoints
- Routes: `/admin/users`, `/admin/users/:id`, `/admin/audit-logs`.
- APIs:
  - `GET /api/v1/admin/users/:id/audit-trail`
  - `POST /api/v1/admin/users/:id/suspend`
  - `POST /api/v1/admin/users/:id/revoke-sessions`

### 6. Điểm lỗi tiềm ẩn & Cơ chế phục hồi (Failure Points & Recovery)
- **Khóa nhầm tài khoản người dùng:** Admin có tính năng *"Kích hoạt lại (Reactivate)"* kèm giải trình lý do vào hệ thống.
- **Admin bị chiếm quyền:** Cơ chế bảo vệ Root Admin: Không tài khoản nào có thể tự xóa hoặc tự hạ quyền của chính mình; thao tác nhạy cảm yêu cầu nhập lại mật khẩu hoặc mã OTP thứ hai.

### 7. Ranh giới Quyền & Vận hành
- **Permission Boundary:** Chỉ tài khoản có role `PLATFORM_ADMIN` và đã qua kiểm tra MFA mới được cấp quyền truy cập các endpoint này.
- **Operational Owner:** Lead System Administrator & Security Officer.

---

## 3. Ma trận Phân nhiệm Service Blueprint (RACI Matrix)

| Hành trình | Học sinh (Student) | Giáo viên (Teacher) | Content Maker/Checker | Platform Admin | Hệ thống tự động (Worker) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **J-01: Self-signup & Test** | **R** (Thực hiện) | I (Thông tin) | A (Chịu trách nhiệm đề) | I | **S** (Tính $\theta$, lưu tiến trình) |
| **J-02: Vào lớp bằng mã** | **R** (Nhập mã) | **A** (Cung cấp mã) | I | I | **S** (Check HMAC, Rate limit) |
| **J-03: Duyệt Giáo viên** | I | **R** (Nộp hồ sơ) | I | **A** (Thẩm định/Duyệt) | **S** (Gửi mail, nâng Role) |
| **J-04: Vận hành lớp học** | **C** (Làm bài tập) | **R / A** (Quản lý) | I | I | **S** (Thống kê ma trận lỗi) |
| **J-05: Maker-Checker** | I | I | **R / A** (Soạn / Duyệt) | I | **S** (Chặn self-approval) |
| **J-06: Khóa tài khoản** | I (Bị tác động) | I | I | **R / A** (Xử lý) | **S** (Revoke token tức thì) |

*(Chú thích: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed, **S** = System Supported)*
