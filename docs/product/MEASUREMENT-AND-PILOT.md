# AdaptiveMath — Measurement & Pilot Research Pack

**Tài liệu:** Product Analytics, Measurement Framework, and Controlled Pilot Research Protocol  
**Phiên bản:** 1.0  
**Tác giả:** Antigravity (Product Discovery & UX Lead)  
**Trạng thái phê duyệt:** DRAFT FRAMEWORK — CHỜ KÝ DUYỆT (Pending Gate 0 & DPO Sign-off)  
**Tài liệu liên quan:**
- `docs/PROJECT-VISION-AND-PM-ROADMAP.md` (Mục 4: North-star & Hệ chỉ số, Mục 7: Kế hoạch Pilot)
- `docs/PRD-AdaptiveMath.md` (Mục 13: Product Analytics)
- `docs/product/GATE-0-DECISION-PACK.md` (Quyết định D-01 đến D-04 - PENDING)

> [!NOTE]
> **Tính chất Dữ liệu:** Toàn bộ các chỉ số benchmark mục tiêu (phễu Onboarding, tỷ lệ chuyển đổi, chỉ số WVSP kỳ vọng) là **GIẢ ĐỊNH KẾ HOẠCH (PLANNING ASSUMPTIONS)** phục vụ thiết lập khung đo lường, không phải số liệu đo lường lịch sử đã đạt được.

---

## 1. Định nghĩa North-Star & Hệ Thống Chỉ Số Cốt Lõi

### 1.1 North-Star Metric: Weekly Verified Skill Progress (WVSP)
- **Định nghĩa:** Số lượng học sinh duy nhất trong tuần có ít nhất **01 kỹ năng Toán học** được ghi nhận tiến bộ (tăng mức độ thành thạo hoặc chuyển từ *Cần hỗ trợ* sang *Đạt/Khá*) dựa trên bằng chứng học tập thực tế và được xác nhận lại qua một bài kiểm tra tái đánh giá (Reassessment).
- **Công thức tính:**
  $$\text{WVSP}_t = \text{Count Distinct}\Big(\text{StudentId} \mid \exists\, \text{Skill } S: \text{MasteryLevel}_{t}(S) > \text{MasteryLevel}_{t-1}(S) \land \text{ReassessmentPassed} = \text{True}\Big)$$
- **Mục đích:** Buộc toàn bộ sản phẩm và thuật toán phải tối ưu hóa cho **sự tiến bộ kiến thức thật sự đã được kiểm chứng**, ngăn chặn hành vi "cày cuốc" ảo (vanity click) hoặc chỉ đếm số phút online vô nghĩa.

### 1.2 Guardrail Metrics (Chỉ số Hàng rào Bảo vệ)
Hệ thống không được phép đánh đổi các chỉ số này để tăng WVSP:
1. **Diagnostic Abandonment Rate (Tỷ lệ bỏ dở bài chẩn đoán):** Ngưỡng an toàn $< 15\%$. Nếu học sinh bỏ thi quá nhiều, bài thi đang quá dài hoặc quá khó gây nản lòng.
2. **First-Session Frustration Rate:** Tỷ lệ học sinh gặp 3 câu sai liên tiếp ở cùng một kỹ năng mà không nhận được gợi ý/hạ độ khó $< 5\%$.
3. **Assessment Integrity (Độ tin cậy đo lường):** Tỷ lệ câu hỏi bị báo cáo lỗi công thức toán KaTeX hoặc sai đáp án $= 0\%$.
4. **Privacy Incident Rate:** $0$ sự cố rò rỉ dữ liệu cá nhân hoặc học sinh bị truy cập trái phép.

---

## 2. Từ điển Sự kiện Dữ liệu (Event Dictionary)

Mọi sự kiện phân tích (Analytics Event) phải được chuẩn hóa, tuân thủ nguyên tắc bảo vệ quyền riêng tư và tối thiểu hóa dữ liệu (Privacy by Design).

| Tên sự kiện (Event Name) | Điểm kích hoạt (Trigger) | Tác nhân (Actor) | Thuộc tính sự kiện (Properties) | Deduplication Key | Nhóm đồng thuận (Consent Class) | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `student_signup_completed` | Đăng ký tài khoản học sinh thành công | Student | `{ grade, signupMethod, parentEmailProvided: bool }` | `userId` | Functional | Growth / Auth |
| `onboarding_step_completed` | Bấm "Tiếp tục" qua mỗi bước khảo sát | Student | `{ stepNumber: 1..8, stepDurationSec: int }` | `userId_stepNumber` | Functional | UX Lead |
| `diagnostic_started` | Bấm "Bắt đầu" bài kiểm tra đầu vào | Student | `{ attemptId, grade, targetGoal, initialTheta }` | `attemptId` | Educational Core | Assessment Lead |
| `question_answered` | Bấm nộp đáp án cho 1 câu hỏi | Student | `{ attemptId, questionId, isCorrect: bool, timeSpentSec, currentTheta, isTimeout: bool, isSkipped: bool }` | `attemptId_questionId` | Educational Core | Assessment Lead |
| `diagnostic_completed` | Hoàn thành toàn bộ câu hỏi chẩn đoán | Student | `{ attemptId, totalQuestions, finalTheta, totalDurationSec, weakSkillsCount }` | `attemptId` | Educational Core | Assessment Lead |
| `skill_progress_verified` | Đạt bài kiểm tra tái đánh giá thành công | System / Student | `{ studentId, skillId, previousLevel, newLevel, evidenceAttemptId }` | `studentId_skillId_date` | Educational Core | Product Lead |
| `class_code_entered` | Nhập mã lớp tìm kiếm | Student | `{ codeHash, isValid: bool, failureReason? }` | `userId_timestamp` | Security / Functional | Classroom Lead |
| `teacher_class_created` | Giáo viên tạo lớp học mới | Teacher | `{ classId, grade, hasInviteCode: bool }` | `classId` | Functional | Classroom Lead |
| `teacher_assignment_published` | Giáo viên phát hành bài tập cho lớp | Teacher | `{ assignmentId, classId, totalQuestions, deadline }` | `assignmentId` | Functional | Classroom Lead |

*Lưu ý bảo mật:* Tuyệt đối **không đưa PII** (Họ tên thật, số điện thoại, mật khẩu, text thô của mã lớp) vào payload của Analytics Event.

---

## 3. Phễu Chuyển Đổi & Cửa Sổ Cohort (Funnels & Windows)

### 3.1 Phễu Học sinh Onboarding (Target Funnel Benchmarks)
```
[100% Truy cập Landing] 
   └──> [45% Bấm Đăng ký]
          └──> [80% Hoàn tất Tạo tài khoản]
                 └──> [85% Hoàn tất 8 bước Onboarding]
                        └──> [75% Hoàn tất Bài chẩn đoán]
                               └──> [60% Bắt đầu Bài học số 1 trong 48h] (Activation Window)
```

### 3.2 Cửa sổ Quan sát Cohort (Cohort Observation Windows)
- **Day 0:** Đăng ký + Chẩn đoán đầu vào.
- **Week 1:** Hoàn thành tối thiểu 2 phiên luyện tập (45 phút/phiên) + sửa 3 lỗi sai trong Sổ tay.
- **Week 2:** Thực hiện bài Reassessment đầu tiên ➔ Đo lường WVSP.
- **Week 4:** Đánh giá độ gắn kết của Giáo viên (Giao bài tối thiểu 1 lần/tuần và xem báo cáo can thiệp).

---

## 4. Khung Giả Thuyết & Kế Hoạch Controlled Pilot

> [!IMPORTANT]
> **Tuyên bố Giả thuyết (Hypothesis Statement):**  
> *"Nếu học sinh lớp 9 ôn thi vào lớp 10 được làm bài kiểm tra chẩn đoán để xác định đúng 2–3 chủ đề hổng cốt lõi và luyện tập bài tập sửa lỗi mục tiêu trong 45 phút/ngày với sự theo dõi của giáo viên chủ nhiệm, thì sau 6 tuần, tỷ lệ thành thạo các kỹ năng mục tiêu sẽ tăng tối thiểu 25% so với điểm xuất phát ban đầu."*

### 4.1 Quy mô Thử nghiệm Có kiểm soát (Pilot Cohort Size)
- **Giáo viên:** 2–5 Giáo viên dạy Toán THCS nhiệt huyết, có kinh nghiệm luyện thi vào 10.
- **Học sinh:** 30–100 Học sinh lớp 9 (tương đương 1–3 lớp học).
- **Thời lượng:** **06 tuần** (Đủ để đi qua 3 chu kỳ Reassessment).
- **Môi trường:** Ứng dụng chạy trên hạ tầng Staging/Pilot cô lập, có đội ngũ kỹ thuật trực hỗ trợ 1-1.

### 4.2 Tiêu chí Lựa chọn Giáo viên & Học sinh (Screening Criteria)
1. **Giáo viên:**
   - Đang trực tiếp giảng dạy môn Toán lớp 9 theo bộ SGK *Kết nối tri thức với cuộc sống*.
   - Sẵn sàng tích hợp 1 buổi làm bài trên hệ thống mỗi tuần.
   - Cam kết tham gia phỏng vấn phản hồi hàng tuần (Weekly Feedback Sync).
2. **Học sinh:**
   - Có thiết bị truy cập internet cá nhân (Máy tính bảng, Laptop hoặc Smartphone).
   - Có sự đồng ý và bảo trợ bằng văn bản từ cha mẹ/người giám hộ (Parental Consent).

---

## 5. Bảng Điểm Quyết Định Pilot (Pilot Decision Scorecard: Continue / Fix / Stop)

Sau 6 tuần Pilot, Product Council sẽ họp để đánh giá kết quả dựa trên Scorecard sau:

| Chỉ số / Tiêu chí | Ngưỡng TIẾP TỤC (Continue / Scale) | Ngưỡng CẦN SỬA (Fix / Pivot) | Ngưỡng DỪNG LẠI (Stop / Abort) |
| :--- | :--- | :--- | :--- |
| **Tỷ lệ Hoàn thành Chẩn đoán** | $\ge 80\%$ hoàn thành bài đầu vào | $60\% - 79\%$ (Cần rút ngắn số câu) | $< 60\%$ (Giao diện hoặc câu hỏi gây nản) |
| **Weekly Active Students (WAU)** | $\ge 65\%$ duy trì nhịp học tuần | $40\% - 64\%$ (Thiếu động lực duy trì) | $< 40\%$ (Học sinh bỏ sau buổi 1) |
| **Chỉ số Tiến bộ WVSP** | $\ge 40\%$ học sinh đạt verified progress | $20\% - 39\%$ (Lộ trình chưa tối ưu) | $< 20\%$ (Thuật toán không mang lại tiến bộ) |
| **Giáo viên Sử dụng Báo cáo** | $\ge 80\%$ GV xem báo cáo can thiệp tuần | $50\% - 79\%$ (Báo cáo khó đọc) | $< 50\%$ (Báo cáo vô dụng với giáo viên) |
| **Sự cố An toàn & Quyền riêng tư** | $0$ sự cố | $0$ sự cố, có feedback nhỏ | $\ge 1$ sự cố rò rỉ dữ liệu trẻ em |

---

## 6. Giao Thức Nghiên Cứu An Toàn Với Người Chưa Thành Niên (Child Research Ethics)

Tuân thủ nghiêm ngặt chuẩn đạo đức nghiên cứu người dùng là trẻ em:
1. **Thư Đồng thuận Phụ huynh (Informed Parental Consent):** Phải có chữ ký số hoặc xác nhận văn bản của cha mẹ trước khi tiến hành quan sát/phỏng vấn học sinh.
2. **Sự hiện diện của Người bảo trợ:** Mọi buổi phỏng vấn (User Interview) với học sinh THCS phải diễn ra tại lớp học có giáo viên hoặc tại nhà có phụ huynh ngồi cạnh.
3. **Không ghi hình nhạy cảm:** Ghi âm và quay màn hình thao tác giao diện chỉ phục vụ nghiên cứu nội bộ, làm mờ thông tin cá nhân và tiêu hủy sau 30 ngày.
4. **Quyền rút lui:** Học sinh có quyền dừng bài test hoặc dừng phỏng vấn bất cứ lúc nào mà không phải chịu bất kỳ áp lực nào.

---

## 7. Mẫu Báo Cáo Phản Hồi Tuần (Weekly Synthesis Template)

```markdown
### Tuần Pilot: [Số tuần] (Từ ngày ... đến ngày ...)
- **Tổng số Học sinh Active:** ... / ...
- **Số lượt WVSP đạt được trong tuần:** ...
- **Bảng tổng hợp Insight & Quyết định:**

| Bằng chứng thực tế (Evidence) | Phát hiện cốt lõi (Insight) | Mức độ nghiêm trọng (Severity) | Quyết định sản phẩm (Decision) | Người phụ trách (Owner) | Hạn chót (Deadline) |
| :--- | :--- | :---: | :--- | :--- | :--- |
| 5 học sinh dừng lại ở câu hình học số 4 | Đề bài câu 4 chưa vẽ hình minh họa nên học sinh không tưởng tượng được | High | Thêm hình SVG minh họa cho bài hình | Content Lead | Thứ Tư |
| Giáo viên hỏi cách in danh sách bài sai | GV cần bản giấy để phát cho học sinh chữa bài trên lớp | Medium | Bổ sung nút "Xuất PDF danh sách lỗi" | UX / OpenCode | Tuần tới |
```

---

## 8. Danh Mục Kiểm Tra Vận Hành & Khắc Phục Sự Cố (Rollback Checklist)

- [ ] Đường dây nóng (Hotline Zalo/Telegram) hỗ trợ giáo viên và học sinh 24/7.
- [ ] Quy trình Rollback database: Tạo snapshot sao lưu dữ liệu mỗi ngày lúc 00:00 UTC.
- [ ] Cơ chế Kill-Switch: Khả năng tắt ngay lập tức 1 câu hỏi bị lỗi mà không cần redeploy toàn bộ hệ thống (Đặt cờ `isActive = false`).
- [ ] Cơ chế hỗ trợ đổi mật khẩu khẩn cấp cho học sinh qua tài khoản Giáo viên chủ nhiệm.
