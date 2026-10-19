# C3-03 — Đặt helper nhóm đề vào feature

- Người thực hiện: Antigravity; rủi ro thấp.
- Mục tiêu: chuyển helper nhóm đề có kiểm thử sang feature, giữ thứ tự ổn định và input bất biến.
- Tệp: `src/components/examDisplay.js`, `tests/exam-display.test.mjs`; tạo `src/features/exam-display/grouping.js` và `src/features/exam-display/index.js`.
- Được phép: di chuyển nguyên logic, index xuất đúng public names, shim tại đường dẫn cũ, thêm test identity.
- Cấm: đổi loại câu hỏi, orderIndex, dữ liệu đáp án; sửa QuestionDisplay/JSX/CSS, box xanh/viền đen, trường editing hoặc policy.
- Hợp đồng: không mutate đề đầu vào; giữ ba nhóm và thứ tự legacy; không đọc browser global, storage hoặc HTTP; không import feature khác.
- Phụ thuộc: nền tảng; độc lập C3-02.
- Nghiệm thu: test cũ đạt và không giảm assertion, shim identity đạt, build và checker đạt, không đổi UI.
- Lệnh: `node --test tests/exam-display.test.mjs`; `npm run architecture:check`; `npm run lint`; `npm run build`.
- Báo cáo: ID, commit/tệp, public exports, kiểm chứng thứ tự/bất biến, kết quả lệnh, rollback.
- Rollback: revert đúng commit gói, giữ các shim khác.
