# Thiết Kế Homepage (Dashboard) Hệ Thống Điện Lạnh Hồng Thái

Vì đây là một hệ thống quản lý nội bộ (ERP), trang Homepage không phải là một trang web giới thiệu cho khách hàng (Landing Page), mà đóng vai trò là một **Dashboard (Bảng điều khiển)** tổng quan. Thiết kế cần được cá nhân hóa và phân quyền rõ ràng dựa trên vai trò của người dùng (Role-based UI) để đảm bảo bảo mật và tính tiện dụng nhất.

Dựa trên yêu cầu của hệ thống, chúng ta có 2 vai trò chính: **Admin (Quản lý/Chủ)** và **Technician (Thợ kỹ thuật)**. 

Dưới đây là thiết kế phù hợp cho trang Homepage:

---

## 📌 Chiến lược Phát triển: Responsive Web App (Ứng dụng Web Thích ứng)
Hệ thống sẽ được xây dựng như một **Web App duy nhất** phục vụ cả hai đối tượng trên cùng một nền tảng, thay vì tách riêng Web và Mobile App bản native. Tùy thuộc vào thiết bị và vai trò (Role) đăng nhập, giao diện sẽ tự động thích ứng (Responsive):
*   **Admin / Quản lý:** Thường dùng trên Máy tính (Desktop/Laptop), giao diện sẽ hiển thị dạng bảng điều khiển rộng (Desktop View) với đầy đủ tính năng và bảng biểu.
*   **Thợ / Kỹ thuật viên:** Thường dùng trên Điện thoại (Mobile Web), giao diện sẽ tự động chuyển sang chế độ Mobile View. Các thành phần sẽ thu gọn lại dạng thẻ (Cards) và sử dụng menu điều hướng dưới cùng (Bottom Navigation) giống hệt một ứng dụng điện thoại (App-like experience).

**Lợi ích:** Tiết kiệm thời gian phát triển ban đầu, dễ dàng nâng cấp, bảo trì và triển khai tính năng mới đồng loạt chỉ trên một nền tảng Web (ReactJS).

---

## 1. Dành cho Admin / Cấp Quản Lý (Giao diện Desktop-first)
**Mục tiêu:** Nắm bắt toàn cảnh tình hình kinh doanh, nhân sự và đơn hàng trong ngày/tuần một cách nhanh nhất.

### Các thành phần chính (Widgets):
*   **Thống kê tổng quan (Quick Stats):**
    *   Tổng số đơn hàng hôm nay (Mới, Đang xử lý, Hoàn thành).
    *   Doanh thu/Lợi nhuận dự kiến trong ngày (nếu có quản lý dòng tiền).
    *   Số lượng thợ đang rảnh / đang bận.
*   **Danh sách Đơn hàng cần chú ý (Urgent/Pending Orders):**
    *   Bảng rút gọn hiển thị các đơn hàng vừa tạo chưa có người nhận, hoặc các đơn hàng bị trễ hẹn/khách khiếu nại.
*   **Trạng thái Kỹ thuật viên (Technician Status):**
    *   Danh sách thợ, trạng thái hiện tại (Đang sửa ở đâu, rảnh không) và vị trí hiện tại (nếu có tracking GPS).
*   **Cảnh báo Kho (Inventory Alerts):**
    *   Hiển thị các vật tư, thiết bị sắp hết (dưới mức tồn kho tối thiểu) để kịp thời nhập hàng.
*   **Thao tác nhanh (Quick Actions):**
    *   Nút nổi bật: "Tạo đơn hàng mới", "Nhập kho vật tư".

### Layout đề xuất:
*   **Sidebar (Bên trái):** Menu điều hướng (Dashboard, Đơn hàng, Nhân sự, Kho, Báo cáo, Cài đặt).
*   **Topbar:** Ô tìm kiếm chung (tìm mã đơn, sđt khách, mã vật tư), Thông báo (Notification), Profile.
*   **Main Content:** Chia grid linh hoạt để hiển thị các Widget thống kê bằng số ở trên cùng, các bảng danh sách chi tiết ở dưới.

---

## 2. Dành cho Technician / Thợ (Giao diện Mobile-first)
**Mục tiêu:** Đơn giản, dễ nhìn trên điện thoại khi đang di chuyển ngoài đường, thao tác nhanh chóng bằng một tay, tập trung vào công việc cá nhân và thu nhập.

### Các thành phần chính (Widgets):
*   **Header / Trạng thái:**
    *   Lời chào: "Xin chào, [Tên Thợ]".
    *   Nút gạt (Switch) đổi trạng thái: "Đang rảnh" / "Đang bận" (Để admin biết đường chia việc).
*   **Công việc hiện tại (Active Tasks):**
    *   Hiển thị dạng thẻ (Card) các đơn hàng đang được giao.
    *   Thông tin trên thẻ: Tên khách, SĐT (có nút bấm gọi điện ngay), Địa chỉ (có nút liên kết mở Google Maps chỉ đường), Tình trạng máy lỗi.
    *   Nút thao tác nhanh: "Bắt đầu đi", "Đã đến nơi", "Hoàn thành", "Báo giá vật tư phát sinh".
*   **Tổng quan Thu nhập (My Earnings):**
    *   Tiền lương/hoa hồng tạm tính trong ngày hoặc trong tháng hiện tại. Hiển thị con số rõ ràng giúp tạo động lực làm việc.
*   **Công việc chờ nhận (Pending Tasks - Tùy chọn):**
    *   Nếu hệ thống cho phép thợ tự tranh đơn, hiển thị danh sách các đơn mới ở khu vực gần đó.

### Layout đề xuất:
*   **Bottom Navigation (Thanh điều hướng dưới cùng):** Trang chủ (Đơn hàng), Lịch sử công việc, Lương thưởng, Cá nhân.
*   **Main Content:** Không dùng bảng (Table) mà dùng dạng danh sách các thẻ (Cards) to, có không gian trắng (whitespace) hợp lý để dễ thao tác bấm trên màn hình cảm ứng nhỏ.

---

## 3. Các lưu ý về UI/UX và Kỹ thuật
*   **Màu sắc & Giao diện:** Nên hỗ trợ chế độ Light/Dark mode. Đặc biệt với Thợ hay làm việc ngoài trời, UI cần có độ tương phản cao, chữ to, nút bấm lớn.
*   **Real-time (Thời gian thực):** Homepage nên được cập nhật realtime bằng Supabase Realtime hoặc Socket.io. Ví dụ: Admin tạo đơn mới giao cho thợ A, màn hình Homepage của thợ A tự động hiện thông báo có việc mới mà không cần F5 tải lại trang.
*   **Tối ưu Loading (Skeleton Loading):** Dashboard thường gọi nhiều API để lấy dữ liệu. Cần sử dụng hiệu ứng skeleton (khung xám nhấp nháy) trong lúc chờ dữ liệu, để người dùng không cảm thấy ứng dụng bị treo.
