# AdaptiveMath — Hướng Dẫn Triển Khai Sản Xuất (Deployment Guide)

> **Tài liệu:** Production Deployment & Cloud Infrastructure Manual  
> **Phiên bản:** 1.0.0  
> **Chịu trách nhiệm:** Release Engineer / DevOps Lead  
> **Phạm vi:** Triển khai Docker, Cloud Container (AWS ECS / GCP Cloud Run / VPS Dedicated)

---

## 1. Kiến Trúc Triển Khai Sản Xuất (Production Topology)

```
                            [ Mạng Internet Công Cộng ]
                                       │
                                       ▼ (HTTPS: 443 / HTTP: 80)
                       ┌───────────────────────────────┐
                       │   Reverse Proxy / Edge Ingress│
                       │   - Nginx / Caddy / Cloudflare │
                       │   - SSL/TLS Termination       │
                       │   - Rate Limiting & WAF       │
                       └───────┬───────────────┬───────┘
                               │               │
            Static Assets (SPA)│               │ /api/v1/* (REST API)
                               ▼               ▼
                     ┌──────────────────┐    ┌───────────────────────────┐
                     │  Nginx Web Server│    │  NestJS Node.js App       │
                     │  (Vite Dist PWA) │    │  (Port 4000, 2+ Replicas) │
                     └──────────────────┘    └─────────────┬─────────────┘
                                                           │
                                                           ▼ (Port 5432)
                                             ┌───────────────────────────┐
                                             │  Managed PostgreSQL 16    │
                                             │  (AWS RDS / Supabase / HA)│
                                             └───────────────────────────┘
```

---

## 2. Cấu Hình Biến Môi Trường Sản Xuất (Environment Variables)

Toàn bộ các khóa bí mật sản xuất **phải được quản lý qua Secret Manager** (AWS Secrets Manager, GCP Secret Manager, hoặc Docker Secrets). Tuyệt đối không commit giá trị thật vào Git.

| Tên biến (Key) | Bắt buộc | Giá trị mẫu sản xuất | Giải thích an toàn |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Có | `production` | Kích hoạt tối ưu runtime của NestJS và Express |
| `PORT` | Có | `4000` | Port lắng nghe của backend bên trong container |
| `WEB_URL` | Có | `https://adaptivemath.vn` | Origin được phép của Web Frontend (Dùng cho CORS và CSRF origin check) |
| `DATABASE_URL` | Có | `postgresql://user:secret@db-host:5432/adaptivemath?schema=public&sslmode=require` | Chuỗi kết nối DB PostgreSQL kèm SSL |
| `SESSION_SECRET` | Có | `[64-hex-characters]` | Khóa bí mật ký HMAC cho session token |
| `SESSION_COOKIE_NAME` | Có | `am_session` | Tên cookie phiên HttpOnly |
| `SESSION_TTL_SECONDS` | Có | `604800` | Thời gian sống của phiên (7 ngày) |
| `INVITE_CODE_HMAC_SECRET` | Có | `[64-hex-characters]` | Khóa bí mật băm mã mời Crockford Base32 |
| `ARGON_MEMORY_COST` | Không | `65536` | Bộ nhớ cho Argon2id (64MB) |
| `ARGON_TIME_COST` | Không | `3` | Số vòng lặp băm mật khẩu |
| `ARGON_PARALLELISM` | Không | `2` | Số luồng tính toán Argon2id |
| `RATE_LIMIT_LIMIT` | Không | `100` | Giới hạn 100 requests / phút / IP |

---

## 3. Docker Containerfiles

### 3.1 Backend API Containerfile (`apps/api/Dockerfile`)
```dockerfile
# -------------------------------------------------------------
# Stage 1: Build
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools for native addons (@node-rs/argon2)
RUN apk add --no-cache python3 make g++

# Copy package descriptors
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy API sources & prisma schema
COPY apps/api ./apps/api

# Generate Prisma Client & Build TypeScript
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production Runtime
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app/apps/api

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=builder /app/apps/api/dist /app/apps/api/dist
COPY --from=builder /app/apps/api/prisma /app/apps/api/prisma
COPY --from=builder /app/apps/api/package.json /app/apps/api/package.json

USER nestjs

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

### 3.2 Frontend Web Client Containerfile (`Dockerfile.frontend`)
```dockerfile
# -------------------------------------------------------------
# Stage 1: Build Vite Bundle
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prototype

# -------------------------------------------------------------
# Stage 2: Nginx Web Server
# -------------------------------------------------------------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Docker Compose Sản Xuất (`docker-compose.prod.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal_net

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - apps/api/.env
    ports:
      - "4000:4000"
    networks:
      - internal_net
      - edge_net

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: always
    depends_on:
      - api
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./certs:/etc/ssl/certs:ro
    networks:
      - edge_net

volumes:
  postgres_data:
    driver: local

networks:
  internal_net:
    internal: true
  edge_net:
```

---

## 5. Cấu Hình Nginx Reverse Proxy Chuẩn Bảo Mật (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name adaptivemath.vn www.adaptivemath.vn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name adaptivemath.vn www.adaptivemath.vn;

    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://adaptivemath.vn;" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Frontend Static SPA
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, no-transform";
    }

    # Static Assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        root /usr/share/nginx/html;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://api:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
    }
}
```

---

## 6. Quy Trình CI/CD Triển Khai Không Gián Đoạn (Zero-Downtime)

1. **Build & Test Gate:**
   - Chạy `npm run typecheck`
   - Chạy `npm run test` (Đảm bảo 100% test suites pass)
   - Chạy `npm run build:prototype`
2. **Database Migration Step:**
   - Chạy `npx prisma migrate deploy` trước khi tráo container ứng dụng.
   - Nguyên tắc: Không thực hiện các thay đổi breaking schema (chỉ add column nullable, không drop column đang được live app sử dụng).
3. **Rolling Update Container:**
   - Khởi chạy container mới và chờ Healthcheck `/api/v1/health` trả về status 200 `{"status":"ok"}`.
   - Tráo traffic tại Nginx / Load Balancer.
   - Dừng container phiên bản cũ sau 30 giây draining.
