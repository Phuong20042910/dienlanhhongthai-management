import { Client } from 'pg';

export const initDatabaseExtensions = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS before_images TEXT[] DEFAULT '{}';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS after_images TEXT[] DEFAULT '{}';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_signature TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INTEGER;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_brand VARCHAR(100);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_type VARCHAR(100);
    `;
    await client.query(sql);
    console.log('✅ Đã đồng bộ các cột mới cho bảng orders (ảnh hiện trường, chữ ký, đánh giá, thông tin máy)');
  } catch (error: any) {
    console.warn('⚠️ Ghi chú đồng bộ database:', error.message);
  } finally {
    try {
      await client.end();
    } catch {}
  }
};
