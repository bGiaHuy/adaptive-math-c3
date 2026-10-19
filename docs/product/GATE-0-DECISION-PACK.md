# AdaptiveMath — Gate 0 Decision Pack

**Tài liệu:** Gate 0 Product & Governance Decision Pack  
**Phiên bản:** 1.0  
**Tác giả:** Antigravity (Product Discovery & UX Lead)  
**Người duyệt (Sign-off):** Product Owner / Head of Product, Legal & Privacy Officer, Lead Architect (Codex)  
**Tình trạng:** CHỜ PHÊ DUYỆT (Pending Executive Sign-off)  
**Tài liệu tham chiếu:**
- `docs/PRD-AdaptiveMath.md` (Mục 20: Các quyết định mở)
- `docs/PROJECT-VISION-AND-PM-ROADMAP.md` (Horizon 1 & Horizon 2)
- `docs/IMPLEMENTATION-PLAN.md` (Engineering Guardrails)

---

## 1. Mục đích và Quy tắc vận hành Gate 0

Tài liệu này đóng băng 4 quyết định mang tính kiến trúc then chốt (Architectural Product Decisions) trước khi hệ thống chuyển từ giai đoạn triển khai nền móng (Horizon 1) sang giai đoạn Pilot có người dùng thực tế (Horizon 2).

### Nguyên tắc quản trị:
1. **Không giả định thay người dùng:** Các phân tích dưới đây đưa ra khuyến nghị kỹ thuật và nghiệp vụ (Recommendation), nhưng **chưa có hiệu lực ràng buộc** cho đến khi có chữ ký chính thức tại Decision Record.
2. **Bảo vệ ranh giới an toàn cho Engineering:** Đội ngũ phát triển (OpenCode) sẽ dựa vào các ảnh hưởng Schema/API được nêu trong tài liệu này để thiết kế Data Model linh hoạt, tránh hard-code giả định.
3. **Tuân thủ Privacy Gate:** Không triển khai thu thập dữ liệu học sinh thật khi chưa hoàn thành phê duyệt D-02 và D-04.

---

## 2. Danh mục Quyết định Gate 0

> [!CAUTION]
> **Tình trạng Phê duyệt Gate 0:**
> - Toàn bộ các quyết định D-01 đến D-04 hiện ở trạng thái **PENDING DECISION** (Chờ người chịu trách nhiệm ký duyệt).
> - Mọi phương án được gắn nhãn "Khuyến nghị (Recommendation)" chỉ là cơ sở kỹ thuật tạm thời, **KHÔNG PHẢI REQUIREMENT ĐÃ DUYỆT**.
> - Tuyệt đối không biến `parentEmail`, `parentConsentStatus` hoặc bất kỳ lựa chọn pháp lý/privacy nào thành requirement đã duyệt cho đến khi có sign-off chính thức từ Legal & Privacy Officer.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                GATE 0 DECISION ROADMAP                                 │
├──────┬───────────────────────────────────────┬────────────┬──────────┬─────────────────┤
│ ID   │ Nội dung quyết định                   │ Mức ưu tiên│ Thời hạn │ Trạng thái      │
├──────┼───────────────────────────────────────┼────────────┼──────────┼─────────────────┤
│ D-01 │ Khối lớp và Bộ sách triển khai Pilot  │ Critical   │ Tuần 1   │ PENDING DECISION│
│ D-02 │ Mô hình định danh tài khoản Học sinh  │ Blocker    │ Tuần 1   │ PENDING DECISION│
│ D-03 │ Tiêu chí và Quy trình duyệt Giáo viên │ High       │ Tuần 2   │ PENDING DECISION│
│ D-04 │ Ranh giới dữ liệu Học sinh chia sẻ GV │ Blocker    │ Tuần 1   │ PENDING DECISION│
└──────┴───────────────────────────────────────┴────────────┴──────────┴─────────────────┘
```

---

## Quyết định D-01: Khối lớp và Bộ SGK cho đợt Controlled Pilot

### 1. Vấn đề cần quyết định
Chương trình GDPT 2018 hiện có 3 bộ sách giáo khoa chính (Kết nối tri thức với cuộc sống, Cánh Diều, Chân trời sáng tạo) trên 4 khối lớp THCS (Lớp 6, 7, 8, 9). Nếu phát hành diện rộng cả 4 khối lớp và 3 bộ SGK ngay đợt đầu, đội ngũ nội dung phải bao phủ hơn 92 bài học và hàng nghìn câu hỏi, gây rủi ro nội dung "rộng nhưng rỗng", không đủ depth để thuật toán chẩn đoán chính xác. Cần quyết định phạm vi hẹp chính xác cho đợt Pilot (Horizon 2).

### 2. Các phương án thực tế

#### Phương án A: Focus hẹp — Lớp 9, Bộ "Kết nối tri thức", Trọng tâm Ôn thi vào 10 (Khuyến nghị)
- **Mô tả:** Pilot giới hạn 1 khối lớp duy nhất (Lớp 9), bộ SGK Kết nối tri thức, tập trung vào 6–8 kỹ năng đại số & hình học cốt lõi thường xuất hiện trong đề thi tuyển sinh vào lớp 10 (Căn thức, Hệ phương trình, Hàm số bậc hai, Hệ thức lượng, Đường tròn).
- **Phù hợp:** Wedge market rõ ràng, học sinh có động lực học tập cao nhất, kỳ thi có deadline cụ thể.

#### Phương án B: Toàn bộ Lớp 9 của cả 3 bộ SGK
- **Mô tả:** Bao phủ toàn bộ khối 9 nhưng chấp nhận khác biệt phân phối chương trình giữa Kết nối tri thức, Cánh Diều và Chân trời sáng tạo.
- **Rủi ro:** Ma trận kỹ năng phức tạp, học sinh học các bộ sách khác nhau gặp thứ tự chủ đề khác nhau, phân tán lực lượng biên soạn câu hỏi.

#### Phương án C: Dải rộng Lớp 6 đến Lớp 9 (Duy trì như Prototype hiện tại)
- **Mô tả:** Cho phép học sinh chọn từ Lớp 6 đến Lớp 9 ngay từ lúc đăng ký.
- **Rủi ro:** Ngân hàng câu hỏi chỉ đạt mức độ "bề nổi" (vài câu mỗi bài), không đủ biến thể để luyện tập sửa sai (remediation) hoặc tái đánh giá (reassessment); vi phạm nguyên tắc chất lượng của PRD.

### 3. Đánh giá Trade-off đa chiều

| Tiêu chí | Phương án A (Focus Lớp 9 KNTT) | Phương án B (Lớp 9 - 3 bộ SGK) | Phương án C (Lớp 6 - 9) |
| :--- | :--- | :--- | :--- |
| **Product & Market** | Rất cao; giải quyết đúng điểm đau cấp bách của học sinh thi vào 10. | Trung bình; thông điệp tiếp thị bị loãng. | Thấp; thiếu tính định vị sắc bén. |
| **UX & Learning** | Học sinh đi trọn vẹn vòng lặp Diagnostic → Remediation → Tiến bộ rõ rệt. | Dễ gây bối rối khi thuật ngữ/thứ tự bài học lệch SGK trường học. | Trải nghiệm nông, người dùng nhanh chóng hết câu hỏi luyện tập. |
| **Engineering** | Schema đơn giản: 1 version cây kiến thức pilot, giảm độ phức tạp mapper. | Phải xây bảng ánh xạ (Curriculum Mapping Matrix) đa bộ sách. | Tải dữ liệu lớn, bảng seed cồng kềnh, khó kiểm soát chất lượng dữ liệu test. |
| **Content Ops** | Khả thi: Đội ngũ chỉ cần thẩm định sâu ~350–400 câu hỏi chất lượng cao. | Nặng: Cần thẩm định ~1.200 câu hỏi cho 3 bộ sách. | Bất khả thi trong thời gian pilot: Cần tối thiểu 3.000 câu. |

### 4. Đề xuất của Product/UX Lead (Recommendation)
**Chọn Phương án A.**  
Tập trung toàn lực cho **Lớp 9 — Bộ Kết nối tri thức với cuộc sống**, định hướng **Ôn thi vào lớp 10**.

### 5. Tác động tới Hệ thống (Engineering & Product Impact)
- **Database Schema:** 
  - Bảng `Curriculum`: Cần trường `grade` (Int), `textbook` (Enum: `KNTT`, `CANH_DIEU`, `CTST`), `isPilotActive` (Boolean).
  - Khóa validation ở cấp API: Trong giai đoạn Pilot, chỉ chấp nhận tạo Diagnostic Attempt cho `grade = 9` và `textbook = 'KNTT'`. Các khối khác hiển thị nhãn *"Sắp ra mắt"* (Coming Soon).
- **Frontend / Routes:**
  - `src/components/OnboardingWizard.jsx`: Bước 2 (Chọn lớp) làm nổi bật Lớp 9 kèm badge *"Chương trình tối ưu tuyển sinh"*. Nếu chọn Lớp 6–8, hiển thị modal thông báo mời đăng ký danh sách chờ (Waitlist) thay vì vào luồng rỗng.
- **Copywriting:**
  - Loại bỏ tuyên bố marketing chung chung *"Đầy đủ 1.472 câu cho lớp 6-9"*. Thay bằng: *"Chương trình tối ưu ôn thi vào 10 chuẩn GDPT 2018 bộ Kết nối tri thức"*.

### 6. Rủi ro nếu trì hoãn quyết định
Nếu không chốt sớm, đội Content sẽ phân tán nguồn lực soạn câu hỏi cho cả 4 khối lớp dẫn đến không khối lớp nào có đủ câu hỏi đạt chuẩn kiểm định trước ngày bấm máy Pilot.

### 7. Phê duyệt Quyết định (Decision Record)
- **Owner ký duyệt:** Head of Product & Academic Lead
- **Hạn chót phê duyệt:** Hết Tuần 1 triển khai
- **Trạng thái phê duyệt:** `PENDING SIGN-OFF` (CHƯA PHÊ DUYỆT CHÍNH THỨC - Đang chờ Head of Product & Academic Lead ký)
- **Lựa chọn:** `[ ] ĐÃ CHỌN PHƯƠNG ÁN A` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN B` | `[ ] KHÁC`
- **Ghi chú phê duyệt:** ............................................................................
- **Chữ ký:** ..................................................... **Ngày:** .........................

---

## Quyết định D-02: Mô hình Định danh và Đăng ký của Học sinh

### 1. Vấn đề cần quyết định
Học sinh THCS là đối tượng vị thành niên (11–15 tuổi). Nhiều học sinh không có email riêng hoặc dùng chung thiết bị gia đình. Luật An toàn thông tin mạng và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân yêu cầu sự đồng ý của cha mẹ/người giám hộ khi xử lý dữ liệu trẻ em. Cần chọn cơ chế định danh phù hợp giữa tính dễ tiếp cận và tuân thủ pháp lý.

### 2. Các phương án thực tế

#### Phương án 1: Email + Password cá nhân độc lập (Mô hình Prototype hiện tại)
- **Mô tả:** Học sinh tự đăng ký bằng Email và Mật khẩu tự tạo.
- **Ưu điểm:** Quen thuộc, dễ tích hợp với các thư viện Auth chuẩn (Argon2id, Session cookie).
- **Nhược điểm:** Tỷ lệ quên mật khẩu cực cao ở lứa tuổi THCS; nhiều học sinh mượn email phụ huynh dẫn đến lẫn lộn thông báo; rủi ro pháp lý nếu không có cơ chế thu thập đồng ý của cha mẹ (Parental Consent).

#### Phương án 2: Định danh kép (Parent-linked) — Phụ huynh quản lý hoặc bảo trợ
- **Mô tả:** Tài khoản học sinh được tạo dưới sự xác nhận qua OTP/Email của phụ huynh; hoặc học sinh nhập email phụ huynh để hệ thống gửi thư thông báo đồng ý (Soft consent gate).
- **Ưu điểm:** Tuân thủ pháp lý tối đa, tạo sự tin tưởng tuyệt đối từ phía phụ huynh.
- **Nhược điểm:** Tỷ lệ rớt phễu (drop-off rate) ở bước Onboarding có thể lên tới 60–70% nếu bắt buộc phụ huynh phê duyệt trước khi học sinh được trải nghiệm.

#### Phương án 3: Mô hình Lai theo 2 nấc (Two-tier Hybrid Identity) (Khuyến nghị)
- **Nấc 1 (Trải nghiệm nhanh / Class-first):** 
  - Học sinh có thể đăng ký bằng `Username / Mã định danh học sinh + Mật khẩu` đơn giản, hoặc thông qua `Mã lớp học của Giáo viên` (Teacher-provisioned / Class invite code).
  - Hoặc đăng ký email cá nhân nhưng cho phép vào làm ngay bài chẩn đoán.
- **Nấc 2 (Bảo hộ & Đồng bộ lâu dài):** 
  - Yêu cầu bổ sung Email/Số điện thoại phụ huynh khi: (1) Muốn nhận báo cáo học tập tuần, (2) Khôi phục mật khẩu, (3) Khi lớp học yêu cầu liên lạc phụ huynh.

### 3. Đánh giá Trade-off đa chiều

| Tiêu chí | Phương án 1 (Email tự do) | Phương án 2 (Parent-linked cứng) | Phương án 3 (Mô hình Lai 2 nấc) |
| :--- | :--- | :--- | :--- |
| **UX Onboarding** | Mượt mà ban đầu nhưng tắc nghẽn khi quên mật khẩu. | Rất nặng nề; học sinh không thể tự bắt đầu tại lớp học. | Tối ưu: Bắt đầu trong 60 giây, hoàn thiện bảo hộ sau. |
| **Privacy & Pháp lý** | Rủi ro cao theo Nghị định 13/2023/NĐ-CP nếu bị thanh tra. | Tuyệt đối an toàn. | Kiểm soát rủi ro thông qua chính sách đồng thuận từng nấc. |
| **Engineering** | Schema chuẩn: `User (email, passwordHash)`. | Cần quan hệ phức tạp `ParentUser 1-N StudentUser`. | `User (username, email nullable, parentEmail nullable)`. |
| **Vận hành Lớp học** | Thầy cô khó quản lý nếu học sinh đặt email lạ (`demo456@...`). | Phụ huynh bận rộn làm chậm tiến độ vào lớp của cả lớp. | Giáo viên có thể điểm danh theo Họ tên & Username hiển thị. |

### 4. Đề xuất của Product/UX Lead (Recommendation)
**Chọn Phương án 3 (Mô hình Lai 2 nấc).**  
Cho phép đăng ký bằng **Username duy nhất (hoặc Email) + Mật khẩu**. Tại bước thiết lập hồ sơ, bổ sung trường *"Email phụ huynh nhận báo cáo tiến bộ"* (Tùy chọn ở pilot, bắt buộc nếu tham gia lớp học chính thức).

### 5. Tác động tới Hệ thống (Engineering & Product Impact)
- **Database Schema:**
  - Bảng `User`: Trường `email` cho phép nullable (hoặc email dạng format alias); thêm trường `username` (VarChar unique, index); thêm trường `parentEmail` (VarChar nullable); trường `parentConsentStatus` (Enum: `NOT_REQUIRED`, `PENDING`, `VERIFIED`).
  - Hỗ trợ cơ chế reset mật khẩu qua Giáo viên chủ nhiệm lớp nếu học sinh chưa gắn email phụ huynh.
- **API Endpoints:**
  - `POST /api/v1/auth/register-student`: Payload nhận `{ fullName, username, password, parentEmail? }`.
  - Rate limiting chặt chẽ cho endpoint đăng ký chống spam account.

### 6. Rủi ro nếu trì hoãn quyết định
Nếu OpenCode xây dựng cứng Schema `email` là khóa định danh duy nhất bắt buộc (`NOT NULL UNIQUE`), việc sửa lại sau này sẽ làm vỡ quan hệ Session, Auth provider và luồng Reset Password.

### 7. Phê duyệt Quyết định (Decision Record)
- **Owner ký duyệt:** Legal Officer & Product Owner
- **Hạn chót phê duyệt:** Hết Tuần 1 triển khai
- **Trạng thái phê duyệt:** `PENDING SIGN-OFF` (CHƯA PHÊ DUYỆT CHÍNH THỨC)
- **Lưu ý Pháp lý/Privacy:** `parentEmail`, `parentConsentStatus` chỉ là đề xuất kỹ thuật tạm thời, KHÔNG coi là requirement đã duyệt cho đến khi có chữ ký chính thức.
- **Lựa chọn:** `[ ] ĐÃ CHỌN PHƯƠNG ÁN 1` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN 2` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN 3`
- **Ghi chú phê duyệt:** ............................................................................
- **Chữ ký:** ..................................................... **Ngày:** .........................

---

## Quyết định D-03: Tiêu chí và Quy trình Xác minh Giáo viên

### 1. Vấn đề cần quyết định
Trong prototype hiện tại, người dùng chỉ cần tick chọn vai trò "Giáo viên" ở form đăng ký là được cấp quyền. Điều này tạo lỗ hổng bảo mật nghiêm trọng: bất kỳ ai cũng có thể giả danh giáo viên để tạo lớp, lấy mã lớp dụ dỗ học sinh tham gia và xem trộm dữ liệu năng lực của trẻ em. Cần thiết lập quy trình xác minh (Teacher Verification) chuẩn mực cho MVP.

### 2. Các phương án thực tế

#### Phương án A: Tự động qua Email đuôi giáo dục (`@edu.vn`, `@*.edu.vn`)
- **Mô tả:** Hệ thống tự động kích hoạt quyền Giáo viên nếu đăng ký bằng email có tên miền giáo dục được whitelist.
- **Hạn chế tại Việt Nam:** Rất nhiều giáo viên THCS công lập hoặc dạy kèm tự do không được cấp hoặc không có thói quen sử dụng email `.edu.vn`. Họ chủ yếu dùng Gmail cá nhân. Phương án này sẽ loại bỏ 70% giáo viên mục tiêu.

#### Phương án B: Quy trình Hàng đợi Duyệt thủ công có Maker-Checker (Khuyến nghị)
- **Mô tả:** 
  1. Người dùng đăng ký vai trò Giáo viên được cấp trạng thái ban đầu là `TEACHER_APPLICANT`.
  2. Người nộp đơn phải cung cấp: Trường/Đơn vị công tác, Tỉnh/Thành phố, Ảnh chụp thẻ giáo viên / Minh chứng phân công chuyên môn / Thư giới thiệu.
  3. Đội ngũ Admin xem xét hồ sơ tại Dashboard Quản trị và bấm `Phê duyệt` hoặc `Từ chối` (kèm lý do).
  4. Trong trạng thái `TEACHER_APPLICANT`, người dùng chỉ xem được hướng dẫn và giao diện demo, **hoàn toàn bị chặn API tạo lớp và xem dữ liệu học sinh**.

#### Phương án C: Xác minh qua Mã kích hoạt nội bộ (Voucher / Invitation Code)
- **Mô tả:** Chỉ những giáo viên được đội ngũ vận hành trao tận tay "Mã mời Giáo viên" (Teacher Invite Key) mới có thể nâng cấp tài khoản lên Giáo viên chính thức.
- **Ưu điểm:** An toàn tuyệt đối trong giai đoạn Pilot 2–5 giáo viên.
- **Nhược điểm:** Kém linh hoạt khi mở rộng ở Horizon 3.

### 3. Đánh giá Trade-off đa chiều

| Tiêu chí | Phương án A (Auto .edu.vn) | Phương án B (Hàng đợi duyệt Admin) | Phương án C (Invite Code nội bộ) |
| :--- | :--- | :--- | :--- |
| **Bảo mật & Trách nhiệm** | Trung bình (email trường có thể bị mượn). | Rất cao; có bằng chứng lưu trữ trong audit log. | Cao, kiểm soát bằng tay 100%. |
| **Trải nghiệm Giáo viên** | Nhanh nếu có email; bế tắc nếu không có. | Minh bạch: Có trạng thái "Đang chờ duyệt trong 24h". | Cần hỗ trợ 1-1 từ nhân viên vận hành. |
| **Khả năng mở rộng (Scale)** | Tự động hóa hoàn toàn. | Phù hợp pilot và giai đoạn đầu (vài chục GV/tuần). | Tốn công sức vận hành thủ công. |
| **Mức độ phức tạp code** | Đơn giản: Regex domain check. | Cần CRUD Queue, Upload chứng chỉ, Mail notify. | Cần bảng `TeacherInviteToken`. |

### 4. Đề xuất của Product/UX Lead (Recommendation)
**Kết hợp Phương án B và C:**
- Với đợt **Pilot đầu tiên (Horizon 2)**: Sử dụng **Invite Code nội bộ** do Admin cấp để onboard ngay 2–5 giáo viên đối tác mà không cần chờ xây xong hệ thống upload tài liệu phức tạp.
- Về mặt **Kiến trúc hệ thống lâu dài**: Xây dựng đầy đủ trạng thái `TEACHER_APPLICANT` và API chuyển trạng thái `APPROVED` / `REJECTED` để sẵn sàng cho Phương án B khi mở rộng.

### 5. Tác động tới Hệ thống (Engineering & Product Impact)
- **Database Schema:**
  - Bảng `TeacherProfile`: Khóa ngoại `userId`; `schoolName` (VarChar), `city` (VarChar), `verificationStatus` (Enum: `DRAFT`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`), `verifiedAt` (Timestamp nullable), `verifiedByAdminId` (UUID nullable), `rejectionReason` (Text nullable).
- **Quy tắc RBAC:**
  - Decorator `@Roles('TEACHER')` chỉ cho phép truy cập khi `user.role === 'TEACHER'` VÀ `teacherProfile.verificationStatus === 'VERIFIED'`.
  - Mọi nỗ lực gọi `POST /api/v1/classes` từ `TEACHER_APPLICANT` phải trả về mã lỗi HTTP `403 Forbidden` với error code `TEACHER_NOT_VERIFIED`.

### 6. Rủi ro nếu trì hoãn quyết định
Nếu mở quyền tạo lớp tự do, nền tảng vi phạm chính sách bảo vệ dữ liệu trẻ em ngay trong ngày đầu tiên chạy thử nghiệm.

### 7. Phê duyệt Quyết định (Decision Record)
- **Owner ký duyệt:** Lead Architect (Codex) & Operations Lead
- **Hạn chót phê duyệt:** Hết Tuần 2 triển khai
- **Trạng thái phê duyệt:** `PENDING SIGN-OFF` (CHƯA PHÊ DUYỆT CHÍNH THỨC - Đang chờ Lead Architect & Operations Lead ký)
- **Lựa chọn:** `[ ] ĐÃ CHỌN PHƯƠNG ÁN A` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN B` | `[ ] KẾT HỢP B & C`
- **Ghi chú phê duyệt:** ............................................................................
- **Chữ ký:** ..................................................... **Ngày:** .........................

---

## Quyết định D-04: Ranh giới Dữ liệu Học sinh Giáo viên được phép xem

### 1. Vấn đề cần quyết định
Khi học sinh tham gia vào lớp học của giáo viên bằng mã lớp, giáo viên có quyền xem những dữ liệu gì? 
Học sinh có thể tự luyện tập các bài riêng ngoài giờ học hoặc làm các bài chẩn đoán mang tính cá nhân. Nếu giáo viên xem được từng lần click chuột, từng câu làm sai ở chế độ tự học, học sinh sẽ hình thành tâm lý lo sợ bị đánh giá/chấm điểm, triệt tiêu tính trung thực của bài kiểm tra thích ứng.

### 2. Các phương án thực tế

#### Phương án 1: Toàn quyền xem mọi dữ liệu (Full Transparency)
- **Mô tả:** Giáo viên lớp học xem được toàn bộ: Lịch sử tự học, bài chẩn đoán đầu vào, điểm số chi tiết từng câu hỏi, thời gian online, lỗi sai trong sổ tay.
- **Rủi ro:** Xâm phạm quyền riêng tư học tập của học sinh; biến hệ thống tự học thành công cụ giám sát áp lực; học sinh có xu hướng gian lận hoặc nhờ người làm hộ để có số liệu đẹp trước mắt thầy cô.

#### Phương án 2: Ranh giới phân định rõ ràng (Scoped Intervention Privacy) (Khuyến nghị)
- **Mô tả:** Phân chia rạch ròi 2 vùng dữ liệu:
  1. **Vùng Bài tập trên lớp (Classroom Assignments):** Giáo viên tạo bài tập nào thì có toàn quyền xem điểm số, thời gian nộp, từng câu đúng/sai của học sinh đối với bài tập đó.
  2. **Vùng Năng lực tổng quát (Aggregated Competency Profile):** Giáo viên chỉ được xem **mức độ thành thạo tổng hợp** theo chủ đề (Ví dụ: *Học sinh Đức đang ở mức 65% chủ đề Căn thức*), phân loại học sinh cần can thiệp (Cần hỗ trợ / Đạt / Khá). Giáo viên **không được xem** nhật ký từng câu hỏi tự luyện riêng tư hay câu làm sai trong Sổ tay cá nhân trừ khi học sinh chủ động bấm "Chia sẻ với thầy cô".
- **Ưu điểm:** Bảo vệ tâm lý học sinh; giữ vững giá trị chẩn đoán trung thực; cung cấp đúng tín hiệu can thiệp mà giáo viên cần mà không gây ngợp thông tin (cognitive overload).

#### Phương án 3: Dữ liệu ẩn danh cấp lớp (Anonymous Class Analytics)
- **Mô tả:** Giáo viên chỉ xem được báo cáo chung của toàn lớp (Ví dụ: *Lớp có 40% học sinh yếu phần Hệ thức lượng*), không xem được danh tính cụ thể từng em trừ các bài kiểm tra trực tiếp.
- **Hạn chế:** Triệt tiêu khả năng can thiệp sư phạm cá nhân hóa 1-1 của giáo viên.

### 3. Đánh giá Trade-off đa chiều

| Tiêu chí | Phương án 1 (Full Access) | Phương án 2 (Scoped Privacy) | Phương án 3 (Anonymous) |
| :--- | :--- | :--- | :--- |
| **Giá trị Sư phạm** | Dễ gây phán xét tiêu cực. | Tối ưu: Đúng tín hiệu cần can thiệp. | Thấp: Không biết cần phụ đạo em nào. |
| **Tâm lý Học sinh** | Căng thẳng, dễ gian lận khi làm test. | Thoải mái, tự tin thử sai khi tự học. | An toàn tuyệt đối nhưng thiếu hỗ trợ. |
| **Bảo vệ Dữ liệu** | Rủi ro rò rỉ dữ liệu cá nhân nhạy cảm. | Đúng nguyên tắc tối thiểu hóa (Data Minimization). | Rất cao. |
| **Độ phức tạp Backend** | Truy vấn trực tiếp không cần lọc quyền. | Cần Scoped Queries theo `classId` và `assignmentId`. | Cần các hàm thống kê Aggregate nặng. |

### 4. Đề xuất của Product/UX Lead (Recommendation)
**Chọn Phương án 2 (Scoped Intervention Privacy).**  
Thiết lập ranh giới bảo mật rõ ràng: Bài tập của lớp thuộc quyền sở hữu của lớp; Hồ sơ tự luyện chỉ chia sẻ ở mức độ phần trăm thành thạo kỹ năng tổng hợp.

### 5. Tác động tới Hệ thống (Engineering & Product Impact)
- **Database Schema & Authorization:**
  - Không truy vấn chéo: `GET /api/v1/teacher/classes/:id/students/:studentId` chỉ trả về:
    - `{ studentName, joinedAt, overallMasteryBySkill: [{ skillId, level, status }], assignmentSubmissions: [...] }`.
    - **Nghiêm cấm** trả về: `studentPersonalMistakes`, `independentPracticeLogs`.
- **UX & Giao diện:**
  - Màn hình Học sinh tham gia lớp: Bổ sung dòng thông báo minh bạch: *"Khi tham gia lớp, Thầy/Cô sẽ xem được mức độ thành thạo các chủ đề và kết quả các bài tập Thầy/Cô giao. Lịch sử tự học cá nhân của bạn được bảo mật."*

### 6. Rủi ro nếu trì hoãn quyết định
Nếu OpenCode viết các API Giáo viên trả về toàn bộ thực thể `Student` kèm toàn bộ quan hệ (Eager loading all student logs), sau này việc cắt tỉa quyền sẽ tạo breaking change trên cả frontend lẫn backend.

### 7. Phê duyệt Quyết định (Decision Record)
- **Owner ký duyệt:** Product Owner & Lead Architect
- **Hạn chót phê duyệt:** Hết Tuần 1 triển khai
- **Trạng thái phê duyệt:** `PENDING SIGN-OFF` (CHƯA PHÊ DUYỆT CHÍNH THỨC - Đang chờ Product Owner & Lead Architect ký)
- **Lựa chọn:** `[ ] ĐÃ CHỌN PHƯƠNG ÁN 1` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN 2` | `[ ] ĐÃ CHỌN PHƯƠNG ÁN 3`
- **Ghi chú phê duyệt:** ............................................................................
- **Chữ ký:** ..................................................... **Ngày:** .........................

---

## 3. Tóm tắt Hành động tiếp theo sau Gate 0

1. **Gửi Change Note cho Lead Architect (Codex) và Kỹ sư (OpenCode):**
   - Lưu ý tạm thời áp dụng các giả định của Recommendation (D-01: Lớp 9 KNTT; D-02: Username/Email; D-03: Invite Token + Teacher Applicant RBAC; D-04: Scoped Queries) để định hình Schema Prisma không bị phụ thuộc cứng.
2. **Chuyển tiếp Deliverable:**
   - Tiến hành soạn thảo ngay **Deliverable 2: Target Journey & Service Blueprint** (`docs/product/TARGET-JOURNEYS.md`) và **Deliverable 3: UX State Spec** (`docs/product/UX-STATE-SPEC.md`).
