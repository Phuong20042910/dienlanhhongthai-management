# 📋 Kế Hoạch Hoàn Thiện Hệ Thống Toàn Diện – Điện Lạnh Hồng Thái

> **Mục tiêu:** Nâng cấp hệ thống hiện tại thành một nền tảng vận hành full chức năng, chuyên nghiệp và tối ưu trải nghiệm thực tế cho cả **3 đối tượng cốt lõi**:
> 1. 🔧 **Thợ (Kỹ thuật viên di động)**
> 2. 👥 **Khách hàng**
> 3. 💼 **Quản trị viên / Điều phối / Chủ cửa hàng (Admin / Staff / Boss)**

---

## 1. DÀNH CHO THỢ (KỸ THUẬT VIÊN)

Thợ điện lạnh chủ yếu thao tác trên điện thoại thông minh ngoài hiện trường (tại nhà khách, công trình, trên mái nhà/gác lửng). Cần tối ưu thao tác nhanh, trực quan, giảm thiểu gõ văn bản:

### 1.1. Bản đồ & Chỉ đường chuyên biệt cho Việt Nam với Goong Map (Goong.io)
* **Lý do chọn Goong Map thay vì Google Maps:**
  * Dữ liệu địa chỉ của Goong Map được tối ưu hóa đặc biệt cho Việt Nam: định vị chính xác từng số nhà, ngách, ngõ, kiệt, hẻm và thôn/xã mà Google Maps thường chỉ ghim chung chung ra đầu đường lớn.
  * Tích hợp Goong Places API để gợi ý địa chỉ chuẩn khi tạo đơn.
  * Hỗ trợ tìm kiếm tọa độ (Geocoding) và tính lộ trình di chuyển tối ưu cho xe máy (thợ di chuyển).
* **Giải pháp triển khai:**
  * Bổ sung nút **"Chỉ đường Goong"** trong thẻ đơn hàng của Thợ.
  * Khi nhấn, hệ thống sẽ mở bản đồ chi tiết với địa chỉ nhà khách hàng (hoặc tọa độ đã geocode qua Goong).
  * Hỗ trợ xem trực tiếp vị trí trên Goong Map SDK (MapLibre/Goong Tiles) hoặc mở app điều hướng.


### 1.2. Gọi điện thoại & Nhắn Zalo 1 chạm
* **Thực trạng:** Muốn liên hệ khách để hẹn giờ hoặc hỏi rõ số nhà/hẻm, thợ phải ghi nhớ hoặc chuyển ứng dụng để bấm số.
* **Giải pháp:**
  * Thêm nút **"Gọi điện"** (`tel:${customer.phone}`).
  * Thêm nút **"Nhắn Zalo"** (`https://zalo.me/${customer.phone}`).
  * Giúp thợ thông báo *"Em đang qua"* hoặc *"Em đã tới đầu ngõ"* chỉ bằng 1 thao tác.

### 1.3. Chụp ảnh hiện trường nghiệm thu (Proof of Work)
* **Thực trạng:** Hiện chưa có lưu trữ hình ảnh hiện trạng thiết bị. Khi phát sinh khiếu nại (ví dụ khách nói thợ làm xước vỏ máy, máy vẫn kêu, chưa nạp đủ gas), khó đối soát.
* **Giải pháp:**
  * Thêm khu vực tải ảnh vào đơn:
    * **Ảnh Trước khi làm (Before):** Hiện trạng máy, tem model, chỉ số đồng hồ đo gas/ampe, vị trí hỏng hóc.
    * **Ảnh Sau khi làm (After):** Máy sau khi vệ sinh sạch sẽ, đồng hồ gas chuẩn, máy chạy mát, phiếu bàn giao.
  * Hỗ trợ chụp trực tiếp từ camera điện thoại và tự động nén dung lượng trước khi upload lên Supabase Storage.

### 1.4. Chữ ký điện tử của khách hàng (E-Signature)
* **Thực trạng:** Nghiệm thu chỉ bằng cách thợ bấm nút "Hoàn thành" trên app.
* **Giải pháp:**
  * Tích hợp canvas ký tên cảm ứng (`react-signature-canvas`).
  * Khách hàng dùng ngón tay ký xác nhận đã nghiệm thu máy chạy tốt trên màn hình điện thoại của thợ.
  * Chữ ký được lưu vào đơn hàng làm bằng chứng hoàn thành minh bạch.

### 1.5. Checklist kỹ thuật chuẩn hóa
* **Thực trạng:** Ghi chú kỹ thuật nhập văn bản tự do, dễ sót quy trình kiểm tra an toàn.
* **Giải pháp:**
  * Cung cấp danh sách tích chọn nhanh tùy loại dịch vụ:
    * *Bảo dưỡng máy lạnh:* [x] Rửa dàn lạnh [x] Xịt rửa dàn nóng [x] Thông đường ống nước xả [x] Đo áp suất gas PSI [x] Đo dòng điện Ampe [x] Vệ sinh lồng sóc.
    * *Sửa chữa:* [x] Thay tụ [x] Nạp gas bổ sung [x] Hàn xì ống đồng [x] Kiểm tra rơ le.

### 1.6. Xem lịch làm việc trực quan (Timeline/Calendar View)
* **Thực trạng:** Thợ xem danh sách đơn phẳng theo thẻ, khó hình dung thứ tự và thời gian các ca trong ngày.
* **Giải pháp:**
  * Cung cấp chế độ xem Lịch làm việc trong ngày: Phân bổ theo khung giờ sáng/chiều/tối, giúp thợ căn thời gian di chuyển hợp lý.

---

## 2. DÀNH CHO KHÁCH HÀNG

Khách hàng cần sự minh bạch, tiện lợi và không muốn gặp rào cản thao tác phức tạp:

### 2.1. Tra cứu đơn dịch vụ & Bảo hành không cần đăng nhập (Public Tracking)
* **Thực trạng:** Chỉ khách có tài khoản và đăng nhập mới xem được đơn hàng. Khách gọi điện vãng lai hoặc người lớn tuổi không tạo tài khoản thì không theo dõi được.
* **Giải pháp:**
  * Tạo trang công khai: `/tra-cuu` (hoặc tra cứu nhanh trên trang chủ).
  * Khách chỉ cần nhập: **Số điện thoại** hoặc **Mã đơn hàng** (ví dụ `DH-2026-0045`).
  * Hiển thị: Trạng thái tiếp nhận, tên thợ phụ trách, thời gian hẹn, chi phí dự kiến, link hóa đơn/phiếu bảo hành.

### 2.2. Đặt lịch thông minh & Đính kèm đa phương tiện
* **Thực trạng:** Form đặt lịch hiện tại mới chỉ có chọn dịch vụ và gõ địa chỉ + mô tả chữ.
* **Giải pháp:**
  * Thêm chọn hãng thiết bị (Daikin, Panasonic, Casper, Toshiba, LG, Funiki...).
  * Thêm chọn loại máy (Treo tường, Âm trần cassette, Áp trần, Tủ đứng).
  * Thêm chọn khung giờ hẹn mong muốn: Sáng (8:00 - 11:30), Chiều (13:30 - 17:00), Tối (17:30 - 20:00).
  * Cho phép tải lên ảnh/video ngắn mô tả lỗi (tiếng kêu, mã lỗi nhấp nháy đèn trên dàn lạnh...).

### 2.3. Sổ Bảo Hành Điện Tử & Nhắc lịch bảo dưỡng định kỳ
* **Thực trạng:** Bảo hành hiện tại chỉ thỏa thuận bằng miệng hoặc ghi giấy dễ rách/mất.
* **Giải pháp:**
  * Hệ thống tự động tạo **Thẻ bảo hành điện tử** gắn liền với Số điện thoại khách hàng và Seri thiết bị.
  * Khách dễ dàng mở ra xem thời hạn bảo hành linh kiện (ví dụ: bảo hành lốc 12 tháng, bảo hành nạp gas 6 tháng).
  * **Hệ thống tự động nhắc bảo dưỡng:** Sau 3 - 6 tháng kể từ ngày vệ sinh/bảo dưỡng gần nhất, hệ thống tự động gửi tin nhắn/thông báo nhắc khách đặt lịch vệ sinh đón mùa nắng nóng.

### 2.4. Đánh giá dịch vụ & Chấm điểm Thợ (Rating & Review)
* **Thực trạng:** Khách chưa có kênh phản hồi chất lượng phục vụ sau khi thợ làm xong.
* **Giải pháp:**
  * Sau khi đơn chuyển trạng thái `COMPLETED`, giao diện khách hàng hiển thị popup/form đánh giá 1-5 sao ⭐⭐⭐⭐⭐.
  * Thu thập phản hồi về: Thái độ phục vụ, tay nghề, tính đúng giờ, sự sạch sẽ sau khi thi công.
  * Điểm đánh giá được đồng bộ về hồ sơ thợ để làm căn cứ khen thưởng/phạt trong kỳ tính lương.

### 2.5. Tự động gửi thông báo qua Zalo ZNS / SMS
* **Giải pháp:**
  * Bắn thông báo Zalo ZNS tự động theo các mốc sự kiện:
    1. Tiếp nhận đơn thành công.
    2. Thợ đang trên đường tới (kèm tên và SĐT thợ).
    3. Xác nhận hoàn tất & gửi link hóa đơn, phiếu bảo hành.

---

## 3. DÀNH CHO QUẢN TRỊ VIÊN / ĐIỀU PHỐI (ADMIN / STAFF / BOSS)

Chủ cửa hàng và nhân viên điều phối cần công cụ giám sát tổng thể, kiểm soát dòng tiền, xuất kho và nhân sự:

### 3.1. In Phiếu Dịch Vụ, Hóa Đơn & Tem Bảo Hành (PDF / In Nhiệt)
* **Thực trạng:** Chưa có công cụ xuất/in tài liệu chuyên nghiệp gửi khách hàng.
* **Giải pháp:**
  * Tạo tính năng in 1 chạm:
    * **Phiếu biên nhận & báo giá:** Đầy đủ logo Điện Lạnh Hồng Thái, thông tin khách, chi tiết linh kiện vật tư, tiền công, cam kết bảo hành.
    * Hỗ trợ định dạng in A4/A5 và in nhiệt khổ 80mm (máy in hóa đơn cầm tay).

### 3.2. Tự động đối soát thanh toán (Webhook Ngân Hàng / VietQR Pro)
* **Thực trạng:** Khách quét mã VietQR xong bấm nút "Đã thanh toán" là cập nhật trạng thái ở frontend (chưa kiểm tra tài khoản ngân hàng thực tế).
* **Giải pháp:**
  * Tích hợp Webhook biến động số dư tài khoản ngân hàng (qua giải pháp như Casso / PayOS / SeABank / MBBank Open API).
  * Khi khách chuyển khoản đúng cú pháp mã đơn `DH-2026-XXXX`:
    * Hệ thống tự động bắt webhook.
    * Đổi trạng thái đơn thành `PAID` và cập nhật số tiền `paid_amount` chính xác mà không cần kế toán/chủ quán phải mở app ngân hàng kiểm tra thủ công.

### 3.3. Quy trình duyệt Báo giá & Chiết khấu (Approval Workflow)
* **Thực trạng:** Thợ báo giá trực tiếp cho khách, khó kiểm soát việc thợ báo giá quá cao hoặc tự ý giảm giá.
* **Giải pháp:**
  * Cài đặt định mức: Báo giá trên ngưỡng quy định (ví dụ > 2.000.000đ) hoặc đơn có áp dụng mã giảm giá/chiết khấu đặc biệt phải gửi yêu cầu phê duyệt về Admin/Boss trên hệ thống trước khi gửi cho khách.

### 3.4. Xuất Báo Cáo Tài Chính & Kho ra Excel
* **Thực trạng:** Dữ liệu mới chỉ xem trên Dashboard trực quan, chưa trích xuất được để lưu trữ kế toán.
* **Giải pháp:**
  * Bổ sung nút **"Xuất Excel"** cho các trang:
    * Báo cáo doanh thu theo thợ, theo dịch vụ, theo mốc thời gian.
    * Sổ theo dõi công nợ khách hàng (Customer Debts).
    * Báo cáo nhập - xuất - tồn kho vật tư (Inventory Movement).
    * Bảng tổng hợp lương nhân sự theo tháng.

### 3.5. Nhật ký thao tác đơn hàng (Audit Trail / Activity Log)
* **Thực trạng:** Chưa lưu lại lịch sử chi tiết ai đã chỉnh sửa giá, phân công lại thợ hoặc hủy đơn.
* **Giải pháp:**
  * Ghi lại nhật ký: `[Thời gian] - [Người thực hiện] - [Hành động]` (ví dụ: *14:20 19/10/2026: Admin Nguyễn Văn A đã gán thợ Trần Văn B; 15:00 Thợ B cập nhật báo giá 450.000đ*).

---

## 4. NỀN TẢNG KỸ THUẬT & TRẢI NGHIỆM TỔNG THỂ

### 4.1. Cài đặt Ứng dụng Web di động (PWA - Progressive Web App)
* Biến website thành App cài trực tiếp lên màn hình chính điện thoại của Thợ và Khách hàng mà không cần đưa lên Google Play / App Store.
* Tải trang siêu tốc, có icon nhận diện thương hiệu Điện Lạnh Hồng Thái, hỗ trợ thông báo đẩy (Web Push Notifications).

### 4.2. Trang chủ giới thiệu dịch vụ (Public Landing Page)
* Xây dựng trang chủ công khai cho khách hàng vãng lai truy cập:
  * Giới thiệu các dịch vụ uy tín (Sửa máy lạnh, Vệ sinh máy giặt, Tủ lạnh, Lắp đặt kho lạnh...).
  * Bảng giá dịch vụ niêm yết công khai tạo sự an tâm.
  * Nút Gọi Hotline khẩn cấp 24/7 & Nút Đặt lịch hẹn nhanh ngay trên trang chủ.
  * Khu vực tra cứu tình trạng đơn và kích hoạt bảo hành.

---

## 📊 LỘ TRÌNH TRIỂN KHAI THEO MỨC ĐỘ ƯU TIÊN

```
┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1: CÔNG CỤ HIỆN TRƯỜNG CHO THỢ & IN ẤN (Hoàn thành 100% ✅)  │
├────────────────────────────────────────────────────────────────────────┤
│ [x] 1. Bản đồ Goong Map & Gọi điện / Zalo 1 chạm cho Thợ               │
│ [x] 2. Chụp ảnh nghiệm thu Trước/Sau (Before/After) + Upload ảnh đơn   │
│ [x] 3. Chữ ký điện tử nghiệm thu trên màn hình của Thợ (HTML5 Canvas)  │
│ [x] 4. Xuất hóa đơn / Phiếu bảo hành ra định dạng In / PDF             │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2: TỐI ƯU TRẢI NGHIỆM KHÁCH HÀNG & BÁO CÁO (Đang thực hiện)  │
├────────────────────────────────────────────────────────────────────────┤
│ [x] 1. Trang tra cứu đơn công khai không cần đăng nhập (/tra-cuu)      │
│ [x] 2. Đánh giá 1 - 5 sao và nhận xét thợ sau khi hoàn thành           │
│ [x] 3. Landing Page giới thiệu dịch vụ & Đặt lịch nhanh 30 giây        │
│ [ ] 4. Xuất dữ liệu Báo cáo & Lương ra file Excel                       │
└────────────────────────────────────────────────────────────────────────┘

                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 3: TỰ ĐỘNG HÓA VẬN HÀNH & NỀN TẢNG PWA                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Webhook đối soát chuyển khoản VietQR tự động (Khớp tiền tức thì)    │
│ 2. PWA (Cài đặt ứng dụng lên màn hình chính điện thoại)                │
│ 3. Sổ bảo hành điện tử & Tin nhắn nhắc bảo dưỡng định kỳ tự động       │
└────────────────────────────────────────────────────────────────────────┘

```
