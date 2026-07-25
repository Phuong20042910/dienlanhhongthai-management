# Chức năng xem lương dành cho Thợ

Theo như tài liệu quy tắc nghiệp vụ (Business Rules) của hệ thống Điện Lạnh Hồng Thái, nếu thợ muốn xem mức lương được nhận là bao nhiêu thì hệ thống sẽ cung cấp chức năng **Xem Phiếu Lương (Payslip)** trực tiếp trên ứng dụng (app) của thợ.

## Các đặc điểm của chức năng này:

1. **Điều kiện hiển thị:** 
   Thợ chỉ có thể xem được phiếu lương của tháng trước **SAU KHI Chủ cửa hàng đã thao tác "Chốt lương"** trên hệ thống (thường diễn ra vào ngày mùng 1 hàng tháng). Một khi Chủ đã bấm chốt, phiếu lương sẽ bị khóa lại (không thể sửa đổi) và tự động hiển thị trên app điện thoại của thợ.
   
2. **Nội dung chi tiết trong phiếu lương:**
   Phiếu lương sẽ hiển thị một cách minh bạch và chi tiết các thông tin để thợ dễ dàng nắm bắt:
   - **Số ngày làm việc:** Tổng số ngày công thực tế mà thợ đã đi làm.
   - **Số ngày nghỉ:** Tổng hợp các ngày nghỉ phép hoặc vắng mặt.
   - **Lương cơ bản thực nhận:** Số tiền tính toán dựa trên mức lương cứng chia cho ngày công chuẩn rồi nhân với số ngày làm thực tế.
   - **Các khoản thưởng:** Hiển thị chi tiết tiền thưởng chuyên cần (nếu đi làm đủ ngày và không vắng không phép), thưởng Lễ/Tết, thưởng năng suất,...
   - **Các khoản bị trừ (Phạt/Khấu trừ):** Hiển thị rõ số tiền và ghi chú lý do bị trừ như: phạt đi trễ, đền đồ hỏng, hoặc tiền đã tạm ứng trong tháng.
   - **Tổng lương cuối cùng:** Số tiền thực lãnh sau khi đã cộng thưởng và trừ phạt `(Tổng lương = Lương cơ bản + Tổng Thưởng - Tổng Khấu trừ)`.

3. **Tính độc lập và bảo mật:**
   - Mỗi thợ chỉ có thể xem được **duy nhất** phiếu lương của bản thân mình, không thể xem được của người khác.
   - Thợ không có quyền chỉnh sửa phiếu lương. Nếu có thắc mắc, thợ sẽ cần báo lại với Chủ cửa hàng dựa trên các thông số chi tiết đã được liệt kê trong phiếu lương.
   - Khi có quyết toán thôi việc (nghỉ việc), thợ cũng sẽ nhận được "Phiếu lương cuối cùng" với các khoản cấn trừ công nợ, đồ nghề tương tự.

*(Tham khảo chi tiết tại mục **BR-10: Chấm Công & Tiền Lương** trong tài liệu `BUSINESS_RULES.md`)*
