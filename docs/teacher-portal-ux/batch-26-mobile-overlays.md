# Batch26 — Geometry/hit test của bottom nav và publish modal

Phần còn thiếu của audit: full-page screenshot vẽ thanh fixed giữa ảnh không cho biết nó che nội dung khi người dùng ở cuối trang hay không. Thêm kiểm tra geometry/hit target thay vì đoán từ ảnh.
Chrome fixture390×844,360×640,820×1000: mở câu22, scroll document cuối; bottom câu cuối thấp hơn navTop137px trên2phone. Publish modal button hit-test elementFromPoint là chính button, không phải nav phía dưới; body scroll khóa/khôi phục và Escape hoạt động. Không pageerror. Không cần sửa product vì bằng chứng không phát hiện lỗi ở các tình huống này.
Files scripts/verify-teacher-mobile-overlays.mjs; thêm suite vào regression runner (16 suite cho lần chạy sau, manifest15 cũ chưa được gọi là16). docs/evidence/teacher-mobile-overlays/verification.json và publish-{phone,small-phone,tablet}.png.
Giới hạn: chưa mô phỏng bàn phím ảo native hoặc screen reader; không suy ra tất cả sticky/footer đều đúng. Goal active, tiếp tục review state/coverage cuối.
