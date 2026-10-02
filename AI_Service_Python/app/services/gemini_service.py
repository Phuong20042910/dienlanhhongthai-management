import json
import re
import io
import requests
from PIL import Image
from typing import Optional
from app.config import settings
from app.schemas import ProductInfo, SKUSuggestionResponse

class GeminiAIService:
    def __init__(self):
        raw_key = settings.GEMINI_API_KEY or ""
        self.api_key = raw_key.strip().strip('"').strip("'")
        self.model_candidates = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro", "gemini-flash-latest"]
        
        # Cấu hình OpenRouter
        import os
        or_key = os.getenv("OPENROUTER_API_KEY", "")
        self.openrouter_api_key = or_key.strip().strip('"').strip("'")

    def _call_gemini_api(self, payload: dict, is_image: bool = False) -> Optional[dict]:
        """Gọi Gemini API bằng REST"""
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            return None

        headers = {"Content-Type": "application/json"}

        for model_name in self.model_candidates:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
            try:
                res = requests.post(url, json=payload, headers=headers, timeout=20)
                if res.status_code == 200:
                    return res.json()
                else:
                    print(f"API Error ({model_name}): {res.status_code}")
            except Exception as e:
                print(f"Connection Error ({model_name})")

        # Fallback sang Groq neu Gemini that bai (danh cho text)
        if not is_image:
            try:
                from app.services.groq_service import groq_service
                text_prompt = payload.get("contents", [{}])[0].get("parts", [{}])[0].get("text", "")
                if text_prompt:
                    groq_res = groq_service.call(text_prompt)
                    if groq_res:
                        return groq_res
            except Exception as e:
                print(f"Groq fallback error: {e}")

        return None

    def _call_openrouter_api(self, payload: dict) -> Optional[dict]:
        """Gọi OpenRouter API (OpenAI compatible)"""
        if not self.openrouter_api_key:
            return None

        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173", # Thay bằng domain thực tế nếu có
            "X-Title": "HongThaiEMS" 
        }

        url = "https://openrouter.ai/api/v1/chat/completions"
        try:
            res = requests.post(url, json=payload, headers=headers, timeout=20)
            if res.status_code == 200:
                return res.json()
        except Exception as e:
            print(f"Lỗi gọi OpenRouter: {e}")
            pass

        return None

    def scan_product_label(self, image_bytes: bytes) -> ProductInfo:
        """
        Phân tích ảnh tem nhãn sản phẩm/vật tư điện lạnh bằng Gemini AI Vision
        """
        import base64
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')

        prompt = """
        Bạn là một chuyên gia quản lý vật tư và thiết bị Điện Lạnh (Máy lạnh, Tủ lạnh, Máy giặt, Linh kiện, Vật tư phụ).
        Hãy phân tích bức ảnh tem nhãn hoặc sản phẩm điện lạnh này và trích xuất các thông tin dưới dạng JSON chuẩn theo cấu trúc sau:
        {
          "name": "Tên sản phẩm đầy đủ (ví dụ: Máy lạnh Daikin Inverter 1 HP FTKF25XVMV)",
          "sku": "Mã Model chính thức của hãng nếu có (ví dụ: FTKF25XVMV). Nếu là vật tư phụ không mã, hãy tự đặt mã ngắn viết tắt (ví dụ: OD-P6-061)",
          "brand": "Thương hiệu (Daikin, Panasonic, Toshiba, LG, Toàn Phát, LHCT...)",
          "category": "Chọn 1 trong các giá trị: MÁY_LẠNH, TỦ_LẠNH, MÁY_GIẶT, LINH_KIỆN, VẬT_TƯ, KHÁC",
          "unit": "Đơn vị tính (Bộ, Cái, Cuộn, Kg, Lon, Mét...)",
          "suggested_price": 0,
          "specs": {
             "gas_type": "R32 / R22 / R410A (nếu có)",
             "capacity": "1 HP / 9000 BTU / 180L (nếu có)",
             "voltage": "220V (nếu có)"
          },
          "confidence_note": "Ghi chú ngắn gọn về kết quả nhận diện"
        }
        Chỉ trả về JSON thuần túy, không kèm markdown hay văn bản thừa.
        """

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": encoded_image
                            }
                        }
                    ]
                }
            ]
        }

        result_json = self._call_gemini_api(payload, is_image=True)
        if result_json:
            try:
                text_response = result_json['candidates'][0]['content']['parts'][0]['text']
                clean_json = re.sub(r'```json\s*|\s*```', '', text_response).strip()
                data = json.loads(clean_json)
                return ProductInfo(**data)
            except Exception:
                pass

        return self._fallback_image_analysis(image_bytes, "Hệ thống đang chạy chế độ offline.")

    def suggest_sku(self, product_name: str, category: Optional[str] = None, brand: Optional[str] = None) -> SKUSuggestionResponse:
        clean_name = product_name.strip()
        cat = category or self._detect_category(clean_name)
        unit = self._detect_unit(clean_name, cat)
        sku = self._generate_rule_based_sku(clean_name, cat, brand)

        return SKUSuggestionResponse(
            suggested_sku=sku,
            standard_name=clean_name,
            category=cat,
            unit=unit
        )

    def _detect_category(self, name: str) -> str:
        name_lower = name.lower()
        if any(w in name_lower for w in ["máy lạnh", "điều hòa", "daikin", "panasonic", "lg"]):
            return "MÁY_LẠNH"
        elif any(w in name_lower for w in ["tủ lạnh", "tủ đông", "toshiba", "sanyo"]):
            return "TỦ_LẠNH"
        elif any(w in name_lower for w in ["máy giặt", "lồng đứng", "lồng ngang"]):
            return "MÁY_GIẶT"
        elif any(w in name_lower for w in ["bo mạch", "tụ", "block", "máy nén", "rơ le"]):
            return "LINH_KIỆN"
        else:
            return "VẬT_TƯ"

    def _detect_unit(self, name: str, category: str) -> str:
        name_lower = name.lower()
        if "ống đồng" in name_lower or "dây điện" in name_lower:
            return "Mét"
        elif "gas" in name_lower:
            return "Bình"
        elif category in ["MÁY_LẠNH", "TỦ_LẠNH", "MÁY_GIẶT"]:
            return "Bộ"
        else:
            return "Cái"

    def _generate_rule_based_sku(self, name: str, category: str, brand: Optional[str] = None) -> str:
        words = re.findall(r'\b\w+', name.upper())
        prefix = "".join([w[0] for w in words[:4]]) if words else "VT"
        numbers = re.findall(r'\d+', name)
        num_suffix = "-".join(numbers[:2]) if numbers else "01"
        return f"{prefix}-{num_suffix}"

    def _fallback_image_analysis(self, image_bytes: bytes, note: str = "") -> ProductInfo:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            width, height = img.size
        except Exception:
            width, height = 0, 0

        return ProductInfo(
            name="Vật tư Điện Lạnh (Quét từ ảnh)",
            sku=f"VT-SCAN-{width}x{height}",
            brand="Không xác định",
            category="VẬT_TƯ",
            unit="Cái",
            suggested_price=0.0,
            specs={"image_resolution": f"{width}x{height}"},
            confidence_note=f"{note} Lấy API Key miễn phí tại https://aistudio.google.com/app/apikey"
        )

    def _clean_text(self, text: str) -> str:
        """Loại bỏ toàn bộ các ký tự định dạng Markdown (**, *, #, _, `, -, v.v.)"""
        if not text:
            return ""
        # Bỏ mã code block ````
        text = re.sub(r'```[\s\S]*?```', '', text)
        # Bỏ dấu bôi đậm, in nghiêng, tiêu đề, mã inline
        text = re.sub(r'[*_#`~]', '', text)
        # Chuyển gạch đầu dòng Markdown thành gạch ngang hoặc chấm tròn sạch
        text = re.sub(r'^\s*[-*+]\s+', '• ', text, flags=re.MULTILINE)
        return text.strip()

    def chat_with_ai(self, message: str, context: Optional[str] = None, provider: str = "gemini") -> str:
        """
        Chat hỏi đáp trực tiếp với Trợ lý AI Thông Minh Đa Lĩnh Vực (Hỗ trợ Gemini và OpenRouter)
        """
        system_instruction = """
        Bạn là em - một trợ lý AI thông minh, am hiểu sâu sắc và chuyên nghiệp về đa lĩnh vực (đặc biệt là kỹ thuật điện lạnh, công nghệ, lập trình, quản lý kho).
        Em luôn sẵn sàng tư vấn, giải đáp chi tiết, phân tích cặn kẽ mọi câu hỏi từ anh/chị người dùng.

        QUY TẮC BẮT BUỘC VỀ PHONG CÁCH VÀ ĐỊNH DẠNG:
        - Xưng "em" hoặc "mình", gọi người dùng là "anh/chị" hoặc "bạn" một cách tự nhiên, gần gũi, lịch sự.
        - Đọc kỹ [Bối cảnh lịch sử trò chuyện] để trả lời mạch lạc, đúng luồng câu chuyện.
        - Trả lời MƯỢT MÀ, CÓ CHIỀU SÂU, và DIỄN GIẢI CHI TIẾT. Nếu là câu hỏi kỹ thuật, hãy phân tích nguyên nhân và hướng dẫn từng bước rõ ràng. Không trả lời hời hợt.
        - TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ DẤU MARKDOWN NÀO (không dùng dấu sao **, *, dấu thăng #, dấu gạch dưới _, dấu nháy ngược `).
        - Trình bày thành các đoạn văn thuần túy, sạch sẽ, rõ ràng, dễ đọc. Có thể dùng ký tự • hoặc - để liệt kê.
        """

        if provider == "openrouter" and self.openrouter_api_key:
            or_payload = {
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": f"[Bối cảnh lịch sử trò chuyện]:\n{context or 'Chưa có lịch sử'}\n\n[Câu hỏi mới từ người dùng]: {message}"}
                ]
            }
            result_json = self._call_openrouter_api(or_payload)
            if result_json:
                try:
                    raw_reply = result_json['choices'][0]['message']['content']
                    return self._clean_text(raw_reply)
                except Exception:
                    pass
            return self._clean_text(self._fallback_chat(message, context, "OpenRouter API Key không hợp lệ hoặc lỗi mạng."))
        
        else:
            # Mặc định dùng Gemini
            full_prompt = f"{system_instruction}\n\n[Bối cảnh lịch sử trò chuyện]:\n{context or 'Chưa có lịch sử'}\n\n[Câu hỏi mới từ người dùng]: {message}"

            payload = {
                "contents": [
                    {
                        "parts": [{"text": full_prompt}]
                    }
                ]
            }

            result_json = self._call_gemini_api(payload)
            if result_json:
                try:
                    raw_reply = result_json['candidates'][0]['content']['parts'][0]['text']
                    return self._clean_text(raw_reply)
                except Exception:
                    pass

            return self._clean_text(self._fallback_chat(message, context))

    def _fallback_chat(self, message: str, context: Optional[str] = None, custom_error: str = "") -> str:
        error_msg = custom_error if custom_error else "**Mã Google Gemini API Key trong file `.env` không hợp lệ hoặc đã hết hạn**."
        return f"""⚠️ **HỆ THỐNG AI ĐANG BỊ NGẮT KẾT NỐI** ⚠️
        
Hiện tại Trợ lý AI không thể phân tích câu hỏi của bạn vì {error_msg}

Để AI có thể trả lời thông minh, phân tích chuyên sâu đúng như bạn muốn, vui lòng kiểm tra lại mã API Key trong file `.env` và khởi động lại Server (`npm run dev`)."""

gemini_service = GeminiAIService()
