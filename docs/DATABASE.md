# 🗄️ Thiết Kế Cơ Sở Dữ Liệu – Điện Lạnh Hồng Thái Management

## Tổng quan

- **Database:** PostgreSQL 14+
- **ORM:** Prisma / TypeORM
- **Encoding:** UTF-8
- **Timezone:** UTC (hiển thị theo UTC+7 ở frontend)

---

## 📊 Sơ đồ quan hệ (ERD)

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    users    │       │     orders      │       │  customers  │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)         │──────►│ id (PK)     │
│ email       │   │   │ order_code      │       │ full_name   │
│ password    │   │   │ customer_id(FK) │       │ phone       │
│ full_name   │   │   │ technician_id   │       │ email       │
│ role        │   │   │ created_by (FK)─┘       │ address     │
│ is_active   │   │   │ status          │       │ note        │
│ created_at  │   │   │ service_type    │       │ created_at  │
└─────────────┘   │   │ scheduled_at    │       └─────────────┘
                  │   │ total_amount    │
┌─────────────┐   │   │ created_at      │
│ technicians │   │   └────────┬────────┘
├─────────────┤   │            │
│ id (PK)     │◄──┘   ┌────────▼────────┐
│ user_id(FK) │       │  order_items    │
│ phone       │       ├─────────────────┤
│ specializ.  │       │ id (PK)         │
│ status      │       │ order_id (FK)   │
│ created_at  │       │ product_id (FK) │
└─────────────┘       │ quantity        │
                      │ unit_price      │
┌─────────────┐       └────────┬────────┘
│  products   │                │
├─────────────┤◄───────────────┘
│ id (PK)     │
│ name        │       ┌─────────────────┐
│ sku         │       │ inventory_logs  │
│ category    │       ├─────────────────┤
│ unit        │◄──────│ id (PK)         │
│ unit_price  │       │ product_id (FK) │
│ stock_qty   │       │ type (IN/OUT)   │
│ min_stock   │       │ quantity        │
│ created_at  │       │ reference_id    │
└─────────────┘       │ created_by (FK) │
                      │ created_at      │
                      └─────────────────┘
```

---

## 📋 Các bảng chính

### `users` – Người dùng hệ thống

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK, NOT NULL | Khóa chính |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu (bcrypt hash) |
| `full_name` | VARCHAR(255) | NOT NULL | Họ tên đầy đủ |
| `role` | ENUM | NOT NULL | `ADMIN`, `MANAGER`, `STAFF`, `TECHNICIAN` |
| `phone` | VARCHAR(20) | | Số điện thoại |
| `avatar_url` | TEXT | | URL ảnh đại diện |
| `is_active` | BOOLEAN | DEFAULT TRUE | Trạng thái tài khoản |
| `last_login_at` | TIMESTAMPTZ | | Lần đăng nhập cuối |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Thời gian tạo |
| `updated_at` | TIMESTAMPTZ | | Thời gian cập nhật |

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','MANAGER','STAFF','TECHNICIAN')),
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

---

### `customers` – Khách hàng

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | Khóa chính |
| `full_name` | VARCHAR(255) | NOT NULL | Họ tên |
| `phone` | VARCHAR(20) | NOT NULL | Số điện thoại |
| `email` | VARCHAR(255) | | Email |
| `address` | TEXT | | Địa chỉ |
| `district` | VARCHAR(100) | | Quận/Huyện |
| `city` | VARCHAR(100) | | Thành phố |
| `note` | TEXT | | Ghi chú nội bộ |
| `total_orders` | INTEGER | DEFAULT 0 | Tổng số đơn hàng |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

### `technicians` – Kỹ thuật viên

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | Khóa chính |
| `user_id` | UUID | FK → users | Liên kết tài khoản |
| `phone` | VARCHAR(20) | NOT NULL | Số điện thoại |
| `specialization` | TEXT[] | | Mảng chuyên môn |
| `status` | ENUM | NOT NULL | `ACTIVE`, `INACTIVE`, `ON_LEAVE` |
| `rating` | DECIMAL(3,2) | | Đánh giá trung bình |
| `total_completed` | INTEGER | DEFAULT 0 | Tổng đơn hoàn thành |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

### `orders` – Đơn hàng

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | Khóa chính |
| `order_code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã đơn hàng (DH-YYYY-NNNN) |
| `customer_id` | UUID | FK → customers | Khách hàng |
| `technician_id` | UUID | FK → technicians | Kỹ thuật viên phụ trách |
| `created_by` | UUID | FK → users | Người tạo đơn |
| `status` | ENUM | NOT NULL | `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `priority` | ENUM | NOT NULL | `LOW`, `NORMAL`, `HIGH`, `URGENT` |
| `service_type` | VARCHAR(255) | NOT NULL | Loại dịch vụ |
| `description` | TEXT | | Mô tả vấn đề |
| `address` | TEXT | NOT NULL | Địa chỉ thực hiện |
| `scheduled_at` | TIMESTAMPTZ | | Lịch hẹn |
| `started_at` | TIMESTAMPTZ | | Thời gian bắt đầu |
| `completed_at` | TIMESTAMPTZ | | Thời gian hoàn thành |
| `sub_total` | DECIMAL(15,2) | DEFAULT 0 | Tiền dịch vụ |
| `discount` | DECIMAL(15,2) | DEFAULT 0 | Giảm giá |
| `total_amount` | DECIMAL(15,2) | DEFAULT 0 | Tổng tiền |
| `payment_status` | ENUM | NOT NULL | `UNPAID`, `PAID`, `PARTIAL` |
| `note` | TEXT | | Ghi chú |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | | |

---

### `products` – Sản phẩm / Vật tư

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | |
| `name` | VARCHAR(255) | NOT NULL | Tên sản phẩm |
| `sku` | VARCHAR(100) | UNIQUE | Mã SKU |
| `category` | VARCHAR(100) | | Danh mục |
| `unit` | VARCHAR(50) | | Đơn vị tính |
| `unit_price` | DECIMAL(15,2) | NOT NULL | Giá bán |
| `unit_cost` | DECIMAL(15,2) | | Giá nhập |
| `stock_quantity` | INTEGER | DEFAULT 0 | Tồn kho hiện tại |
| `min_stock_alert` | INTEGER | DEFAULT 5 | Cảnh báo tồn kho thấp |
| `is_active` | BOOLEAN | DEFAULT TRUE | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

### `order_items` – Chi tiết đơn hàng

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | |
| `order_id` | UUID | FK → orders | |
| `product_id` | UUID | FK → products | |
| `quantity` | INTEGER | NOT NULL | Số lượng |
| `unit_price` | DECIMAL(15,2) | NOT NULL | Giá tại thời điểm |
| `total` | DECIMAL(15,2) | NOT NULL | Thành tiền |

---

### `inventory_logs` – Lịch sử nhập/xuất kho

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| `id` | UUID | PK | |
| `product_id` | UUID | FK → products | |
| `type` | ENUM | NOT NULL | `IMPORT`, `EXPORT`, `ADJUSTMENT` |
| `quantity` | INTEGER | NOT NULL | Số lượng (dương/âm) |
| `reference_type` | VARCHAR(50) | | `ORDER`, `SUPPLIER`, `MANUAL` |
| `reference_id` | UUID | | ID tham chiếu |
| `note` | TEXT | | |
| `created_by` | UUID | FK → users | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 🔍 Indexes quan trọng

```sql
-- Tìm kiếm đơn hàng theo khách hàng
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Lọc đơn hàng theo kỹ thuật viên và trạng thái
CREATE INDEX idx_orders_technician_status ON orders(technician_id, status);

-- Tìm đơn theo ngày
CREATE INDEX idx_orders_scheduled_at ON orders(scheduled_at);

-- Tìm kiếm khách hàng theo số điện thoại
CREATE INDEX idx_customers_phone ON customers(phone);

-- Tìm sản phẩm theo SKU
CREATE INDEX idx_products_sku ON products(sku);

-- Lịch sử kho theo sản phẩm
CREATE INDEX idx_inventory_product_created ON inventory_logs(product_id, created_at DESC);
```

---

## 🔄 Migration Strategy

```bash
# Tạo migration mới
npm run db:migration:generate -- --name CreateOrdersTable

# Chạy migrations pending
npm run db:migrate

# Rollback migration gần nhất
npm run db:migrate:revert

# Xem trạng thái migrations
npm run db:migrate:show
```

---

## 📦 Backup & Recovery

| Loại | Tần suất | Lưu trữ |
|------|----------|---------|
| Full backup | Hàng ngày (2:00 AM) | 30 ngày |
| Incremental | Mỗi 6 giờ | 7 ngày |
| Transaction logs | Liên tục | 3 ngày |

```bash
# Backup thủ công
pg_dump -U postgres -d dienlanh_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d dienlanh_db < backup_20260715.sql
```
