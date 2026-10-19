# Soft Pastel Bento — Adaptive Math THPT

## Tokens

| Nhóm | Token / giá trị |
|---|---|
| Canvas / surface | #f5f5f7 / #ffffff |
| Mint / pink | #d5ebe3 / #f8deea |
| Lavender / yellow | #e6dff4 / #ffedb5 |
| Text / muted | #252a32 / #535966 |
| Action / hover | #2f574c / #23463c |
| Primary CTA | #293b35 với chữ trắng |
| Focus | #64468e, outline 3px, offset 4px |
| Typography | Poppins 400/500/600/700; Be Vietnam Pro và sans-serif dự phòng cho tiếng Việt |
| Scale | 11–14px metadata; 13–16px nội dung và điều khiển; 17–24px tiêu đề thẻ; 28–40px tiêu đề trang; 30–36px số liệu |
| Leading | 1.35–1.5 tiêu đề; 1.7–1.9 nội dung |
| Spacing | 8, 16, 24, 32, 40, 48px |
| Radius | 16px phần tử con, 24px thẻ và nút, 50% nút tròn |
| Shadow | 6px 6px 20px #343f4910, -4px -4px 16px #ffffffa6 |
| Motion | 180ms cho màu/transform, bỏ chuyển động khi prefers-reduced-motion |

Nguồn token: `src/pastel-bento.css`. Các màu pastel làm nền; chữ tối giữ khả năng đọc. Biến thể đáp án chuẩn xanh/viền đen của QuestionDisplay được giữ riêng, không thay thế bằng token trang trí.

## Components tái sử dụng

- BentoCard: nền white/mint/pink/lavender/yellow, semantic section.
- BentoStat: nhãn, số liệu, chú thích và icon; không tự sinh thành tích.
- RoundButton: nút 48px, tên truy cập, title, hover/focus/active/disabled.
- BankNotice: giải thích kho THCS tạm ẩn và trạng thái chờ THPT.
- CurriculumExplorer: dùng chung dashboard, lộ trình, màn hình tạm ngưng, kho giáo viên/quản trị; chọn lớp, tìm không dấu, empty state, chuyên đề lựa chọn riêng.
- PracticeCalendar: giữ dữ liệu lịch thực tế, tháng trước/sau/hôm nay, loading/error/retry.

## Layout và UX

Desktop: sidebar 224px, dashboard hai cột bất đối xứng, thẻ hành động lớn + 3 chỉ số + lịch. Tablet: sidebar gọn, nội dung lần lượt và lịch/ghi chú hai cột. Mobile: điều hướng ngang có nhãn và cuộn, nội dung một cột, không giấu chuyên đề trong accordion. Danh mục có 3 cột, 2 cột và 1 cột theo chiều rộng; màn hình lớn hơn 1450px sử dụng thẻ rộng xen kẽ.

Kiểm soát tương tác bằng nút và input chuẩn, aria-pressed cho chọn lớp, nhãn tìm kiếm, focus ring, skip link, trạng thái tải lịch và thử lại khi lỗi. Câu hỏi và ô đáp án trong đề đã giao tiếp tục do QuestionDisplay quản lý.
