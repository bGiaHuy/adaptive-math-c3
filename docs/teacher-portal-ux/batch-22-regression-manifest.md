# Batch22 — Hồi quy tổng hợp bản hiện tại

P1 về bằng chứng: nhiều script/ảnh nằm ở các lượt khác nhau, có selector cũ và không có một manifest chứng minh chạy trên cùng phiên runtime. Thêm scripts/verify-teacher-regression.mjs chạy15 verifier tuần tự, lưu startedAt/finishedAt/code/stdout/stderr từng nhóm vào docs/evidence/teacher-regression/latest.json; bất kỳ lỗi làm exit1. Không giảm assertions để lấy pass.

Run thực hoàn tất15/15 exit0: report-ux/regrade/composer-flow/draft-reuse/manual-json/generation/class-management/settings/keyboard/density/report-recovery/partial-load/report-navigation/report-race/library-density. Node test report-insights6/6 đạt. Fixtures được intercept, không tạo/xóa/công bố dữ liệu thật. Kết quả có các mutations giả phục vụ lỗi/thử lại và không chứng minh backend. Thời điểm từng suite trong manifest là nguồn chính xác, không suy từ file tồn tại.

Cập nhật design-system mô tả TeacherOverview/ClassDirectory/Library hiện tại, hành động trực tiếp và ownership pageSize. Không đổi product runtime trong batch này.

## Giới hạn còn tồn tại
- Yêu cầu before/after đúng trạng thái chưa có ở một số batch cũ; không dựng lại ảnh before giả. Có baseline rộng và cặp ảnh cụ thể cho density.
- Axe/keyboard hiện tại không chứng minh screen reader toàn diện.
- Fixture không chứng minh AI/thuật toán/quyền backend; những phần này không thuộc chỉnh sửa UX nhưng chưa đủ bằng chứng cho tuyên bố không regression toàn hệ thống.
- Chưa làm final visual review toàn trang sau mọi thay đổi song song. Tablet thư viện vẫn dài hơn3viewport.

Goal vẫn active; bước tiếp theo là review thực các màn cuối, ghi rõ vấn đề cụ thể và sửa vấn đề có tác động UX, không tiếp tục lặp tests xanh khi chưa có thay đổi hoặc nghi vấn mới.
