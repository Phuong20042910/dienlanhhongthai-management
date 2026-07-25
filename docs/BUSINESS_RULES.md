# ⚖️ Tài Liệu Business Rules (Quy Tắc Nghiệp Vụ)

**Dự án:** Điện Lạnh Hồng Thái – Hệ Thống Quản Lý Nội Bộ  
**Phiên bản:** 1.2.0  
**Ngày cập nhật:** 2026-07-15  

> Tài liệu này mô tả các quy tắc nghiệp vụ cụ thể, phản ánh đúng cách cửa hàng **Điện Lạnh Hồng Thái** vận hành thực tế.

---

## 📋 Mục lục

1. [BR-01: Loại Dịch Vụ](#br-01-loại-dịch-vụ)
2. [BR-02: Đơn Công Việc](#br-02-đơn-công-việc)
3. [BR-03: Phân Công Thợ](#br-03-phân-công-thợ)
4. [BR-04: Trạng Thái & Vòng Đời Đơn](#br-04-trạng-thái--vòng-đời-đơn)
5. [BR-05: Khách Hàng](#br-05-khách-hàng)
6. [BR-06: Quản Lý Thợ](#br-06-quản-lý-thợ)
7. [BR-07: Thống Kê & Báo Cáo](#br-07-thống-kê--báo-cáo)
8. [BR-08: Tài Khoản](#br-08-tài-khoản)
9. [BR-09: Nghỉ Phép & Vắng Mặt](#br-09-nghỉ-phép--vắng-mặt)
10. [BR-10: Chấm Công & Tiền Lương](#br-10-chấm-công--tiền-lương)

---

## BR-01: Loại Dịch Vụ

### BR-01-01 – Danh sách loại dịch vụ chuẩn

Hệ thống hỗ trợ đúng **8 loại dịch vụ** chia thành 3 nhóm:

```
NHÓM SỬA CHỮA (REPAIR):
  ├── SC_MAY_LANH      → Sửa chữa máy lạnh
  ├── SC_MAY_GIAT      → Sửa chữa máy giặt
  ├── SC_TU_LANH       → Sửa chữa tủ lạnh
  └── SC_MAY_NUOC_NONG → Sửa chữa máy nước nóng

NHÓM VỆ SINH (CLEANING):
  ├── VS_MAY_LANH      → Vệ sinh máy lạnh
  └── VS_MAY_GIAT      → Vệ sinh máy giặt

NHÓM GIAO HÀNG (DELIVERY):
  ├── GH_TU_LANH       → Chở / giao tủ lạnh đã bán cho khách
  └── GH_MAY_GIAT      → Chở / giao máy giặt đã bán cho khách
```

---

### BR-01-02 – Yêu cầu riêng theo nhóm dịch vụ

#### Nhóm Sửa chữa

```
Quy tắc: Mỗi đơn sửa chữa chỉ phân công 1 thợ chính.
Quy tắc: Mô tả sự cố là trường tùy chọn nhưng nên được nhập 
         để thợ biết trước khi đến.
Ví dụ ghi chú hữu ích: "Máy lạnh không mát, bật lên kêu to"
                        "Máy giặt không vắt được"
```

#### Nhóm Vệ sinh

```
Quy tắc: Đơn vệ sinh máy lạnh phải ghi số lượng máy cần vệ sinh 
         (ví dụ: 2 máy, 3 máy...).
Quy tắc: Số lượng máy vệ sinh ≥ 1 và ≤ 20.
Quy tắc: Thời gian ước tính = số_lượng_máy × 45 phút (hiển thị gợi ý, 
         không bắt buộc).
Quy tắc: Đơn vệ sinh không cần mô tả sự cố – chỉ cần địa chỉ và ngày hẹn.
```

#### Nhóm Giao hàng

```
Quy tắc: Đơn giao hàng cho phép phân công 2 thợ (thợ phụ không bắt buộc).
Quy tắc: Phải ghi thông tin hàng cần giao: tên sản phẩm, số lượng.
         Ví dụ: "Tủ lạnh Samsung 300L - 1 cái"
Quy tắc: Đơn giao hàng phải ghi địa chỉ giao hàng cụ thể (khác địa chỉ 
         có thể là địa chỉ kho / cửa hàng).
Quy tắc: Không cần ghi mô tả sự cố cho đơn giao hàng.
Quy tắc: Khi lọc đơn, đơn giao hàng được tách thành nhóm riêng để 
         quản lý xe và lịch trình vận chuyển.
```

---

### BR-01-03 – Bổ sung loại dịch vụ mới

```
Quy tắc: Chỉ ADMIN mới được thêm / sửa / ẩn loại dịch vụ.
Quy tắc: Không được xóa loại dịch vụ đã có đơn hàng đang dùng 
         (chỉ được ẩn để không chọn mới).
Quy tắc: Loại dịch vụ mới phải thuộc 1 trong 3 nhóm: REPAIR, CLEANING, DELIVERY.
```

---

## BR-02: Đơn Công Việc

### BR-02-01 – Mã đơn công việc

```
Quy tắc: Mã đơn tự động sinh theo định dạng: DH-{YYYY}-{NNNN}
  - YYYY: năm hiện tại
  - NNNN: số thứ tự tăng dần từ 0001, reset mỗi đầu năm
  - Ví dụ: DH-2026-0001, DH-2026-0002

Quy tắc: Mã đơn là duy nhất và không thể thay đổi sau khi tạo.
Quy tắc: Mã đơn được dùng để tra cứu nhanh khi khách gọi lại.
```

---

### BR-02-02 – Thông tin bắt buộc khi tạo đơn

```
BẮT BUỘC (không thể tạo đơn nếu thiếu):
  ✅ Số điện thoại khách (10 chữ số)
  ✅ Tên khách
  ✅ Địa chỉ đến làm (số nhà, tên đường, phường/xã, quận/huyện)
  ✅ Loại dịch vụ (chọn từ danh sách)
  ✅ Ngày hẹn

TÙY CHỌN:
  ○ Giờ hẹn (nếu không rõ, ghi "sáng" / "chiều" / "tối")
  ○ Ghi chú / mô tả sự cố
  ○ Mức ưu tiên (mặc định: Bình thường)
  ○ Phân công thợ ngay (có thể phân công sau)
```

---

### BR-02-03 – Ngày giờ hẹn

```
Quy tắc: Ngày hẹn không được là ngày đã qua (phải >= hôm nay).
Quy tắc: Ngày hẹn không được quá 60 ngày kể từ ngày tạo đơn.
Quy tắc: Nếu không biết giờ cụ thể, chọn khung giờ:
         - Sáng (07:00 – 12:00)
         - Chiều (13:00 – 17:00)
         - Tối (18:00 – 21:00)
Quy tắc: Đơn ưu tiên GẤP phải có ngày hẹn trong vòng 24 giờ.
```

---

### BR-02-04 – Sửa / Hủy đơn

```
AI ĐƯỢC SỬA:
  - BOSS (Chủ cửa hàng): sửa bất kỳ đơn nào, bất kỳ trạng thái nào (trừ HOÀN THÀNH và HỦY)

AI ĐƯỢC HỦY:
  - BOSS (Chủ cửa hàng): hủy bất kỳ đơn nào chưa HOÀN THÀNH

BẮT BUỘC khi hủy:
  - Phải chọn lý do hủy (từ danh sách):
    * Khách hủy lịch
    * Khách không nghe máy / không liên lạc được
    * Không có thợ phù hợp
    * Lý do khác (kèm ghi chú)

Quy tắc: Đơn đã HOÀN THÀNH không thể hủy, chỉ CHỦ mới có thể 
         đánh dấu lại là có vấn đề.
```

---

### BR-02-05 – Dời lịch (Reschedule)

> **Tình huống thực tế:** Thợ đến nhà khách nhưng khách bận, không có nhà, hoặc muốn hẹn lại ngày khác.

```
AI ĐƯỢC DỜI LỊCH:
  - THỢ (TECHNICIAN): dời lịch đơn được phân công cho mình 
                (khi đang ở trạng thái ĐANG ĐI hoặc ĐANG LÀM)
  - BOSS (Chủ cửa hàng): dời lịch bất kỳ đơn nào chưa HOÀN THÀNH
                   (ví dụ khi khách gọi điện về cửa hàng xin đổi lịch)

QUY TRÌNH DỜI LỊCH:
  Bước 1: Thợ bấm "Dời lịch" trên điện thoại
  Bước 2: Chọn lý do dời lịch (bắt buộc):
            * Khách không có nhà / ra ngoài
            * Khách bận, hẹn lại
            * Khách yêu cầu đổi giờ
            * Lý do khác (nhập tự do)
  Bước 3: Nhập ngày hẹn mới (bắt buộc)
  Bước 4: Nhập giờ hoặc khung giờ mới
  Bước 5: Nhập ghi chú thêm (tùy chọn, ví dụ: "Khách nhờ gọi trước 30 phút")
  Bước 6: Xác nhận → đơn tự động chuyển sang trạng thái DỜI_LỊCH

Quy tắc: Ngày hẹn mới phải sau ngày hiện tại.
Quy tắc: Đơn dời lịch vẫn GIỮ NGUYÊN mã đơn cũ (DH-XXXX), 
         không tạo đơn mới (để tiện tra lịch sử).
Quy tắc: Lịch sử dời lịch được ghi lại đầy đủ: ai dời, lúc mấy giờ, 
         lý do, ngày hẹn cũ → ngày hẹn mới.
Quy tắc: Sau khi dời lịch, thợ vẫn được giữ phân công cho đơn đó
         (không cần phân công lại, trừ khi CHỦ muốn đổi thợ).
Quy tắc: Đơn DỜI_LỊCH hiển thị badge "Đã dời X lần" nếu dời nhiều hơn 1 lần.
Cảnh báo: Nếu 1 đơn bị dời lịch ≥ 3 lần, hệ thống cảnh báo CHỦ 
          để liên hệ lại khách và xem xét có tiếp tục không.
```

---

### BR-02-06 – Ghi chú của thợ (Technician Notes)

> **Mục đích:** Thợ có thể ghi lại thông tin hữu ích tại chỗ để cửa hàng biết, và để tham khảo lần sau.

```
KHI NÀO THỢ ĐƯỢC GHI CHÚ:
  ✅ Bất kỳ lúc nào khi đơn đang ở trạng thái ĐANG ĐI / ĐANG LÀM
  ✅ Khi báo kết quả hoàn thành đơn
  ✅ Khi dời lịch

Các loại ghi chú thợ hay dùng (gợi ý, không bắt buộc chọn từ danh sách):
  - "Thiếu phụ tùng [tên phụ tùng], cần đặt trước khi quay lại"
  - "Máy bị [mô tả sự cố thực tế]"
  - "Khách nhờ gọi điện báo trước 30 phút khi đến"
  - "Địa chỉ khó tìm: [mô tả thêm cách đi]"
  - "Cần mang thêm [dụng cụ / vật tư] khi quay lại"

Quy tắc: Ghi chú của thợ KHÔNG CÓ giới hạn ký tự tối thiểu (có thể để trống).
Quy tắc: Giới hạn tối đa: 1000 ký tự / lần ghi chú.
Quy tắc: Thợ có thể ghi nhiều ghi chú cho 1 đơn (mỗi lần thêm = 1 entry riêng).
Quy tắc: Ghi chú của thợ hiển thị rõ ràng cho CHỦ trên trang chi tiết đơn.
Quy tắc: Thợ chỉ xem được ghi chú của đơn mình được phân công, 
         không xem ghi chú đơn của thợ khác.
Quy tắc: Thợ KHÔNG được sửa / xóa ghi chú đã lưu (chỉ thêm mới).
         Lý do: đảm bảo tính minh bạch và không bị sửa lại sau sự kiện.
Quy tắc: CHỦ có thể xóa ghi chú sai nội dung.
```

---

### BR-02-07 – Báo cáo kết quả và Hoàn thành đơn

```
Quy tắc: Khi thợ hoàn thành đơn, phải chọn 1 trong các kết quả:
  ✅ Đã làm xong hoàn toàn
  ⚠️ Làm được một phần – cần quay lại lần sau
  ❌ Không làm được – cần kỹ thuật / phụ tùng khác
  🔄 Khách yêu cầu dời lịch (→ chuyển sang luồng Dời lịch BR-02-05)

Quy tắc: Nếu thợ có sử dụng vật tư (từ kho hoặc tự mua ngoài), thợ PHẢI 
         thêm vật tư đó vào phiếu thanh toán của đơn hàng (xem BR-11, BR-12).
Quy tắc: Thợ bắt buộc phải chọn Hình thức thanh toán (Tiền mặt / Chuyển khoản QR Boss) 
         khi thu tiền của khách.
Quy tắc: Nếu kết quả là "Không làm được" hoặc "Làm được một phần",
         bắt buộc nhập ghi chú lý do. (Có thể thu "Phí kiểm tra" nếu có).
Quy tắc: Khi chọn kết quả "Dời lịch" → hệ thống tự chuyển sang màn hình 
         nhập ngày hẹn mới (luồng BR-02-05).
Quy tắc: Thợ có thể chụp ảnh đính kèm khi hoàn thành (tùy chọn, tối đa 5 ảnh).
Quy tắc: Sau khi thợ bấm Hoàn thành, đơn chuyển sang HOÀN THÀNH và 
         thợ KHÔNG thể sửa lại kết quả (chỉ BOSS được điều chỉnh).
```

---

## BR-03: Phân Công Thợ

### BR-03-01 – Quy tắc phân công cơ bản

```
Quy tắc: Một đơn hàng bất kỳ có thể được phân công cho:
  - 1 Thợ chính (bắt buộc)
  - 1 Thợ phụ (tùy chọn, đi theo phụ việc hoặc bê vác)
Quy tắc: Không phân công 2 thợ chính cho cùng một đơn (tránh lãng phí nhân sự).
Quy tắc: Chỉ phân công thợ đang HOẠT ĐỘNG (không nghỉ phép, không nghỉ việc).
Quy tắc: Không được phân công thợ vào đơn có giờ bị TRÙNG với đơn khác 
         đã phân công cho cùng thợ đó.
```

---

### BR-03-02 – Cảnh báo lịch trùng

```
Quy tắc: Trước khi xác nhận phân công, hệ thống kiểm tra lịch của thợ.

  CÙNG NGÀY CÙNG GIỜ → Chặn, không cho phân công:
    "Thợ [Tên] đã có đơn DH-XXXX lúc [giờ] ngày này."

  CÙNG NGÀY, GIỜ LIỀN KỀ (trong vòng 1 tiếng) → Cảnh báo, cho phép bỏ qua:
    "Thợ [Tên] có đơn khác cách 45 phút. Bạn có chắc muốn phân công không?"

  KHÁC NGÀY → Không cần kiểm tra.
```

---

### BR-03-03 – Phân công phù hợp theo loại dịch vụ

```
Quy tắc: Hệ thống ưu tiên hiển thị thợ có kỹ năng phù hợp:
  - Sửa máy lạnh → ưu tiên thợ có kỹ năng "Máy lạnh"
  - Sửa máy giặt → ưu tiên thợ có kỹ năng "Máy giặt"
  - Sửa tủ lạnh → ưu tiên thợ có kỹ năng "Tủ lạnh"
  - Sửa máy nước nóng → ưu tiên thợ có kỹ năng "Máy nước nóng"
  - Vệ sinh → ưu tiên thợ có kỹ năng "Vệ sinh"
  - Giao hàng → tất cả thợ đều có thể, ưu tiên theo lịch rảnh

Quy tắc: Thợ không có kỹ năng phù hợp vẫn hiển thị nhưng ở cuối danh sách,
         kèm cảnh báo "Thợ này chưa được đánh dấu kỹ năng phù hợp".

Quy tắc: BOSS vẫn có thể phân công bất kỳ thợ nào bất kể kỹ năng.
```

---

### BR-03-04 – Thay đổi phân công

```
Quy tắc: Có thể thay thợ khi đơn chưa sang trạng thái ĐANG LÀM.
Quy tắc: Khi thay thợ: thợ cũ nhận thông báo "Đơn DH-XXXX đã được chuyển cho thợ khác".
Quy tắc: Khi thay thợ: thợ mới nhận thông báo "Bạn được phân công đơn DH-XXXX".
Quy tắc: Không thể thay thợ khi đơn đang trạng thái ĐANG LÀM hoặc HOÀN THÀNH,
         trừ BOSS.
```

---

## BR-04: Trạng Thái & Vòng Đời Đơn

### BR-04-01 – Các trạng thái

| Trạng thái | Mã | Mô tả | Ai có thể chuyển |
|-----------|-----|-------|-----------------|
| Tiếp nhận | `RECEIVED` | Đơn vừa được tạo, chưa phân công thợ | Hệ thống (tự động) |
| Đã phân công | `ASSIGNED` | Đã có thợ, chờ đến ngày hẹn | BOSS, STAFF |
| Đang đi | `EN_ROUTE` | Thợ đang trên đường đến nhà khách | TECHNICIAN, BOSS, STAFF |
| Đang làm | `IN_PROGRESS` | Thợ đang tại nhà khách thực hiện | TECHNICIAN, BOSS, STAFF |
| **Dời lịch** | **`RESCHEDULED`** | **Khách bận / yêu cầu hẹn lại ngày khác** | **TECHNICIAN, BOSS, STAFF** |
| Hoàn thành | `COMPLETED` | Đã làm xong | TECHNICIAN, BOSS, STAFF |
| Hủy | `CANCELLED` | Đơn bị hủy hoàn toàn | BOSS, STAFF (giới hạn) |

---

### BR-04-02 – Sơ đồ chuyển trạng thái

```
                    Tạo đơn
                       │
                       ▼
              ┌─── TIẾP NHẬN ─────────────────────┐
              │    (RECEIVED)                      │
              │         │                          │
              │    Phân công thợ                   │
              │         │                          │
              │         ▼                          │
              │   ĐÃ PHÂN CÔNG ───────────────────┤
              │    (ASSIGNED)           ▲          │
              │         │               │          │ HỦY
              │    Thợ bắt đầu đi       │ Dời      │ (CANCELLED)
              │         │               │ lịch xong│
              │         ▼               │          │
              │    ĐANG ĐI ────────────►│          │
              │   (EN_ROUTE)    │       │          │
              │         │       │ Khách bận        │
              │    Thợ đến nơi  │       │          │
              │         │       ▼       │          │
              │         ▼   DỜI LỊCH ──┘          │
              │    ĐANG LÀM (RESCHEDULED)          │
              │  (IN_PROGRESS)  │                  │
              │         │       │ Khách bận        │
              │    Làm xong     ▼       ▲          │
              │         │   DỜI LỊCH ──┘          │
              │         ▼                          │
              └──► HOÀN THÀNH ◄───────────────────┘
                  (COMPLETED)

  ⚠️ Từ ĐANG LÀM → HỦY: Chỉ BOSS mới được làm
  ⚠️ Từ HOÀN THÀNH → không thể đi đâu
  ⚠️ DỜI LỊCH không phải trạng thái kết thúc: sau khi dời,
     đơn tự động quay về ĐÃ PHÂN CÔNG với ngày hẹn mới
```

---

### BR-04-03 – Quy tắc tự động

```
Quy tắc: Khi phân công thợ cho đơn TIẾP NHẬN → tự động chuyển sang ĐÃ PHÂN CÔNG.
Quy tắc: Khi hủy phân công (bỏ thợ) của đơn ĐÃ PHÂN CÔNG → tự động trả về TIẾP NHẬN.
Quy tắc: Khi thợ xác nhận dời lịch → đơn tự động chuyển sang DỜI_LỊCH,
         lưu ngày hẹn mới + lý do + ghi chú, sau đó tự chuyển về ĐÃ_PHÂN_CÔNG.
Quy tắc: Thời gian chuyển trạng thái được lưu lại chính xác (timestamp).
Quy tắc: Không có giới hạn số lần dời lịch, nhưng cảnh báo BOSS khi >= 3 lần.
```




### BR-04-04 – Mức độ ưu tiên

| Mức | Màu | Khi nào dùng |
|-----|-----|-------------|
| **Bình thường** | Xanh lá | Các đơn thông thường |
| **Gấp** | Đỏ | Máy hỏng gấp, khách không có thiết bị dùng |

```
Quy tắc: Đơn "Gấp" phải nổi bật trên dashboard và danh sách.
Quy tắc: Đơn "Gấp" chưa được phân công sau 1 giờ → cảnh báo cho BOSS/STAFF.
```

---

## BR-05: Khách Hàng

### BR-05-01 – Nhận dạng khách hàng

```
Quy tắc: Số điện thoại là định danh duy nhất của khách hàng.
Quy tắc: Khi tạo đơn mới, nhập SĐT → hệ thống tự tìm khách đã có:
  - Nếu có: tự điền tên và địa chỉ lần trước vào form (người dùng có thể sửa lại).
  - Nếu chưa có: tạo hồ sơ khách mới khi lưu đơn.

Quy tắc: Không được tạo 2 khách hàng có cùng số điện thoại.
Quy tắc: Nếu phát hiện trùng SĐT, hệ thống hỏi: 
         "SĐT này đã có khách [Tên]. Bạn có muốn dùng thông tin này không?"
```

---

### BR-05-02 – Địa chỉ của khách

```
Quy tắc: Một khách hàng có thể có nhiều địa chỉ khác nhau.
         (Ví dụ: khách có nhà riêng và nhà cho thuê, đều cần dùng dịch vụ)
Quy tắc: Khi tạo đơn mới, nếu khách đã biết → hiển thị dropdown chọn 
         địa chỉ đã dùng trước đó hoặc nhập địa chỉ mới.
Quy tắc: Địa chỉ mới nhập được lưu vào hồ sơ khách để dùng lần sau.
```

---

### BR-05-03 – Lịch sử khách hàng

```
Quy tắc: Xem được toàn bộ lịch sử đơn hàng của khách (sắp xếp mới nhất lên đầu).
Quy tắc: Thống kê tự động hiển thị: tổng số lần gọi dịch vụ, loại dịch vụ hay dùng nhất.
Quy tắc: Không được xóa khách hàng đã có đơn. Chỉ được ẩn hồ sơ.
```

---

## BR-06: Quản Lý Thợ

### BR-06-01 – Thông tin thợ

```
Thông tin bắt buộc khi thêm thợ:
  ✅ Họ tên
  ✅ Số điện thoại
  ✅ Cấp bậc (Thợ chính / Thợ phụ)
  ✅ Kỹ năng / loại công việc có thể làm (chọn nhiều)

Tùy chọn:
  ○ Email (để tạo tài khoản đăng nhập)
  ○ Địa chỉ nhà
  ○ Ghi chú nội bộ
```

---

### BR-06-02 – Trạng thái thợ

```
Trạng thái:
  ACTIVE      → Đang làm việc, nhận đơn bình thường
  ON_LEAVE    → Đang nghỉ phép được chủ duyệt (có ngày bắt đầu – kết thúc)
  INACTIVE    → Đã nghỉ việc

Quy tắc: Chỉ thợ ACTIVE mới được phân công đơn mới.
Quy tắc: Thợ ON_LEAVE không nhận đơn mới, nếu có đơn đã phân công 
         nhưng chưa làm → Cảnh báo chủ để chuyển cho thợ khác.
Quy tắc: Thợ INACTIVE không thể đăng nhập hệ thống.
Quy tắc: Không được xóa thợ có lịch sử đơn hàng, chỉ được chuyển sang INACTIVE.
```

---

### BR-06-03 – Kỹ năng của thợ

```
Danh sách kỹ năng chuẩn:
  □ Sửa máy lạnh
  □ Sửa máy giặt
  □ Sửa tủ lạnh
  □ Sửa máy nước nóng
  □ Vệ sinh máy lạnh
  □ Vệ sinh máy giặt
  □ Giao hàng / vận chuyển

Quy tắc: Một thợ có thể có nhiều kỹ năng.
Quy tắc: Kỹ năng chỉ dùng để gợi ý khi phân công, không bắt buộc phải khớp.
```

---

### BR-06-04 – Thống kê thợ

```
Quy tắc: Mỗi tháng, hệ thống tính cho từng thợ:
  - Tổng số đơn đã hoàn thành
  - Số đơn theo từng loại dịch vụ
  - Số đơn "Không làm được"
  - Số đơn hủy sau khi đã phân công
  - Số ngày nghỉ phép trong tháng

Quy tắc: Dữ liệu này chỉ CHỦ xem được, thợ không thấy số liệu của người khác.
```

---

### BR-06-05 – Quy trình xin nghỉ phép

> **Tình huống thực tế:** Thợ muốn xin nghỉ (nghỉ ốm, việc riêng, nghỉ phép...). Chủ cần biết trước để sắp xếp lại công việc.
> **Lưu ý quan trọng:** Toàn bộ quy trình xin nghỉ phép, báo nghỉ khẩn, và xử lý vi phạm nghỉ không phép được áp dụng chung cho **TẤT CẢ** các cấp bậc (cả Thợ chính và Thợ phụ). Dù là thợ phụ học việc cũng bắt buộc phải tuân thủ kỷ luật làm việc và không được tự ý nghỉ.

#### Các loại nghỉ

| Loại | Mã | Mô tả | Cần duyệt |
|------|-----|-------|----------|
| Nghỉ phép | `ANNUAL` | Nghỉ phép thường niên | ✅ Cần duyệt |
| Nghỉ ốm | `SICK` | Nghỉ do bệnh / ốm đau | ⚠️ Duyệt sau |
| Việc riêng | `PERSONAL` | Việc gia đình, việc của bản thân | ✅ Cần duyệt |
| Nghỉ đột xuất | `EMERGENCY` | Sự cố khẩn cấp, báo gấp | ⚠️ Duyệt sau |

#### Quy trình: Thợ xin nghỉ trước

```
Bước 1: Thợ vào app → bấm "Xin nghỉ"
Bước 2: Chọn loại nghỉ (nghỉ phép / việc riêng / ốm...)
Bước 3: Chọn ngày bắt đầu và ngày kết thúc nghỉ
Bước 4: Nhập lý do (tùy chọn, tối đa 200 ký tự)
Bước 5: Gửi đơn → CHỦ nhận thông báo ngay

CHỦ xem và dứt khoát:
  ✅ DUYỆT → Thợ nhận thông báo "Nghỉ của bạn đã được chấp thuận"
               Trạng thái thợ tự động được cập nhật sang ON_LEAVE
               theo đúng thời gian xin nghỉ.
  ❌ TỪ CHỐI → Thợ nhận thông báo kèm lý do từ chối (nếu có).
```

#### Quy trình: Thợ báo nghỉ đột xuất (nghỉ ốm, sự cố khẩn)

```
Bước 1: Thợ bấm "Báo nghỉ khẩn" trên app
Bước 2: Chọn lý do: Ốm đau / Sự cố gia đình / Lý do khác
Bước 3: Chọn ngày nghỉ (có thể chỉ 1 buổi)
Bước 4: Gửi → CHỦ nhận cảnh báo ngay lập tức

Hệ thống tự động:
  - Trạng thái thợ tạm thời đánh dấu ON_LEAVE cho ngày đó
  - Liệt kê tất cả đơn đã phân công cho thợ trong ngày nghỉ
  - Cảnh báo CHỦ: "Thợ [Tên] báo nghỉ. Có [X] đơn cần sắp xếp lại"
  - Hiển thị danh sách đơn cần phân công lại, được sắp xếp theo giờ hẹn
```

#### Quy tắc xử lý khi thợ nghỉ

```
Quy tắc: Nếu thợ ON_LEAVE có đơn đã phân công mà chưa thực hiện:
         → Hệ thống KHÔNG tự động chuyển thợ (tránh nhầm lẫn).
         → CHỦ phải tự tay phân công lại cho thợ khác.
         → Hệ thống chỉ LIỆT KÊ rõ những đơn cần xử lý.

Quy tắc: Thợ ON_LEAVE vẫn đăng nhập được (xem lịch sử của mình),
         nhưng không thể cập nhật trạng thái đơn.

Quy tắc: Sau ngày kết thúc nghỉ, trạng thái tự động đổi về ACTIVE.
         (Trừ khi CHỦ điều chỉnh thủ công)

Quy tắc: CHỦ có thể tự tạo lịch nghỉ cho thợ mà không cần thợ gửi đơn
         (ví dụ: cho nghỉ lễ, cợ sắp xếp nội bộ).
```

#### Giới hạn xin nghỉ

```
Quy tắc: Thợ xin nghỉ phép / việc riêng phải gửi đơn trước ít nhất 1 ngày.
Quy tắc: Thợ báo nghỉ đột xuất (nghỉ ốm, khẩn) không bị giới hạn giờ báo.
Quy tắc: Mỗi lần xin nghỉ tối đa 14 ngày liên tục.
         (Nghỉ dài hơn: CHỦ tự cập nhật thủ công)
```

---

## BR-07: Thống Kê & Báo Cáo

### BR-07-01 – Dữ liệu thống kê

```
Quy tắc: Đơn được tính vào thống kê tháng dựa theo NGÀY HẸN (không phải ngày tạo).
Ví dụ: Đơn tạo ngày 28/06 nhưng hẹn ngày 02/07 → tính vào tháng 7.

Quy tắc: Chỉ đơn HOÀN THÀNH mới được tính vào số liệu "đã hoàn thành".
Quy tắc: Đơn HỦY được thống kê riêng (để phân tích lý do hủy).
```

---

### BR-07-02 – Quyền xem báo cáo

```
Quy tắc: Chỉ BOSS mới xem được tổng quan báo cáo toàn cửa hàng.
Quy tắc: TECHNICIAN chỉ xem được số liệu của bản thân.
Quy tắc: STAFF không xem được báo cáo.
```

---

### BR-07-03 – Xuất dữ liệu

```
Quy tắc: Chỉ BOSS mới xuất được file Excel danh sách đơn.
Quy tắc: File Excel xuất ra gồm các cột:
  Mã đơn | Ngày hẹn | Tên khách | SĐT | Địa chỉ | Loại dịch vụ | Thợ | Trạng thái | Ghi chú
Quy tắc: Giới hạn xuất tối đa 3 tháng / lần.
```

---

## BR-08: Tài Khoản

### BR-08-01 – Mật khẩu

```
Quy tắc: Mật khẩu tối thiểu 6 ký tự (phù hợp với thợ ít quen công nghệ).
Quy tắc: Tài khoản bị khóa sau 5 lần nhập sai liên tiếp.
Quy tắc: ADMIN đặt lại mật khẩu bằng cách tạo mật khẩu tạm thời.
Quy tắc: Lần đầu đăng nhập bằng mật khẩu tạm thời → yêu cầu đổi mật khẩu mới.
```

---

### BR-08-02 – Tài khoản thợ

```
Quy tắc: Thợ đăng nhập bằng SĐT + mật khẩu (thay vì email, vì thợ dễ nhớ SĐT hơn).
Quy tắc: Thợ chỉ thấy giao diện đơn giản: danh sách đơn của mình + cập nhật trạng thái.
Quy tắc: Thợ không xem được thông tin đơn của thợ khác.
Quy tắc: Thợ không tạo, sửa, hủy được đơn hàng.
```

---

### BR-08-03 – Phiên đăng nhập

```
Quy tắc: Tự động đăng xuất sau 60 phút không thao tác (với BOSS/ADMIN/STAFF trên máy tính).
Quy tắc: Với thợ trên điện thoại: giữ đăng nhập trong 7 ngày (tránh phải đăng nhập lại liên tục).
Quy tắc: Khi tài khoản bị ADMIN vô hiệu hóa → bị đăng xuất ngay lập tức.
```

---

## 📌 Quy ước chung

### Dữ liệu

```
Quy tắc: Số điện thoại: 10 chữ số, bắt đầu bằng 0, chỉ chứa chữ số.
         Được phép nhập có dấu cách/gạch: "0901 234 567" → tự động chuẩn hóa thành "0901234567".
Quy tắc: Tên khách: 2–50 ký tự.
Quy tắc: Địa chỉ: tối thiểu 10 ký tự, tối đa 300 ký tự.
Quy tắc: Ghi chú: tối đa 500 ký tự.
Quy tắc: Tất cả text input được tự động trim() (bỏ khoảng trắng đầu/cuối) trước khi lưu.
```

### Không xóa dữ liệu

```
Quy tắc: Toàn bộ dữ liệu (đơn hàng, khách hàng, thợ) KHÔNG BAO GIỜ bị xóa khỏi database.
         Chỉ được đánh dấu ẩn (soft delete).
Lý do: Cần lưu lịch sử để tra cứu khi khách hàng gọi lại về đơn cũ.
```

### Múi giờ

```
Quy tắc: Tất cả ngày giờ lưu trong database theo UTC.
Quy tắc: Toàn bộ giao diện hiển thị theo giờ Việt Nam (UTC+7).
Quy tắc: "Hôm nay" tính từ 00:00 đến 23:59 giờ Việt Nam.
```

---

## BR-09: Nghỉ Phép & Vắng Mặt

### BR-09-01 – Trạng thái đơn xin nghỉ

| Trạng thái | Mã | Mô tả |
|-----------|-----|-------|
| Chờ duyệt | `PENDING` | Thợ vừa gửi đơn, chưa có phản hồi của chủ |
| Đã duyệt | `APPROVED` | Chủ duyệt → thợ tự động ON_LEAVE vào ngày nghỉ |
| Từ chối | `REJECTED` | Chủ từ chối → thợ vẫn ACTIVE |
| Đã nghỉ | `COMPLETED` | Kỳ nghỉ đã qua, thợ trở lại ACTIVE |
| Hủy | `CANCELLED` | Thợ tự hủy đơn (trước ngày bắt đầu nghỉ) |

---

### BR-09-02 – Quy tắc xử lý đơn xin nghỉ

```
Quy tắc: Thợ chỉ có 1 đơn xin nghỉ ở trạng thái PENDING tại một thời điểm.
Quy tắc: Thợ có thể hủy đơn PENDING hoặc APPROVED nếu chưa đến ngày nghỉ.
Quy tắc: Không thể hủy đơn khi đã bắt đầu nghỉ (ngày hiện tại >= ngày bắt đầu).
Quy tắc: CHỦ phải duyệt / từ chối trong vòng 24 giờ sau khi nhận đơn.
         (Nếu quá 24 giờ → nhắc nhở CHỦ)
Quy tắc: Hai đơn xin nghỉ không được trùng ngày nhau.
Quy tắc: CHỦ từ chối phải nhập lý do (tối thiểu 5 ký tự).
```

---

### BR-09-03 – Xem lịch nghỉ

```
Quy tắc: CHỦ xem được lịch nghỉ của tất cả thợ (dạng lịch tháng / danh sách).
Quy tắc: Thợ chỉ xem được lịch nghỉ của bản thân.
Quy tắc: Khi phân công thợ cho đơn, hệ thống hiển thị cảnh báo nếu 
         thợ đó có lịch nghỉ được duyệt trùng với ngày hẹn của đơn.
Quy tắc: Dashboard của CHỦ hiển thị: "Thợ đang nghỉ hôm nay: [danh sách tên]"
```

---

### BR-09-04 – Lịch sử nghỉ phép

```
Quy tắc: Tất cả đơn xin nghỉ được lưu vĩnh viễn (kể cả đã từ chối / đã hủy).
Quy tắc: CHỦ xem được lịch sử nghỉ của từng thợ: số ngày nghỉ phép,
         số lần nghỉ ốm, số lần nghỉ đột xuất trong năm.
Quy tắc: Thợ xem được lịch sử xin nghỉ của bản thân.
```

---

## BR-10: Chấm Công & Tiền Lương

> **Mục tiêu:** Hệ thống hỗ trợ tính toán lương cuối tháng cho thợ tự động dựa trên mức lương cứng, ngày công, và các khoản phụ cấp/phạt. Hệ thống không trả lương theo dạng khoán phần trăm trên từng đơn.

### BR-10-01 – Thiết lập lương cơ bản

```
Quy tắc: CHỦ thiết lập mức "Lương cứng (VND/tháng)" cho từng thợ trong phần quản lý nhân sự.
Quy tắc: Mức lương cứng phụ thuộc vào Cấp bậc của thợ:
  - Thợ chính: Lương cứng cao (đã thạo việc, chịu trách nhiệm chính).
  - Thợ phụ: Lương cứng thấp hơn (đang học việc, đi phụ).
Quy tắc: Số ngày công chuẩn của 1 tháng mặc định là 26 ngày (trừ 4 ngày Chủ Nhật)
         hoặc do CHỦ tự cấu hình chung cho cả cửa hàng.
```

### BR-10-02 – Cách tính ngày công (Chấm công)

```
Hệ thống tự động chấm công dựa vào trạng thái làm việc mỗi ngày:
  - Nửa ngày: Được tính khi thợ có làm việc một phần trong ngày.
  - 1 ngày công: Đánh dấu tự động cho các ngày thợ ACTIVE và có phân công công việc.
  
Phân loại ngày nghỉ:
  - Nghỉ có phép (APPROVED): Vẫn bị trừ vào ngày công làm việc thực tế, 
                             nhưng không bị tính vào "Nghỉ không phép".
  - Nghỉ không phép (Vắng mặt không báo): CHỦ đánh dấu thủ công vào những 
                             ngày thợ không đi làm mà không có đơn xin nghỉ.

Quy tắc: Lương cơ bản thực nhận = (Lương cứng / Ngày công chuẩn) * Số ngày công thực tế.
```

### BR-10-03 – Thưởng & Phụ cấp

```
Các khoản cộng thêm vào lương tháng (CHỦ nhập thủ công hoặc hệ thống tự động tính):
  1. Thưởng chuyên cần:
     → Tự động cộng: Nếu thợ đạt đủ 100% số ngày công chuẩn trong tháng 
                     và không có ngày "Nghỉ không phép".
     → CHỦ thiết lập mức tiền thưởng chuyên cần (vd: 500,000đ).
  2. Thưởng Lễ/Tết: CHỦ nhập tay số tiền và ghi chú (vd: Thưởng Tết dương lịch).
  3. Thưởng năng suất (Tùy chọn): CHỦ có thể thưởng thêm nếu thợ hoàn thành nhiều đơn.
```

### BR-10-04 – Khấu trừ (Phạt)

```
Các khoản trừ vào lương tháng (CHỦ nhập thủ công):
  - Phạt đi trễ / vi phạm nội quy.
  - Khấu trừ do làm hỏng đồ của khách (kèm mã đơn hàng liên quan nếu có).
  - Tạm ứng lương: Nếu thợ xin ứng tiền trước trong tháng.

Quy tắc: Mỗi khoản trừ phải bắt buộc có Ghi chú giải thích.
```

### BR-10-05 – Chốt lương (Payroll)

```
Quy tắc: Ngày mùng 1 hàng tháng, hệ thống tự động tạo ra bảng "Phiếu lương tạm tính"
         của tháng trước cho tất cả thợ.
Công thức tổng:
  Tổng lương = Lương cơ bản thực nhận + Tổng Thưởng - Tổng Khấu trừ

Quy tắc: CHỦ có thể điều chỉnh (thêm thưởng/phạt) trước khi bấm "Chốt lương".
Quy tắc: Khi CHỦ đã bấm "Chốt lương", phiếu lương sẽ được Khóa (không thể sửa đổi)
         và Thợ sẽ xem được phiếu lương này trên app điện thoại của mình.
Quy tắc: Phiếu lương sẽ hiển thị rõ chi tiết: Số ngày làm, số ngày nghỉ, các khoản 
         thưởng, và các khoản bị trừ để thợ nắm rõ.
```

### BR-10-06 – Quyết toán khi thôi việc (Nghỉ việc hoàn toàn)

> **Tình huống:** Thợ nộp đơn xin nghỉ việc hoặc Chủ cho thợ nghỉ việc. Hệ thống cần hỗ trợ chốt lương cuối cùng trước khi chuyển trạng thái thợ sang `INACTIVE`.

```
Điều kiện BẮT BUỘC để hệ thống cho phép chốt lương nghỉ việc:
  1. Thợ KHÔNG CÒN bất kỳ đơn công việc nào ở trạng thái "Đang thực hiện" hoặc 
     "Chưa phân công lại". Tất cả phải được hoàn thành hoặc bàn giao cho thợ khác.

Các khoản Khấu trừ tự động / thủ công khi chốt lương nghỉ việc:
  - Khấu trừ đồ nghề/đồng phục: Chủ kiểm tra thực tế, nếu mất hoặc hỏng thì 
    nhập số tiền khấu trừ vào hệ thống kèm ghi chú.
  - Cấn trừ công nợ: Thu hồi toàn bộ tiền tạm ứng còn nợ của thợ.
  - Phạt nghỉ ngang: Nếu thợ nghỉ đột xuất (không báo trước số ngày theo quy định), 
    Chủ có quyền chọn "Phạt nghỉ ngang" → Hệ thống tự động cắt toàn bộ Thưởng chuyên cần 
    của tháng đó và có thể trừ thêm ngày công tùy cấu hình.
  - Trường hợp học việc / thử việc cực ngắn (dưới 3 ngày): Nếu thợ phụ làm dưới 3 ngày 
    rồi tự ý nghỉ ngang, hệ thống cung cấp nút "Hủy kết quả chấm công" → Lương chốt = 0 
    (theo luật ngầm của các cửa hàng: học việc vài ngày tự bỏ thì không tính lương).

Quy trình thao tác:
  Bước 1: Chủ vào hồ sơ thợ → Chọn "Quyết toán thôi việc".
  Bước 2: Hệ thống tính số ngày công tính đến ngày làm việc cuối cùng.
  Bước 3: Chủ nhập các khoản phụ cấp và các khoản bồi thường / khấu trừ (nếu có).
  Bước 4: Bấm "Chốt quyết toán". Hệ thống sinh ra "Phiếu lương cuối cùng".
  Bước 5: Sau khi thanh toán xong, Chủ bấm "Đã thanh toán" → Hệ thống tự động 
          chuyển trạng thái thợ thành INACTIVE.
```

---

## BR-11: Quản Lý Vật Tư & Phụ Tùng (Inventory)

### BR-11-01 – Quản lý danh mục vật tư
```
Quy tắc: Chỉ BOSS và ADMIN mới có quyền Thêm, Sửa, Xóa danh mục vật tư trong kho 
         (ví dụ: Gas R32, Lốc tủ lạnh, Ống đồng).
Quy tắc: BOSS và ADMIN là người thực hiện thao tác Nhập kho (cộng dồn số lượng).
Quy tắc: Giá vật tư trong danh mục là Giá bán chuẩn cho khách hàng (không phải giá vốn).
```

### BR-11-02 – Xuất vật tư cho đơn hàng
```
Quy tắc: Khi thợ đang làm việc tại nhà khách, thợ có quyền chọn và thêm vật tư 
         từ Danh mục vào Đơn hàng ngay trên App.
Quy tắc: Thợ có thể thay đổi số lượng (ví dụ: dùng 2 mét ống đồng).
Quy tắc: Tồn kho chỉ bị TRỪ ĐI khi đơn hàng chuyển sang trạng thái HOÀN THÀNH.
         (Nếu đơn HỦY, tồn kho giữ nguyên).

Quy tắc (Vật tư tiêu hao đi kèm): Với các vật tư lặt vặt (như xi cuốn ống đồng, băng keo), 
         khi thợ thêm vào đơn, thợ có thể tick chọn "Miễn phí (Đi kèm dịch vụ)". 
         Lúc này giá bán của vật tư đó trên hóa đơn = 0đ, nhưng tồn kho vẫn bị trừ 
         bình thường để Boss kiểm soát số lượng.
```

### BR-11-03 – Vật tư tự mua ngoài
> **Tình huống:** Thợ đi làm nhưng vật tư trong kho hết, thợ phải ra tiệm ngoài mua để thay cho khách.

```
Quy tắc: Thợ được phép thêm "Vật tư mua ngoài" vào Đơn hàng.
Quy tắc: Thợ phải nhập: Tên vật tư + Số tiền mua + Giá bán cho khách + Chụp ảnh hóa đơn.
Quy tắc: Sau khi hoàn thành, số tiền mua vật tư ngoài sẽ tự động được đưa vào 
         Danh sách "Cần thanh toán lại cho thợ" của Boss để chốt vào cuối ngày/tháng.
```

---

## BR-12: Báo Giá & Thanh Toán

### BR-12-01 – Báo giá cho khách
```
Quy tắc: Tổng tiền của một đơn hàng = (Phí dịch vụ nhân công) + (Tổng tiền vật tư).
Quy tắc: Thợ báo giá cho khách dựa trên Tổng tiền hiển thị trên App.
Quy tắc: Thợ có thể xin ý kiến Boss để áp dụng Giảm giá (Discount) cho đơn hàng. 
         Việc giảm giá phải được lưu lại số tiền giảm.
```

### BR-12-02 – Thu tiền và Hình thức thanh toán
```
Quy tắc: Khi bấm HOÀN THÀNH đơn, thợ bắt buộc chọn 1 trong 2 hình thức thanh toán:
  1. TIỀN MẶT: Thợ thu tiền mặt của khách (Cuối ngày thợ phải nộp lại cho Boss số tiền này).
  2. CHUYỂN KHOẢN: Khách quét mã QR chuyển thẳng vào tài khoản của Boss.
     (Thợ báo Boss kiểm tra điện thoại xem tiền đã vào chưa).

Quy tắc: Phí kiểm tra (Inspection Fee): Nếu khách từ chối sửa, thợ chọn kết quả 
         "Không làm được", nhưng hệ thống vẫn cho phép nhập số tiền "Phí kiểm tra" 
         (ví dụ 150k) để thu của khách.
```

### BR-12-03 – Bán lẻ vật tư (Retail)
> **Tình huống:** Khách vãng lai hoặc thợ tiệm khác đến mua đứt vật tư mang về.

```
Quy tắc: Boss (hoặc Admin) có thể tạo nhanh "Đơn Bán Lẻ" trực tiếp trên Web.
Quy tắc: Đơn bán lẻ KHÔNG cần gán thợ, KHÔNG có phí dịch vụ, KHÔNG có ngày hẹn.
Quy tắc: Hệ thống tính tiền = Số lượng × Giá gốc danh mục (ví dụ: 3 cuộn xi × 10k = 30k).
Quy tắc: Khi bấm Hoàn thành đơn bán lẻ, kho lập tức trừ số lượng vật tư tương ứng 
         và doanh thu được cộng vào ngày hôm đó.
```

---

## BR-13: Quy Trình Bảo Hành (Warranty)

### BR-13-01 – Nhận diện đơn bảo hành
```
Quy tắc: Khi Boss tạo đơn mới, nếu số điện thoại của khách khớp với một đơn 
         đã HOÀN THÀNH trong vòng 6 tháng gần nhất (có thể cấu hình thời gian), 
         hệ thống sẽ hiển thị cảnh báo: "⚠️ Khách này có thiết bị đang trong thời gian bảo hành".
Quy tắc: Boss có quyền đánh dấu (check) đơn hàng mới này là "Đơn Bảo Hành".
```

### BR-13-02 – Xử lý đơn bảo hành
```
Quy tắc: Đơn bảo hành mặc định có Phí dịch vụ = 0đ.
Quy tắc: Thợ đi sửa đơn bảo hành (kể cả do lỗi sửa ẩu lần trước) thì 
         Thợ VẪN ĐƯỢC TÍNH NGÀY CÔNG HÔM ĐÓ bình thường. Không bị phạt trừ lương.
Quy tắc: Thợ chỉ bị phạt tiền nếu vi phạm nội quy (ví dụ: đi trễ) - xem BR-10-04.
Quy tắc: Nếu đơn bảo hành phát sinh thay thế vật tư mới (không thuộc diện bảo hành), 
         thợ vẫn được phép thêm vật tư đó vào đơn và thu tiền vật tư của khách.
```
