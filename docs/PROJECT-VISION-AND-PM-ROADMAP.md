# AdaptiveMath — Tầm nhìn sản phẩm và PM Roadmap

**Phiên bản:** 0.1  
**Vai trò tài liệu:** North-star và kế hoạch điều hành sau PRD  
**Nguồn yêu cầu chi tiết:** `docs/PRD-AdaptiveMath.md`  
**Nguồn triển khai kỹ thuật:** `docs/IMPLEMENTATION-PLAN.md`

---

## 1. Tầm nhìn

AdaptiveMath trở thành hệ thống học Toán THCS giúp mỗi học sinh luôn biết:

1. Mình đang vững và hổng kiến thức ở đâu.
2. Việc học có giá trị nhất cần làm tiếp theo là gì.
3. Tiến bộ đó được chứng minh bằng dữ liệu nào.

Đối với Giáo viên, AdaptiveMath không thay thế vai trò sư phạm. Sản phẩm giúp Giáo viên nhìn thấy tín hiệu khó quan sát trong một lớp đông và can thiệp đúng học sinh, đúng kỹ năng, đúng thời điểm.

Đối với đội vận hành, sản phẩm phải biến curriculum và câu hỏi thành một hệ thống nội dung có phiên bản, kiểm duyệt, đo chất lượng và cải thiện liên tục — không phải một tập dữ liệu tĩnh.

### Tuyên bố định vị

> AdaptiveMath là nền tảng chẩn đoán và luyện tập Toán THCS theo kỹ năng, biến kết quả làm bài thành một lộ trình học có thể giải thích cho học sinh và một tín hiệu can thiệp có thể hành động cho giáo viên.

### Điều chúng ta không muốn trở thành

- Một kho đề thi có thêm điểm XP nhưng không thực sự cá nhân hóa.
- Một dashboard nhiều biểu đồ nhưng Giáo viên không biết phải làm gì tiếp theo.
- Một “AI tutor” đưa ra lời giải thiếu kiểm chứng.
- Một hệ thống thu thập quá nhiều dữ liệu trẻ em chỉ vì có thể thu thập.
- Một LMS tổng quát cố làm mọi môn học, thanh toán, chat và video ngay từ MVP.

---

## 2. Lợi thế mở đầu và thị trường hẹp cần thắng trước

Prototype hiện tập trung mạnh nhất vào Học sinh lớp 9 và mục tiêu thi vào lớp 10. Đây nên là wedge market đầu tiên thay vì mở đồng thời lớp 6–9.

### PM recommendation cho pilot

- Đối tượng: Học sinh lớp 9 đang ôn thi vào lớp 10.
- Chương trình đầu tiên: một curriculum/textbook đã được đội nội dung xác nhận.
- Phạm vi kiến thức: 6–8 kỹ năng trọng tâm có prerequisite rõ.
- Môi trường: một nhóm Giáo viên và lớp học đối tác nhỏ, có support trực tiếp.
- Thời lượng pilot: đủ để quan sát ít nhất một chu kỳ diagnostic → học → reassessment.

Lý do chọn hướng này:

- Nhu cầu và thời hạn học rõ ràng.
- Prototype hiện tại đã có nhiều ngôn ngữ và luồng phù hợp lớp 9.
- Có thể đo kết quả trước/sau trên một tập kỹ năng cụ thể.
- Thu hẹp yêu cầu nội dung và giảm nguy cơ phát hành trải nghiệm “rộng nhưng rỗng”.

Quyết định cuối cùng vẫn cần Product Owner xác nhận trong Decision Gate 0.

---

## 3. Product pillars

### 3.1 Diagnose credibly — Chẩn đoán đáng tin

- Không đánh đồng vài câu trả lời với năng lực chắc chắn.
- Hiển thị mức tin cậy và lý do chọn câu/lộ trình.
- Lưu đầy đủ attempt, timeout, skip, content version và algorithm version.
- Chỉ tuyên bố IRT/CAT khi đã có dữ liệu hiệu chỉnh và kiểm định phù hợp.

### 3.2 Guide the next best action — Luôn rõ việc cần làm tiếp theo

- Dashboard ưu tiên một hành động chính thay vì dàn trải tính năng.
- Lộ trình giải thích được: vì sao học chủ đề này, liên quan mục tiêu nào.
- Bài học vừa với quỹ thời gian và có thể tiếp tục sau khi gián đoạn.

### 3.3 Close the learning loop — Chứng minh việc đã học

- Câu sai đi vào remediation, không chỉ lưu để xem lại.
- Sau luyện tập có reassessment để xác nhận tiến bộ.
- Mastery chỉ thay đổi từ evidence có nguồn và phiên bản rõ.

### 3.4 Make teachers more effective — Biến dữ liệu thành can thiệp

- Báo cáo trả lời “ai cần hỗ trợ, ở kỹ năng nào, hành động đề xuất là gì”.
- Không dùng vanity metrics làm trọng tâm.
- Phạm vi dữ liệu Giáo viên xem được phải rõ và tối thiểu.

### 3.5 Trust by design — Niềm tin là tính năng sản phẩm

- Quyền tối thiểu, audit, maker-checker và privacy gate.
- Không dùng dark pattern với học sinh.
- Nội dung và đáp án được kiểm duyệt, có owner và khả năng rollback.

---

## 4. North-star và hệ chỉ số

### North-star metric

**Weekly Verified Skill Progress (WVSP):** số học sinh hoạt động trong tuần có ít nhất một kỹ năng chuyển mức dựa trên evidence học tập và được xác nhận lại qua reassessment.

North-star này buộc sản phẩm tối ưu cho tiến bộ đã được kiểm chứng, không chỉ số phút online hoặc số câu đã bấm.

Định nghĩa vận hành ban đầu:

- `active learner`: có ít nhất một submission học/đánh giá hợp lệ trong tuần ISO.
- `skill chuyển mức`: mastery vượt threshold đã version hóa sau learning/remediation và vẫn đạt trong một reassessment dùng item tương đương nhưng không trùng câu.
- Reassessment diễn ra trong cửa sổ 3–14 ngày sau activity kết thúc; báo cáo riêng nếu sớm hơn để tránh nhầm practice effect với learning retention.
- WVSP rate = unique active learners có ≥1 verified skill progression / tổng unique active learners đủ điều kiện reassessment.
- Mọi thay đổi threshold/algorithm tạo version mới; không so cohort qua hai version mà không phân đoạn, tránh “tăng chỉ số” bằng cách hạ chuẩn mastery.
- Pilot chỉ diễn giải WVSP là tín hiệu tiến bộ trong sản phẩm, chưa phải bằng chứng nhân quả về hiệu quả giáo dục nếu chưa có thiết kế nghiên cứu phù hợp.

### Guardrail metrics

| Nhóm | Chỉ số |
|---|---|
| Activation | Xác minh tài khoản → hoàn tất onboarding → hoàn tất diagnostic |
| Engagement | Weekly active learner; số phiên học hữu ích/tuần |
| Learning | Skill progression; remediation success; reassessment retention |
| Teacher value | Lớp có hoạt động; cảnh báo dẫn đến assignment/can thiệp |
| Content quality | Tỷ lệ câu bị report; distractor quality; câu bị retire |
| Trust | Sự cố phân quyền; khiếu nại dữ liệu; teacher verification SLA |
| Reliability | API availability; submit failure; resume success |

Không dùng “thời gian trên app” làm north-star vì thời gian dài có thể phản ánh bài khó hiểu hoặc trải nghiệm kém.

---

## 5. Product flywheel

```text
Diagnostic có chất lượng
  → xác định skill gap
  → lộ trình đúng trọng tâm
  → học và remediation
  → reassessment tạo evidence
  → Giáo viên can thiệp tốt hơn
  → dữ liệu giúp cải thiện câu hỏi và thuật toán
  → diagnostic có chất lượng hơn
```

Flywheel chỉ hoạt động khi content version, attempt data và decision trace đáng tin. Vì vậy content operations và data instrumentation là phần lõi của sản phẩm, không phải việc làm sau launch.

---

## 6. Các giai đoạn phát triển sản phẩm

### Horizon 0 — Nền móng đáng tin

**Khung định hướng:** tháng 0–2 sau Gate 0, phụ thuộc capacity Engineering.

**Mục tiêu:** hệ thống có auth, RBAC, persistence, content version và audit đúng.

Exit criteria:

- Student, Teacher applicant, Teacher và Admin có quyền tách biệt.
- Không còn dữ liệu học tập thật trong `localStorage`.
- Một happy path Student chạy end-to-end bằng dữ liệu database.
- Authorization negative tests đạt.
- Bốn Product blocker ở Gate 0 đã được quyết định.

### Horizon 1 — Pilot lớp 9 có vòng lặp học hoàn chỉnh

**Khung định hướng:** tháng 2–4; chỉ bắt đầu khi content và privacy gate có owner.

**Mục tiêu:** chứng minh diagnostic → learning path → remediation → reassessment mang giá trị cho một tập kỹ năng hẹp.

Exit criteria:

- Content gate đạt cho 6–8 kỹ năng pilot.
- Học sinh hoàn thành được toàn bộ vòng lặp.
- Giáo viên thấy được học sinh/kỹ năng cần hỗ trợ và giao được bài.
- UAT với dữ liệu representative đạt; privacy gate được ký duyệt.
- Analytics đủ để đo activation, completion và verified skill progress.

### Horizon 2 — Teacher-led classroom product

**Khung định hướng:** tháng 4–8, sau pilot review.

**Mục tiêu:** Giáo viên chủ động dùng sản phẩm hằng tuần, không chỉ xem báo cáo sau khi học sinh tự học.

Khả năng mở rộng:

- Assignment templates theo mục tiêu.
- Nhóm học sinh theo skill gap.
- Intervention queue và follow-up.
- Báo cáo lớp theo tuần/chủ đề.
- Quy trình đồng bộ hoặc import roster phù hợp đối tác.

Trước khi khóa Horizon 2 cần một commercial discovery gate: xác định buyer/payer chính là học sinh-phụ huynh (B2C), Giáo viên tự dùng hay nhà trường (B2B). Quyết định này chi phối organization model, roster, consent, procurement, support và packaging; chưa cần xây billing trước khi có bằng chứng.

### Horizon 3 — Mở rộng curriculum lớp 6–9

**Khung định hướng:** tháng 8–15; không mở đồng loạt nếu content throughput chưa đạt.

**Mục tiêu:** tái sử dụng platform và content pipeline cho nhiều grade mà không sao chép logic.

Điều kiện vào horizon:

- Pilot chứng minh retention và learning signal.
- Content throughput và QA SLA ổn định.
- Curriculum model hỗ trợ version/textbook/school year.
- Có capacity thật để sản xuất và kiểm duyệt nội dung.

### Horizon 4 — Cá nhân hóa dựa trên dữ liệu

**Khung định hướng:** tháng 12–24, có thể chạy nghiên cứu song song nhưng chỉ productionize sau khi dữ liệu đủ chất lượng.

**Mục tiêu:** cải thiện độ chính xác và hiệu quả học từ dữ liệu đủ chất lượng.

Khả năng:

- Hiệu chỉnh item difficulty/discrimination.
- Experiment framework và A/B test an toàn.
- Spaced review và knowledge tracing nâng cao.
- Recommendation tối ưu theo mục tiêu và thời gian còn lại.

Không đi vào horizon này chỉ vì muốn gắn nhãn “AI”.

---

## 7. Decision Gate 0 — Việc PM phải khóa ngay khi OpenCode đang xây nền móng

Đây là bốn quyết định chặn schema hoặc behavior. OpenCode có thể tiếp tục nền móng nhưng không nên tự chọn thay Product.

| ID | Quyết định | PM recommendation | Deadline logic | Nếu chưa chốt |
|---|---|---|---|---|
| D-01 | Grade/curriculum pilot | Lớp 9, ôn thi vào 10, một curriculum | Trước Student data/content implementation | Chặn curriculum seed và onboarding thật |
| D-02 | Định danh Học sinh | Email/Google cho self-signup; thiết kế schema không giả định email luôn tồn tại để mở đường cho invite account | Trước khóa user schema/auth UX | Chỉ làm auth foundation, chưa khóa signup flow |
| D-03 | Xác minh Giáo viên | Manual review ở pilot: email tổ chức hoặc tài liệu + lý do duyệt/từ chối | Trước Teacher vertical slice | Teacher applicant không thể thành Teacher |
| D-04 | Phạm vi dữ liệu Giáo viên | Chỉ dữ liệu phát sinh trong lớp/assignment khi membership active; dữ liệu tự học ngoài lớp cần consent riêng | Trước analytics/teacher progress API | Không mở student detail API |

Quyết định bổ sung cần chốt trước pilot:

- D-05: tuổi tối thiểu, consent/đại diện hợp pháp và retention.
- D-06: content readiness threshold.
- D-07: pilot cohort, support channel và incident owner.
- D-08: tiêu chí “pilot thành công/thất bại/tiếp tục có điều kiện”.

Mỗi quyết định cần ghi: owner, ngày chốt, lựa chọn, lý do, hệ quả, ngày review lại.

---

## 8. Product discovery trước pilot

Discovery chạy song song với Engineering, không chờ sản phẩm hoàn chỉnh.

### Giả thuyết cần kiểm chứng

- Học sinh hiểu “skill gap” và tin kết quả diagnostic khi có giải thích phù hợp.
- Hành động học tiếp theo đủ nhỏ và rõ để học sinh bắt đầu mà không cần Giáo viên thúc đẩy.
- Giáo viên ưu tiên danh sách học sinh/kỹ năng cần can thiệp hơn dashboard tổng quan nhiều biểu đồ.
- Giáo viên sẵn sàng thực hiện assignment/can thiệp dựa trên insight của hệ thống.
- Phụ huynh/đại diện và nhà trường hiểu, chấp nhận phạm vi dữ liệu được thu thập/chia sẻ.

### Kế hoạch nghiên cứu tối thiểu

- 5–8 Học sinh lớp 9 cho concept/usability theo từng vòng, có quy trình đồng ý phù hợp.
- 5–8 Giáo viên Toán cho workflow, terminology và intervention value.
- 3–5 phụ huynh/đại diện hoặc người phụ trách nhà trường cho trust, consent và kỳ vọng dữ liệu.
- Mỗi vòng research có script, note template, severity của issue và decision/action owner.
- Không thu dữ liệu nhạy cảm không cần thiết trong recording/research artifact; access có thời hạn.

Discovery hoàn tất một vòng khi insight được chuyển thành một trong bốn kết quả: thay đổi requirement, thay đổi UX, thêm test/guardrail hoặc không thay đổi kèm lý do.

---

## 9. Content readiness — đường găng ngoài code

Code hoàn thành nhưng nội dung chưa sẵn sàng thì sản phẩm vẫn chưa thể pilot.

### PM recommendation cho content gate pilot

- Chọn 6–8 skills có prerequisite map.
- “15 câu/skill” chỉ là planning assumption để kiểm kê, không phải chuẩn khoa học cố định. Blueprint phải tách pool diagnostic, practice, remediation và reassessment; không tái dùng nguyên câu để xác nhận tiến bộ.
- Mỗi skill có coverage ba difficulty bucket, misconception chính, câu tương đương cho reassessment và item-exposure rule.
- Mỗi câu có đáp án, lời giải, metadata, curriculum mapping và reviewer khác author.
- Mỗi skill có ít nhất hai learning/remediation activities.
- Có bộ câu hỏi vàng dành cho QA thuật toán, không dùng trong pilot thường xuyên.
- Không có lỗi KaTeX, đáp án mơ hồ hoặc câu phụ thuộc hình ảnh thiếu alt/context.

Trước khi cam kết ngày pilot, Content Lead phải lập capacity model gồm số author/reviewer, throughput mỗi tuần, review SLA, tỷ lệ reject/rework và owner xử lý lỗi production.

### Pipeline nội dung

```text
Curriculum map
  → blueprint theo skill/difficulty
  → authoring
  → mathematical review
  → editorial/accessibility review
  → QA import/preview
  → publish version
  → item analytics
  → revise/retire
```

PM phải theo dõi content burn-up riêng với engineering burn-up.

---

## 10. Phân công hiện tại

### PM — người điều phối chính

- Giữ product vision, priority và scope.
- Chốt/đẩy quyết định ở Gate 0.
- Duy trì roadmap, decision log, risk register và release gates.
- Nghiệm thu theo outcome/acceptance criteria, không theo số file đã tạo.
- Tổ chức UAT và pilot review.

### OpenCode — Coding/Implementation Agent

- Đối chiếu tiến độ với `docs/IMPLEMENTATION-PLAN.md` và code hiện tại.
- Báo cáo theo milestone và bằng chứng build/test/migration.
- Không nhận thêm nhánh PM/UX trong khi đang triển khai để tránh context switching.
- Escalate các quyết định Product/Security/Privacy; không âm thầm lựa chọn.

### Antigravity — Product Discovery & UX Agent

Nhiệm vụ song song, theo thứ tự:

1. **Gate 0 Decision Pack:** D-01 đến D-04 với options, trade-off, recommendation và tác động schema/API/UX/privacy.
2. **Target Journey + Service Blueprint:** Student, Teacher applicant, Teacher, Content Admin, Platform Admin; mỗi bước ánh xạ route/API hoặc handoff thủ công có owner.
3. **Route-level Wireflow & UX State Spec:** happy path cùng loading, empty, invalid, timeout, retry, resume, expired invite, pending verification và forbidden.
4. **PRD Traceability + UAT Pack:** requirement → role → flow → acceptance → test data → expected result → evidence; gồm negative RBAC và maker-checker.
5. **Measurement & Pilot Research Pack:** định nghĩa WVSP, event dictionary, funnel, scorecard, interview script và weekly synthesis.
6. Xây content readiness matrix cùng Content Lead cho skills pilot.

Antigravity không thay đổi code production khi chưa được giao implementation cụ thể.

---

## 11. Danh sách việc PM chạy song song khi OpenCode đang code

### P0 — Làm ngay

| Việc | Owner | Deliverable | Done khi |
|---|---|---|---|
| Khóa D-01 đến D-04 | PM + Product Owner | Decision records | Không còn blocker schema/role/data scope |
| Chọn skills pilot và inventory nội dung | PM + Content Lead | Content coverage matrix | Biết rõ đủ/thiếu theo skill/difficulty |
| Privacy discovery | PM + Legal/Owner | Privacy decision memo | Chốt consent, retention, teacher visibility |
| Target journey/wireflow | Antigravity | Flow artifacts | Bao phủ success, error, empty, resume và denial |
| Testable acceptance mapping | PM + Antigravity | Requirement → test matrix | Mỗi P0 requirement có cách kiểm chứng |

### P1 — Trước khi Student/Teacher vertical slice hoàn tất

| Việc | Owner | Deliverable | Done khi |
|---|---|---|---|
| Assessment Algorithm Spec | PM + Math/Assessment Lead | Spec + golden cases | Engineering/Content cùng duyệt |
| Content authoring guideline | Content Lead | Template + review checklist | Hai author tạo cùng format và pass QA |
| Analytics taxonomy | Antigravity + PM | Event dictionary | Event có trigger, property, owner, consent |
| UAT plan | Antigravity + PM | Scenario/checklist | Có data setup và expected result |
| Pilot cohort plan | PM | Danh sách cohort/support/SLA | Có owner liên hệ và escalation path |

### P2 — Trước beta

| Việc | Owner | Deliverable | Done khi |
|---|---|---|---|
| Help content và onboarding copy | Antigravity | In-product copy/FAQ | Test được với người mới |
| Incident runbook | PM + Engineering | Severity/escalation/rollback | Dry run một sự cố giả lập |
| Release communication | PM | Release notes + support script | Support hiểu thay đổi/rủi ro |
| Feedback operation | PM + Antigravity | Interview/survey cadence | Insight được tổng hợp hàng tuần |

---

## 12. Việc phải làm sau khi OpenCode báo hoàn thành implementation

Không chuyển thẳng sang launch. Đi qua các gate sau:

### Gate 1 — Implementation evidence review

- Đối chiếu từng acceptance criterion PRD với code/test bằng traceability matrix.
- Xem migration, schema, OpenAPI và auth/RBAC implementation.
- Xác nhận không còn mock/hard-code nằm trên production path.
- Tất cả build, lint, typecheck, unit và integration tests đạt.

### Gate 2 — Product/UX review

- Antigravity kiểm tra UI so với target journey/wireflow.
- Review đầy đủ loading, empty, error, timeout, retry, resume, forbidden.
- Kiểm tra mobile/responsive và keyboard/focus.
- Copy không tạo claim quá mức về năng lực/IRT.

### Gate 3 — Content and algorithm validation

- Content coverage đạt release threshold.
- Golden question/attempt cases trả đúng kết quả mong đợi.
- Math reviewer sign-off đáp án/lời giải.
- Không lộ đáp án trước policy cho phép.

### Gate 4 — Security, privacy and data readiness

- Chạy authorization matrix và cross-class access tests.
- Session revoke, role change, reset password, MFA và audit được kiểm chứng.
- Privacy gate được ký duyệt.
- Backup/restore và incident response có dry run.

### Gate 5 — UAT và pilot readiness

- UAT theo ba role với dữ liệu representative.
- Analytics event được kiểm tra end-to-end.
- Cohort, support, feedback channel và rollback criteria đã sẵn sàng.
- Go/no-go review có người chịu trách nhiệm cuối cùng.

Điều kiện UX tối thiểu phải được kiểm trên thiết bị Android cấu hình thấp và mạng chập chờn: màn hình nhỏ, KaTeX render, thao tác bàn phím/focus, autosave và resume sau mất mạng. Không chỉ nghiệm thu trên desktop/mạng nội bộ.

### Gate 6 — Controlled pilot

- Rollout theo cohort nhỏ, không mở toàn bộ người dùng.
- Daily monitoring trong những ngày đầu.
- Weekly review: activation, diagnostic completion, learning loop, support issue, content issue.
- Quyết định tiếp tục, sửa hoặc dừng theo tiêu chí định trước.

Thiết kế pilot đề xuất ban đầu: 2–5 Giáo viên, 30–100 Học sinh, khoảng 6 tuần; điều chỉnh sau discovery và privacy review. PM phải chỉ định onboarding owner, giờ support, severity/SLA, escalation và rollback owner trước ngày bắt đầu.

### Pilot scorecard ban đầu

Các ngưỡng dưới đây là hypothesis để chốt trước pilot, không phải cam kết đã được chứng minh:

| Quyết định | Tín hiệu |
|---|---|
| Stop ngay | Bất kỳ sự cố truy cập chéo dữ liệu, vi phạm privacy nghiêm trọng hoặc mất attempt không thể phục hồi |
| Fix trước khi mở rộng | Diagnostic completion < 60%, submit/resume failure > 2%, lỗi nội dung nghiêm trọng lặp lại hoặc Giáo viên không hiểu action cần làm |
| Continue có điều kiện | Onboarding ≥ 65%, diagnostic completion ≥ 75%, D7 learning return ≥ 30%, có tín hiệu WVSP nhưng sample/confidence còn thấp |
| Xem xét scale | Các guardrail đạt, ≥40% Giáo viên hoạt động thực hiện ít nhất một can thiệp/assignment từ insight và không có P0 trust incident |

Learning efficacy phải được báo cáo riêng engagement: dùng baseline và reassessment tương đương, ghi khoảng thời gian giữa hai lần đo, nhận diện practice effect và không diễn giải pilot quan sát như thử nghiệm nhân quả.

---

## 13. Nhịp điều hành đề xuất

### Hằng ngày, bất đồng bộ

OpenCode báo:

- Đã hoàn thành.
- Evidence build/test.
- Quyết định đang bị chặn.
- File/schema/API thay đổi quan trọng.
- Việc tiếp theo.

Antigravity báo:

- Artifact đã hoàn tất.
- Insight/quyết định cần PM.
- Thay đổi UX có thể ảnh hưởng engineering.
- Rủi ro scope hoặc content.

### Hai lần mỗi tuần

- PM review demo chạy được, không chỉ đọc status.
- Triage P0/P1/P2.
- Cập nhật decision log và risk register.
- Kiểm tra engineering, UX và content có còn đồng bộ.

### Cuối mỗi milestone

- Demo theo user journey.
- Acceptance evidence review.
- Retrospective ngắn: giữ, sửa, bỏ.
- Chỉ mở milestone kế khi gate trước đạt hoặc có waiver ghi rõ owner/risk.

---

## 14. Risk register cấp dự án

| Rủi ro | Xác suất | Tác động | Tín hiệu sớm | Owner | Giảm thiểu |
|---|---|---|---|---|---|
| Code đi trước quyết định Product | Cao | Cao | Schema/flow chứa assumption không được duyệt | PM | Gate 0 + decision log |
| Nội dung không theo kịp platform | Cao | Cao | UI/API xong nhưng thiếu question pool | Content Lead | Content burn-up + pilot hẹp |
| “Adaptive” không tạo giá trị thật | Trung bình | Cao | Lộ trình giống nhau, confidence giả | Assessment Lead | Baseline rõ + golden cases + pilot data |
| RBAC đúng ở UI nhưng sai ở API | Trung bình | Rất cao | Thiếu negative/cross-class tests | Engineering | Authorization matrix gate |
| Privacy trẻ em chưa rõ | Cao | Rất cao | Không xác định consent/retention | PM/Legal | Privacy gate trước dữ liệu thật |
| Mở scope lớp 6–9 quá sớm | Cao | Cao | Nhiều curriculum nhưng coverage mỏng | PM | Chỉ mở sau Horizon 1 |
| Dashboard Giáo viên không actionable | Trung bình | Cao | Giáo viên xem nhưng không giao/can thiệp | Product/UX | Research + action-first dashboard |
| Pilot không đo được learning outcome | Trung bình | Cao | Chỉ có click/time metrics | PM/Data | WVSP + reassessment design |

---

## 15. Tiêu chí thành công của toàn project

Project không được coi là thành công chỉ vì deploy được.

### Thành công kỹ thuật

- An toàn quyền và dữ liệu.
- Luồng chính ổn định, resume được và có observability.
- Content/attempt có version và tái dựng được.

### Thành công sản phẩm

- Học sinh hiểu kết quả và biết việc tiếp theo.
- Có evidence cho tiến bộ kỹ năng, không chỉ completion.
- Giáo viên dùng insight để thực hiện can thiệp.

### Thành công vận hành

- Content team publish/rollback không cần can thiệp database.
- Support điều tra được sự cố qua audit/request ID.
- PM nhìn được funnel, learning loop và risk theo cohort.

### Thành công chiến lược

- Chứng minh được một wedge hẹp trước khi mở rộng.
- Mỗi grade mới tận dụng platform chung, không tạo một sản phẩm riêng.
- Cá nhân hóa ngày càng tốt từ dữ liệu đáng tin thay vì từ claim marketing.

---

## 16. Hành động tiếp theo ngay lập tức

1. Không đổi prompt đang chạy của OpenCode.
2. PM/Product Owner duyệt hoặc sửa PM recommendation D-01 đến D-04.
3. Antigravity bắt đầu decision pack và target journey/wireflow.
4. Kiểm kê content thật theo skill/difficulty, không dựa vào con số marketing trong prototype.
5. Tạo traceability matrix PRD → implementation → test trước khi khối lượng code tăng lớn.
6. Chỉ mở Student/Teacher data API sau khi data scope và privacy gate có quyết định.
7. Khi OpenCode hoàn thành milestone đầu, tổ chức Gate 1 review bằng demo và evidence.
