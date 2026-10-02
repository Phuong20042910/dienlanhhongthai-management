# Tích hợp Dữ liệu Sản phẩm / Vật tư Điện Lạnh từ bên ngoài (External APIs)

Trong lĩnh vực Điện Lạnh tại Việt Nam, hiện tại **không có một API công cộng (Public API) chuẩn nào** cung cấp sẵn toàn bộ danh sách thiết bị và vật tư (như API thời tiết hay API phim ảnh). 

Tuy nhiên, để tự động hóa việc lấy dữ liệu (Tên, Mã Model, Thông số, Giá tham khảo) vào hệ thống **Hồng Thái EMS**, chúng ta có 3 giải pháp thực tế nhất. Dưới đây là phân tích chi tiết để bạn lựa chọn:

---

## Giải pháp 1: Sử dụng Python Crawler (Cào dữ liệu từ Web) - ĐỀ XUẤT CAO NHẤT
Chúng ta đã có sẵn `AI_Service_Python`. Python là ngôn ngữ mạnh nhất thế giới để làm Web Scraping (cào dữ liệu).

*   **Cách thức:** Viết thêm một API endpoint trong Python (ví dụ: `GET /api/crawler/search-product?q=Daikin+1HP`). Khi gọi API này, Python sẽ tự động lướt các trang web bán vật tư điện lạnh lớn, bóc tách thông tin và trả về JSON cho Node.js.
*   **Ưu điểm:** Miễn phí, lấy được giá thị trường thực tế (Real-time).
*   **Nhược điểm:** Nếu trang web đổi giao diện, code cào dữ liệu có thể phải sửa lại.
*   **Thư viện sử dụng:** `BeautifulSoup4`, `Requests`.

## Giải pháp 2: Tận dụng luôn AI Gemini (Sinh thông số tự động)
Do hệ thống đã kết nối Google Gemini AI, Gemini đã được huấn luyện trên hàng tỷ trang web nên nó thuộc lòng hầu hết các thông số kỹ thuật của các máy lạnh.

*   **Cách thức:** Tạo API `POST /api/ai/get-specs`. Node.js truyền tên máy (VD: `Daikin FTKB25YVMV`), AI sẽ tự sinh ra một file JSON chứa toàn bộ thông số: `Công suất: 1HP`, `Gas: R32`, `Inverter: Có`.
*   **Ưu điểm:** Rất dễ làm, trả về JSON chuẩn xác, không sợ lỗi giao diện web.
*   **Nhược điểm:** Giá cả chỉ là giá tham khảo trong dữ liệu huấn luyện, không phải giá cập nhật từng ngày.

## Giải pháp 3: Sử dụng API Thương Mại Điện Tử (Shopee/Tiki API)
*   **Cách thức:** Dùng Node.js gọi thẳng Open API của các sàn TMĐT.
*   **Ưu điểm:** Dữ liệu chuẩn, hợp pháp.
*   **Nhược điểm:** Đăng ký cực kỳ phức tạp (yêu cầu doanh nghiệp đối tác), tài liệu khó, giới hạn lượt gọi (Rate Limit).

---

## Kết luận
Mình đề xuất chúng ta sẽ kết hợp **Giải pháp 1** (Cào giá thị trường) và **Giải pháp 2** (Dùng AI lấy thông số). Mình đã lên bản kế hoạch Implementation Plan để chờ bạn duyệt.
