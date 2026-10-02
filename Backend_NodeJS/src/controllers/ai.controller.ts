import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';

const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

export const aiController = {
  // Proxy endpoint quét ảnh tem nhãn qua Python AI Service
  async scanLabel(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Vui lòng chọn file ảnh tem nhãn để quét' });
      }

      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/api/ai/scan-label`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 25000,
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Lỗi khi gọi Python AI Service:', error.message);
      res.status(500).json({
        error: 'Không thể gọi dịch vụ AI. Hãy đảm bảo Python AI Service đang chạy trên cổng 8000.',
        details: error.response?.data || error.message
      });
    }
  },

  // Proxy endpoint gợi ý mã SKU từ tên sản phẩm
  async suggestSKU(req: Request, res: Response) {
    try {
      const { product_name, category, brand } = req.body;

      if (!product_name) {
        return res.status(400).json({ error: 'product_name là bắt buộc' });
      }

      const response = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/api/ai/suggest-sku`,
        { product_name, category, brand },
        { timeout: 10000 }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Lỗi khi gọi Python AI Service:', error.message);
      res.status(500).json({
        error: 'Không thể gọi dịch vụ AI.',
        details: error.response?.data || error.message
      });
    }
  },

  // Proxy endpoint chat hỏi đáp trực tiếp với Trợ lý AI
  async chat(req: Request, res: Response) {
    try {
      const { message, context, provider } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Nội dung câu hỏi (message) là bắt buộc' });
      }

      const response = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/api/ai/chat`,
        { message, context, provider },
        { timeout: 25000 }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Lỗi khi gọi Python AI Service:', error.message);
      res.status(500).json({
        error: 'Không thể trò chuyện với Trợ lý AI. Vui lòng đảm bảo Python AI Service đang chạy trên cổng 8000.',
        details: error.response?.data || error.message
      });
    }
  },

  // Proxy endpoint tìm kiếm và cào dữ liệu sản phẩm từ mạng
  async fetchExternalProduct(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Từ khóa tìm kiếm (q) là bắt buộc' });
      }

      const response = await axios.get(
        `${PYTHON_AI_SERVICE_URL}/api/external/fetch-product`,
        { 
          params: { q },
          timeout: 25000 
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Lỗi khi cào dữ liệu sản phẩm ngoài:', error.message);
      res.status(500).json({
        error: 'Không thể lấy thông tin sản phẩm từ mạng lúc này.',
        details: error.response?.data || error.message
      });
    }
  }
};
