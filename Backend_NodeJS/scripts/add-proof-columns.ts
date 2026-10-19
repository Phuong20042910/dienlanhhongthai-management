import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const addProofColumns = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Không tìm thấy DATABASE_URL trong .env');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    console.log('🔄 Đang kết nối tới Supabase Postgres...');
    await client.connect();
    console.log('✅ Kết nối thành công!');

    const sql = `
      -- Thêm cột ảnh hiện trường Trước / Sau khi làm việc
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS before_images TEXT[] DEFAULT '{}';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS after_images TEXT[] DEFAULT '{}';

      -- Thêm cột chữ ký điện tử nghiệm thu của khách hàng
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_signature TEXT;

      -- Thêm cột đánh giá dịch vụ và nhận xét thợ
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;

      -- Thêm thông tin chi tiết thiết bị (hãng, loại máy)
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_brand VARCHAR(100);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_type VARCHAR(100);
    `;

    console.log('⚡ Đang thực thi thêm các cột mới cho bảng orders...');
    await client.query(sql);
    console.log('🎉 Thành công! Bảng orders đã được bổ sung: before_images, after_images, customer_signature, rating, review, device_brand, device_type.');
  } catch (error: any) {
    console.error('❌ Lỗi khi thực thi migration:', error.message);
  } finally {
    await client.end();
  }
};

addProofColumns();
