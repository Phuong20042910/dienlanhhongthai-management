import requests
from bs4 import BeautifulSoup
from typing import Optional
from app.schemas import ProductInfo
from app.services.gemini_service import gemini_service
import json
import re
import urllib.parse

class CrawlerService:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    def fetch_search_results(self, query: str) -> str:
        """Cào kết quả tìm kiếm từ DuckDuckGo HTML để lấy thông tin sơ bộ (giá, thông số)"""
        url = "https://html.duckduckgo.com/html/"
        data = {"q": f"{query} thông số kỹ thuật giá bán"}
        try:
            res = requests.post(url, data=data, headers=self.headers, timeout=15)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, "html.parser")
                results = soup.find_all("a", class_="result__snippet")
                
                # Lấy 5 kết quả đầu tiên
                snippets = [r.get_text(strip=True) for r in results[:5]]
                return "\n".join(snippets)
            return ""
        except Exception as e:
            print(f"Crawler Error: {e}")
            return ""

    def fetch_image_bing(self, query: str) -> Optional[str]:
        """Cào ảnh đầu tiên từ Bing Images"""
        url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, "html.parser")
                img_tags = soup.find_all("img", class_="mimg")
                for img in img_tags:
                    src = img.get("src") or img.get("data-src")
                    if src and src.startswith("http"):
                        return src
            return None
        except Exception as e:
            print(f"Bing Image Fetch Error: {e}")
            return None

    def fetch_product_and_specs(self, query: str) -> ProductInfo:
        """Kết hợp Crawler và AI để bóc tách thông tin sản phẩm chi tiết"""
        
        # 1. Cào dữ liệu text từ mạng
        scraped_text = self.fetch_search_results(query)
        
        # 2. Xây dựng Prompt cho AI phân tích
        prompt = f"""
        Bạn là chuyên gia về vật tư, thiết bị điện lạnh.
        Người dùng đang muốn tìm kiếm và thêm sản phẩm: "{query}" vào kho lưu trữ.
        
        Dưới đây là một số thông tin cào được từ các trang web bán hàng (có thể chứa giá cả và thông số):
        ---
        {scraped_text if scraped_text else "Không tìm thấy thông tin trên mạng, hãy sử dụng kiến thức sẵn có của bạn."}
        ---
        
        Hãy phân tích dữ liệu trên (hoặc dùng kiến thức của bạn) để trích xuất các thông tin dưới dạng JSON chuẩn theo cấu trúc sau:
        {{
          "name": "Tên sản phẩm đầy đủ chuẩn hóa (ví dụ: Máy lạnh Daikin Inverter 1 HP FTKB25YVMV)",
          "sku": "Mã Model của hãng (nếu có, VD: FTKB25YVMV) hoặc tự sinh mã viết tắt (VD: OD-P6)",
          "brand": "Thương hiệu (Daikin, Panasonic, LG...)",
          "category": "Chọn 1 trong: MÁY_LẠNH, TỦ_LẠNH, MÁY_GIẶT, LINH_KIỆN, VẬT_TƯ, KHÁC",
          "unit": "Đơn vị tính (Bộ, Cái, Cuộn, Kg, Lon, Mét...)",
          "suggested_price": Giá bán tham khảo thị trường (chỉ ghi số nguyên, ví dụ: 8500000, không ghi chữ, nếu không biết thì để 0),
          "specs": {{
             "gas_type": "R32 / R410A / R22 (nếu có)",
             "capacity": "1 HP / 9000 BTU (nếu có)",
             "inverter": "Có / Không"
          }},
          "confidence_note": "Ghi chú (VD: Giá tham khảo từ web, cấu hình lấy từ hãng...)"
        }}
        Chỉ trả về JSON thuần túy, không kèm markdown hay text thừa.
        """

        # 3. Gọi Gemini AI
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        
        result_json = gemini_service._call_gemini_api(payload)
        if result_json:
            try:
                text_response = result_json['candidates'][0]['content']['parts'][0]['text']
                clean_json = re.sub(r'```json\s*|\s*```', '', text_response).strip()
                data = json.loads(clean_json)
                
                # 4. Tìm kiếm ảnh mẫu trên mạng
                img_url = self.fetch_image_bing(data.get('name', query))
                data['image_url'] = img_url
                
                return ProductInfo(**data)
            except Exception as e:
                print(f"Lỗi parse JSON từ AI: {e}")
        
        # Fallback nếu AI lỗi
        return ProductInfo(
            name=query.title(),
            sku=f"SKU-{query.replace(' ', '-').upper()}",
            category="VẬT_TƯ",
            unit="Cái",
            confidence_note="Dữ liệu lấy từ Fallback do lỗi AI hoặc mạng."
        )

crawler_service = CrawlerService()
