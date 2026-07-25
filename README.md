# Điện Lạnh Hồng Thái - Hệ Thống Quản Lý Nội Bộ 🚀

Hệ thống ERP (Enterprise Resource Planning) tối giản và hiện đại dành riêng cho cửa hàng Điện Lạnh Hồng Thái, giúp số hóa quy trình quản lý đơn hàng, vật tư, và nhân sự.

## 🌟 Tính Năng Nổi Bật (Version 1.0.0)

- **Quản lý Đơn hàng (Cốt lõi):** Tạo đơn, phân công kỹ thuật viên, theo dõi trạng thái.
- **Quản lý Nhân sự & Phân quyền:**
  - `Admin/Boss`: Toàn quyền thao tác.
  - `Technician (Thợ)`: Giao diện Mobile-friendly, chỉ xem đơn của mình và nhận phiếu lương.
- **Quản lý Kho:** Thống kê lượng tồn kho thiết bị/vật tư.
- **Quản lý Lương (Payroll):** Tự động sinh Phiếu lương cho từng Thợ dựa trên ngày công và thưởng/phạt.
- **Báo cáo (Dashboard):** Dữ liệu trực quan (Real-time) từ Supabase.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Zustand, React-Hook-Form.
- **Backend:** Node.js, Express, TypeScript, Swagger UI.
- **Database:** Supabase (PostgreSQL).

## 🚀 Hướng Dẫn Cài Đặt

### 1. Backend (Node.js)
```bash
cd Backend_NodeJS
npm install
npm run dev
# Server chạy tại http://localhost:4000
# Xem Swagger Docs tại http://localhost:4000/api-docs
```

### 2. Frontend (React)
```bash
cd Frontend_ReactJS
npm install
npm run dev
# Website chạy tại http://localhost:5173
```

## 📚 Tài Liệu (Docs)
Hãy tham khảo thư mục `docs/` để đọc chi tiết các nguyên tắc thiết kế, kiến trúc hệ thống và quy tắc tính lương.
