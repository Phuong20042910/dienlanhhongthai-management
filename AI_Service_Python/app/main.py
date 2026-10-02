from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import ProductInfo, SKUSuggestionRequest, SKUSuggestionResponse
from app.services.gemini_service import gemini_service
from app.services.crawler_service import crawler_service

app = FastAPI(
    title="Điện Lạnh Hồng Thái - Python AI Microservice",
    description="Microservice AI nhận diện tem nhãn sản phẩm, trích xuất mã Model/SKU và tự động gợi ý danh mục vật tư điện lạnh.",
    version="1.0.0"
)

# Cấu hình CORS để cho phép Node.js Backend & ReactJS Frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "Dien Lanh Hong Thai AI Service",
        "status": "Online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/ai/health")
def health_check():
    return {
        "status": "OK",
        "gemini_api_configured": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")
    }

@app.post("/api/ai/scan-label", response_model=ProductInfo, summary="Quét ảnh tem nhãn sản phẩm")
async def scan_label(file: UploadFile = File(...)):
    """
    Tải lên file ảnh tem nhãn sản phẩm/vật tư ➔ AI trả về Tên, Mã Model, Loại gas, Công suất, Đơn vị tính.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File tải lên phải là hình ảnh (jpg, png, webp...)")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="File ảnh rỗng")

    result = gemini_service.scan_product_label(contents)
    return result

from app.schemas import ProductInfo, SKUSuggestionRequest, SKUSuggestionResponse, ChatRequest, ChatResponse

@app.post("/api/ai/suggest-sku", response_model=SKUSuggestionResponse, summary="Gợi ý mã SKU và Danh mục từ tên vật tư")
def suggest_sku(payload: SKUSuggestionRequest):
    """
    Nhập tên vật tư ➔ AI tự động trả về mã SKU chuẩn hóa, Danh mục gợi ý và Đơn vị tính.
    """
    if not payload.product_name or not payload.product_name.strip():
        raise HTTPException(status_code=400, detail="Tên sản phẩm không được để trống")

    result = gemini_service.suggest_sku(
        product_name=payload.product_name,
        category=payload.category,
        brand=payload.brand
    )
    return result

@app.post("/api/ai/chat", response_model=ChatResponse, summary="Chat trực tiếp với Trợ lý AI Điện Lạnh")
def chat_ai(payload: ChatRequest):
    """
    Gửi câu hỏi hoặc yêu cầu hỗ trợ kỹ thuật/kho ➔ AI trả về câu trả lời chi tiết.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Nội dung câu hỏi không được để trống")

    reply_text = gemini_service.chat_with_ai(
        message=payload.message,
        context=payload.context
    )
    return ChatResponse(reply=reply_text)

@app.get("/api/external/fetch-product", response_model=ProductInfo, summary="Tìm kiếm và cào dữ liệu sản phẩm từ web ngoài")
def fetch_product_external(q: str):
    """
    Nhập tên sản phẩm (VD: Daikin 1HP) ➔ Cào giá thị trường và dùng AI bóc tách cấu hình.
    """
    if not q or not q.strip():
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp từ khóa tìm kiếm (q)")
    
    result = crawler_service.fetch_product_and_specs(query=q.strip())
    return result

from app.schemas import GenerateExcelRequest
from app.services.excel_generator import generate_excel_from_prompt

@app.post("/api/ai/generate-excel", summary="AI tạo file Excel vật tư")
def generate_excel(payload: GenerateExcelRequest):
    """
    Nhập yêu cầu ➔ AI trả về file Excel chứa danh sách vật tư kèm link ảnh.
    """
    if not payload.prompt or not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Vui lòng nhập yêu cầu")
    
    try:
        excel_stream = generate_excel_from_prompt(payload.prompt)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi tạo Excel")
    
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=AI_Generated_Inventory.xlsx"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
