# 🔐 Chính Sách Bảo Mật (Security Policy)

## Tổng quan

Tài liệu này mô tả các biện pháp bảo mật được áp dụng trong hệ thống **Điện Lạnh Hồng Thái Management** và quy trình xử lý sự cố bảo mật.

---

## 🛡️ Các biện pháp bảo mật

### 1. Authentication & Authorization

#### JWT Token Strategy

```
Access Token:  Thời hạn 15 phút, lưu trong memory (không localStorage)
Refresh Token: Thời hạn 7 ngày, lưu trong HttpOnly Cookie
```

- **Không** lưu access token trong `localStorage` (dễ bị XSS)
- Refresh token tự động được xoay mỗi lần dùng (Refresh Token Rotation)
- Blacklist token khi logout bằng Redis

#### Password Policy

| Yêu cầu | Tiêu chuẩn |
|---------|-----------|
| Độ dài tối thiểu | 8 ký tự |
| Phải có | Chữ hoa, chữ thường, số |
| Nên có | Ký tự đặc biệt |
| Hash algorithm | bcrypt (cost factor: 12) |
| Không cho phép | Mật khẩu phổ biến (top 10,000) |

#### RBAC (Role-Based Access Control)

```typescript
// Ví dụ phân quyền
const permissions = {
  ADMIN: ['*'],  // Toàn quyền
  MANAGER: [
    'orders:read', 'orders:write', 'orders:assign',
    'technicians:read', 'technicians:write',
    'reports:read', 'reports:export',
    'customers:read', 'customers:write',
  ],
  STAFF: [
    'orders:read', 'orders:write',
    'customers:read', 'customers:write',
    'inventory:read',
  ],
  TECHNICIAN: [
    'orders:read-assigned',
    'orders:update-status',
  ],
};
```

---

### 2. Input Validation & Sanitization

- Tất cả input từ client được validate qua **Zod / class-validator** trước khi xử lý
- Sanitize HTML để chống **XSS** (dùng DOMPurify ở frontend, sanitize-html ở backend)
- Sử dụng **Parameterized Queries** / ORM để chống **SQL Injection**
- Giới hạn kích thước request body (mặc định: 10MB)

```typescript
// Ví dụ validation schema
const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  serviceType: z.string().min(3).max(255),
  description: z.string().max(2000).optional(),
  scheduledAt: z.string().datetime(),
});
```

---

### 3. API Security

#### Rate Limiting

| Endpoint | Giới hạn | Cửa sổ |
|----------|---------|--------|
| `POST /auth/login` | 5 lần | 15 phút |
| `POST /auth/refresh` | 10 lần | 1 giờ |
| API chung | 100 lần | 1 phút |
| Export reports | 5 lần | 1 giờ |

#### CORS

```typescript
// Chỉ cho phép các origin đã được whitelist
const corsOptions = {
  origin: [
    'https://app.dienlanhhongthai.vn',
    'https://staging.dienlanhhongthai.vn',
    // Development
    process.env.NODE_ENV === 'development' && 'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
};
```

#### Security Headers (Nginx / Helmet.js)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
Referrer-Policy: strict-origin-when-cross-origin
```

---

### 4. Data Security

#### Mã hóa dữ liệu nhạy cảm

| Loại dữ liệu | Biện pháp |
|-------------|----------|
| Mật khẩu | bcrypt (không thể giải mã) |
| Kết nối DB | SSL/TLS bắt buộc |
| Backup files | AES-256 encryption |
| Dữ liệu truyền tải | HTTPS/TLS 1.2+ |

#### Không lưu trữ

- ❌ Mật khẩu dạng plaintext
- ❌ Thẻ tín dụng / thông tin thanh toán nhạy cảm
- ❌ Secrets trong source code (dùng biến môi trường)
- ❌ PII không cần thiết

---

### 5. Infrastructure Security

- **Firewall**: Chỉ mở cổng 80, 443 (HTTP/HTTPS) ra internet
- **Database**: PostgreSQL chỉ chấp nhận kết nối từ localhost / private network
- **SSH**: Chỉ dùng SSH key, tắt password authentication
- **Auto-update**: Bật tự động cập nhật security patches cho OS

```bash
# Cấu hình UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

### 6. Logging & Audit Trail

Mọi hành động quan trọng đều được ghi log:

```typescript
// Ví dụ audit log
{
  "timestamp": "2026-07-15T08:00:00Z",
  "userId": "uuid",
  "action": "ORDER_STATUS_CHANGED",
  "resource": "orders",
  "resourceId": "order-uuid",
  "previousValue": "PENDING",
  "newValue": "IN_PROGRESS",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Dữ liệu trong audit log không được xóa trong vòng 1 năm.**

---

## 🚨 Báo cáo lỗ hổng bảo mật

### Quy trình Responsible Disclosure

Nếu bạn phát hiện lỗ hổng bảo mật, **KHÔNG** tạo public Issue. Thay vào đó:

1. **Gửi email** đến: `security@dienlanhhongthai.vn`
2. **Tiêu đề**: `[SECURITY] Mô tả ngắn về lỗ hổng`
3. **Nội dung email** bao gồm:
   - Mô tả chi tiết lỗ hổng
   - Các bước tái hiện
   - Mức độ nguy hiểm (ước tính)
   - Đề xuất vá lỗi (nếu có)
4. **Không tiết lộ** cho bên thứ ba trước khi được vá

### Timeline xử lý

| Mức độ | SLA phản hồi | SLA vá lỗi |
|--------|-------------|------------|
| **Critical** (RCE, data breach) | 4 giờ | 24 giờ |
| **High** (Auth bypass, privilege escalation) | 24 giờ | 7 ngày |
| **Medium** (XSS, CSRF) | 48 giờ | 30 ngày |
| **Low** | 7 ngày | 90 ngày |

---

## 📋 Security Checklist (Pre-deployment)

### Backend

- [ ] Tất cả endpoints đều có authentication (trừ `/auth/login`)
- [ ] Validate và sanitize toàn bộ input
- [ ] Rate limiting được cấu hình
- [ ] CORS chỉ whitelist đúng origin
- [ ] Không có secrets trong source code
- [ ] Dependencies được cập nhật, không có CVE nghiêm trọng (`npm audit`)
- [ ] SQL queries dùng parameterized / ORM
- [ ] Logging đủ thông tin cho audit

### Frontend

- [ ] Không lưu sensitive data trong `localStorage`
- [ ] CSP headers được cấu hình
- [ ] HTTPS được enforce
- [ ] Form có CSRF protection
- [ ] Dependency audit sạch

### Infrastructure

- [ ] Firewall đã cấu hình đúng
- [ ] SSH chỉ dùng key authentication
- [ ] Database không exposed ra internet
- [ ] Backup được mã hóa
- [ ] SSL certificate còn hạn (kiểm tra với certbot)

---

## 📅 Phiên bản được hỗ trợ

| Phiên bản | Trạng thái bảo mật |
|-----------|-------------------|
| 1.x (latest) | ✅ Được hỗ trợ đầy đủ |
| < 1.0 | ❌ Không được hỗ trợ |
