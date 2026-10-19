# C3-02 — Đặt helper báo cáo vào feature

- Người thực hiện: Antigravity; rủi ro thấp.
- Mục tiêu: thử migration feature trên hàm trình bày đã có kiểm thử, giữ nguyên consumer.
- Tệp: `src/components/assignmentReportInsights.js`, `tests/assignment-report-insights.test.mjs`; tạo `src/features/assignment-report/insights.js` và `src/features/assignment-report/index.js`.
- Được phép: chuyển nguyên thân hàm sang `insights.js`, index xuất đúng tên hiện có, tệp cũ re-export qua index, bổ sung identity test cho shim.
- Cấm: sửa JSX/CSS, state, API, công thức tỷ lệ, làm tròn, tiêu chí thời gian hoặc tên export; sửa import checker/policy; chuyển `AssignmentResultsPanel`/`AssignmentAnalyticsPanel` trong gói này.
- Hợp đồng: helper không I/O, không import component/feature khác; giữ trạng thái chưa nộp/chưa chấm và zero; public entry duy nhất là index.
- Phụ thuộc: nền tảng; độc lập C3-03, không chồng lấn tệp.
- Nghiệm thu: test cũ nguyên ý nghĩa, test identity đạt; consumer cũ hoạt động qua shim; không thay markup hoặc payload.
- Lệnh: `node --test tests/assignment-report-insights.test.mjs`; `npm run architecture:check`; `npm run lint`; `npm run build`.
- Báo cáo: ID, tệp, export giữ lại, lệnh/exit code, diff hành vi bằng không, rollback.
- Rollback: revert commit gói; giữ mọi thay đổi gói khác.
