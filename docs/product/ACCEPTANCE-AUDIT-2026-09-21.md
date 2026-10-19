# Rà soát các mục chưa đạt nghiệm thu — 2026-09-21

**Trạng thái hiện hành: NOT HANDOFF READY.** Working tree còn thay đổi chưa commit; `c9c1df9` chỉ là commit nền, không phải build SHA của bản đang kiểm tra. Kết luận “TECHNICAL HANDOFF READY” trong báo cáo cũ bị rút lại vì bộ browser test mới chỉ bao phủ smoke, môi trường kiểm thử và package chưa tái lập đầy đủ trên máy sạch.

## Bằng chứng chạy trong lượt này

| Hạng mục chưa đạt ở lần rà soát trước | Kết quả hiện tại |
| --- | --- |
| Browser smoke | `npm run e2e:browser` PASS 12/12 smoke checks có assertion trên Edge; báo cáo và ảnh trong `docs/evidence/browser-e2e/`. Lần chạy đầu phát hiện 404 giả PASS; lần tiếp theo phát hiện duplicate answer gây API 500 và KaTeX mobile trả PASS giả. Code và điều kiện kiểm tra đã được sửa. |
| Diagnostic duplicate/timeout | `apps/api/test/diagnostic-resilience.integration.spec.ts`: 5 request đồng thời, 1 answer record, 0 HTTP 500; resume sau khi câu quá hạn trả 0 giây và backend ghi timeout. Test riêng 2/2 PASS. |
| Build và API test sau sửa lỗi | `npm run build:prototype`, `npm run build:api`, `npm run typecheck` PASS; `npm run test`: 8 files, 35 tests PASS trên `adaptivemath_test`. |
| DB test | Vitest dùng `adaptivemath_test`; DB này có sẵn trong máy kiểm thử. Chưa có quy trình tạo/reset deterministic từ source package. Không coi là máy trắng độc lập. |
| Source package | `npm run package:release` PASS: staging allowlist 122 file, loại `docs/evidence/`, giải nén rồi chạy `npm ci`, Prisma generate, frontend build, typecheck, API build và 35 tests. ZIP hiện hành `release/adaptivemath-release-1.0.0-rc1.zip`; SHA-256 trong tệp `.zip.sha256` bên ngoài. Bản kiểm chứng dùng DB test có sẵn trên cùng host, chưa gồm browser E2E hay Docker boot. |
| Backup evidence | Dump nằm ở `docs/evidence/backup/backup_rehearsal.sql`, bị loại khỏi Git/package. Đây là dữ liệu nhạy cảm cần Data owner quyết định retention. RPO/RTO đo cục bộ không phải SLA production. |

## Việc còn mở

| Mức | Điều kiện đóng | Owner |
| --- | --- | --- |
| P1 | Browser E2E có assertion cho toàn bộ luồng student: hoàn thành diagnostic, result, mistake, join classroom, refresh/resume, session revoke; teacher applicant → admin approve → teacher tạo lớp/mã; maker-checker negative. Bộ script hiện tại chủ yếu mở màn hình/chụp ảnh. | Frontend / QA |
| P1 | Automated WCAG 2.2 AA scan, keyboard thủ công, screen reader (ghi NOT TESTED nếu không có), console và overflow ở 390/768/1024/desktop với kịch bản thực. | QA / UX |
| P1 | Test DB được tạo, migrate, seed và reset theo quy trình tự động trên môi trường sạch; test không để dữ liệu tồn dư và không chạm DB demo. | Backend / QA |
| P1 | Tạo lại package từ snapshot source hiện hành; kiểm tra `npm ci`, migration, build, test, browser E2E, Docker boot/health trên package và secret scan phù hợp. | Release Engineer |
| External | Source legacy, D-01..D-04, Academic/Privacy/Legal sign-off và UAT người dùng thật. | Product / Academic / Legal / QA |

## Dữ liệu nội dung

Snapshot DB demo được ghi ở lần kiểm kê gần nhất: **254 Question** (2 DRAFT, 216 IN_REVIEW, 36 PUBLISHED) và **32 SkillNode**. Đây không phải bằng chứng import nguồn legacy hoặc duyệt học thuật. Không xóa bản ghi hiện có chỉ để khớp snapshot tài liệu cũ.

## Ghi chú về bằng chứng trước đây

- Screenshot `04_diagnostic_result_report_1440.png` thực tế là **empty profile trước khi hoàn thành bài**, không chứng minh result report.
- Bài `frontend-client-routing.spec.ts` sao chép logic thay vì import mã frontend, nên 34/35 test API không thay cho frontend unit test.
- Script browser cũ ghi PASS cho 404 bằng cách tìm chữ “AdaptiveMath” và ghi PASS cho KaTeX mobile khi không có `.katex-display`; hai điều kiện này đã được loại bỏ.
- Package cũ quét mẫu private key và denylist, chưa chứng minh không có mọi loại secret. Quy trình kiểm chứng phụ thuộc PostgreSQL test DB có sẵn trên host.
- Không tự ký thay Product Owner, Academic Lead, Legal/Privacy Officer hoặc QA UAT.
