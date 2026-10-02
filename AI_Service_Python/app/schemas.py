from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ProductInfo(BaseModel):
    name: str = Field(..., description="Tên đầy đủ của sản phẩm/vật tư")
    sku: str = Field(..., description="Mã Model của hãng hoặc mã SKU chuẩn gợi ý")
    brand: Optional[str] = Field(None, description="Thương hiệu (Daikin, Panasonic, LG, Toàn Phát...)")
    category: str = Field("VẬT_TƯ", description="Danh mục (MÁY_LẠNH, TỦ_LẠNH, MÁY_GIẶT, LINH_KIỆN, VẬT_TƯ, KHÁC)")
    unit: str = Field("Bộ", description="Đơn vị tính (Bộ, Cái, Cuộn, Kg, Lon, Mét...)")
    suggested_price: Optional[float] = Field(0.0, description="Giá gợi ý (nếu nhận diện được)")
    specs: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Thông số kỹ thuật (Loại gas, công suất BTU, kích thước ống...)")
    confidence_note: Optional[str] = Field("", description="Ghi chú nhận diện từ AI")
    image_url: Optional[str] = Field(None, description="URL ảnh mẫu lấy từ mạng")

class SKUSuggestionRequest(BaseModel):
    product_name: str = Field(..., description="Tên sản phẩm hoặc mô tả ngắn từ người dùng")
    category: Optional[str] = Field(None, description="Danh mục nếu có")
    brand: Optional[str] = Field(None, description="Thương hiệu nếu có")

class SKUSuggestionResponse(BaseModel):
    suggested_sku: str = Field(..., description="Mã SKU được chuẩn hóa")
    standard_name: str = Field(..., description="Tên sản phẩm chuẩn hóa")
    category: str = Field(..., description="Danh mục gợi ý")
    unit: str = Field(..., description="Đơn vị tính gợi ý")

class ChatRequest(BaseModel):
    message: str = Field(..., description="Nội dung câu hỏi gửi cho AI Assistant")
    context: Optional[str] = Field(None, description="Bối cảnh bổ sung")
    provider: Optional[str] = Field("gemini", description="Nhà cung cấp AI: 'gemini' hoặc 'openrouter'")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Câu trả lời từ Trợ lý AI Điện Lạnh")

class GenerateExcelRequest(BaseModel):
    prompt: str = Field(..., description="Yêu cầu tạo danh sách, vd: 'Tạo 20 linh kiện máy lạnh'")
