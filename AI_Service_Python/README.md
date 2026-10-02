# 🐍 Điện Lạnh Hồng Thái - Python AI Microservice

Microservice xử lý trí tuệ nhân tạo (AI) giúp tự động hóa nhận diện tem nhãn sản phẩm điện lạnh, bóc tách mã Model, phân loại danh mục và gợi ý mã SKU cho kho hàng.

## 🚀 Tính năng chính

1. **📸 Quét ảnh tem nhãn sản phẩm (`POST /api/ai/scan-label`)**:
   - Nhân viên chỉ cần chụp ảnh tem nhãn dán trên máy lạnh, tủ lạnh, máy giặt hoặc vật tư.
   - AI sẽ bóc tách dữ liệu: Tên sản phẩm, Mã Model/SKU, Thương hiệu, Loại Gas (R32, R22...), Công suất (1HP, 9000BTU...), Đơn vị tính.

2. **🏷️ Gợi ý mã SKU & Phân loại (`POST /api/ai/suggest-sku`)**:
   - Nhập tên ngắn của vật tư phụ (vd: `Ống đồng phi 6 Thái Lan`).
   - AI tự động sinh mã SKU chuẩn hóa (`OD-P6-061`), đề xuất danh mục `VẬT_TƯ` và đơn vị tính `Mét`.

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### 1. Tạo môi trường ảo Python (Virtual Environment)
Mở cửa sổ Command Prompt / Terminal tại thư mục `AI_Service_Python`:

```bash
# Tạo virtualenv
python -m venv venv

# Kích hoạt virtualenv (Trên Windows)
venv\Scripts\activate
```

### 2. Cài đặt các thư viện cần thiết
```bash
pip install -r requirements.txt
```

### 3. Cấu hình biến môi trường `.env`
Tạo file `.env` (hoặc copy từ `.env.example`):
```bash
cp .env.example .env
```
Mở file `.env` và điền **Google Gemini API Key** của bạn (Lấy API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey)).

### 4. Khởi chạy Server
```bash
python -m app.main
```
Hoặc dùng `uvicorn`:
```bash
uvicorn app.main:app --reload --port 8000
```

---

## 📖 Swagger API Documentation
Sau khi server khởi chạy thành công, truy cập trình duyệt tại:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)** để trải nghiệm giao diện test API trực quan.
