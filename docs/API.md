# 📡 Tài Liệu API – Điện Lạnh Hồng Thái Management

## Tổng quan

- **Base URL (Development):** `http://localhost:4000/api/v1`
- **Base URL (Production):** `https://api.dienlanhhongthai.vn/v1`
- **Format:** JSON
- **Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication

### Headers bắt buộc

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Login

```http
POST /auth/login
```

**Request body:**

```json
{
  "email": "admin@dienlanhhongthai.vn",
  "password": "password123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "uuid-here",
      "email": "admin@dienlanhhongthai.vn",
      "fullName": "Nguyễn Văn A",
      "role": "ADMIN"
    }
  }
}
```

### Refresh Token

```http
POST /auth/refresh
```

**Request body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

---

## 📦 Đơn Hàng (Orders)

### Lấy danh sách đơn hàng

```http
GET /orders
```

**Query parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Trang hiện tại (mặc định: 1) |
| `limit` | number | Số bản ghi/trang (mặc định: 20) |
| `status` | string | Lọc theo trạng thái: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `technicianId` | string | Lọc theo kỹ thuật viên |
| `fromDate` | string | Từ ngày (ISO 8601) |
| `toDate` | string | Đến ngày (ISO 8601) |
| `search` | string | Tìm kiếm theo tên/SĐT khách hàng |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order-uuid",
        "orderCode": "DH-2026-001",
        "status": "PENDING",
        "customer": {
          "id": "cust-uuid",
          "name": "Trần Thị B",
          "phone": "0901234567"
        },
        "technician": null,
        "serviceType": "Sửa chữa điều hòa",
        "scheduledAt": "2026-07-16T09:00:00Z",
        "address": "123 Đường ABC, Quận 1, TP.HCM",
        "totalAmount": 500000,
        "createdAt": "2026-07-15T08:00:00Z"
      }
    ],
    "meta": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

### Tạo đơn hàng mới

```http
POST /orders
```

**Request body:**

```json
{
  "customerId": "cust-uuid",
  "serviceType": "Sửa chữa điều hòa",
  "description": "Điều hòa không mát, cần kiểm tra gas",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "scheduledAt": "2026-07-16T09:00:00Z",
  "technicianId": "tech-uuid",
  "priority": "NORMAL",
  "items": [
    {
      "productId": "prod-uuid",
      "quantity": 1,
      "unitPrice": 200000
    }
  ]
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "new-order-uuid",
    "orderCode": "DH-2026-002",
    "status": "PENDING",
    ...
  }
}
```

### Lấy chi tiết đơn hàng

```http
GET /orders/:id
```

### Cập nhật đơn hàng

```http
PATCH /orders/:id
```

### Cập nhật trạng thái đơn hàng

```http
PATCH /orders/:id/status
```

**Request body:**

```json
{
  "status": "IN_PROGRESS",
  "note": "Kỹ thuật viên đã đến nơi"
}
```

### Hủy đơn hàng

```http
DELETE /orders/:id
```

---

## 👨‍🔧 Kỹ Thuật Viên (Technicians)

### Lấy danh sách kỹ thuật viên

```http
GET /technicians
```

**Query parameters:**

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Trang |
| `limit` | number | Giới hạn |
| `status` | string | `ACTIVE`, `INACTIVE` |
| `available` | boolean | Chỉ lấy kỹ thuật viên rảnh |

### Tạo kỹ thuật viên

```http
POST /technicians
```

**Request body:**

```json
{
  "fullName": "Lê Văn C",
  "phone": "0909876543",
  "email": "levanc@dienlanhhongthai.vn",
  "specialization": ["Điều hòa", "Tủ lạnh"],
  "address": "456 Đường XYZ, Quận 3, TP.HCM"
}
```

### Lấy lịch làm việc

```http
GET /technicians/:id/schedule?fromDate=2026-07-01&toDate=2026-07-31
```

---

## 🏪 Kho Hàng (Inventory)

### Lấy danh sách sản phẩm

```http
GET /inventory/products
```

### Nhập kho

```http
POST /inventory/import
```

**Request body:**

```json
{
  "supplierId": "sup-uuid",
  "note": "Nhập hàng tháng 7",
  "items": [
    {
      "productId": "prod-uuid",
      "quantity": 50,
      "unitCost": 150000
    }
  ]
}
```

### Xuất kho (cho đơn hàng)

```http
POST /inventory/export
```

### Kiểm tra tồn kho

```http
GET /inventory/products/:id/stock
```

---

## 👥 Khách Hàng (Customers)

### Lấy danh sách khách hàng

```http
GET /customers
```

### Tạo khách hàng

```http
POST /customers
```

**Request body:**

```json
{
  "fullName": "Phạm Thị D",
  "phone": "0912345678",
  "email": "phamthid@email.com",
  "address": "789 Đường QWE, Quận 5, TP.HCM",
  "note": "Khách VIP"
}
```

### Lịch sử đơn hàng của khách

```http
GET /customers/:id/orders
```

---

## 📊 Báo Cáo (Reports)

### Doanh thu theo kỳ

```http
GET /reports/revenue?period=monthly&year=2026
```

### Hiệu suất kỹ thuật viên

```http
GET /reports/technician-performance?fromDate=2026-07-01&toDate=2026-07-31
```

### Xuất báo cáo PDF

```http
POST /reports/export
```

**Request body:**

```json
{
  "type": "revenue",
  "format": "pdf",
  "fromDate": "2026-07-01",
  "toDate": "2026-07-31"
}
```

**Response:** File download (application/pdf)

---

## ⚠️ Mã lỗi (Error Codes)

| HTTP Status | Code | Mô tả |
|------------|------|-------|
| 400 | `VALIDATION_ERROR` | Dữ liệu đầu vào không hợp lệ |
| 401 | `UNAUTHORIZED` | Chưa đăng nhập hoặc token hết hạn |
| 403 | `FORBIDDEN` | Không có quyền thực hiện |
| 404 | `NOT_FOUND` | Không tìm thấy tài nguyên |
| 409 | `CONFLICT` | Xung đột dữ liệu |
| 422 | `UNPROCESSABLE` | Không thể xử lý yêu cầu |
| 429 | `TOO_MANY_REQUESTS` | Quá nhiều request (rate limit) |
| 500 | `INTERNAL_ERROR` | Lỗi máy chủ nội bộ |

**Format lỗi chuẩn:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "phone",
        "message": "Số điện thoại không đúng định dạng"
      }
    ]
  }
}
```

---

## 📌 Phân trang (Pagination)

Tất cả API trả về danh sách đều hỗ trợ phân trang:

```http
GET /orders?page=2&limit=10
```

**Meta trong response:**

```json
{
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```
