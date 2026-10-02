-- ==============================================================================
-- 🗄️ ĐIỆN LẠNH HỒNG THÁI - DATABASE SCHEMA (SUPABASE)
-- Lưu ý: Chạy toàn bộ script này trong SQL Editor của Supabase.
-- ==============================================================================

-- 1. Kích hoạt extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Dọn dẹp schema cũ (chỉ dùng khi dev, cẩn thận trên production)
DROP TABLE IF EXISTS inventory_logs CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Tạo các Enum Types
CREATE TYPE user_role AS ENUM ('ADMIN', 'BOSS', 'STAFF', 'TECHNICIAN');
CREATE TYPE technician_status AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE order_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'PARTIAL');
CREATE TYPE inventory_log_type AS ENUM ('IMPORT', 'EXPORT', 'ADJUSTMENT');

-- ==============================================================================
-- 4. TẠO CÁC BẢNG (TABLES)
-- ==============================================================================

-- Bảng users (Mở rộng từ auth.users của Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'TECHNICIAN',
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Bảng customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  address TEXT,
  district VARCHAR(100),
  city VARCHAR(100),
  note TEXT,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng technicians
CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  phone VARCHAR(20) NOT NULL,
  specialization TEXT[], -- Mảng các chuyên môn (vd: ['SC_MAY_LANH', 'VS_MAY_GIAT'])
  status technician_status NOT NULL DEFAULT 'ACTIVE',
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng products (Sản phẩm/Vật tư)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  unit VARCHAR(50),
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  technician_price DECIMAL(15,2) DEFAULT 0,
  unit_cost DECIMAL(15,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng orders (Đơn hàng)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'PENDING',
  priority order_priority NOT NULL DEFAULT 'NORMAL',
  service_type VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  sub_total DECIMAL(15,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  payment_status payment_status NOT NULL DEFAULT 'UNPAID',
  is_warranty BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Bảng order_items (Chi tiết vật tư trong đơn)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  total DECIMAL(15,2) NOT NULL DEFAULT 0
);

-- Bảng inventory_logs (Lịch sử xuất/nhập kho)
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type inventory_log_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'ORDER', 'SUPPLIER', 'MANUAL'
  reference_id UUID,
  note TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. INDEXES (Tăng tốc độ truy vấn)
-- ==============================================================================
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_technician_status ON orders(technician_id, status);
CREATE INDEX idx_orders_scheduled_at ON orders(scheduled_at);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_inventory_product_created ON inventory_logs(product_id, created_at DESC);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) - CƠ BẢN
-- ==============================================================================
-- Tạm thời cho phép xem và sửa mọi thứ khi gọi từ Service Role hoặc đã đăng nhập (authenticated)
-- (Sẽ siết chặt hơn ở các bản cập nhật sau nếu cần thiết)

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON technicians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép User đã đăng nhập làm mọi thứ" ON inventory_logs FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- BẢNG PAYSLIPS: Lương Thợ
-- ==============================================================================
CREATE TABLE payslips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  base_salary NUMERIC NOT NULL DEFAULT 0,
  working_days INTEGER NOT NULL DEFAULT 0,
  leave_days INTEGER NOT NULL DEFAULT 0,
  bonus NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  total_salary NUMERIC NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'FINALIZED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
