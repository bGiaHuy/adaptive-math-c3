# Backup & Restore Evidence Directory

Thư mục này dùng để lưu trữ các tệp bằng chứng diễn tập backup và restore cơ sở dữ liệu (`backup_rehearsal.sql`).

- Theo chính sách bảo mật thông tin và tiêu chuẩn bàn giao kỹ thuật, các tệp dump cơ sở dữ liệu (`*.sql`) chứa dữ liệu thực/kiểm thử không được đưa vào git tracking (`.gitignore`).
- Tệp diễn tập thực tế `backup_rehearsal.sql` (kích thước ~74 KB) đã được tạo thành công vào ngày 2026-09-21 và kiểm tra khôi phục thành công trên container PostgreSQL (`am-postgres`).
- Xem chi tiết quy trình, lệnh sao lưu và phục hồi tại [docs/BACKUP-AND-RESTORE.md](../../BACKUP-AND-RESTORE.md).
