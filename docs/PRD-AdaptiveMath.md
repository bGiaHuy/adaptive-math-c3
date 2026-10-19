# PRD — AdaptiveMath

**Phiên bản:** 0.1 (bản đề xuất sau khi rà soát prototype)  
**Trạng thái:** Draft để thống nhất phạm vi MVP  
**Đối tượng đọc:** Product, UI/UX, Frontend, Backend, QA, Content Toán  
**Phạm vi:** Web học Toán THCS cho Học sinh, Giáo viên và Quản trị viên

---

## 1. Tóm tắt quyết định

AdaptiveMath là nền tảng học Toán THCS cá nhân hóa theo năng lực. Học sinh thiết lập mục tiêu, làm bài chẩn đoán, nhận lộ trình và luyện tập; giáo viên tạo lớp, giao bài và theo dõi tiến bộ; quản trị viên vận hành người dùng, nội dung và hệ thống.

Prototype hiện tại chứng minh được phần lớn luồng giao diện của Học sinh nhưng chưa phải một hệ thống nhiều vai trò hoàn chỉnh. Sản phẩm MVP nên được xây theo hướng:

- Frontend: **Next.js App Router + React + TypeScript**.
- Backend: **NestJS + TypeScript**, kiến trúc modular monolith.
- API: **REST/JSON, OpenAPI**, phiên bản `/api/v1`.
- Database: **PostgreSQL + Prisma ORM**.
- Cache/session/job: **Redis**; hàng đợi nền dùng BullMQ khi cần.
- Đăng nhập web: **opaque server-side session** qua cookie `HttpOnly`, `Secure`, `SameSite=Lax`; không lưu access/refresh token trong `localStorage`.
- Phân quyền: **RBAC kết hợp kiểm tra ownership/scope** tại backend; frontend chỉ dùng quyền để điều chỉnh giao diện, không phải rào chắn bảo mật.
- Giáo viên được tự đăng ký nhưng chỉ nhận quyền Giáo viên sau khi xác minh; Admin chỉ được tạo bằng lời mời hoặc thao tác nội bộ và bắt buộc MFA.

Kiến trúc này ưu tiên tốc độ ra MVP, dễ kiểm thử, khả năng mở rộng và an toàn dữ liệu học sinh. Chưa cần microservices hoặc Kubernetes ở giai đoạn đầu.

---

## 2. Bối cảnh và vấn đề cần giải quyết

Học sinh THCS thường không biết chính xác mình yếu ở chủ đề nào, học dàn trải và thiếu một kế hoạch phù hợp với mục tiêu hoặc quỹ thời gian. Giáo viên khó quan sát lỗ hổng kiến thức của từng em khi lớp đông. Nhà vận hành cần một công cụ đáng tin cậy để quản lý nội dung, tài khoản, chất lượng câu hỏi và sự cố.

AdaptiveMath cần giải quyết ba nhu cầu:

1. Học sinh biết mình đang ở đâu và nên học gì tiếp theo.
2. Giáo viên nhìn thấy tiến bộ và can thiệp đúng học sinh, đúng chủ đề.
3. Admin kiểm soát chất lượng nội dung và hoạt động hệ thống mà không can thiệp tùy tiện vào dữ liệu riêng tư.

---

## 3. Kết quả rà soát prototype hiện tại

### 3.1 Công nghệ và trạng thái

- React 18 + Vite 5, JavaScript, CSS thuần.
- Điều hướng bằng state trong `App.jsx`, chưa có URL/router.
- Không có backend, database, API hoặc hệ thống xác thực thật.
- Người dùng, hồ sơ và kết quả được lưu trong `localStorage`.
- Build production chạy thành công: 1.593 modules; bundle JavaScript khoảng 464 kB trước gzip, 140 kB sau gzip.
- Có UI cho Học sinh và lựa chọn vai trò Giáo viên; chưa có UI/Admin flow.

### 3.2 Luồng đang có

```text
Landing
  → Đăng ký / Đăng nhập giả lập
  → Loading
  → Dashboard dùng chung
  → Thiết lập hồ sơ 8 bước
  → Kiểm tra đầu vào 3 câu
  → Hồ sơ năng lực
  → Lộ trình / Nhiệm vụ / Sổ lỗi sai / Lớp học
```

Vai trò `student` hoặc `teacher` chỉ được lưu như một thuộc tính và hiển thị trên Navbar. Cả hai vai trò vẫn thấy cùng Sidebar, cùng dashboard và cùng chức năng. Không có kiểm tra quyền ở route hoặc dữ liệu.

### 3.3 Điểm tốt có thể kế thừa

- Giá trị sản phẩm và CTA trên landing tương đối rõ.
- Onboarding đã thu thập lớp, mục tiêu, quỹ thời gian, ngày thi, tự đánh giá và chủ đề yếu.
- Đã có khái niệm bài chẩn đoán thích ứng, hồ sơ năng lực, lộ trình, nhiệm vụ, sổ lỗi sai và mã lớp.
- Component được tách theo màn hình, phù hợp để dùng làm reference khi chuyển sang cấu trúc route/module.

### 3.4 Khoảng trống và lỗi cần ưu tiên

| Mức | Phát hiện | Tác động | Hướng xử lý |
|---|---|---|---|
| P0 | Đăng nhập chỉ giả lập; mật khẩu không được xác minh | Bất kỳ ai cũng có thể vào hệ thống | Xây auth/session thật trước khi kết nối dữ liệu thật |
| P0 | Không có RBAC và ownership check | Giáo viên/Học sinh có thể truy cập sai dữ liệu nếu chỉ nối API vào UI hiện tại | Guard/policy ở từng backend use case |
| P0 | Dữ liệu học tập chỉ nằm ở `localStorage` | Mất dữ liệu, không đồng bộ thiết bị, có thể bị sửa | PostgreSQL là nguồn dữ liệu chuẩn |
| P0 | Mã lớp dài từ 4 ký tự bất kỳ đều được coi là hợp lệ | Tham gia lớp giả, rò rỉ logic | Tra cứu server-side, mã ngẫu nhiên, rate limit, trạng thái lớp |
| P1 | Chọn lớp 6–8 nhưng danh sách chủ đề onboarding vẫn là lớp 9 | Sai nội dung và lộ trình | Tải curriculum theo grade/version |
| P1 | Ngân hàng hiện có 3 câu nhưng UI mô tả 1.472 câu/92 bài | Không đủ để đánh giá thích ứng | CMS nội dung + quy trình review/publish |
| P1 | Kết quả `answers` bỏ thiếu câu cuối do cập nhật state bất đồng bộ | Báo cáo sai | Tạo `nextAnswers` và gửi toàn bộ attempt |
| P1 | Timer hết giờ tự quay lại 90 giây | Không có hành vi timeout đúng | Tự nộp/đánh dấu timeout theo rule |
| P1 | Sổ lỗi sai không được cập nhật | Chức năng luôn rỗng | Tạo mistake record từ attempt/submission |
| P1 | `localStorage.clear()` khi logout | Có thể xóa dữ liệu khác cùng origin | Chỉ thu hồi session và xóa key thuộc ứng dụng |
| P2 | Ngày hiện tại, lịch, số học sinh, tiến độ đều hard-code | Trải nghiệm gây hiểu nhầm | Lấy dữ liệu thật; gắn nhãn demo nếu chưa có |
| P2 | Không có URL riêng cho màn hình | Không deep-link, refresh hoặc guard route đúng | Dùng file-based routing |
| P2 | Chưa có validation đầy đủ, reset password, verify email, audit log | Rủi ro vận hành và bảo mật | Đưa vào Auth/Admin MVP |

---

## 4. Mục tiêu và chỉ số thành công

### 4.1 Mục tiêu MVP

- Học sinh hoàn tất onboarding và bài chẩn đoán, sau đó nhận được lộ trình cá nhân hóa có thể học ngay.
- Giáo viên tạo lớp, mời học sinh, giao nội dung và xem báo cáo theo lớp/học sinh.
- Admin quản lý tài khoản, curriculum, ngân hàng câu hỏi và lịch sử thay đổi.
- Mọi truy cập dữ liệu đều được xác thực, phân quyền và ghi audit đối với thao tác nhạy cảm.

### 4.2 Chỉ số sản phẩm đề xuất

| Chỉ số | Mục tiêu MVP ban đầu |
|---|---:|
| Tỷ lệ đăng ký → hoàn tất onboarding | ≥ 65% |
| Tỷ lệ bắt đầu → hoàn tất diagnostic | ≥ 75% |
| Học sinh quay lại học trong 7 ngày | ≥ 35% |
| Học sinh hoàn thành ít nhất 3 phiên/tuần | ≥ 25% |
| Giáo viên tạo lớp → có ít nhất 5 học sinh tham gia | ≥ 50% |
| API availability theo tháng | ≥ 99,5% |
| Request API p95, không tính tác vụ nền | < 500 ms |
| Sự cố truy cập chéo dữ liệu lớp | 0 |

Các ngưỡng cần được hiệu chỉnh sau 4–6 tuần beta dựa trên cohort thật.

---

## 5. Persona và phạm vi vai trò

### 5.1 Học sinh

Học sinh lớp 6–9 muốn xác định lỗ hổng, học theo mục tiêu và theo dõi tiến bộ. Có thể học độc lập hoặc tham gia lớp của giáo viên.

### 5.2 Giáo viên

Giáo viên Toán quản lý một hoặc nhiều lớp, giao bài/lộ trình, xem báo cáo và hỗ trợ học sinh. Giáo viên chỉ được xem học sinh thuộc lớp mình phụ trách và dữ liệu được học sinh/nhà trường cho phép.

### 5.3 Admin

Nhân sự vận hành nền tảng, gồm hai permission bundle ban đầu:

- `content_admin`: bundle quản lý curriculum, bài học, câu hỏi, đáp án và phiên bản nội dung. Bundle gồm các permission tách biệt `content:create`, `content:review`, `content:publish`; quy tắc maker-checker không cho cùng một người vừa tạo vừa duyệt/publish chính nội dung đó.
- `platform_admin`: quản lý tài khoản, xác minh giáo viên, cấu hình hệ thống và sự cố.

Một tài khoản có thể có nhiều role. Backend hợp nhất permission từ các role nhưng luôn áp dụng scope/ownership và explicit deny; “workspace hiện hành” ở UI chỉ đổi menu/ngữ cảnh, không làm thay đổi quyền thật. Mỗi user có `permission_version`; đổi role/quyền làm tăng version và thu hồi hoặc buộc refresh toàn bộ session. Không tạo lựa chọn “Admin” ở form đăng ký công khai.

Người đăng ký theo luồng Giáo viên ban đầu là **teacher applicant**, chưa có role `teacher`. Họ chỉ có quyền quản lý hồ sơ xác minh. Role `teacher` được Platform Admin cấp sau khi hồ sơ được duyệt và bị thu hồi nếu xác minh mất hiệu lực.

---

## 6. Ma trận phân quyền

Ký hiệu: **Tạo/Quản lý**, **Xem**, **Không**.

| Tài nguyên / Hành động | Học sinh | Giáo viên | Content Admin | Platform Admin |
|---|---|---|---|---|
| Hồ sơ cá nhân | Tạo/Quản lý của mình | Tạo/Quản lý của mình | Không mặc định | Xem giới hạn để hỗ trợ |
| Hồ sơ năng lực | Xem của mình | Xem học sinh trong lớp phụ trách | Không | Xem khi có lý do hỗ trợ + audit |
| Diagnostic / luyện tập | Làm và xem kết quả của mình | Xem báo cáo; không sửa câu trả lời | Xem dữ liệu tổng hợp | Xem dữ liệu tổng hợp |
| Lộ trình học | Xem/thực hiện của mình | Giao/điều chỉnh trong lớp | Không | Không mặc định |
| Lớp học | Tham gia/rời theo chính sách | Tạo, sửa, đóng lớp của mình | Không | Khóa/khôi phục khi có sự cố |
| Thành viên lớp | Xem thông tin lớp tối thiểu | Mời/xóa học sinh trong lớp mình | Không | Hỗ trợ có audit |
| Bài tập | Nộp bài của mình | Tạo/giao/chấm trong lớp mình | Không | Không mặc định |
| Curriculum | Chỉ đọc bản đã publish | Chỉ đọc bản đã publish | Theo permission create/review/publish và maker-checker | Cấu hình, không sửa nội dung mặc định |
| Ngân hàng câu hỏi | Không truy cập trực tiếp đáp án | Xem theo quyền soạn/giao; không lộ đáp án trước hạn | CRUD + review + publish | Khóa nội dung vi phạm |
| Người dùng và role | Không | Không | Không | Quản lý, đình chỉ, gán role có audit |
| Audit log | Không | Chỉ log liên quan lớp nếu cần | Log nội dung | Xem toàn bộ theo quyền |
| Cấu hình hệ thống | Không | Không | Cấu hình nội dung giới hạn | Quản lý |

### 6.1 Quy tắc bắt buộc

- Không tin cậy `role` gửi từ client; role lấy từ session/database.
- Mỗi request backend kiểm tra cả permission và quan hệ sở hữu: ví dụ `teacher:student:read` chỉ hợp lệ khi học sinh đang thuộc lớp do giáo viên phụ trách.
- Học sinh không thể tự nâng quyền thành Giáo viên/Admin.
- Giáo viên `pending_verification` chỉ được hoàn tất hồ sơ; chưa được tạo lớp hoặc xem dữ liệu học sinh.
- Membership đang hoạt động là scope chia sẻ dữ liệu lớp trong MVP: trước khi tham gia, học sinh thấy rõ loại dữ liệu Giáo viên được xem; rời/bị xóa khỏi lớp chặn truy cập dữ liệu mới ngay lập tức. Căn cứ đồng ý/đại diện hợp pháp cho học sinh nhỏ tuổi phải được Legal/Product chốt trước beta thật.
- Thao tác gán role, khóa tài khoản, publish nội dung, reset MFA và hỗ trợ truy cập dữ liệu phải có audit log bất biến.
- Admin không mặc nhiên được xem mọi câu trả lời chi tiết; truy cập hỗ trợ phải có mục đích, thời hạn và log.

---

## 7. Workflow mục tiêu

### 7.1 Học sinh mới

```text
Landing
  → Đăng ký bằng email/mật khẩu hoặc Google
  → Xác minh email
  → Chọn lớp và mục tiêu
  → Chọn thời gian/ngày thi/tự đánh giá/chủ đề yếu
  → Xác nhận hồ sơ
  → Diagnostic thích ứng
  → Kết quả + giải thích mức năng lực
  → Sinh lộ trình
  → Phiên học hằng ngày
  → Cập nhật mastery, streak, nhiệm vụ và sổ lỗi sai
```

Nếu học sinh vào từ link/mã mời lớp, lời mời được giữ xuyên suốt auth và chỉ xác nhận tham gia sau khi đăng nhập.

### 7.2 Học sinh quay lại

```text
Đăng nhập
  → Dashboard “Việc nên làm tiếp theo”
  → Tiếp tục bài đang dở hoặc nhiệm vụ hôm nay
  → Nộp bài
  → Phản hồi tức thời
  → Cập nhật lộ trình
```

### 7.3 Giáo viên

```text
Đăng ký
  → Xác minh email
  → Gửi thông tin xác minh giáo viên
  → Được duyệt
  → Tạo lớp
  → Nhận mã/link mời
  → Học sinh tham gia
  → Giao diagnostic/bài tập/lộ trình
  → Xem dashboard lớp và cảnh báo
  → Xem chi tiết học sinh
  → Can thiệp: giao bài, ghi chú, nhắc học
```

Giáo viên chưa được xác minh có trạng thái rõ ràng, hướng dẫn bổ sung hồ sơ và thời gian xử lý dự kiến.

### 7.4 Admin nội dung

```text
Đăng nhập + MFA
  → Tạo/sửa câu hỏi ở trạng thái Draft
  → Preview công thức và đáp án
  → Gửi review
  → Người khác duyệt
  → Publish phiên bản
  → Theo dõi thống kê chất lượng
  → Retire/rollback nếu có lỗi
```

Không cho người tạo tự duyệt nội dung quan trọng trong giai đoạn vận hành chính thức.

### 7.5 Platform Admin

```text
Đăng nhập + MFA
  → Dashboard vận hành
  → Xử lý hàng chờ xác minh giáo viên / báo cáo vi phạm / sự cố
  → Thực hiện thao tác có lý do
  → Hệ thống ghi audit
```

---

## 8. Yêu cầu chức năng

### 8.1 Authentication và tài khoản

- Đăng ký Học sinh/Giáo viên; không đăng ký Admin công khai.
- Xác minh email, đăng nhập, đăng xuất tất cả thiết bị, quên/đặt lại mật khẩu.
- Tùy chọn Google OAuth/OIDC; liên kết tài khoản theo email đã xác minh, có cơ chế chống account takeover.
- Session list: thiết bị, thời gian, vị trí gần đúng; cho phép thu hồi.
- MFA TOTP hoặc WebAuthn bắt buộc cho Admin, tùy chọn cho Giáo viên.
- Rate limit và chống credential stuffing cho auth endpoints.
- Khóa mềm/đình chỉ tài khoản, không xóa cứng dữ liệu học tập ngay lập tức.

### 8.2 Học sinh

- Quản lý hồ sơ học: khối lớp, mục tiêu, quỹ thời gian, ngày thi, chủ đề tự đánh giá yếu.
- Làm diagnostic có autosave, resume, timeout rõ ràng và idempotent submission.
- Xem competency theo topic/skill, mức tin cậy và ngày cập nhật.
- Nhận lộ trình có lý do ưu tiên; bắt đầu/tiếp tục từng activity.
- Xem nhiệm vụ, streak, lịch học và tiến độ.
- Sổ lỗi sai tự động ghi câu sai, lời giải và trạng thái đã khắc phục.
- Tìm và tham gia lớp bằng mã/link hợp lệ; xem giáo viên, lớp và quyền chia sẻ trước khi xác nhận.

### 8.3 Giáo viên

- Tạo/sửa/đóng/lưu trữ lớp; mã lớp có thể xoay vòng hoặc vô hiệu hóa.
- Mời, duyệt, xóa học sinh; xuất danh sách khi có quyền.
- Tạo assignment từ lesson/question set; đặt hạn, số lần làm và chính sách hiển thị đáp án.
- Dashboard lớp: participation, completion, accuracy, mastery theo chủ đề, học sinh cần hỗ trợ.
- Chi tiết học sinh: lịch sử tiến bộ, lỗi thường gặp, assignment; không cho sửa attempt gốc.
- Ghi chú riêng của giáo viên và gửi phản hồi phù hợp.

### 8.4 Admin nội dung

- CRUD curriculum theo grade, school year, program/textbook/version.
- CRUD topic, skill, lesson, question, option, đáp án, lời giải, độ khó và metadata.
- Workflow `draft → in_review → approved → published → retired`.
- Preview KaTeX, validate câu hỏi, phát hiện thiếu đáp án/giải thích/trùng lặp cơ bản.
- Import/export có validation và báo cáo lỗi theo dòng.
- Versioning để attempt cũ luôn trỏ đúng phiên bản câu hỏi đã làm.

### 8.5 Platform Admin

- Tìm tài khoản theo trường tối thiểu; khóa/mở khóa; thu hồi session.
- Duyệt/từ chối xác minh Giáo viên kèm lý do.
- Gán role theo policy; thao tác nhạy cảm yêu cầu xác nhận lại/MFA.
- Xem audit log, health metrics, job failures và báo cáo lỗi nội dung.
- Feature flags cho rollout an toàn.

---

## 9. Diagnostic và cá nhân hóa

### 9.1 Phạm vi MVP

MVP nên dùng engine thích ứng dựa trên rule có thể giải thích, chưa tuyên bố là IRT/CAT đã được kiểm định nếu chưa có dữ liệu hiệu chỉnh câu hỏi.

- Chọn câu theo grade, skill, difficulty, coverage và lịch sử đã làm.
- Cập nhật mastery theo kết quả, độ khó và recency.
- Điều kiện dừng: đủ coverage, đạt độ tin cậy tối thiểu, hết thời gian hoặc số câu tối đa.
- Lưu decision trace: câu nào được chọn, vì sao, phiên bản thuật toán nào.
- Kết quả phải phân biệt “ước lượng ban đầu” với “năng lực đã được củng cố qua luyện tập”.

Baseline để Engineering có thể estimate: mỗi skill ưu tiên được thăm dò từ mức trung bình; hai câu đúng liên tiếp tăng một difficulty bucket, hai câu sai liên tiếp giảm một bucket; mỗi skill dừng sau 3–5 câu hoặc khi kết quả ổn định; toàn bài tối đa 24 câu. Confidence chỉ hiển thị `low/medium/high` theo số quan sát và độ nhất quán, không giả vờ là xác suất đã hiệu chỉnh. Công thức score, tie-break, coverage và bộ test vàng phải được chốt trong một **Assessment Algorithm Spec** trước khi bắt đầu Sprint Student vertical slice.

### 9.2 Giai đoạn sau

- Hiệu chỉnh tham số câu hỏi từ dữ liệu thật.
- A/B test thuật toán chọn câu và xếp lộ trình.
- IRT/CAT chỉ phát hành sau khi có kiểm định độ tin cậy, fairness và quy mô mẫu phù hợp.

---

## 10. Kiến trúc kỹ thuật đề xuất

### 10.1 Sơ đồ logic

```text
Browser
  → Next.js Web (SSR/RSC + client interactions)
      → NestJS REST API
          → PostgreSQL (system of record)
          → Redis (session, rate limit, cache, queue)
          → Worker (email, report, recalculation)
          → S3-compatible storage (import/export/assets)
```

### 10.2 Frontend

**Chọn:** Next.js App Router, React, TypeScript.

Lý do:

- Có route/layout thực cho `/student`, `/teacher`, `/admin`, hỗ trợ deep-link và route guard.
- Landing page được render tốt cho SEO; khu vực ứng dụng vẫn hỗ trợ tương tác client phong phú.
- Server-side data access giảm lộ dữ liệu và bundle không cần thiết.
- Có thể chuyển dần component React hiện tại thay vì bỏ toàn bộ UI.

Thư viện đề xuất:

- Styling: Tailwind CSS + CSS variables/design tokens; có thể giữ CSS hiện tại trong lúc migration.
- Form/validation: React Hook Form + Zod.
- Client server-state: TanStack Query chỉ cho màn hình cần polling/cache/mutation phía client.
- Math: KaTeX tiếp tục sử dụng; bổ sung sanitization và test accessibility.
- Test: Vitest + Testing Library; Playwright cho E2E.

Nếu mục tiêu chỉ là demo nội bộ ngắn hạn, có thể giữ Vite. Với sản phẩm thật có landing SEO, nhiều role và route bảo vệ, chuyển sang Next.js sớm sẽ giảm nợ kỹ thuật.

### 10.3 Backend

**Chọn:** NestJS + TypeScript, modular monolith.

Module ban đầu:

- Identity & Access
- Users & Profiles
- Schools & Teacher Verification
- Classrooms & Memberships
- Curriculum & Content
- Assessments & Attempts
- Mastery & Learning Paths
- Assignments
- Notifications
- Admin & Audit

Một codebase/module rõ ràng nhanh hơn microservices ở MVP, nhưng vẫn cho phép tách Assessment hoặc Notification thành service sau này nếu tải hoặc đội ngũ yêu cầu.

### 10.4 Database và hạ tầng dữ liệu

- PostgreSQL cho quan hệ chặt giữa user, classroom, enrollment, content version và attempt.
- Prisma ORM cho migration, type-safe query và tốc độ phát triển.
- PostgreSQL là nguồn chuẩn cho session/revocation; Redis chỉ cache session ngắn hạn, rate limit và distributed lock. Cache key mang `permission_version` và bị xóa khi role, mật khẩu hoặc trạng thái tài khoản thay đổi.
- BullMQ cho email, tạo report, recompute mastery và tác vụ retry được.
- Object storage tương thích S3 cho file import/export và media.
- Backup tự động, point-in-time recovery theo gói hạ tầng, kiểm thử restore định kỳ.

PostgreSQL Row-Level Security có thể dùng như lớp phòng thủ bổ sung cho dữ liệu nhạy cảm theo tenant/lớp, nhưng không thay thế authorization trong service. Khi bật RLS phải có test để tránh cả rò dữ liệu lẫn thiếu dữ liệu trong backup/job.

### 10.5 API

**Chọn:** REST/JSON + OpenAPI 3.x.

REST phù hợp vì domain chủ yếu là resource/workflow rõ ràng, dễ cache, audit, test và tích hợp mobile sau này. Không cần GraphQL trong MVP. Quy ước:

- Prefix `/api/v1`.
- ID dùng UUID/ULID, không dùng ID tăng dần công khai.
- Pagination cursor cho danh sách lớn.
- UTC ISO 8601 trong API; timezone hiển thị theo người dùng.
- Idempotency key cho tạo submission, join class và tác vụ dễ bấm lặp.
- Error shape thống nhất: `code`, `message`, `fieldErrors`, `requestId`.
- Không trả đáp án đúng trước khi attempt được nộp hoặc chính sách cho phép.

### 10.6 Quan sát và vận hành

- Structured logs có `requestId`, `actorId` đã pseudonymize và action; không log mật khẩu/session/đáp án nhạy cảm không cần thiết.
- Error tracking, metrics, tracing OpenTelemetry.
- Dashboard cho latency, error rate, login failures, queue depth, attempt completion.
- CI: lint, typecheck, unit, integration, migration check, E2E smoke, dependency/security scan.
- Triển khai bằng container trên managed platform; chưa cần Kubernetes cho MVP.

---

## 11. Thiết kế đăng nhập và session

### 11.1 Phương án được chọn

**Opaque session ID lưu server-side**, gửi cho trình duyệt bằng cookie:

```text
Set-Cookie: __Host-am_session=<random-id>;
            Path=/; HttpOnly; Secure; SameSite=Lax
```

- Session record trong PostgreSQL lưu hash của session ID, user ID, `permission_version`, thời hạn, thiết bị và trạng thái thu hồi. Không lưu role snapshot có thể sống lâu hơn quyền hiện tại; authorization resolve quyền từ cache/DB đã version hóa.
- Rotate session sau login, đổi mật khẩu, bật/tắt MFA hoặc đổi quyền.
- Idle timeout và absolute timeout khác nhau; “remember me” tạo session có thời hạn dài hơn nhưng vẫn thu hồi được.
- State-changing request kiểm tra Origin/Referer và CSRF token theo kiến trúc triển khai.
- Mật khẩu hash bằng Argon2id với tham số được benchmark trên hạ tầng thật.
- Token reset/xác minh email là one-time, lưu dạng hash, có TTL ngắn.

### 11.2 Vì sao không lưu JWT trong `localStorage`

JavaScript cùng origin có thể đọc `localStorage`; một lỗi XSS có thể lấy token và dùng ngoài trình duyệt. Cookie `HttpOnly` giảm khả năng đánh cắp secret bằng JavaScript. Session server-side còn cho phép logout/revoke tức thời, phù hợp với tài khoản học sinh và Admin.

JWT vẫn có thể dùng cho service-to-service hoặc ứng dụng mobile sau này, nhưng không phải lựa chọn mặc định cho web browser MVP.

### 11.3 Luồng quyền sau đăng nhập

```text
Request
  → Xác thực session
  → Kiểm tra trạng thái user/session
  → Resolve roles + permissions
  → Kiểm tra ownership/scope của resource
  → Thực thi use case
  → Audit nếu là thao tác nhạy cảm
```

Redirect/hide menu ở frontend chỉ phục vụ UX. Mỗi API và Server Action vẫn phải kiểm tra quyền gần nguồn dữ liệu.

---

## 12. API MVP đề xuất

### 12.1 Auth và user

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Đăng ký Student/Teacher |
| POST | `/api/v1/auth/login` | Public | Tạo session |
| POST | `/api/v1/auth/logout` | Authenticated | Thu hồi session hiện tại |
| POST | `/api/v1/auth/logout-all` | Authenticated | Thu hồi mọi session |
| POST | `/api/v1/auth/verify-email` | Public + token | Xác minh email |
| POST | `/api/v1/auth/forgot-password` | Public | Gửi link reset, không làm lộ email tồn tại |
| POST | `/api/v1/auth/reset-password` | Public + token | Đặt mật khẩu mới |
| GET | `/api/v1/auth/oauth/google/start` | Public | Bắt đầu Google OIDC |
| GET | `/api/v1/auth/oauth/google/callback` | Public | Xác minh callback và liên kết an toàn |
| GET | `/api/v1/auth/sessions` | Authenticated | Danh sách session/thiết bị |
| DELETE | `/api/v1/auth/sessions/{id}` | Owner | Thu hồi một session |
| POST | `/api/v1/auth/mfa/enroll` | Authenticated + re-auth | Bắt đầu đăng ký MFA |
| POST | `/api/v1/auth/mfa/verify` | Authenticated | Xác nhận MFA challenge |
| GET | `/api/v1/me` | Authenticated | User, role, permission, onboarding state |
| PATCH | `/api/v1/me/profile` | Owner | Sửa hồ sơ cá nhân |
| PUT | `/api/v1/me/learning-profile` | Student | Sửa cấu hình học |

### 12.2 Curriculum, assessment và learning

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| GET | `/api/v1/curricula?grade=` | Authenticated | Curriculum đã publish |
| POST | `/api/v1/diagnostics` | Student | Tạo diagnostic attempt |
| GET | `/api/v1/diagnostics/{id}/next-question` | Owner | Nhận câu tiếp theo |
| PUT | `/api/v1/diagnostics/{id}/answers/{questionId}` | Owner | Autosave câu trả lời, idempotent |
| POST | `/api/v1/diagnostics/{id}/submit` | Owner | Nộp bài |
| GET | `/api/v1/diagnostics/{id}/result` | Owner/Teacher scoped | Kết quả |
| GET | `/api/v1/me/mastery` | Student | Hồ sơ năng lực |
| GET | `/api/v1/me/learning-path` | Student | Lộ trình hiện tại |
| POST | `/api/v1/learning-sessions` | Student | Bắt đầu phiên học |
| POST | `/api/v1/learning-sessions/{id}/submit` | Owner | Nộp phiên học |
| GET | `/api/v1/me/mistakes` | Student | Sổ lỗi sai |

### 12.3 Classroom và teacher

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| POST | `/api/v1/classrooms` | Verified Teacher | Tạo lớp |
| GET | `/api/v1/classrooms` | Teacher/Student scoped | Danh sách lớp được phép xem |
| GET | `/api/v1/classrooms/lookup/{code}` | Authenticated + rate limit | Xem thông tin tối thiểu trước khi tham gia |
| POST | `/api/v1/classrooms/{id}/join` | Student | Tham gia lớp bằng code/invite token |
| DELETE | `/api/v1/classrooms/{id}/members/me` | Student | Yêu cầu rời lớp theo policy |
| GET | `/api/v1/classrooms/{id}/students` | Owning Teacher | Danh sách học sinh |
| DELETE | `/api/v1/classrooms/{id}/students/{studentId}` | Owning Teacher | Xóa thành viên |
| POST | `/api/v1/classrooms/{id}/assignments` | Owning Teacher | Tạo/giao bài |
| GET | `/api/v1/me/assignments` | Student | Danh sách bài được giao |
| POST | `/api/v1/assignments/{id}/attempts` | Assigned Student | Bắt đầu lượt làm |
| POST | `/api/v1/assignment-attempts/{id}/submit` | Attempt Owner | Nộp bài, idempotent |
| POST | `/api/v1/assignments/{id}/publish-results` | Owning Teacher | Công bố kết quả/đáp án theo policy |
| GET | `/api/v1/classrooms/{id}/analytics` | Owning Teacher | Báo cáo lớp |
| GET | `/api/v1/classrooms/{id}/students/{studentId}/progress` | Owning Teacher | Tiến bộ học sinh |

### 12.4 Admin

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| GET/PATCH | `/api/v1/admin/users/...` | Platform Admin | Tìm, khóa, hỗ trợ tài khoản |
| GET/PATCH | `/api/v1/admin/teacher-verifications/...` | Platform Admin | Duyệt Giáo viên |
| CRUD | `/api/v1/admin/content/questions/...` | Content Admin | Quản lý câu hỏi draft |
| POST | `/api/v1/admin/invitations` | Platform Admin + MFA | Mời Admin theo permission bundle |
| POST | `/api/v1/admin/content/questions/{id}/submit-review` | `content:create` | Gửi review |
| POST | `/api/v1/admin/content/questions/{id}/approve` | `content:review`, khác author | Duyệt nội dung |
| POST | `/api/v1/admin/content/releases` | `content:publish`, maker-checker | Publish phiên bản |
| GET | `/api/v1/admin/audit-logs` | `audit:read` | Tra cứu audit |

---

## 13. Mô hình dữ liệu cốt lõi

| Entity | Thuộc tính/quan hệ chính |
|---|---|
| `users` | id, email, status, email_verified_at, created_at |
| `credentials` | user_id, password_hash, password_changed_at |
| `roles`, `permissions`, `user_roles` | RBAC; role có thể có scope/expiry; user có permission_version |
| `sessions` | token_hash, user_id, permission_version, expires_at, last_seen_at, revoked_at |
| `student_profiles` | user_id, grade, goal, daily_minutes, exam_date, timezone |
| `teacher_profiles` | user_id, verification_status, school, verified_at |
| `schools` | thông tin đơn vị; optional ở MVP |
| `classrooms` | owner_teacher_id, name, join_code_digest, code_expires_at, status, school_year |
| `classroom_memberships` | classroom_id, student_id, status, joined_at |
| `curricula`, `curriculum_versions` | grade, program, school_year, publish state |
| `topics`, `skills`, `prerequisites` | cây kiến thức và phụ thuộc |
| `questions`, `question_versions`, `options` | nội dung versioned, difficulty, answer policy |
| `assessments`, `attempts`, `attempt_answers` | snapshot cấu hình, thời gian, kết quả |
| `mastery_estimates` | student_id, skill_id, score, confidence, algorithm_version |
| `learning_paths`, `learning_path_items` | ưu tiên, trạng thái, reason trace |
| `assignments`, `assignment_targets`, `submissions` | giao bài và nộp bài |
| `mistake_records` | answer_id, remediation_status, resolved_at |
| `audit_logs` | actor, action, resource, before/after redacted, reason, timestamp, hash-chain reference |

Không lưu đáp án chỉ như field có thể bị ghi đè. Mỗi lần publish tạo version bất biến để báo cáo lịch sử luôn tái dựng được.

MVP chỉ hỗ trợ **một owner teacher cho mỗi lớp**. Đồng giáo viên/trợ giảng là mở rộng sau MVP và khi triển khai sẽ cần bảng `classroom_staff` cùng scope riêng.

Mã tham gia lớp dùng 8 ký tự Crockford Base32 ngẫu nhiên (40 bit), không tuần tự; database chỉ lưu HMAC digest để lookup, có unique index, ngày hết hạn, rotate/revoke và rate limit theo IP/account. Không log mã thô.

Assignment có vòng đời `draft → published → closed → archived`. Học sinh chỉ bắt đầu attempt khi assignment `published` và còn trong cửa sổ làm bài; policy quy định số lần làm, nộp muộn và thời điểm hiện đáp án. Submission đã nộp là bất biến; chấm lại tạo grading revision và audit record.

---

## 14. Yêu cầu phi chức năng

### 14.1 Bảo mật và riêng tư

- TLS toàn bộ; HSTS ở production.
- Cookie bảo mật; CSP; output encoding; sanitize nội dung do người dùng/admin nhập.
- Rate limit theo IP, account và action; CAPTCHA chỉ bật theo risk để không cản học sinh đại trà.
- Mã hóa at rest theo hạ tầng; secret trong secret manager.
- Phân loại dữ liệu, retention và quy trình xóa/xuất dữ liệu.
- **Privacy gate trước beta người dùng thật:** Legal/Product phải chốt độ tuổi tối thiểu, căn cứ xử lý dữ liệu, cơ chế đồng ý/đại diện hợp pháp, dữ liệu Giáo viên được xem, thời hạn lưu, quyền truy cập/xóa/xuất và quy trình xử lý yêu cầu. Không vượt gate này chỉ bằng acceptance kỹ thuật; PRD này không thay thế tư vấn pháp lý.
- Dependency scan, SAST, kiểm thử authorization và pentest trước public launch.

### 14.2 Hiệu năng và khả dụng

- LCP p75 trên mobile mục tiêu < 2,5 giây ở mạng phổ biến.
- API p95 < 500 ms; endpoint analytics nặng có thể chạy async.
- Autosave câu trả lời chịu được retry và không tạo bản ghi trùng.
- Diagnostic tiếp tục được sau refresh/mất mạng ngắn.
- Backup và restore drill; xác định RPO/RTO chính thức trước beta mở.

### 14.3 Accessibility và nội dung

- Mục tiêu WCAG 2.2 AA cho luồng chính.
- Điều hướng bàn phím, focus state, label và error message rõ.
- Công thức Toán có biểu diễn hỗ trợ screen reader khi khả thi.
- Không chỉ dùng màu để thể hiện đúng/sai hoặc mức năng lực.

---

## 15. Cấu trúc route đề xuất

```text
/
/login /register /verify-email /forgot-password

/student/dashboard
/student/onboarding
/student/diagnostic/[attemptId]
/student/competency
/student/learning-path
/student/missions
/student/mistakes
/student/classrooms

/teacher/dashboard
/teacher/classes
/teacher/classes/[classId]
/teacher/classes/[classId]/assignments
/teacher/classes/[classId]/students/[studentId]
/teacher/verification

/admin/dashboard
/admin/users
/admin/teacher-verifications
/admin/content/curricula
/admin/content/questions
/admin/audit-logs
```

Mỗi group có layout/menu riêng. Role mismatch trả `403` hoặc redirect về đúng dashboard; resource không thuộc scope trả response không làm lộ sự tồn tại của dữ liệu khi cần.

---

## 16. Phạm vi MVP và ngoài phạm vi

### 16.1 MVP

- Auth/session/email verification/reset password.
- Ba khu vực Student, Teacher, Admin với RBAC thật.
- Student onboarding, diagnostic, competency cơ bản, learning path và mistake notebook.
- Teacher verification, classroom, join code, assignment và báo cáo cơ bản.
- Admin user support, teacher approval, content workflow và audit log.
- Curriculum và question bank đủ cho một grade pilot trước khi mở toàn bộ lớp 6–9.

### 16.2 Ngoài phạm vi MVP

- Livestream/video call.
- Chat tự do Học sinh–Giáo viên.
- Marketplace/gia sư và thanh toán.
- Native mobile app.
- Microservices/Kubernetes.
- AI sinh câu hỏi tự động publish không qua kiểm duyệt.
- Tuyên bố đánh giá IRT/CAT chuẩn hóa khi chưa đủ dữ liệu kiểm định.

---

## 17. Kế hoạch triển khai đề xuất

### Giai đoạn 0 — Nền móng (1–2 sprint)

- Chuyển repo sang TypeScript/monorepo; dựng Next.js, NestJS, PostgreSQL, migration và CI.
- Auth/session, RBAC, audit framework, error format, OpenAPI.
- Design tokens và route shell cho ba role.

### Giai đoạn 1 — Student vertical slice (2–4 sprint)

- Onboarding động theo grade.
- Curriculum/question versioning tối thiểu.
- Diagnostic attempt có autosave/submit/resume.
- Competency, learning path và mistake notebook end-to-end.

### Giai đoạn 2 — Teacher (2–3 sprint)

- Verification, classroom, invite/join, membership.
- Assignment và dashboard báo cáo cơ bản.
- Ownership test cho toàn bộ teacher endpoints.

### Giai đoạn 3 — Admin và content operations (2–3 sprint)

- CMS câu hỏi/curriculum, review/publish/rollback.
- User support, audit viewer, feature flags.
- Import pipeline và quality validation.

### Giai đoạn 4 — Beta hardening

- Accessibility, load test, security test, restore drill.
- Instrument funnel/retention; pilot một khối lớp và một nhóm giáo viên.
- Hiệu chỉnh roadmap dựa trên dữ liệu sử dụng thật.

---

## 18. Acceptance criteria cấp sản phẩm

### Học sinh

- Không thể truy cập route/API của Giáo viên hoặc Admin dù sửa URL hay request.
- Hoàn tất onboarding cho đúng grade và chỉ nhận curriculum đã publish của grade đó.
- Refresh giữa diagnostic không mất câu đã lưu; submit lặp không tạo kết quả trùng.
- Kết quả bao gồm mọi câu đã trả lời, kể cả câu cuối và timeout/skip.
- Câu sai xuất hiện trong sổ lỗi sai và có thể chuyển sang trạng thái đã khắc phục.

### Giáo viên

- Tài khoản chưa xác minh không tạo được lớp.
- Chỉ xem được lớp mình sở hữu và học sinh đang là thành viên; co-teacher chưa thuộc MVP.
- Mã lớp hết hạn/vô hiệu hóa không thể dùng; lookup bị rate limit.
- Xóa học sinh khỏi lớp không xóa lịch sử học cá nhân của học sinh.

### Admin

- Không có đường đăng ký Admin công khai.
- Admin bắt buộc MFA và re-auth cho thao tác đặc biệt nhạy cảm.
- Gán role, khóa tài khoản, duyệt giáo viên và publish nội dung đều tạo audit log.
- Question version đã được dùng trong attempt không thể sửa tại chỗ.
- Audit log được append-only ở tầng ứng dụng; quyền xóa trực tiếp bị tách khỏi runtime role, log nhạy cảm có hash chain/tamper evidence, retention riêng và export sang storage chỉ-ghi hoặc hệ thống log bảo vệ khi production.

### Hệ thống

- Authorization được test ở API, không chỉ test ẩn/hiện nút.
- Không có credential hoặc session token trong `localStorage`, URL hay log.
- Migration có rollback/forward plan; backup restore được kiểm thử.
- E2E smoke bao phủ ba happy path chính và các case 401/403.
- Role/permission change làm session cũ mất quyền ngay ở request kế tiếp hoặc trong SLA cache tối đa 60 giây; thao tác nâng/hạ quyền quan trọng chủ động thu hồi toàn bộ session.

---

## 19. Rủi ro và cách giảm thiểu

| Rủi ro | Giảm thiểu |
|---|---|
| Nội dung chưa đủ cho lớp 6–9 | Pilot một grade; công khai coverage thật; ưu tiên CMS/import |
| Thuật toán thích ứng tạo cảm giác “chính xác giả” | Hiển thị confidence, reason trace; chưa dùng claim chuẩn hóa |
| Giáo viên tự khai role để xem dữ liệu | Verification state + backend permission + ownership |
| Rò dữ liệu học sinh giữa lớp | Integration test ma trận quyền; scoped query; cân nhắc RLS |
| Admin có quyền quá rộng | Tách permission bundle, MFA, re-auth, audit, least privilege |
| Scope MVP quá lớn | Ship vertical slice một grade; loại chat/payment/mobile khỏi MVP |
| Migration UI làm chậm tiến độ | Giữ component/style hiện có, chuyển route theo từng màn hình |

---

## 20. Câu hỏi cần Product/Business xác nhận

1. MVP pilot lớp mấy và theo bộ sách/chương trình nào? Có cần nhiều bộ sách ngay từ đầu không?
2. Học sinh có bắt buộc email không, hay cần tài khoản username/mã do Giáo viên tạo cho học sinh nhỏ tuổi?
3. Ai xác minh Giáo viên và bằng chứng nào được chấp nhận?
4. Một lớp có nhiều Giáo viên đồng quản lý không? Có vai trò trợ giảng không?
5. Học sinh có được tự rời lớp hay cần Giáo viên/phụ huynh xác nhận?
6. Giáo viên được xem mức dữ liệu nào: điểm tổng hợp, từng câu trả lời, hay cả lịch sử ngoài lớp?
7. Có cần vai trò Phụ huynh hoặc School Admin trong 6–12 tháng tới không?
8. Content team hiện có bao nhiêu câu hỏi đã thẩm định, ở định dạng nào và ai có quyền publish?
9. Mô hình kinh doanh dự kiến là miễn phí, freemium, B2C hay bán theo trường?
10. Yêu cầu lưu trữ/xóa dữ liệu và khu vực triển khai production cụ thể là gì?

Các câu hỏi 1–3 và 8 là điều kiện để chốt scope, estimation và data model MVP.

### 20.1 Quy ước đo KPI

- `signup_completed`: user được tạo và email đã xác minh; mẫu số onboarding là unique user phát event này trong cohort tuần.
- `onboarding_completed`: hồ sơ học hợp lệ được xác nhận lần đầu.
- `diagnostic_started/completed`: attempt được tạo / submit hợp lệ; tỷ lệ đo trên unique attempt đầu tiên của user trong 7 ngày sau onboarding.
- `weekly_active_learner`: student có ít nhất một learning/assessment submission hợp lệ trong tuần ISO.
- Retention D7: user có activity trong ngày 7 ± 1 ngày sau activation; báo cáo theo cohort tuần và role.
- Teacher activation: verified teacher tạo lớp và có ≥5 membership active trong 14 ngày.

Analytics spec phải định nghĩa event owner, schema, deduplication key, consent và loại bỏ dữ liệu thử nghiệm trước beta.

---

## 21. Tài liệu tham chiếu kỹ thuật

- [Next.js — Authentication](https://nextjs.org/docs/app/guides/authentication): tách authentication, session management và authorization; khuyến nghị kiểm tra quyền gần data source.
- [Next.js — App Router](https://nextjs.org/docs/app): file-based routing, Server Components, Suspense và Server Functions.
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): cookie `Secure`, `HttpOnly`, `SameSite`, session rotation và tránh lưu token trong Web Storage.
- [OWASP — CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): SameSite là lớp phòng thủ, không mặc định thay thế CSRF protection.
- [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/17/ddl-rowsecurity.html): giới hạn row theo policy và hành vi default-deny khi bật RLS mà không có policy phù hợp.

---

## 22. Definition of Ready cho bước thiết kế/estimate tiếp theo

PRD sẵn sàng chuyển sang solution design khi:

- Đã trả lời các câu hỏi bắt buộc ở mục 20.
- Đã chốt một grade pilot và content coverage tối thiểu.
- Đã duyệt ma trận quyền và quy trình xác minh Giáo viên.
- Đã thống nhất login identifier cho Học sinh.
- Đã có wireflow riêng cho Student, Teacher và Admin.
- Engineering đã tách PRD thành epics, threat model sơ bộ và migration plan từ prototype.
