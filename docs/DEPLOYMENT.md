# 🚀 Hướng Dẫn Triển Khai (Deployment Guide)

## Tổng quan

Tài liệu này hướng dẫn cách triển khai hệ thống **Điện Lạnh Hồng Thái Management** lên môi trường Staging và Production.

---

## 📋 Môi trường

| Môi trường | URL | Branch |
|------------|-----|--------|
| Development | http://localhost:3000 | `feature/*`, `fix/*` |
| Staging | https://staging.dienlanhhongthai.vn | `develop` |
| Production | https://app.dienlanhhongthai.vn | `main` |

---

## 🐳 Triển khai với Docker (Khuyến nghị)

### Yêu cầu

- Docker Engine >= 24.x
- Docker Compose >= 2.x
- Server: Ubuntu 22.04 LTS (tối thiểu 2 vCPU, 4GB RAM, 50GB SSD)

### Cấu hình `docker-compose.yml`

```yaml
version: '3.9'

services:
  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.dienlanhhongthai.vn
    depends_on:
      - backend
    restart: unless-stopped

  # Backend (Node.js API)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # Database
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: dienlanh_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Cache
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Các bước triển khai

```bash
# 1. Pull code mới nhất
git pull origin main

# 2. Copy cấu hình môi trường
cp .env.example .env.production
# Chỉnh sửa .env.production với giá trị production

# 3. Build images
docker-compose -f docker-compose.prod.yml build

# 4. Chạy migrations
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:migrate

# 5. Khởi chạy tất cả services
docker-compose -f docker-compose.prod.yml up -d

# 6. Kiểm tra logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 📦 Triển khai thủ công (Manual)

### 1. Chuẩn bị server

```bash
# Cài đặt Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 (process manager)
npm install -g pm2

# Cài đặt Nginx
sudo apt-get install -y nginx

# Cài đặt PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Cài đặt Redis
sudo apt-get install -y redis-server
```

### 2. Clone & Build

```bash
git clone https://github.com/your-org/dienlanhhongthai-management.git /var/www/dienlanh
cd /var/www/dienlanh

# Cài đặt dependencies
npm install --production

# Build
npm run build
```

### 3. Cấu hình PM2

Tạo file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'dienlanh-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/dienlanh/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'dienlanh-backend',
      script: 'dist/main.js',
      cwd: '/var/www/dienlanh/backend',
      instances: 2,
      exec_mode: 'cluster',
      env_file: '/var/www/dienlanh/.env.production',
    },
  ],
};
```

```bash
# Khởi chạy
pm2 start ecosystem.config.js

# Lưu cấu hình để auto-start khi reboot
pm2 save
pm2 startup
```

### 4. Cấu hình Nginx

```nginx
# /etc/nginx/sites-available/dienlanhhongthai
server {
    listen 443 ssl http2;
    server_name app.dienlanhhongthai.vn;

    ssl_certificate /etc/letsencrypt/live/dienlanhhongthai.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dienlanhhongthai.vn/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name app.dienlanhhongthai.vn;
    return 301 https://$server_name$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dienlanhhongthai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Cài đặt SSL với Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.dienlanhhongthai.vn
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/dienlanh
            git pull origin main
            npm install --production
            npm run build
            npm run db:migrate
            pm2 restart all
```

---

## 🔁 Quy trình deploy chuẩn

```
1. Developer push code lên branch feature/*
2. Tạo PR vào develop → Review → Merge
3. CI/CD tự động deploy lên Staging
4. QA test trên Staging
5. Tạo PR từ develop vào main
6. Tech Lead review & approve
7. CI/CD tự động deploy lên Production
8. Smoke test trên Production
```

---

## 🩺 Health Check & Monitoring

```bash
# Kiểm tra trạng thái services
pm2 status

# Xem logs real-time
pm2 logs dienlanh-backend --lines 100

# Kiểm tra Nginx
sudo systemctl status nginx

# Kiểm tra PostgreSQL
sudo systemctl status postgresql

# Kiểm tra disk
df -h

# Kiểm tra RAM
free -h
```

### Health Check Endpoint

```http
GET /api/health
```

```json
{
  "status": "ok",
  "timestamp": "2026-07-15T08:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "uptime": 86400
}
```

---

## 🔙 Rollback

```bash
# Xem lịch sử deploy
git log --oneline -10

# Rollback về commit cụ thể
git checkout <commit-hash>
npm install --production
npm run build
pm2 restart all
```
