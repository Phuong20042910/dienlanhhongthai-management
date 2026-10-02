import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/upload.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload file ảnh lên server (Lưu local vào thư mục public/uploads)
 *     tags: [Upload]
 */
router.post('/', upload.single('file'), uploadController.uploadImage);

export default router;
