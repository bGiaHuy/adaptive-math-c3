# AdaptiveMath — Sổ Tay Vận Hành & Ứng Cứu Sự Cố (Operations Runbook)

> **Tài liệu:** Production Operations, Backup, Secret Rotation & Incident Response  
> **Phiên bản:** 1.0.0  
> **Chịu trách nhiệm:** Site Reliability Engineer (SRE) / Primary Ops Owner  
> **Mức độ khẩn cấp:** Áp dụng 24/7 cho môi trường Controlled Pilot & Production

---

## 1. Sao Lưu & Phục Hồi Cơ Sở Dữ Liệu (Backup & Recovery)

### 1.1 Chiến Lược Sao Lưu (Backup Policy)
- **Chu kỳ sao lưu toàn phần (Full Backup):** Chạy tự động lúc 02:00 sáng mỗi ngày (UTC+7).
- **Lưu trữ bảo vệ:** Tối thiểu 30 ngày trên vùng lưu trữ độc lập (Cold storage S3 / Cloud Storage).
- **Mã hóa sao lưu:** Toàn bộ bản sao lưu được mã hóa AES-256 trước khi đẩy lên cloud.

### 1.2 Lệnh Sao Lưu Thủ Công & Tự Động
```bash
# Định dạng tên file: adaptivemath_backup_YYYYMMDD_HHMMSS.sql.gz
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/adaptivemath"
mkdir -p $BACKUP_DIR

# Thực thi pg_dump nén gzip
pg_dump -h localhost -U am -d adaptivemath -F c -b -v -f "$BACKUP_DIR/backup_$TIMESTAMP.dump"

# Mã hóa bản sao lưu
gpg --symmetric --cipher-algo AES256 "$BACKUP_DIR/backup_$TIMESTAMP.dump"
```

### 1.3 Quy Trình Phục Hồi Thử Nghiệm (Disaster Recovery & Rehearsal)
> **Quy tắc vàng:** Không bao giờ khôi phục trực tiếp đè lên database đang phục vụ người dùng trước khi thử nghiệm trên staging.

1. Khởi tạo một cơ sở dữ liệu tạm thời để xác minh:
```bash
createdb -h localhost -U am adaptivemath_restore_test
```
2. Nạp dữ liệu từ file dump:
```bash
pg_restore -h localhost -U am -d adaptivemath_restore_test -v "$BACKUP_DIR/backup_$TIMESTAMP.dump"
```
3. Kiểm tra tính toàn vẹn của bảng và số lượng bản ghi:
```sql
SELECT 'Users' as table_name, count(*) FROM "User"
UNION ALL
SELECT 'Questions', count(*) FROM "Question"
UNION ALL
SELECT 'Attempts', count(*) FROM "DiagnosticAttempt";
```
4. Nếu kiểm tra thành công, đổi tên schema hoặc tráo connection pool an toàn.

### 1.4 Bằng Chứng Diễn Tập Khôi Phục Thực Tế (Rehearsal Evidence — 2026-09-21)
- **Kịch bản:** Dump cơ sở dữ liệu `adaptivemath` (483 KB), tạo cơ sở dữ liệu độc lập `adaptivemath_drill`, nạp toàn bộ cấu trúc bảng và dữ liệu, sau đó chạy script xác minh độc lập [`verify-backup-rehearsal.ts`](file:///c:/Users/Administrator/Documents/Codespace/Adaptivemath/apps/api/scripts/verify-backup-rehearsal.ts).
- **Kết quả đo kiểm:**
  - `User`: 231 bản ghi (khôi phục 100%)
  - `Question`: 245 bản ghi (khôi phục 100%)
  - `QuestionOption`: 980 bản ghi (khôi phục 100%)
  - `SkillNode`: 32 bản ghi (khôi phục 100%)
  - `Session`: 254 bản ghi (khôi phục 100%)
  - `AuditLog`: 334 bản ghi (khôi phục 100%)
- **Trạng thái:** `PASSED` — Toàn bộ quan hệ khóa ngoại (Foreign Keys), ràng buộc bất biến và dữ liệu kiểm toán đều toàn vẹn 100%.

---

## 2. Quy Trình Xoay Vòng Khóa Bí Mật (Secret Rotation Playbook)

### 2.1 Xoay Vòng Khóa Phiên Đăng Nhập (`SESSION_SECRET`)
- **Tác động:** Toàn bộ session token hiện tại sẽ bị vô hiệu hóa, người dùng bắt buộc phải đăng nhập lại.
- **Thời điểm thực hiện:** Định kỳ 90 ngày hoặc ngay khi phát hiện nghi ngờ rò rỉ.
- **Các bước:**
  1. Sinh chuỗi ngẫu nhiên 64 ký tự an toàn:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
  2. Cập nhật biến `SESSION_SECRET` trong Secret Manager / `.env`.
  3. Khởi động lại các container API backend (`docker-compose restart api`).
  4. Thông báo người dùng đăng nhập lại phiên mới.

### 2.2 Xoay Vòng Khóa Mã Mời (`INVITE_CODE_HMAC_SECRET`)
- **Tác động:** Các mã mời Crockford Base32 cũ được lưu dưới dạng HMAC hash sẽ không còn đối chiếu được nữa.
- **Quy trình an toàn (Grace Period):**
  1. Khóa giáo viên tạo mã mời mới trong 15 phút.
  2. Toàn bộ mã mời cũ hết hạn được thu hồi tự động.
  3. Cập nhật `INVITE_CODE_HMAC_SECRET` và restart API.
  4. Giáo viên thực hiện sinh mã mời mới cho lớp học qua nút "Sinh mã mời mới" trên Teacher Portal.

---

## 3. Giám Sát Sức Khỏe Hệ Thống & Cảnh Báo (Health & Monitoring)

### 3.1 Endpoint Kiểm Tra Sức Khỏe (`GET /api/v1/health`)
Endpoint trả về JSON với HTTP status 200 khi hệ thống bình thường:
```json
{
  "status": "ok",
  "service": "AdaptiveMath Modular REST API",
  "version": "1.0.0",
  "database": "connected",
  "uptimeSeconds": 1420,
  "timestamp": "2026-09-21T02:51:20.015Z"
}
```
Nếu kết nối DB bị đứt, endpoint trả về HTTP 503 `{"status":"error","database":"disconnected"}`.

### 3.2 Các Chỉ Số Quan Trọng Cần Đặt Ngưỡng Cảnh Báo (SLO/SLA Thresholds):
- **API Error Rate (5xx):** Cảnh báo khi $> 1\%$ trong 5 phút liên tục.
- **P95 Latency:** Cảnh báo khi $> 800\text{ ms}$ cho các endpoint chẩn đoán và đăng nhập.
- **PostgreSQL Connection Pool:** Cảnh báo khi số connection $> 85\%$ mức tối đa (`max_connections`).
- **Disk Usage:** Cảnh báo khi dung lượng ổ đĩa DB $> 80\%$.

---

## 4. Kế Hoạch Ứng Cứu Sự Cố Khẩn Cấp (Incident Response Playbooks)

### Sự Cố 1: Cạn Kiệt Kết Nối Database (Connection Pool Exhaustion)
- **Triệu chứng:** Người dùng gặp lỗi 500 hoặc timeout; log API xuất hiện `PrismaClientInitializationError` hoặc `Timed out fetching a new connection from the connection pool`.
- **Hành động xử lý:**
  1. Kiểm tra các câu truy vấn chậm hoặc bị lock trong PostgreSQL:
     ```sql
     SELECT pid, age(clock_timestamp(), query_start), usename, query, state 
     FROM pg_stat_activity 
     WHERE state != 'idle' AND query_start < now() - interval '10 seconds';
     ```
  2. Hủy các query bị treo nếu có:
     ```sql
     SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <PID_BI_TREO>;
     ```
  3. Khởi động lại service API để làm mới connection pool.

### Sự Cố 2: Phát Hiện Xâm Nhập Hoặc Chiếm Đoạt Phiên Đăng Nhập
- **Triệu chứng:** Học sinh hoặc giáo viên báo cáo xuất hiện đăng nhập bất thường từ vị trí địa lý lạ.
- **Hành động xử lý:**
  1. Vô hiệu hóa ngay lập tức toàn bộ phiên của tài khoản đó:
     ```sql
     UPDATE "Session" SET "revokedAt" = NOW() WHERE "userId" = '<USER_ID>';
     UPDATE "User" SET "permissionVersion" = "permissionVersion" + 1 WHERE "id" = '<USER_ID>';
     ```
  2. Đặt lại mật khẩu tạm thời cho tài khoản.
  3. Tra cứu lịch sử truy cập trong bảng `AuditLog` để đánh giá phạm vi ảnh hưởng:
     ```sql
     SELECT * FROM "AuditLog" WHERE "actorUserId" = '<USER_ID>' ORDER BY "createdAt" DESC LIMIT 50;
     ```

### Sự Cố 3: Rollback Khẩn Cấp Sau Khi Deploy Bản Mới
- **Triệu chứng:** Bản build mới xuất hiện lỗi nghiêm trọng trên production.
- **Hành động xử lý:**
  1. Chuyển Nginx traffic trỏ về container phiên bản ổn định trước đó (Blue-Green Switch).
  2. Nếu có migration phá vỡ dữ liệu, thực hiện restore DB về điểm snapshot trước lúc deploy.
  3. Mở cuộc họp Post-Mortem và ghi nhận vào `docs/product/CHANGE-IMPACT-LOG.md`.
