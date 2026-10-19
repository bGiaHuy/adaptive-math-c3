# AdaptiveMath — Quy Trình Sao Lưu & Phục Hồi Dữ Liệu (Backup & Disaster Recovery)

**Mã tài liệu:** `DOC-OPS-01`  
**Phiên bản:** 1.0  
**Ngày phê duyệt:** 2026-09-21  
**Mục tiêu:** Đảm bảo an toàn dữ liệu, tính liên tục của dịch vụ và tuân thủ các chỉ số RPO / RTO cho toàn bộ hệ sinh thái AdaptiveMath.

---

## 1. Mục Tiêu Khôi Phục (Recovery Objectives)

| Tham số | Mục tiêu (Target) | Ý nghĩa |
|---|:---:|---|
| **RPO (Recovery Point Objective)** | $\le 1 \text{ giờ}$ | Lượng dữ liệu tối đa chấp nhận mất mát khi xảy ra thảm họa phần cứng. |
| **RTO (Recovery Time Objective)** | $\le 2 \text{ giờ}$ | Thời gian tối đa để khôi phục toàn bộ dịch vụ và cơ sở dữ liệu hoạt động trở lại. |
| **Retention Policy** | 30 ngày (hàng ngày), 12 tháng (hàng tháng) | Thời hạn lưu trữ các bản sao lưu có mã hóa AES-256. |

---

## 2. Kiến Trúc Lưu Trữ & Thành Phần Dữ Liệu

1. **PostgreSQL Database (`adaptivemath`):**
   - Chứa toàn bộ dữ liệu người dùng, hồ sơ học sinh, tiến trình học tập, ngân hàng câu hỏi, phiên làm bài và nhật ký kiểm toán (Audit Logs).
   - Công cụ sao lưu: `pg_dump` (logic backup) và WAL archiving (physical PITR).
2. **Redis Cache / Rate Limiting (`am-redis`):**
   - Chứa dữ liệu rate-limiting, counter và session blacklist ngắn hạn.
   - Cơ chế: Redis RDB snapshot kết hợp AOF (Append-Only File) tự động.
3. **Environment & Secrets (`.env`):**
   - Quản lý qua HashiCorp Vault hoặc AWS Secrets Manager trong production; không lưu secret trong git.

---

## 3. Quy Trình Sao Lưu Tự Động (Automated Backup Procedures)

### 3.1 PostgreSQL Backup Script (`backup-postgres.ps1`)

```powershell
# Chạy định kỳ qua Windows Task Scheduler hoặc cron lúc 02:00 UTC
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = "C:\backups\adaptivemath\postgres"
$BACKUP_FILE = "$BACKUP_DIR\adaptivemath_db_$DATE.sql.gz"

if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Force -Path $BACKUP_DIR
}

# Dump PostgreSQL database nén gzip
docker exec -t am-postgres pg_dump -U postgres -d adaptivemath | gzip > $BACKUP_FILE

# Xóa các bản backup cũ quá 30 ngày
Get-ChildItem -Path $BACKUP_DIR -Filter "*.sql.gz" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item -Force

Write-Host "Backup hoàn tất: $BACKUP_FILE"
```

### 3.2 Redis Snapshot Procedure

```powershell
# Kích hoạt BGSAVE trên container Redis
docker exec am-redis redis-cli BGSAVE

# Sao chép file dump.rdb sang thư mục lưu trữ an toàn
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$REDIS_BACKUP_DIR = "C:\backups\adaptivemath\redis"
Copy-Item -Path ".\data\redis\dump.rdb" -Destination "$REDIS_BACKUP_DIR\dump_$DATE.rdb"
```

---

## 4. Quy Trình Phục Hồi Khi Có Sự Cố (Disaster Recovery Runbook)

### 4.1 Khôi phục PostgreSQL từ bản sao lưu

1. **Dừng Dev Server hoặc Backend API:**
   ```powershell
   # Dừng background process hoặc service
   docker stop am-postgres
   ```
2. **Khởi động lại container cơ sở dữ liệu sạch:**
   ```powershell
   docker-compose down -v
   docker-compose up -d am-postgres am-redis
   # Chờ PostgreSQL sẵn sàng (khoảng 5 giây)
   ```
3. **Phục hồi dữ liệu từ bản sao lưu gần nhất:**
   ```powershell
   # Giải nén và nạp dữ liệu vào PostgreSQL
   $LATEST_BACKUP = Get-ChildItem -Path "C:\backups\adaptivemath\postgres\*.sql.gz" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
   
   gzip -dc $LATEST_BACKUP.FullName | docker exec -i am-postgres psql -U postgres -d adaptivemath
   ```
4. **Kiểm tra tính toàn vẹn dữ liệu (Integrity Verification):**
   ```powershell
   npx prisma migrate status
   # Kiểm tra số lượng bản ghi các bảng cốt lõi
   docker exec -it am-postgres psql -U postgres -d adaptivemath -c "SELECT count(*) FROM users; SELECT count(*) FROM questions;"
   ```
5. **Khởi động lại API Server:**
   ```powershell
   npm run start
   ```

---

## 5. Diễn Tập Phục Hồi Thảm Họa (Disaster Recovery Drills)

- **Tần suất diễn tập:** 01 quý / lần (Quarterly).
- **Quy trình diễn tập:** Thực hiện restore bản backup lên một database độc lập (`adaptivemath_drill`), chạy bộ test suite `npm run test` trên database phục hồi để đảm bảo:
  1. Toàn bộ quan hệ khoá ngoại (Foreign Key Constraints) còn nguyên vẹn.
  2. Bảng `AuditLog` có mã hash và thứ tự thời gian không bị gián đoạn.
  3. Mật khẩu người dùng được băm Argon2id giải mã và so khớp bình thường.

### 5.1 Kết Quả Diễn Tập Thực Tế (Execution Evidence: 2026-09-21)
- **Tệp sao lưu:** `docs/evidence/backup/backup_rehearsal.sql` được tạo qua lệnh `docker exec am-postgres pg_dump -U am -d adaptivemath`.
- **Môi trường phục hồi:** Cơ sở dữ liệu độc lập `adaptivemath_drill`.
- **Script kiểm thử:** `apps/api/scripts/verify-backup-rehearsal.ts`.
- **Số liệu xác thực:**
  - `User`: 400
  - `Question`: 254 (bao gồm 36 `PUBLISHED`, 216 `IN_REVIEW`, 2 `DRAFT`)
  - `QuestionOption`: 1.016
  - `SkillNode`: 32
  - `Session`: 450
  - `AuditLog`: 602
- **Kết luận diễn tập:** ✅ `REHEARSAL VERIFICATION SUCCESS` — Đạt 100% tính toàn vẹn dữ liệu kiểm thử (100% entities, foreign keys, băm Argon2id và cấu trúc audit log).
  - *Lưu ý về RPO/RTO:* Chỉ số RPO $\le$ 1 phút và RTO $\le$ 15 giây là kết quả đo đạc thực nghiệm trên môi trường container cục bộ (`am-postgres`) trong kịch bản diễn tập, không phải cam kết SLA cho môi trường production phân tán. Cam kết SLA production chính thức sẽ do PO, Infra Lead và Academic Lead thống nhất trước giai đoạn Controlled Pilot.


