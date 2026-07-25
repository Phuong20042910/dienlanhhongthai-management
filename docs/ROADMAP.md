# 🗺️ Lộ Trình Phát Triển (Product Roadmap)

**Dự án:** Điện Lạnh Hồng Thái – Hệ Thống Quản Lý  
**Ngày tạo:** 2026-07-15  

---

## Tổng quan các giai đoạn

```
Giai đoạn 1          Giai đoạn 2            Giai đoạn 3
(Hiện tại)           (Tương lai gần)        (Tương lai xa)
    │                     │                      │
    ▼                     ▼                      ▼
Nội bộ hoàn hảo  →  Khách hàng nhẹ   →  Nền tảng đầy đủ
ADMIN, STAFF, Thợ    + Tra cứu đơn       + App khách hàng
                     + Thông báo ZL/SMS  + Đặt lịch online
                                         + Tích hợp thanh toán
```

---

## 🟢 Giai đoạn 1 – Nội bộ (Đang xây dựng)

**Mục tiêu:** Số hóa toàn bộ quy trình vận hành nội bộ của cửa hàng.

### Người dùng
| Vai trò | Thiết bị | Chức năng chính |
|---------|---------|----------------|
| ADMIN (Chủ cửa hàng) | Máy tính / điện thoại | Toàn quyền, xem báo cáo |
| STAFF (Nhân viên) | Máy tính | Tiếp nhận đơn, phân công thợ |
| TECHNICIAN (Thợ) | Điện thoại | Xem đơn, cập nhật trạng thái, ghi chú |

### Khách hàng ở Giai đoạn 1

> **Khách hàng KHÔNG sử dụng hệ thống.**

```
Cách khách tương tác hiện tại:
  Khách gọi điện / nhắn Zalo
         │
         ▼
  Nhân viên nghe máy → Nhập thông tin vào hệ thống
         │
         ▼
  Thợ đến làm → Báo xong qua điện thoại / hệ thống
         │
         ▼
  Nhân viên thông báo lại cho khách (nếu cần)
```

**Thông tin khách hàng** trong Giai đoạn 1 chỉ là **dữ liệu**:
- Được lưu để tra cứu nhanh lần sau
- Được thống kê (khách gọi bao nhiêu lần, dùng dịch vụ gì)
- Khách không đăng nhập, không xem được bất cứ gì

---

## 🔵 Giai đoạn 2 – Mở rộng nhẹ phía khách hàng

**Mục tiêu:** Cải thiện trải nghiệm khách hàng mà không cần họ tạo tài khoản.

### Tính năng dự kiến

#### 2A. Tra cứu trạng thái đơn (Không cần đăng nhập)

```
Khách hàng truy cập: dienlanhhongthai.vn/tra-cuu
         │
         ▼
Nhập: Số điện thoại + Mã đơn hàng (DH-2026-XXXX)
         │
         ▼
Xem thông tin:
  ✅ Trạng thái hiện tại (Đang đi / Đang làm / Hoàn thành...)
  ✅ Tên thợ được phân công
  ✅ Ngày giờ hẹn
  ✅ Ghi chú từ cửa hàng (nếu có)
```

> **Không cần tài khoản** – chỉ cần biết SĐT và mã đơn.  
> Đây là cách đơn giản nhất để khách tự tra cứu.

#### 2B. Thông báo tự động qua Zalo / SMS

```
Sự kiện xảy ra trong hệ thống:
  → Thợ bấm "Đang đi"  
     → Tự động gửi Zalo/SMS cho khách:
        "Thợ [Tên] đang trên đường đến nhà bạn. Dự kiến 15-20 phút."
  
  → Thợ bấm "Hoàn thành"
     → Tự động gửi Zalo/SMS:
        "Đơn dịch vụ DH-2026-XXXX đã hoàn thành. Cảm ơn bạn đã tin dùng!"
  
  → Đơn bị dời lịch
     → Tự động gửi Zalo/SMS:
        "Lịch hẹn của bạn đã được dời sang [ngày mới]. 
         Liên hệ 0901234567 nếu cần hỗ trợ."
```

**Ưu điểm:** Khách biết thông tin mà không cần gọi lại hỏi.

---

## 🟣 Giai đoạn 3 – Nền tảng đầy đủ (Tương lai xa)

**Mục tiêu:** Khách hàng có thể tự phục vụ hoàn toàn.

### 3A. Tài khoản khách hàng (Customer Role)

Nếu triển khai, khách hàng sẽ có **role riêng** trong hệ thống:

```
Role: CUSTOMER
  Quyền:
    ✅ Xem tất cả đơn hàng của mình (chỉ của mình)
    ✅ Đặt lịch dịch vụ mới online
    ✅ Xem lịch sử thiết bị đã dùng dịch vụ
    ✅ Dời lịch / hủy lịch đã đặt (trước 2 giờ)
    ✅ Đánh giá dịch vụ sau khi hoàn thành
    ❌ Không thấy thông tin nội bộ (giá vốn, ghi chú thợ...)
    ❌ Không thấy đơn hàng của khách hàng khác
```

### 3B. Đặt lịch online

```
Khách truy cập website → Chọn dịch vụ → Chọn ngày giờ
         │
         ▼
Hệ thống kiểm tra lịch thợ → Hiển thị khung giờ còn trống
         │
         ▼
Khách xác nhận → Đơn tạo tự động vào hệ thống
         │
         ▼
Nhân viên nhận thông báo → Xác nhận và phân công thợ
```

### 3C. Đánh giá dịch vụ (Rating)

```
Sau khi đơn HOÀN THÀNH → Gửi link đánh giá cho khách:
  ⭐⭐⭐⭐⭐  (1-5 sao)
  Nhận xét tự do (tùy chọn)
  
Dữ liệu này hiển thị trong hồ sơ thợ (chỉ ADMIN/MANAGER xem)
```

---

## 📐 Thiết kế để dễ mở rộng

Dù Giai đoạn 1 không có khách hàng dùng hệ thống, **database và API được thiết kế sẵn** để sau này mở rộng không cần làm lại:

| Yếu tố | Giai đoạn 1 | Dễ mở rộng như thế nào |
|--------|------------|----------------------|
| Bảng `customers` | Lưu thông tin khách | Thêm cột `user_id` để liên kết tài khoản |
| Bảng `orders` | Có `order_code` unique | Dùng để tra cứu không cần đăng nhập |
| API `/orders` | Có authentication | Thêm route public `/orders/lookup` không cần auth |
| Thông báo | In-app cho nhân viên | Thêm Zalo/SMS provider là xong |
| Role system | ADMIN, STAFF, TECHNICIAN | Thêm role CUSTOMER không ảnh hưởng cũ |

---

## ❓ Câu hỏi cần trả lời trước Giai đoạn 2

Trước khi xây dựng tính năng khách hàng, cần quyết định:

1. **Thông báo qua kênh nào?** Zalo (phổ biến ở VN) hay SMS (tốn phí hơn)?
2. **Tra cứu đơn:** Chỉ xem trạng thái, hay xem thêm chi tiết (tên thợ, ảnh...)?
3. **Đặt lịch online:** Có cần chọn thợ cụ thể hay chỉ chọn dịch vụ + ngày giờ?
4. **Thanh toán:** Có cần tích hợp thanh toán online (MoMo, VNPay...) không?
