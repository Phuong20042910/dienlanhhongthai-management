# Hướng dẫn Đóng góp (Contributing Guidelines)

Chào mừng bạn đến với dự án **Quản lý nội bộ Điện Lạnh Hồng Thái**. Dưới đây là các quy chuẩn làm việc:

## 1. Môi trường phát triển
- Node.js >= 18
- Trình quản lý package: npm

## 2. Quy trình làm việc (Git Workflow)
- **main**: Nhánh code chính, chạy trên production.
- **dev**: Nhánh gom tính năng (nếu làm việc nhóm).
- Tạo nhánh riêng khi fix bug hoặc thêm tính năng: `feature/ten-tinh-nang` hoặc `bugfix/mo-ta-loi`.
- Viết commit message bằng tiếng Việt, rõ ràng (ví dụ: "Thêm API chốt lương cho thợ").

## 3. Kiến trúc dự án
- **Backend**: ExpressJS, kết nối CSDL Supabase. Cấu trúc MVC.
- **Frontend**: React (Vite), Zustand để quản lý State, TailwindCSS để làm giao diện.
- Không đưa mật khẩu hoặc khóa bí mật (API Key) lên git. Chỉ cập nhật vào file `.env`.

Cảm ơn bạn đã đóng góp!
