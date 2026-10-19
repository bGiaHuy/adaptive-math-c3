# Task biểu đồ năng lực, chatbot và dịch vụ đã nhắc

> Trạng thái cuối 14/10/2026: đã hoàn thành các task tính năng biểu đồ, chatbot hỏi tiếp bài ôn và đối chiếu hạ tầng riêng của Math; đã kiểm chứng MWAPI thật. Mục 1–7 giữ lịch sử rà soát/triển khai; kết luận và giới hạn hiện hành ở mục 8. Không tuyên bố đã hoàn thành ngân hàng học liệu hoặc tích hợp gửi email Resend.

Ngày rà soát: 14/10/2026. Nguồn: mã nguồn và tài liệu tại workspace hiện tại, gồm cả thay đổi chưa commit. Đây là kết quả rà soát local; chưa kiểm chứng môi trường production, tài khoản dịch vụ hoặc database đích. Không deploy, gửi email hoặc thay đổi database trong lần rà soát này.

> Cập nhật: người dùng đã yêu cầu tự triển khai các task. Biểu đồ và chatbot đã được triển khai và kiểm chứng local; xem mục 5. Các bảng bên dưới mô tả trạng thái trước triển khai.

## 1. Kết quả đối chiếu

| Hạng mục | Bằng chứng hiện có | Kết luận |
| --- | --- | --- |
| Hồ sơ năng lực | `src/components/ProfileCompetencyView.jsx`; `getMasteryOverview` trong `apps/api/src/modules/student/student.service.ts`; PRD mục hồ sơ năng lực; `docs/product/RELEASE-READINESS.md` mục 2.5 | Có giao diện tổng quan, thanh phần trăm từng kỹ năng, số câu bằng chứng, mức thành thạo và trạng thái thiếu dữ liệu. Checklist cũ có đánh dấu hoàn thành mastery overview; không đồng nghĩa đã hoàn thành biểu đồ mới. |
| Biểu đồ năng lực riêng | Giao diện hiện tại dùng thanh CSS theo kỹ năng. Không tìm thấy task ghi rõ radar trong tài liệu đã rà soát. | Đã có trực quan cơ bản; radar hoặc biểu đồ tổng hợp là phần đề xuất mới, chưa triển khai/chưa chốt dạng biểu đồ. |
| Thông tin chất lượng ước lượng | API trả `evidenceCount`, `lastAssessedAt`, `insufficientCount`, `unassessedCount`, `targetMastery`; UI hiển thị số bằng chứng và phần dữ liệu chưa đánh giá. | Chưa hiển thị ngày cập nhật từng kỹ năng; API mastery chưa trả sai số/khoảng tin cậy. Số bằng chứng không thay thế khoảng tin cậy thống kê. |
| AI hỗ trợ bài ôn | `src/components/MathReviewView.jsx`, `MathAiReply.jsx`; `apps/api/src/modules/student/math-review.controller.ts`, `math-review.service.ts`; module `apps/api/src/modules/ai/`; `docs/PERSONAL-STUDY.md` | Có ô nhập cách suy nghĩ và nút xin góp ý sau khi mở đáp án, gọi `/student/review/feedback`. Có kiểm tra dữ liệu thuộc học sinh và chặn khi diagnostic đang làm. |
| Chatbot nhiều lượt | Luồng hiện tại nhận một phần cách suy nghĩ và trả một góp ý; chưa thấy màn hình hội thoại, API phiên chat hoặc lưu lịch sử hội thoại riêng trong phần rà soát. | Chưa có bằng chứng triển khai chatbot nhiều lượt. Không tìm thấy task chatbot độc lập được chốt trong tài liệu. |
| Cấu hình AI | `apps/api/.env.example`, `apps/api/src/modules/ai/ai.config.ts` | Template mặc định `AI_ENABLED=false`, hỗ trợ Anthropic/MWAPI và các biến giới hạn ngân sách. Không suy ra AI production đang bật hoặc đã chạy thành công. |

## 2. Backlog và tiêu chí hoàn thành

Các mục dưới đây đã được đối chiếu triển khai và bằng chứng local/production ở mục 7–8. Nhánh điều kiện tổng hợp theo chương không áp dụng vì đã chọn thanh theo kỹ năng. Resend được đối chiếu trạng thái, không coi là đã tích hợp gửi thư.

### NL-01 — Chốt cách thể hiện biểu đồ năng lực (ưu tiên 1)

- [x] Chọn biểu đồ theo kỹ năng hoặc tổng hợp theo chương dựa trên câu hỏi cần trả lời: học sinh đang mạnh/yếu ở đâu và nên luyện gì tiếp.
- [x] Nếu tổng hợp theo chương, ghi rõ công thức, trọng số và cách xử lý kỹ năng chưa đánh giá; không lấy thiếu dữ liệu thành điểm 0.
- [x] Ghi quyết định về dạng biểu đồ trong decision log, kèm tiêu chí đọc được trên điện thoại và khi có nhiều kỹ năng. Radar là lựa chọn cần đánh giá, chưa phải yêu cầu cũ được xác nhận.

### NL-02 — Hoàn thiện dữ liệu và giao diện năng lực (ưu tiên 2; sau NL-01)

- [x] Dùng dữ liệu mastery thật, lọc đúng khối lớp và học sinh; phân biệt chưa đánh giá, thiếu bằng chứng, đang củng cố, cần luyện và thành thạo.
- [x] Hiển thị ngày cập nhật, số bằng chứng, ngưỡng theo mục tiêu và giải thích điểm là ước tính. Chỉ trình bày sai số/khoảng tin cậy khi backend cung cấp và có định nghĩa được kiểm chứng.
- [x] Có bảng hoặc nhãn chữ tương đương biểu đồ; không chỉ dựa vào màu. Kiểm tra trạng thái tải, lỗi, trống, dữ liệu một phần và màn hình nhỏ.
- [x] Nghiệm thu bằng dữ liệu có kỹ năng chưa đánh giá/thiếu bằng chứng và bằng tài khoản khác nhau; điểm hiển thị khớp API. Ghi bằng chứng kiểm tra vào tài liệu nghiệm thu trước khi đánh dấu hoàn thành.

### AI-01 — Kiểm chứng luồng AI góp ý đang có (ưu tiên 1)

- [x] Kiểm tra schema/migration, cấu hình provider và ngân sách của môi trường đích trước khi bật AI; khóa chỉ nằm ở backend.
- [x] Nghiệm thu luồng mở đáp án → nhập cách nghĩ → nhận góp ý có công thức toán; xác nhận lời giải/lịch ôn vẫn dùng được khi AI tắt hoặc lỗi.
- [x] Kiểm tra từ chối truy cập lượt ôn của người khác, chặn khi đang diagnostic, giới hạn yêu cầu/ngân sách và hành vi khi provider lỗi/hết thời gian.
- [x] Ghi rõ môi trường và kết quả thực chạy. Sự tồn tại của code/test không được coi là bằng chứng đã chạy production.

### AI-02 — Xác định và triển khai chatbot nhiều lượt (ưu tiên 2; sau khi chốt phạm vi)

- [x] Chốt chatbot dùng để hỏi tiếp bài ôn, giải thích kiến thức hay hỗ trợ sử dụng web; quy định dữ liệu nào được đưa vào ngữ cảnh.
- [x] Đặc tả màn hình hội thoại, phiên chat, lịch sử, thời hạn lưu/xóa, quyền sở hữu và hợp đồng API; xác định có tái sử dụng module AI hiện tại hay không.
- [x] Thực hiện hội thoại nhiều lượt có ngữ cảnh đúng bài/học sinh, nút gửi, trạng thái chờ, lỗi và thử lại không tạo yêu cầu trùng.
- [x] Áp dụng giới hạn chi phí, bảo vệ khóa, phân quyền dữ liệu và quy tắc hỗ trợ khi có bài kiểm tra đang diễn ra. Ghi rõ giới hạn hiện tại: cơ chế chặn diagnostic chưa chứng minh chặn được mọi phiên bài lớp.
- [x] Nghiệm thu ít nhất hai lượt hỏi tiếp, hai học sinh không đọc được lịch sử của nhau, lỗi provider, AI tắt và vượt hạn mức. Lưu bằng chứng trước khi đánh dấu hoàn thành.

## 3. Vercel, Supabase và Resend

Người dùng xác nhận đã nhắc cả ba dịch vụ trong quá trình làm. Ghi nhận này là ngữ cảnh lựa chọn dịch vụ, không phải bằng chứng cả ba đã được kết nối thành công.

| Dịch vụ | Cấu hình/bằng chứng local | Phần cần xác minh |
| --- | --- | --- |
| Vercel | Có `vercel.json`: framework Vite, build `npm run build`, output `dist`, chuyển `/api/:path*` sang `https://adaptivemath.onrender.com/api/:path*`, fallback SPA về `index.html`; có `.vercelignore`. | Project/domain/deployment đang phục vụ người dùng, biến môi trường, backend tương ứng và cookie/origin thực tế. File cấu hình không chứng minh lần deploy mới nhất đã thành công. |
| Supabase | `docs/deployment/DEPLOYMENT.md` nhắc Supabase trong các lựa chọn PostgreSQL; backend dùng Prisma và `DATABASE_URL`. Template đang trỏ PostgreSQL local. | Project Supabase nào được chọn, database đích và migration tương ứng. Không có SDK Supabase không chứng minh chưa dùng database Supabase qua Prisma. Không đọc/in khóa hoặc chuỗi kết nối bí mật vào báo cáo. |
| Resend | Không tìm thấy tên Resend trong mã nguồn, dependency hoặc tài liệu được rà soát. Có trường email tài khoản/phụ huynh nhưng đó chưa phải luồng gửi thư. | Tài khoản/domain gửi và mục đích email đã chọn; sau đó mới đối chiếu tích hợp backend, biến môi trường, xử lý lỗi và bằng chứng gửi thử được cho phép. Chưa kết luận Resend đã tích hợp. |

### INF-01 — Đối chiếu môi trường đã kết nối (ưu tiên 1, trước triển khai)

- [x] Xác định project Vercel, backend Render, project/database Supabase và tài khoản/domain Resend từ bằng chứng cấu hình hoặc tài khoản được kết nối.
- [x] Lưu tên môi trường và tham chiếu bằng chứng đã che bí mật; phân biệt chưa cấu hình, đã cấu hình và đã kiểm chứng chạy thật cho từng dịch vụ.
- [x] Ghi kết quả đối chiếu vào tài liệu triển khai; mọi thay đổi production/database và gửi email nằm ngoài phạm vi lần rà soát này.

Vercel CLI chưa được cài theo thông tin phiên làm việc. Khuyến nghị cài `npm i -g vercel` khi bắt đầu công việc triển khai để dùng các chức năng quản lý môi trường, deploy và xem log; không cần cài để hoàn thành tài liệu rà soát này.

## 4. Thứ tự đề xuất và giới hạn nghiệm thu

Thực hiện NL-01, AI-01 và INF-01 trước; sau đó NL-02 và AI-02 theo quyết định sản phẩm. Tài liệu này hoàn thành việc ghi nhận task và tiêu chí, không đánh dấu các task triển khai là đã xong. Chưa truy cập web đang chạy hoặc các tài khoản dịch vụ; chưa chạy lại test chức năng vì lần này chỉ sửa tài liệu.

## 5. Kết quả triển khai 14/10/2026

### Đã làm và kiểm chứng local

- NL-01: chọn biểu đồ thanh ngang theo kỹ năng để đọc được nhiều kỹ năng trên điện thoại. Không tổng hợp điểm chương, không đặt trọng số hoặc coi phần chưa đánh giá là 0. Bộ lọc chương chỉ lọc dữ liệu.
- NL-02: API trả catalog đúng khối lớp, điểm null khi chưa đánh giá. Biểu đồ có lọc chương, sắp xếp điểm thấp trước, ngưỡng mục tiêu, nhãn chữ, số bằng chứng và ngày cập nhật. Thanh gạch chéo chỉ kết quả chưa đủ bằng chứng; không dựng khoảng tin cậy giả.
- AI-02: chatbot theo bài ôn đã mở đáp án, nhiều lượt, dùng ngữ cảnh server và 6 lượt gần nhất, tối đa 20 lượt. Có danh sách mở lại lịch sử, xóa nội dung nhưng giữ chi phí. Nội dung quá 30 ngày không xuất hiện trong lịch sử và được dọn khi học sinh mở hội thoại. Tái sử dụng `AiRequest` và `MathReviewLog`, không cần migration mới.
- Chống gửi trùng bằng mã yêu cầu, ID ổn định theo người dùng/bài ôn/yêu cầu và kiểm tra trong khóa giao dịch ngân sách. Xóa hội thoại dùng cùng khóa và từ chối khi có yêu cầu đang xử lý.
- AI-01 (local): đã kiểm tra bật/tắt, lỗi mạng, ngân sách, chủ sở hữu, diagnostic, gửi lại, lưu và xóa lịch sử. Chưa gọi provider thật.

### Bằng chứng nghiệm thu

- Build frontend, build API và typecheck đạt.
- `node scripts/verify-math-adaptive.mjs`: 69 test đạt, 1 bỏ qua; database riêng, kiểm tra migration và bảo toàn bản ghi English.
- `node scripts/verify-math-tutor.mjs`: giao diện thật + API thật + database riêng; hai lượt chat có ngữ cảnh, mở lại sau reload, gửi lại không tăng phí, học sinh khác nhận 404, diagnostic đang làm nhận 403, xóa nội dung vẫn giữ accounting. Không tràn ngang ở 390px, không lỗi JavaScript chưa xử lý.
- Provider trong bài kiểm tra trình duyệt được kiểm soát và chỉ được nạp trong môi trường QA riêng. Không phải fallback sản phẩm và không chứng minh cấu hình/chất lượng AI thật.
- Báo cáo, ảnh: `docs/evidence/math-tutor/VERIFICATION.md`.

### Dịch vụ đã đối chiếu và phần còn lại

- Vercel có project `adaptivemath`, domain `adaptivemath-blush.vercel.app`, deployment production gần nhất được API trả READY; chưa deploy bản sửa mới.
- Render có service `Adaptivemath` tại `https://adaptivemath.onrender.com`, trong `My Workspace`. Nhưng service đang theo repo `bGiaHuy/english`, nhánh main, trong khi workspace local có remote `bGiaHuy/math`. Cần đối chiếu nguồn trước khi phát hành, tránh ghi đè sản phẩm khác.
- Supabase: `adaptivestudy` ACTIVE_HEALTHY, `Adaptivemath2` INACTIVE. Catalog của dự án hoạt động có LeafChatMessage/StudentSkillProfile và cấu trúc khác Math local. Chưa xác nhận là database của repo này; chưa migrate vào đó. Catalog báo RLS tắt ở các bảng public; cần kiểm tra quyền Data API và mô hình truy cập trước khi sửa.
- Resend: tài khoản kết nối trả không có domain. Chưa gửi thư; cần xác định domain và mục đích email trước khi bổ sung luồng thư, không tự tạo dịch vụ không liên quan đến hai tính năng học tập.
- Local chưa có biến AI được cấu hình ngoài template. Chưa xác minh provider/backend/database thật hoặc deploy bản sửa mới. Goal vẫn active cho phần hoàn thiện trên môi trường thật.

### Rà soát bổ sung trước phát hành

- Đã sửa trường hợp gửi lại câu hỏi chứa thông tin bị che: đối chiếu cùng bản đã che để không từ chối nhầm mã yêu cầu. Kiểm tra hồi quy cho thấy không gửi lại provider hoặc tạo phí mới; 11 test chatbot đạt và typecheck đạt.
- Render đang theo URL GitHub `bGiaHuy/english`; connector GitHub trả 404 khi đọc package.json ở URL đó, nhưng đọc được package.json của `bGiaHuy/math`. 404 có thể do quyền truy cập hoặc repo không còn ở URL cũ, chưa đủ căn cứ tự đổi liên kết production.
- `.env` local chỉ trỏ database kiểm thử tại loopback; không thể dùng nó để suy ra database production. Đọc catalog của `Adaptivemath2` thất bại do timeout trong trạng thái tạm dừng.
- Câu hỏi chọn đích triển khai đã gửi và đang chờ trả lời. Không coi phản hồi trước “hình như là vậy” là xác nhận đổi repo hoặc chọn một database có schema khác.

### Trình tự phát hành khi xác định được đích

1. Xác nhận repo/site/database của Math; đọc schema database đích và đối chiếu lịch sử migration trước khi thay đổi. Nếu chọn `Adaptivemath2`, khôi phục rồi kiểm tra trước, không reset/database push.
2. Kiểm tra backend có schema Math review và adaptive loop. Biểu đồ/chatbot mới không thêm schema nhưng phụ thuộc những phần nền này đang chưa commit trong workspace.
3. Kiểm tra cấu hình AI backend: provider, khóa chỉ phía server, model, đơn giá và ngân sách. Chưa bật AI trước khi đủ cấu hình.
4. Chuẩn bị bản phát hành frontend/API cùng phiên bản; xác định các thay đổi nền đã có trong workspace, không ghi đè hoặc bỏ sót chúng khi đóng gói.
5. Kiểm chứng cookie/origin trên domain Vercel và backend Render, dữ liệu năng lực thật, hai lượt chat với provider thật và ledger chi phí. Chỉ ghi hoàn tất production sau bằng chứng thực chạy.
6. Resend được ghi nhận trong stack, nhưng chưa có domain/mục đích email xác nhận. Không tự gửi email thử hoặc dùng nó làm provider cho chatbot.

## 6. Đích riêng đã được người dùng xác nhận

- Người dùng yêu cầu Math dùng site riêng, được phép deploy mới nếu cần; phải tránh xung đột Adaptive English và đối chiếu database trước khi dùng. Người dùng chọn organization/tài khoản Supabase khác cho Math khi biết hạn mức hiện tại.
- Render `Adaptivemath` (`srv-darv7grbc2fs738mev20`) có deployment live commit `61775c878995cf7cc4da1397db50bb79f6db3f8d` với thông điệp về vocabulary cards/callouts; deployment trước về AI tutor mock fallback. Đây là bằng chứng nguồn đang phục vụ luồng English, không phải bản Math mới. Không đổi repo, môi trường hoặc kích hoạt deploy service này.
- Đã thử khôi phục `Adaptivemath2` để đọc schema theo yêu cầu người dùng. Supabase từ chối vì tài khoản quản trị đã đạt giới hạn 2 dự án miễn phí đang hoạt động trên các organization. Không tạm dừng/xóa/nâng cấp dự án khác để lấy chỗ.
- Kết nối Supabase hiện chỉ liệt kê `bGiaHuy's Org` (`vmeqbceqcbsvtkjpdoox`); không có organization khác có thể chọn. Cần người dùng kết nối tài khoản khác hoặc cấp quyền organization đích trước khi tạo database riêng. Việc tạo organization mới bằng cùng tài khoản không chứng minh giải quyết hạn mức theo tài khoản quản trị.
- Đã cập nhật Blueprint `render.yaml` cho backend riêng tên `adaptivemath-api`, repo `bGiaHuy/math`, region Singapore, gói free, build theo lockfile, Node 24, domain Vercel Math đã xác minh, cookie `__Host-am_math_session`, secret phiên và lời mời sinh riêng, health endpoint. Chưa tạo service mới vì chưa có database riêng hoạt động để cấu hình và kiểm chứng. AI mặc định tắt cho đến khi có thông tin provider phía server hợp lệ; không có mock fallback sản phẩm.
- Chưa đổi rewrite Vercel: chỉ đổi sang URL backend Math mới sau khi service đó được tạo và kiểm chứng, tránh tự suy đoán hostname hoặc trỏ sang service English.
- Đang chờ kết nối Supabase mới và tên organization đích. Sau đó xác nhận tên tổ chức, tạo project Math riêng, kiểm tra schema/migration, cấu hình backend mới và phát hành frontend/API đồng bộ. Không chia sẻ `DATABASE_URL`, khóa AI hoặc secret với English.

### Kết nối CLI mới đã xác minh

- Người dùng đăng nhập Supabase CLI bằng tài khoản khác ngày 14/10/2026; CLI xác nhận đăng nhập thành công. Không lưu mã xác minh hoặc access token trong tài liệu.
- Organization khả dụng của CLI mới: `adaptivemath org` (`rehsadgpwweamkvxairh`). Project mới: `turjtcqkmjfkhqijjpdz`, region Tokyo, tạo ngày 14/10/2026.
- Truy vấn chỉ đọc qua `supabase db query --linked --project-ref ...` xác nhận `public_table_count = 0`; chưa có bảng public để nhầm với schema Math/English cũ. Chưa áp dụng migration hoặc nạp dữ liệu.
- Plugin Supabase và CLI có phiên đăng nhập độc lập. Các bước tiếp theo với project này phải dùng CLI đã xác minh; không dùng plugin cũ để suy ra quyền hoặc project đích.
- Hạn mức của tài khoản cũ không còn là điều kiện chặn đích mới. Cần thiết lập schema/quyền, thông tin kết nối backend riêng, đối chiếu migration và triển khai service Math mới; AI thật vẫn cần khóa phía backend và kiểm chứng ngân sách.

## 7. Math đã phát hành riêng ngày 14/10/2026

- Repo: `bGiaHuy/math`, nhánh `codex/math-competency-tutor-release`. Commit tính năng `e6c5d5d`; commit chuyển API sang backend Math riêng `f5566e7`.
- Frontend production: https://adaptivemath-blush.vercel.app, Vercel project `adaptivemath`, deployment `dpl_HEMZHjUQcqsqtjjVs3cgyhg4XVCu` READY ở commit `f5566e7989d1dc54d507787498d38f6bc88a6ce5`.
- Backend mới: https://adaptivemath-api.onrender.com, service `srv-db7oia2vcj2c73eck8o0` trong `My Workspace`, gói free, Singapore. Nguồn là nhánh Math riêng; không cập nhật service cũ `Adaptivemath` đang phục vụ English.
- Người dùng đã xác nhận rõ cho phép đưa DATABASE_URL của `math_app`, SESSION_SECRET và INVITE_CODE_HMAC_SECRET mới vào biến môi trường service Math mới sau khi kiểm duyệt tự động yêu cầu xác nhận đích nhận secret. Không đưa secret vào Git/frontend/tài liệu.
- Database mới: project `turjtcqkmjfkhqijjpdz` thuộc `adaptivemath org`, schema riêng `math`. 7 migration được áp dụng, gồm migration tiến tới `20261014100000_schema_reconciliation` cho các bảng bài tập lớp còn thiếu và quan hệ author/reviewer cũ.
- Đã chạy chuỗi migration từ đầu trong database QA và đối chiếu schema trước khi áp dụng cloud. Không reset hoặc migrate vào database English.
- 30 bảng ứng dụng có RLS. `anon`/`authenticated` không có USAGE trên schema; runtime `math_app` không có CREATE, SUPERUSER hoặc BYPASSRLS. Chính sách RLS chỉ cho runtime backend; quyền sở hữu học sinh tiếp tục được kiểm tra ở API.
- Prisma kết nối đúng role `math_app` và schema `math` qua pooler đã được CLI trả về. Secret riêng lưu cục bộ trong `.env.math-production.local` (Git bỏ qua); các SQL chuẩn bị chứa secret nằm trong thư mục QA bị Git bỏ qua.
- Đã khởi tạo 8 kỹ năng tham chiếu từ danh mục canonical trong seed; không chạy seed demo, không tạo tài khoản demo hoặc tự xuất bản câu hỏi.
- Kiểm tra domain frontend trả 200; `/api/v1/health` qua chính domain Vercel trả 200, `status=ok`, `database=connected`.
- Kiểm tra trình duyệt production: đăng ký/đăng nhập, cookie `__Host-am_math_session` Secure + HttpOnly, biểu đồ có điểm/thiếu bằng chứng/chưa đánh giá ở desktop và 390px. Tài khoản QA tạm và dữ liệu năng lực tổng hợp đã được xóa trong finally. Báo cáo: `docs/evidence/math-tutor/live/VERIFICATION.md`.
- Build frontend/API đạt; bộ QA Math mới nhất 70 test đạt, 1 bỏ qua. Secret scan đạt.

### Phần còn lại trước khi nghiệm thu đầy đủ chatbot

- Người dùng đã chọn MWAPI. Backend Math đã cấu hình `AI_PROVIDER=mwapi`, `AI_MODEL=claude-haiku-4-5-20251001`; AI production vẫn tắt. Sau lần kiểm duyệt tự động yêu cầu xác nhận đích nhận token, người dùng đã cho phép nhập token. Đã lưu `ANTHROPIC_AUTH_TOKEN` vào biến môi trường service Math riêng trên Render, không chạy installer và không lưu token trong tài liệu/Git. Đang chờ đơn giá hiệu dụng input/output của MWAPI để ledger tính phí; chưa gọi provider hoặc bật AI.
- Database mới hiện có 0 câu hỏi PUBLISHED. Luồng chatbot theo bài ôn cần câu hỏi đã duyệt và lượt ôn đã mở đáp án. Không sao chép ngân hàng hoặc dữ liệu học sinh từ English; không tự xuất bản seed để tạo bằng chứng nghiệm thu.
- Cần kiểm chứng hai lượt hội thoại bằng provider thật trên bài ôn đã duyệt và kiểm tra ledger chi phí, rồi mới đánh dấu hoàn thành AI production.
- Resend vẫn chưa có domain trên tài khoản đã kết nối; chưa gửi email hoặc tự thêm luồng email không được xác định. Việc ghi nhận Resend trong stack đã hoàn thành, không coi là đã tích hợp gửi thư.
- Goal vẫn active; việc phát hành site/database/backend riêng đã xong, phần AI thật và nội dung phục vụ luồng ôn còn chưa đạt.

### Bảng giá MWAPI công khai đã đối chiếu

- Đã đọc trang https://api.mwapi.dev/model-plaza bằng trình duyệt ngày 14/10/2026. Nhóm công khai `Claude Uptime 99%`, rate `5x`, model `claude-haiku-4-5-20251001` hiển thị giá 5 USD input / 25 USD output cho một triệu token. Cột giá official là 1 / 5, không phải giá MWAPI của nhóm này.
- Trang ghi đăng nhập để xem exclusive groups/personal rates. Chưa xác nhận token người dùng thuộc nhóm công khai này hoặc có hệ số riêng; không suy diễn bảng giá official Anthropic thành đơn giá MWAPI của tài khoản.
- Chưa thay đơn giá production hoặc bật AI dựa trên giá công khai. Cần xác nhận nhóm/giá của token trước khi nghiệm thu chi phí thực.

## 8. Nghiệm thu MWAPI thật và phạm vi hoàn thành

- Sau khi được thông báo giá công khai, người dùng đồng ý dùng mức 5 USD input / 25 USD output mỗi triệu token và cho phép tiếp tục. Backend Math được bật `AI_ENABLED=true` với hai đơn giá này; token chỉ nằm trong biến môi trường Render riêng.
- Kiểm thử hai lượt qua trình duyệt production, Vercel proxy, backend Render và MWAPI thật đạt; ledger có hai bản ghi COMPLETED, số token dương, `reservedUsd=0` và chi phí khớp công thức đơn giá đã chọn. Lần kiểm chứng đầu ghi 0,060815 USD.
- Câu hỏi kiểm chứng là fixture toán kiểm tra được bằng phép thế, thuộc khối QA 99 ngoài chương trình học sinh thật 6–9. Fixture/câu ôn/nội dung chat được xóa, tài khoản QA bị khóa, session bị thu hồi; accounting được giữ lại. Không dùng fixture để tuyên bố ngân hàng học liệu production đã sẵn sàng.
- Phản hồi đầu có xu hướng suy diễn lỗ hổng từ câu hỏi “vì sao”; đã sửa chỉ dẫn để trả lời câu hỏi và chỉ xác định lỗi khi có bằng chứng từ đáp án/bước giải. Build API và 13 test chatbot đạt, bao gồm bài thi bắt đầu giữa lúc gọi AI và lỗi xác thực provider.
- Biểu đồ production được kiểm chứng thêm trạng thái trống/tải/lỗi/thử lại. Lỗi tải chỉ được mô phỏng trong trình duyệt QA, không thay cấu hình hoặc gây lỗi backend thật. Dữ liệu tạm đã được dọn.
- Các task NL-01, NL-02, AI-01, AI-02 và INF-01 được triển khai/đối chiếu theo bằng chứng ở `docs/evidence/math-tutor/`, `docs/evidence/math-tutor/live/`, test API và cấu hình dịch vụ riêng. Không triển khai gửi thư Resend vì chưa có domain hoặc mục đích email trong yêu cầu.
- Giới hạn sản phẩm còn công khai: database Math mới chưa có câu hỏi chính thức PUBLISHED; chatbot này hỏi tiếp sau bài ôn, không phải chatbot tự do toàn website. Đưa ngân hàng học liệu qua quy trình duyệt là công việc nội dung riêng. Không thay đổi database hoặc backend Adaptive English.

### Audit hoàn thành các task đã ghi nhận

| Task | Bằng chứng quyết định/triển khai | Bằng chứng kiểm chứng |
| --- | --- | --- |
| NL-01 | Thanh theo từng kỹ năng; quyết định D-MATH-20261014; không tổng hợp chương nên điều kiện trọng số không áp dụng | Biểu đồ desktop/390px và bộ lọc/sắp xếp trong QA |
| NL-02 | Catalog đúng lớp, null chưa đánh giá, nhãn trạng thái, bằng chứng và ngày cập nhật | Báo cáo production VERIFICATION.md: đăng nhập thật, giá trị/API, trống/tải/lỗi/thử lại và không tràn ngang |
| AI-01 | Migration/schema riêng, giá MWAPI đã được người dùng chấp thuận, token chỉ ở backend, ledger ngân sách | Test lỗi/tắt/ngân sách/chủ sở hữu/diagnostic; MWAPI thật trả lời qua route bài ôn và ledger khớp token |
| AI-02 | Hội thoại/lịch sử 6 lượt ngữ cảnh, tối đa 20 lượt, hiển thị 30 ngày, dọn khi đọc, xóa nội dung giữ accounting | Hai lượt liên tiếp thật sau bản sửa chỉ dẫn; QA khác học sinh 404, thi đang làm 403; test thi bắt đầu giữa request giữ accounting và chặn phản hồi |
| INF-01 | Vercel Math, Render service mới, Supabase tài khoản/project/schema riêng; Resend đối chiếu không có domain | Health qua domain Vercel `ok/connected`, runtime math_app đúng schema, RLS/quyền, dữ liệu English không bị sửa |

- Bản sửa gia sư `bf41a1c6cbabbf8e87cf1982244e2f8329083459` đã live trên Render trước vòng kiểm chứng cuối; phản hồi mới giải thích trực tiếp câu hỏi và không gán lỗi tiềm ẩn khi thiếu bằng chứng.
- Vòng MWAPI cuối ghi 0,058265 USD. Cộng vòng đầu, ledger giữ tổng 0,119080 USD cho 4 request COMPLETED; `reservedUsd=0`.
- `FINAL-AUDIT.json` xác nhận site khỏe, không còn tài khoản QA ACTIVE, không còn kỹ năng QA khối 99, giữ 8 kỹ năng tham chiếu và 0 câu hỏi chính thức PUBLISHED. Frontend production có cùng mã ứng dụng với nhánh phát hành hiện tại; thay đổi sau commit frontend chỉ ở API, tài liệu và script kiểm chứng.
- Goal tính năng đủ bằng chứng để hoàn tất. Phần nội dung chính thức và email chỉ được ghi rõ trạng thái, không bị giả định là đã triển khai.
