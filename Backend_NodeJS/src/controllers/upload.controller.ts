import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const uploadController = {
  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
      }

      // Multer memory storage was used, so we write the buffer to disk manually
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileExt = path.extname(req.file.originalname) || '.jpg';
      const fileName = `img_${Date.now()}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);

      // Trả về URL đường dẫn tương đối (server tĩnh sẽ host thư mục public)
      const imageUrl = `/uploads/${fileName}`;

      res.json({ url: imageUrl, message: 'Upload thành công' });
    } catch (error: any) {
      console.error('Lỗi upload ảnh:', error);
      res.status(500).json({ error: 'Lỗi server khi upload ảnh' });
    }
  }
};
