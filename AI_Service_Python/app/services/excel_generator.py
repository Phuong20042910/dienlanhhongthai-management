import os
import json
import io
import xlsxwriter
from duckduckgo_search import DDGS
from .gemini_service import gemini_service

def search_image(query: str) -> str:
    """Tìm 1 link ảnh từ DuckDuckGo cho tên sản phẩm"""
    try:
        results = DDGS().images(
            keywords=f"{query} điện lạnh",
            region="vn-vi",
            safesearch="off",
            size="Small",
            max_results=1
        )
        if results and len(results) > 0:
            return results[0].get("image")
    except Exception as e:
        pass
    return ""

def generate_excel_from_prompt(prompt: str) -> io.BytesIO:
    # 1. Ask Gemini to generate JSON list of products
    system_prompt = """
    Bạn là một chuyên gia về vật tư, linh kiện điện lạnh.
    Hãy tạo danh sách vật tư theo yêu cầu của người dùng.
    Trả về ĐÚNG MỘT MẢNG JSON, không có markdown (không dùng ```json), không giải thích.
    Mỗi phần tử trong mảng có các key sau:
    - name: Tên vật tư (đầy đủ)
    - sku: Mã SKU gợi ý
    - unit: Đơn vị tính (Bộ, Cái, Mét, Cuộn...)
    - unit_price: Giá bán khách (VNĐ - kiểu số nguyên, VD: 150000)
    - technician_price: Giá thợ (VNĐ - kiểu số nguyên, VD: 120000)
    - stock_quantity: Số lượng tồn kho gợi ý (kiểu số nguyên)
    """

    payload = {
        "contents": [{"parts": [{"text": f"{system_prompt}\n\nYêu cầu của người dùng: {prompt}"}]}]
    }
    
    result_json = gemini_service._call_gemini_api(payload)
    text_result = "[]"
    if result_json:
        try:
            text_result = result_json['candidates'][0]['content']['parts'][0]['text'].strip()
        except Exception:
            pass
    if text_result.startswith("```json"):
        text_result = text_result[7:]
    if text_result.endswith("```"):
        text_result = text_result[:-3]
    
    try:
        products = json.loads(text_result)
    except Exception:
        products = []
        
    if not products:
        raise ValueError("AI returned empty data or parsing failed")
        
    # 2. Tạo Excel file trong memory
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet('Vật Tư')

    # Định dạng
    header_format = workbook.add_format({
        'bold': True, 'bg_color': '#D8E4BC', 'border': 1, 'align': 'center', 'valign': 'vcenter'
    })
    cell_format = workbook.add_format({'border': 1, 'valign': 'vcenter'})
    
    headers = ['Tên vật tư', 'Mã SKU', 'Đơn vị tính', 'Giá bán', 'Giá thợ', 'Số lượng tồn kho', 'Link ảnh']
    
    for col_num, header in enumerate(headers):
        worksheet.write(0, col_num, header, header_format)
        
    worksheet.set_column(0, 0, 40) # Tên
    worksheet.set_column(1, 1, 15) # SKU
    worksheet.set_column(2, 2, 10) # ĐVT
    worksheet.set_column(3, 4, 15) # Giá
    worksheet.set_column(5, 5, 15) # Số lượng
    worksheet.set_column(6, 6, 60) # Link ảnh
    
    # 3. Ghi data và tìm link ảnh
    for row_num, p in enumerate(products, 1):
        name = p.get('name', '')
        # Đi tìm link ảnh
        img_url = search_image(name)
        
        worksheet.write(row_num, 0, name, cell_format)
        worksheet.write(row_num, 1, p.get('sku', ''), cell_format)
        worksheet.write(row_num, 2, p.get('unit', 'Cái'), cell_format)
        worksheet.write(row_num, 3, p.get('unit_price', 0), cell_format)
        worksheet.write(row_num, 4, p.get('technician_price', 0), cell_format)
        worksheet.write(row_num, 5, p.get('stock_quantity', 10), cell_format)
        if img_url:
            worksheet.write_url(row_num, 6, img_url, string=img_url, cell_format=cell_format)
        else:
            worksheet.write(row_num, 6, "", cell_format)

    workbook.close()
    output.seek(0)
    return output
