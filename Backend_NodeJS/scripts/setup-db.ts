import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

const runMigration = async () => {
  // Lấy chuỗi kết nối từ biến môi trường
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ LỖI: Không tìm thấy biến môi trường DATABASE_URL.');
    console.error('Vui lòng thêm DATABASE_URL vào file .env. Ví dụ:');
    console.error('DATABASE_URL=postgresql://postgres.tshywhtzklgwytyzizwk:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    console.log('🔄 Đang kết nối tới database...');
    await client.connect();
    console.log('✅ Đã kết nối thành công!');

    // Đường dẫn tới file sql chứa schema
    const schemaPath = path.join(__dirname, '../supabase_schema.sql');
    
    console.log(`📖 Đang đọc file schema tại: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⚡ Đang thực thi schema (Tạo bảng, Enum, RLS, Indexes)...');
    await client.query(sql);

    console.log('🎉 XONG! Toàn bộ bảng đã được tạo/cập nhật thành công.');
  } catch (error) {
    console.error('❌ CÓ LỖI XẢY RA KHI CHẠY MIGRATION:');
    console.error(error);
  } finally {
    await client.end();
    console.log('🔌 Đã đóng kết nối database.');
  }
};

runMigration();
