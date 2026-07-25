# 📋 Tài Liệu Yêu Cầu Hệ Thống (Software Requirements Specification)

**Dự án:** Điện Lạnh Hồng Thái – Hệ Thống Quản Lý Nội Bộ  
**Phiên bản:** 1.2.0  
**Ngày cập nhật:** 2026-07-15  
**Trạng thái:** Đã xác nhận với chủ cửa hàng  

---

## 📋 Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Tổng quan nghiệp vụ thực tế](#2-tổng-quan-nghiệp-vụ-thực-tế)
3. [Người dùng & Phân quyền](#3-người-dùng--phân-quyền)
4. [Yêu cầu chức năng (FR)](#4-yêu-cầu-chức-năng)
5. [Yêu cầu phi chức năng (NFR)](#5-yêu-cầu-phi-chức-năng)
6. [Yêu cầu giao diện](#6-yêu-cầu-giao-diện)

---

## 1. Giới thiệu

### 1.1 Mục đích

Xây dựng hệ thống quản lý nội bộ cho **cửa hàng Điện Lạnh Hồng Thái**, giúp:
- Ghi nhận thông tin đơn công việc từ khách hàng
- Phân công thợ đến địa chỉ khách thực hiện dịch vụ
- Theo dõi tiến độ công việc theo từng loại hình dịch vụ

### 1.2 Phạm vi

#### ✅ Trong phạm vi (Giai đoạn 1 – Hiện tại)

Hệ thống chỉ phục vụ **người dùng nội bộ** của cửa hàng:

| Người dùng | Cách tương tác |
|-----------|---------------|
| **CHỦ (ADMIN)** | Dùng máy tính / điện thoại, toàn quyền |
| **THỢ (TECHNICIAN)** | Dùng điện thoại, xem và cập nhật đơn của mình |
| **Khách hàng** | **Không dùng hệ thống** – gọi điện / nhắn Zalo cho chủ |

> **Khách hàng trong giai đoạn này là dữ liệu được lưu trữ, không phải người dùng hệ thống.**  
> Nhân viên là người nhập thông tin khách vào hệ thống thay cho khách.

#### 🔮 Ngoài phạm vi (Dự kiến Giai đoạn 2 – Tương lai)

Các tính năng **chưa xây dựng** nhưng hệ thống được thiết kế để **dễ mở rộng** sau:

| Tính năng tương lai | Mô tả |
|--------------------|-------|
| **Tra cứu đơn hàng** | Khách nhập SĐT + mã đơn → xem trạng thái, không cần tài khoản |
| **Thông báo Zalo/SMS** | Tự động gửi tin nhắn khi thợ đang trên đường / hoàn thành |
| **Đặt lịch online** | Khách tự chọn dịch vụ, ngày giờ qua web |
| **Tài khoản khách hàng** | Khách có role riêng, xem lịch sử đơn, thiết bị đã dùng dịch vụ |

> **Lý do để Giai đoạn 2 sau:**  
> Ưu tiên ổn định quy trình nội bộ trước. Khi đã vận hành trơn tru thì mới mở rộng  
> ra phía khách hàng – tránh xây phức tạp ngay từ đầu.

### 1.3 Định nghĩa

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| Đơn công việc | Một yêu cầu dịch vụ của khách hàng được ghi nhận vào hệ thống |
| Thợ | Kỹ thuật viên / nhân viên đến nhà khách thực hiện dịch vụ |
| Loại dịch vụ | Loại công việc cụ thể (xem danh sách tại mục 2.2) |
| Phân công | Hành động giao đơn công việc cho một thợ cụ thể |
| Khách hàng | Người sử dụng dịch vụ của cửa hàng. **Không phải người dùng hệ thống** ở Giai đoạn 1 |
| Dời lịch | Hành động thay đổi ngày/giờ hẹn của đơn đã có |

---

## 2. Tổng quan nghiệp vụ thực tế

### 2.1 Quy trình cốt lõi

```
Khách gọi điện / nhắn tin
        │
        ▼
Chủ ghi nhận đơn:
  - Tên + SĐT khách
  - Địa chỉ đến làm
  - Loại dịch vụ cần làm
  - Ngày giờ hẹn
        │
        ▼
Phân công thợ phù hợp
        │
        ▼
Thợ đến làm → Cập nhật hoàn thành
        │
        ▼
Ghi nhận kết quả (có làm được không,
ghi chú thêm nếu cần)
```

### 2.2 Các loại dịch vụ (Service Types)

Hệ thống hỗ trợ đúng các loại dịch vụ mà cửa hàng cung cấp:

#### Nhóm 1: Sửa chữa (Repair)

| Mã | Tên dịch vụ |
|----|------------|
| `SC_MAY_LANH` | Sửa chữa máy lạnh |
| `SC_MAY_GIAT` | Sửa chữa máy giặt |
| `SC_TU_LANH` | Sửa chữa tủ lạnh |
| `SC_MAY_NUOC_NONG` | Sửa chữa máy nước nóng |

#### Nhóm 2: Vệ sinh (Cleaning)

| Mã | Tên dịch vụ |
|----|------------|
| `VS_MAY_LANH` | Vệ sinh máy lạnh |
| `VS_MAY_GIAT` | Vệ sinh máy giặt |

#### Nhóm 3: Giao hàng – Vận chuyển (Delivery)

| Mã | Tên dịch vụ |
|----|------------|
| `GH_TU_LANH` | Chở / giao tủ lạnh đã bán cho khách |
| `GH_MAY_GIAT` | Chở / giao máy giặt đã bán cho khách |

> **Lưu ý:** Danh sách này có thể được ADMIN bổ sung thêm sau mà không cần sửa code.

### 2.3 Sự khác biệt giữa các nhóm dịch vụ

| Đặc điểm | Sửa chữa | Vệ sinh | Giao hàng |
|----------|----------|---------|-----------|
| Cần thợ kỹ thuật | ✅ | ✅ | ⚠️ (cần người khỏe) |
| Cần phương tiện vận chuyển | ❌ | ❌ | ✅ |
| Thời gian thực hiện | Không cố định | ~1-2 giờ | ~1-3 giờ |
| Có thể cần 2 thợ | ❌ | ❌ | ✅ (hàng nặng) |

---

## 3. Người dùng & Phân quyền

### 3.1 Các vai trò

| Vai trò | Mô tả | Ai dùng | Số lượng |
|---------|-------|---------|----------|
| **BOSS (Chủ cửa hàng)** | Toàn quyền nghiệp vụ: tạo đơn, phân công thợ, xem báo cáo, chấm công, chốt lương | Chủ cửa hàng | 1–2 người |
| **ADMIN (IT)** | Toàn quyền hệ thống: tạo/khóa tài khoản, cấu hình danh mục, xem log | IT / Quản trị viên | 1 người |
| **THỢ / TECHNICIAN** | Xem đơn được phân công, cập nhật trạng thái, ghi chú | Thợ kỹ thuật | 1–20 người |

> **Tại sao tách ADMIN và BOSS?**  
> • Đảm bảo bảo mật tài chính (ADMIN không xem báo cáo doanh thu/lương).
> • Phân quyền rõ ràng khi thuê bên ngoài bảo trì hệ thống.
> • Sau này muốn thêm nhân viên văn phòng có thể tách role STAFF ra khỏi BOSS khi cần.

### 3.2 Ma trận phân quyền

| Chức năng | BOSS | ADMIN | STAFF | TECHNICIAN |
|-----------|:----:|:-----:|:-----:|:----------:|
| Xem tất cả đơn công việc | ✅ | ❌ | ✅ | ❌ |
| Xem đơn được phân công cho mình | ❌ | ❌ | ❌ | ✅ |
| Tạo đơn công việc mới | ✅ | ❌ | ✅ | ❌ |
| Sửa / Hủy đơn công việc | ✅ | ❌ | ⚠️* | ❌ |
| Phân công thợ | ✅ | ❌ | ✅ | ❌ |
| Cập nhật trạng thái đơn | ✅ | ❌ | ✅ | ⚠️*** |
| Quản lý danh sách thợ (nghiệp vụ) | ✅ | ❌ | ❌ | ❌ |
| Quản lý danh sách khách hàng | ✅ | ❌ | ✅ | ❌ |
| Xem báo cáo doanh thu / tiền lương | ✅ | ❌ | ❌ | ❌ |
| Quản lý tài khoản (tạo, khóa, đổi pass)| ❌ | ✅ | ❌ | ❌ |
| Cấu hình hệ thống (loại dịch vụ...) | ❌ | ✅ | ❌ | ❌ |

> ⚠️\* STAFF chỉ sửa/hủy đơn do mình tạo, khi còn trạng thái **CHƯA PHÂN CÔNG**  
> ⚠️\*\*\* TECHNICIAN chỉ chuyển đơn của mình sang **ĐANG LÀM** hoặc **HOÀN THÀNH**

---

## 4. Yêu cầu chức năng

### FR-01: Xác thực & Tài khoản

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-01-01 | Đăng nhập bằng tên đăng nhập (hoặc email) và mật khẩu | 🔴 Cao |
| FR-01-02 | Khóa tài khoản sau 5 lần nhập sai mật khẩu liên tiếp | 🔴 Cao |
| FR-01-03 | ADMIN tạo / sửa / vô hiệu hóa tài khoản người dùng (cấp tài khoản BOSS, THỢ) | 🔴 Cao |
| FR-01-04 | ADMIN đặt lại mật khẩu cho người dùng khác | 🔴 Cao |
| FR-01-05 | Người dùng tự đổi mật khẩu của mình | 🟡 Trung bình |
| FR-01-06 | Tự động đăng xuất sau 60 phút không hoạt động | 🟡 Trung bình |

---

### FR-02: Quản lý Đơn Công Việc

#### FR-02-A: Tiếp nhận đơn

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-01 | Tạo đơn công việc mới với thông tin: tên khách, số điện thoại, địa chỉ, loại dịch vụ, ngày hẹn, ghi chú | 🔴 Cao |
| FR-02-02 | Hệ thống tự sinh mã đơn theo định dạng `DH-YYYY-NNNN` | 🔴 Cao |
| FR-02-03 | Chọn loại dịch vụ từ danh sách có sẵn (8 loại, xem mục 2.2) | 🔴 Cao |
| FR-02-04 | Khi nhập số điện thoại, hệ thống tự động gợi ý nếu khách đã từng gọi trước đây | 🔴 Cao |
| FR-02-05 | Chọn "Tình trạng hư hỏng / Mã lỗi" từ danh sách gợi ý có sẵn (được nạp từ danh_sach_su_co.md) | 🔴 Cao |
| FR-02-05B| Nhập ghi chú thêm mô tả sự cố hoặc yêu cầu đặc biệt của khách (nhập tự do) | 🔴 Cao |
| FR-02-06 | Đánh dấu mức ưu tiên: Bình thường / Gấp | 🟡 Trung bình |

#### FR-02-B: Phân công thợ

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-07 | Phân công một hoặc nhiều thợ cho một đơn công việc | 🔴 Cao |
| FR-02-08 | Xem lịch làm việc của từng thợ trong ngày để tránh trùng lịch | 🔴 Cao |
| FR-02-09 | Có thể phân công thợ ngay khi tạo đơn hoặc phân công sau | 🔴 Cao |
| FR-02-10 | Thay đổi / hủy phân công thợ trước khi thợ bắt đầu đi làm | 🔴 Cao |
| FR-02-11 | Lọc thợ theo loại dịch vụ (ví dụ: chỉ hiện thợ biết sửa máy lạnh) | 🟡 Trung bình |

#### FR-02-C: Theo dõi & Cập nhật

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-12 | Xem danh sách tất cả đơn công việc, lọc theo: ngày, trạng thái, thợ, loại dịch vụ | 🔴 Cao |
| FR-02-13 | Tìm kiếm đơn theo tên khách, số điện thoại, mã đơn | 🔴 Cao |
| FR-02-14 | Thợ xem danh sách đơn được phân công cho mình trong ngày / tuần | 🔴 Cao |
| FR-02-15 | Thợ cập nhật trạng thái đơn: **Đang đi** → **Đang làm** → **Hoàn thành** | 🔴 Cao |
| FR-02-16 | Thợ hoặc nhân viên ghi chú kết quả sau khi hoàn thành (làm được, không làm được, lý do) | 🔴 Cao |
| FR-02-17 | Ghi lại lịch sử thay đổi trạng thái: ai đổi, lúc mấy giờ | 🔴 Cao |
| FR-02-18 | Hủy đơn kèm lý do | 🔴 Cao |

#### FR-02-D: Dời lịch (Reschedule)

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-19 | Thợ bấm **"Dời lịch"** ngay trên điện thoại khi đến nhà khách nhưng khách bận hoặc yêu cầu đổi ngày | 🔴 Cao |
| FR-02-20 | Khi dời lịch, bắt buộc chọn lý do (Khách không có nhà / Khách bận / Khách đổi giờ / Lý do khác) | 🔴 Cao |
| FR-02-21 | Khi dời lịch, bắt buộc nhập ngày hẹn mới và giờ hoặc khung giờ (sáng/chiều/tối) | 🔴 Cao |
| FR-02-22 | Đơn dời lịch **giữ nguyên mã đơn cũ** và thợ được phân công cũ, chỉ cập nhật ngày hẹn mới | 🔴 Cao |
| FR-02-23 | Lịch sử dời lịch được ghi lại đầy đủ: ai dời, giờ dời, lý do, ngày hẹn cũ → mới | 🔴 Cao |
| FR-02-24 | Cảnh báo cho BOSS/STAFF khi một đơn bị dời lịch từ 3 lần trở lên | 🟡 Trung bình |
| FR-02-25 | Đơn đã dời lịch hiển thị badge "Đã dời X lần" trong danh sách | 🟡 Trung bình |
| FR-02-26 | BOSS/STAFF cũng có thể thực hiện dời lịch thay cho thợ (khi khách gọi về cửa hàng) | 🔴 Cao |

#### FR-02-E: Ghi chú của thợ (Technician Notes)

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-27 | Thợ ghi chú bất kỳ lúc nào khi đơn đang ở trạng thái **Đang đi** hoặc **Đang làm** | 🔴 Cao |
| FR-02-28 | Thợ nhập ghi chú tự do (không giới hạn cú pháp, tối đa 1000 ký tự) | 🔴 Cao |
| FR-02-29 | Mỗi lần thợ thêm ghi chú = 1 dòng riêng có timestamp (không ghi đè ghi chú cũ) | 🔴 Cao |
| FR-02-30 | Ghi chú của thợ hiển thị rõ ràng cho BOSS/STAFF trên trang chi tiết đơn | 🔴 Cao |
| FR-02-31 | Thợ **không thể sửa/xóa** ghi chú đã lưu (chỉ thêm mới) để đảm bảo tính minh bạch | 🔴 Cao |
| FR-02-32 | Thợ có thể đính kèm ảnh chụp tại hiện trường (tùy chọn, tối đa 5 ảnh / lần cập nhật) | 🟡 Trung bình |

#### FR-02-F: Đặc thù theo loại dịch vụ

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-19 | Đơn **Giao hàng (chở tủ lạnh / máy giặt)**: cho phép phân công 2 thợ, ghi thêm tên hàng cần giao | 🔴 Cao |
| FR-02-20 | Đơn **Vệ sinh máy lạnh**: ghi nhận số lượng máy cần vệ sinh | 🟡 Trung bình |
| FR-02-21 | Lọc riêng đơn giao hàng (để quản lý xe / phương tiện vận chuyển) | 🟡 Trung bình |

#### FR-02-G: Vật tư, Thanh toán & Bảo hành

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-02-33 | Thợ xem danh mục vật tư và thêm vật tư sử dụng vào đơn (có ô check "Miễn phí - Đi kèm dịch vụ") | 🔴 Cao |
| FR-02-34 | Tự động tính Tổng tiền đơn hàng = Phí dịch vụ + Tổng tiền vật tư (bỏ qua vật tư miễn phí) | 🔴 Cao |
| FR-02-34B| Boss/Admin tạo "Đơn Bán Lẻ" để xuất kho thu tiền nhanh cho khách vãng lai (không cần gán thợ) | 🔴 Cao |
| FR-02-35 | Thợ xác nhận thu Tiền mặt hoặc Khách chuyển khoản khi hoàn thành đơn | 🔴 Cao |
| FR-02-36 | Tự động trừ số lượng tồn kho vật tư khi đơn chuyển sang HOÀN THÀNH | 🔴 Cao |
| FR-02-37 | BOSS hoặc ADMIN thêm, sửa, xóa danh mục vật tư và cập nhật tồn kho (Nhập kho) | 🔴 Cao |
| FR-02-38 | Hệ thống cảnh báo đơn "Đang trong thời gian bảo hành" nếu SĐT khách khớp đơn hoàn thành < 6 tháng | 🔴 Cao |
| FR-02-39 | Phí dịch vụ mặc định = 0đ cho Đơn Bảo Hành (trừ khi có phát sinh thêm) | 🟡 Trung bình |

---

### FR-03: Quản lý Thợ (Kỹ Thuật Viên)

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-03-01 | Thêm thợ với thông tin: họ tên, SĐT, cấp bậc (thợ chính/phụ), loại công việc có thể làm | 🔴 Cao |
| FR-03-02 | Đánh dấu thợ đang nghỉ / không nhận việc | 🔴 Cao |
| FR-03-03 | Xem lịch công việc của thợ trong ngày / tuần (bao nhiêu đơn, giờ nào) | 🔴 Cao |
| FR-03-04 | Xem lịch sử các đơn mà thợ đã làm | 🟡 Trung bình |
| FR-03-05 | Thống kê: thợ làm bao nhiêu đơn trong tháng, số ngày nghỉ phép | 🟡 Trung bình |

---

### FR-03-B: Xin Nghỉ Phép (Leave Request)

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-03-06 | Thợ gửi đơn xin nghỉ trực tiếp từ điện thoại: chọn loại nghỉ, ngày bắt đầu, ngày kết thúc, lý do | 🔴 Cao |
| FR-03-07 | Thợ báo nghỉ đột xuất (nghỉ ốm, sự cố khẩn) với 1 nút bấm nhanh | 🔴 Cao |
| FR-03-08 | CHỦ nhận thông báo ngay khi có thợ xin nghỉ | 🔴 Cao |
| FR-03-09 | CHỦ duyệt hoặc từ chối đơn xin nghỉ (kèm lý do nếu từ chối) | 🔴 Cao |
| FR-03-10 | Khi CHỦ duyệt → trạng thái thợ tự động chuyển sang **Đang nghỉ** vào đúng ngày bắt đầu | 🔴 Cao |
| FR-03-11 | Khi kỳ nghỉ kết thúc → trạng thái thợ tự động trở về **Đang làm việc** | 🔴 Cao |
| FR-03-12 | Khi thợ báo nghỉ đột xuất → hệ thống liệt kê ngay các đơn đang phân công cho thợ trong ngày đó cần xử lý lại | 🔴 Cao |
| FR-03-13 | Thợ xem được trạng thái đơn xin nghỉ của mình (chờ duyệt / đã duyệt / từ chối) | 🔴 Cao |
| FR-03-14 | Thợ tự hủy đơn xin nghỉ chưa đến ngày bắt đầu | 🟡 Trung bình |
| FR-03-15 | CHỦ xem lịch nghỉ của tất cả thợ dưới dạng lịch tháng | 🟡 Trung bình |
| FR-03-16 | CHỦ tự tạo lịch nghỉ cho thợ (nghỉ lễ, cửa hàng nghỉ chung) | 🟡 Trung bình |
| FR-03-17 | Cảnh báo khi phân công thợ vào ngày thợ đó đã có lịch nghỉ được duyệt | 🔴 Cao |

---

### FR-04: Quản lý Khách Hàng

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-04-01 | Hệ thống tự động lưu thông tin khách khi tạo đơn lần đầu (tên, SĐT, địa chỉ) | 🔴 Cao |
| FR-04-02 | Tìm kiếm khách hàng theo tên hoặc số điện thoại | 🔴 Cao |
| FR-04-03 | Xem lịch sử đơn hàng đã làm cho khách | 🔴 Cao |
| FR-04-04 | Khách hàng có thể có nhiều địa chỉ khác nhau | 🟡 Trung bình |
| FR-04-05 | Ghi chú nội bộ về khách (thiết bị đang dùng, lưu ý khi đến) | 🟡 Trung bình |

---

### FR-05: Dashboard & Thống Kê

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-05-01 | Dashboard hiển thị: số đơn hôm nay theo từng trạng thái | 🔴 Cao |
| FR-05-02 | Danh sách đơn **chưa phân công thợ** (cần xử lý ngay) | 🔴 Cao |
| FR-05-03 | Danh sách đơn **đang thực hiện** trong ngày | 🔴 Cao |
| FR-05-04 | Dashboard hiển thị: **thợ đang nghỉ hôm nay** và danh sách đơn cần phân công lại | 🔴 Cao |
| FR-05-05 | Xem số đơn theo từng loại dịch vụ trong tháng | 🟡 Trung bình |
| FR-05-06 | Xem số đơn theo từng thợ trong tháng | 🟡 Trung bình |
| FR-05-07 | Lọc và xuất danh sách đơn ra file Excel (.xlsx) | 🟡 Trung bình |

---

### FR-06: Thông Báo

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-06-01 | Thợ nhận thông báo khi được phân công đơn mới | 🔴 Cao |
| FR-06-02 | Cảnh báo đơn **Gấp** chưa được phân công thợ sau 1 giờ | 🔴 Cao |
| FR-06-03 | Nhắc nhở đơn có lịch hẹn trong vòng 2 giờ tới mà thợ chưa bắt đầu | 🟡 Trung bình |
| FR-06-04 | Thông báo khi thợ hoàn thành đơn | 🟢 Thấp |

---

### FR-07: Chấm Công & Tiền Lương

| ID | Yêu cầu | Độ ưu tiên |
|----|---------|-----------|
| FR-07-01 | CHỦ thiết lập "Lương cứng theo tháng" cho từng thợ | 🔴 Cao |
| FR-07-02 | Hệ thống tự động đếm số ngày đi làm thực tế dựa trên số đơn đã nhận/hoàn thành | 🔴 Cao |
| FR-07-03 | CHỦ có thể đánh dấu thợ "Nghỉ không phép" cho các ngày vắng mặt | 🔴 Cao |
| FR-07-04 | Tự động tính toán lương cơ bản: `(Lương cứng / Ngày công chuẩn) * Ngày làm thực tế` | 🔴 Cao |
| FR-07-05 | Tự động tính thưởng chuyên cần nếu đi làm đủ 100% ngày công chuẩn và không nghỉ không phép | 🟡 Trung bình |
| FR-07-06 | CHỦ nhập thêm các khoản Thưởng (Lễ Tết, năng suất) kèm ghi chú | 🔴 Cao |
| FR-07-07 | CHỦ nhập các khoản Khấu trừ (Đi trễ, làm hỏng đồ, tạm ứng) kèm ghi chú | 🔴 Cao |
| FR-07-08 | Hệ thống tự xuất Phiếu lương tạm tính vào ngày 1 hàng tháng cho tháng trước | 🔴 Cao |
| FR-07-09 | CHỦ duyệt và bấm "Chốt lương" để khóa bảng lương tháng | 🔴 Cao |
| FR-07-10 | Thợ xem được Phiếu lương chi tiết (ngày làm, thưởng, phạt, tổng nhận) trên điện thoại | 🔴 Cao |
| FR-07-11 | Tính năng **"Quyết toán thôi việc"**: Bắt buộc bàn giao hết đơn, hỗ trợ nhập khấu trừ đồ nghề/tạm ứng và tự động đổi trạng thái thợ thành INACTIVE sau khi thanh toán | 🔴 Cao |

---

## 5. Yêu cầu phi chức năng

### NFR-01: Hiệu năng

| Yêu cầu | Mục tiêu |
|---------|---------|
| Tải trang đầu tiên | ≤ 3 giây |
| Tìm kiếm khách hàng theo SĐT | ≤ 1 giây |
| Hỗ trợ đồng thời | ≥ 20 người dùng |

### NFR-02: Giao diện thiết bị di động (Thợ dùng điện thoại)

```
Yêu cầu: Thợ có thể dùng điện thoại Android/iOS để:
  - Xem danh sách đơn của mình trong ngày
  - Bấm cập nhật trạng thái (Đang đi / Đang làm / Hoàn thành)
  - Xem địa chỉ khách và bấm mở Google Maps
  - Ghi chú kết quả sau khi xong việc
```

### NFR-03: Độ tin cậy

| Yêu cầu | Mục tiêu |
|---------|---------|
| Uptime hệ thống | ≥ 99% |
| Backup dữ liệu tự động | Hàng ngày |

### NFR-04: Ngôn ngữ & Định dạng

| Yêu cầu | Chi tiết |
|---------|---------|
| Ngôn ngữ giao diện | Tiếng Việt hoàn toàn |
| Định dạng ngày giờ | DD/MM/YYYY HH:mm |
| Múi giờ | UTC+7 (Việt Nam) |
| Số điện thoại | 10 số, bắt đầu bằng 0 |

---

## 6. Yêu cầu giao diện

### 6.1 Màn hình chính (Nhân viên – trên máy tính)

```
┌─────────────────────────────────────────┐
│ HEADER: Logo | Ngày hôm nay | Thông báo │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │  NỘI DUNG CHÍNH              │
│          │                              │
│ Dashboard│  Dashboard / Danh sách đơn / │
│ Đơn hàng │  Chi tiết đơn / ...          │
│ Thợ      │                              │
│ Khách    │                              │
│ Báo cáo  │                              │
└──────────┴──────────────────────────────┘
```

### 6.2 Màn hình thợ (trên điện thoại)

```
┌─────────────────────┐
│ 📋 Đơn của tôi      │
│ Hôm nay: 3 đơn      │
├─────────────────────┤
│ [DH-2026-0012]      │
│ 🔧 Sửa máy lạnh     │
│ 📍 123 Lê Lợi, Q.1  │
│ ⏰ 9:00 sáng        │
│ [ĐI LÀM] [XEM MAP]  │
├─────────────────────┤
│ [DH-2026-0013]      │
│ 🧹 Vệ sinh máy lạnh │
│ 📍 456 Trần Hưng Đạo│
│ ⏰ 14:00 chiều      │
│ [ĐI LÀM] [XEM MAP]  │
└─────────────────────┘
```

### 6.3 Form tạo đơn nhanh (mục tiêu: tạo xong trong 2 phút)

Các trường bắt buộc khi tạo đơn, theo thứ tự nhập:
1. Số điện thoại khách *(gợi ý tự động)*
2. Tên khách
3. Địa chỉ
4. Loại dịch vụ *(dropdown)*
5. Ngày hẹn + Giờ hẹn
6. Phân công thợ *(dropdown)*
7. Ghi chú *(tùy chọn)*
