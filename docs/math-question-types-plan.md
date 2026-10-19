# Adaptive Math: hợp đồng ba dạng câu hỏi và kế hoạch triển khai

## Checkout và phân công
Bản tích hợp là checkout hiện tại đang chạy local, có các thay đổi phân quyền chưa commit phải giữ nguyên. Worktree adaptive-math-agent đã gắn với chat là snapshot cũ; đồng bộ kết quả sau tích hợp, không dùng nó ghi đè checkout hiện tại.
- Backend agent: Prisma schema/migration; assignment DTO/controller/service; question helper; backend tests.
- Teacher UI agent: TeacherClassroomsView và component giáo viên mới.
- Documents agent: docs/math-import, script nhập, tài liệu bổ sung; không tự ghi database trước pilot review.
- Root: API client, giao diện học sinh, admin question API, lọc tương thích diagnostic/practice/review, tích hợp và kiểm chứng.

## Hợp đồng đóng băng v1
Question.questionType: SINGLE_CHOICE (default), TRUE_FALSE, SHORT_ANSWER.
Giữ options quan hệ hiện tại. Custom payload options dùng key; admin DTO dùng optionKey như cũ.
TRUE_FALSE: statements [{key:'a',content,isCorrect:boolean}, ...b,c,d], đúng 4 ý khác key; không options hoặc shortAnswer.
SHORT_ANSWER: shortAnswer {mode:'NUMERIC'|'TEXT', acceptedAnswers:string[], tolerance?:number, caseSensitive?:boolean}. NUMERIC nhận dấu phẩy/chấm, dấu âm và phân số a/b với b khác0; cấm eval, NaN/Infinity, đơn vị không khai báo. Sai số tuyệt đối >=0 default 1e-9, so sánh số hữu hạn. TEXT: Unicode NFC, trim, gộp whitespace; caseSensitive default false; acceptedAnswers không rỗng.
SINGLE_CHOICE: 4 phương án A-D và đúng 1 đáp án; câu cũ tiếp tục hoạt động không bị migration xóa; hỗ trợ legacy options tối thiểu2 nếu đang lưu, nhưng UI/câu mới tạo chuẩn4.
source JSON: {file,page,questionNumber,url?,author?,year?,reviewStatus:'VERIFIED'}. Chỉ nguồn đã đối chiếu mới VERIFIED; nhập DRAFT, không auto publish.
Submission answer API: {questionId,selectedOptionKey?,selectedOption? (legacy), response?:{trueFalseAnswers?:{a:boolean,b:boolean,c:boolean,d:boolean},shortAnswer?:string}}.
SINGLE_CHOICE dùng selectedOptionKey. TF/SA dùng response; DB SubmissionAnswer.response JSON, gradingDetails JSON. Không tin điểm/isCorrect từ client.
Chấm: mỗi câu chính 1 điểm thô; TF mỗi ý đúng0.25; SINGLE_CHOICE/SHORT_ANSWER đúng1 sai0. Điểm thang10 = tổng điểm thô/tổng trọng số*10, làm tròn1 chữ số. correctCount là số câu chính đúng hoàn toàn.
CreateAssignment thêm questionCounts?:{SINGLE_CHOICE:number,TRUE_FALSE:number,SHORT_ANSWER:number}; khi có phải khớp số thật. UI default12/4/6 nhưng legacy clients không gửi counts giữ được đề cũ. Chặn ID trùng, câu nội dung trùng, tổng0, dữ liệu sai; tạo transaction atomic.
POST /assignments/:id/draft payload tương tự submit lưu IN_PROGRESS; GET take trả assignment.draftAnswers và startedAt, timeSpentSeconds để khôi phục; isSubmitted chỉ true với trạng thái cuối. GET take không lộ shortAnswer rules, correctOption, isCorrect, explanation, gradingDetails. Result chỉ trả sau submit.
GET /admin/questions (teacher được RBAC hiện có): teacher chỉ thấy PUBLISHED hoặc DRAFT của chính mình hoặc DRAFT có source.reviewStatus VERIFIED. Student bị403. Không đổi quyền duyệt tài khoản. Bản nháp được giáo viên chọn rõ vào đề vẫn chưa vào pool học thích ứng.
Assignment custom question lưu DRAFT author teacher; dùng trong đề của mình. Teacher có thể chọn vetted imported draft ở trên.
Diagnostic/practice/review giữ SINGLE_CHOICE đến khi có hiệu chỉnh riêng; không tự đưa câu TF/SA vào engine một đáp án.

## Chặng
A khảo sát/hợp đồng (hoàn tất).
B backend + teacher UI + nguồn chạy song song theo hợp đồng.
C tích hợp student taking/resume/results, test mixed3-type, RBAC, legacy.
D nhập pilot một đề thật, dry-run, đối chiếu nguồn, draft only; kiểm chứng qua đề thử.
E xử lý danh mục12 tài liệu theo lô<=30 câu: câu chắc chắn nhập, câu không đủ đọc/đáp án/hình ghi review cụ thể, không đoán.

## Hoàn tất
Build+test liên quan pass; đủ3 dạng toàn luồng; defaults editable12/4/6; migration additive local only; pilot thật; mỗi12 nguồn có trạng thái/lý do; thống kê nhập/review và bằng chứng. Không production, không English, không reset dữ liệu cũ.

## Kết quả tích hợp 17/10/2026
- Backend/frontend build đạt. Toàn bộ backend118 tests đạt; helper giáo viên5 tests đạt; assignment12 tests đạt sau bổ sung sổ tay/thứ tự.
- API thật kiểm chứng pilot1/1/1 (TF3/4 điểm9.2), đề mặc định12/4/6 đủ22 câu (đúng hết điểm10), khôi phục nháp, thời gian, phân quyền và giữ imported DRAFT.
- Đã nhập local99 DRAFT:71 SINGLE_CHOICE,10 TRUE_FALSE (40 ý),18 SHORT_ANSWER. Nguồn12 được kiểm kê; còn phần chưa đủ xác minh xem docs/math-import/review-queue.json.
- Tải thêm HK2 Hưng Yên12 trang, chưa nhập; không có connector Antigravity, đã lưu prompt.
- Giao diện giáo viên thực tế đã kiểm tra defaults12/4/6, chỉnh1/1/1, chọn ngân hàng và phát hành đề thành công; ảnh teacher-defaults.png.
- Kiểm tra trực quan giao diện học sinh sau nâng cấp chưa hoàn tất vì browser use bị tắt trong Work settings. Không coi kiểm thử API là kiểm thử click UI học sinh. Chưa kiểm tra responsive mobile toàn luồng.
- Cách chấm hiện tại: trọng số bằng nhau câu chính, TF0.25/ý; không phải tỷ trọng3–4–3 điểm như một số đề nguồn. Nội dung imported chưa xuất bản.

## Kiểm chứng UI bổ sung
- Browser use đã hoạt động. Khởi động lại PostgreSQL cluster hiện có bằng pg_ctl (không reset), frontend và API.
- QA học sinh làm đề Web ba dạng qua UI: chọn SC, bốn ý TF, nhập -6; tự lưu và tải lại khôi phục đáp án, đồng hồ không reset; nộp qua xác nhận thành công.
- Kết quả UI 7.5/10 khớp SC1 + TF0.25 + SA1; hiển thị đáp án từng ý và đáp án ngắn. Ảnh student-mobile-result.png ở viewport390x844.
- Còn audit bố cục mobile khi làm bài và giáo viên trước khi đánh dấu goal hoàn tất.

## Chốt kiểm chứng
- UI mobile học sinh đủ3 dạng, bốn ý TF và phân số -12/2 nộp10/10; UI giáo viên tăng6→7/reset đạt. Backend118 tests, helpers5, hai build và diff check đạt.
- Báo cáo đối chiếu yêu cầu/bàn giao: docs/math-question-types-completion.md. Không còn bước kiểm thử UI bị chặn.
