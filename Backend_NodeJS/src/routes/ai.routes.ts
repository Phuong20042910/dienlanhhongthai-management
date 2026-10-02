import { Router } from 'express';
import multer from 'multer';
import { aiController } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Tối đa 10MB
});

/**
 * @swagger
 * /api/ai/scan-label:
 *   post:
 *     summary: Quét ảnh tem nhãn sản phẩm bằng Python AI Service
 *     tags: [AI Services]
 */
router.post('/scan-label', upload.single('file'), aiController.scanLabel);

/**
 * @swagger
 * /api/ai/suggest-sku:
 *   post:
 *     summary: Gợi ý mã SKU chuẩn hóa và Danh mục từ tên vật tư
 *     tags: [AI Services]
 */
router.post('/suggest-sku', aiController.suggestSKU);

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat trực tiếp với Trợ lý AI Chuyên gia Điện Lạnh
 *     tags: [AI Services]
 */
router.post('/chat', aiController.chat);
/**
 * @swagger
 * /api/ai/fetch-product:
 *   get:
 *     summary: Cào dữ liệu sản phẩm từ mạng và dùng AI bóc tách thông số
 *     tags: [AI Services]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên vật tư/máy lạnh cần lấy dữ liệu (VD Daikin 1HP)
 */
router.get('/fetch-product', aiController.fetchExternalProduct);

export default router;
