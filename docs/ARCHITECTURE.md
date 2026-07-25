# 🏗️ Kiến Trúc Hệ Thống – Điện Lạnh Hồng Thái Management

## Tổng quan

Tài liệu này mô tả kiến trúc tổng thể của hệ thống quản lý nội bộ **Điện Lạnh Hồng Thái**, bao gồm các lớp ứng dụng, luồng dữ liệu, và các quyết định thiết kế quan trọng.

---

## 📐 Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│   Browser / PWA (React + Next.js + TypeScript)              │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS / REST API / WebSocket
┌─────────────────────────▼───────────────────────────────────┐
│                      API GATEWAY / NGINX                    │
│   Load Balancing, SSL Termination, Rate Limiting            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    APPLICATION LAYER                        │
│                Node.js / NestJS Backend                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Orders  │  │  Users   │  │Inventory │  │ Reports  │  │
│   │  Module  │  │  Module  │  │  Module  │  │  Module  │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      DATA LAYER                             │
│   ┌────────────────┐         ┌─────────────────┐           │
│   │  PostgreSQL    │         │  Redis Cache    │           │
│   │  (Primary DB)  │         │  (Sessions/     │           │
│   │                │         │   Cache)        │           │
│   └────────────────┘         └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Frontend Architecture

### Tech Stack

| Công nghệ | Mục đích |
|-----------|---------|
| Next.js 14+ | Framework React với App Router |
| TypeScript | Type safety |
| Tailwind CSS / CSS Modules | Styling |
| React Query (TanStack) | Server state management |
| Zustand / Redux Toolkit | Client state management |
| React Hook Form + Zod | Form validation |
| Recharts / Chart.js | Biểu đồ, dashboard |
| Axios | HTTP client |

### Cấu trúc Frontend

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route group: Auth pages
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/        # Route group: Main app
│   │   ├── layout.tsx      # Shared layout với sidebar
│   │   ├── dashboard/      # Tổng quan
│   │   ├── orders/         # Quản lý đơn hàng
│   │   ├── technicians/    # Quản lý kỹ thuật viên
│   │   ├── inventory/      # Quản lý kho
│   │   ├── customers/      # Quản lý khách hàng
│   │   └── reports/        # Báo cáo
│   ├── api/                # Next.js API Routes (BFF layer)
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Base UI components (Button, Input, Modal...)
│   ├── layout/             # Sidebar, Header, Footer
│   └── shared/             # Reusable business components
├── features/               # Feature-based modules
│   └── [feature]/
│       ├── components/     # Feature-specific components
│       ├── hooks/          # Feature hooks
│       ├── api/            # API calls
│       ├── types.ts        # Types/interfaces
│       └── store.ts        # Local state (nếu cần)
├── hooks/                  # Global custom hooks
├── lib/                    # Utilities
│   ├── api.ts              # Axios instance
│   ├── auth.ts             # Auth helpers
│   └── utils.ts            # Helper functions
└── types/                  # Global TypeScript types
```

---

## ⚙️ Backend Architecture

### Tech Stack

| Công nghệ | Mục đích |
|-----------|---------|
| Node.js 18+ | Runtime |
| NestJS | Framework (hoặc Express) |
| TypeScript | Type safety |
| Prisma / TypeORM | ORM |
| PostgreSQL | Database chính |
| Redis | Caching, sessions |
| JWT | Authentication |
| Passport.js | Auth strategies |
| class-validator | Input validation |
| Winston | Logging |

### Luồng Request/Response

```
Request
  │
  ▼
[Middleware: Auth, Logger, RateLimit]
  │
  ▼
[Controller] → validate input (DTO)
  │
  ▼
[Service] → business logic
  │
  ├──▶ [Repository] → database queries via Prisma
  │
  ├──▶ [Cache Layer] → Redis (cho data hay đọc)
  │
  └──▶ [External Service] → Email, SMS, etc.
  │
  ▼
Response (JSON)
```

---

## 🗄️ Database Architecture

Chi tiết xem tại [DATABASE.md](DATABASE.md).

### Sơ đồ quan hệ cấp cao

```
Users ──────────── Orders ──────────── OrderItems
  │                  │                      │
  │              Customers              Products
  │
  └── Technicians ── TechnicianOrders
                         │
                       Orders
```

---

## 🔐 Bảo mật

Chi tiết xem tại [SECURITY.md](SECURITY.md).

### Nguyên tắc bảo mật chính

- **Authentication**: JWT Access Token (15 phút) + Refresh Token (7 ngày)
- **Authorization**: RBAC (Role-Based Access Control)
- **Data**: Tất cả kết nối DB dùng SSL; passwords hash bằng bcrypt (salt rounds: 12)
- **Transport**: HTTPS bắt buộc ở production
- **Input**: Validate và sanitize mọi input từ client

### Các vai trò (Roles)

| Role | Quyền hạn |
|------|-----------|
| `ADMIN` | Quản trị hệ thống IT, cấu hình danh mục, quản lý tài khoản |
| `BOSS` | Toàn quyền nghiệp vụ: quản lý đơn hàng, báo cáo tài chính, lương, thợ |
| `STAFF` | Tạo đơn hàng, quản lý khách hàng (Role dự phòng) |
| `TECHNICIAN` | Xem đơn được phân công, cập nhật trạng thái, xem phiếu lương |

---

## 📦 Caching Strategy

| Loại dữ liệu | TTL | Lý do |
|-------------|-----|-------|
| Session user | 7 ngày | Giảm DB query |
| Dashboard stats | 5 phút | Data không cần real-time |
| Product catalog | 30 phút | Ít thay đổi |
| Reports | 1 giờ | Tốn tài nguyên tính toán |

---

## 🚀 Deployment Architecture

Chi tiết xem tại [DEPLOYMENT.md](DEPLOYMENT.md).

```
Internet
    │
    ▼
[Cloudflare CDN] ── Static assets (JS, CSS, Images)
    │
    ▼
[VPS / Cloud Server]
    ├── [Nginx] ── Reverse proxy, SSL
    │       │
    │       ├── :3000 → [Next.js App]
    │       └── :4000 → [Node.js API]
    │
    ├── [PostgreSQL] ── Port 5432 (internal only)
    └── [Redis] ──────── Port 6379 (internal only)
```

---

## 📊 Monitoring & Logging

| Công cụ | Mục đích |
|---------|---------|
| Winston | Application logging |
| Morgan | HTTP request logging |
| PM2 | Process management, restart on crash |
| Uptime Robot | Uptime monitoring |

### Log Levels

```
ERROR   – Lỗi nghiêm trọng, cần xử lý ngay
WARN    – Cảnh báo, cần theo dõi
INFO    – Thông tin hoạt động bình thường
DEBUG   – Chi tiết debug (chỉ dùng ở development)
```

---

## 🔄 Các quyết định thiết kế (ADR)

### ADR-001: Sử dụng Next.js App Router

- **Lý do**: Server Components giúp cải thiện performance, built-in routing đơn giản hóa cấu trúc
- **Trade-off**: Cần team làm quen với mô hình mới

### ADR-002: NestJS cho Backend

- **Lý do**: Kiến trúc module rõ ràng, dependency injection, TypeScript first
- **Trade-off**: Boilerplate nhiều hơn Express thuần

### ADR-003: PostgreSQL thay vì NoSQL

- **Lý do**: Dữ liệu nghiệp vụ có quan hệ rõ ràng, cần ACID compliance, reporting phức tạp
- **Trade-off**: Schema cần thiết kế cẩn thận từ đầu
