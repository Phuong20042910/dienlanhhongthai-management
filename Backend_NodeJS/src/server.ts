import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';
import { initSocket } from './config/socket';

import authRoutes from './routes/auth.routes';
import inventoryRoutes from './routes/inventory.routes';
import ordersRoutes from './routes/orders.routes';
import profilesRoutes from './routes/profiles.routes';
import customersRoutes from './routes/customers.routes';
import statsRoutes from './routes/stats.routes';
import payrollRoutes from './routes/payroll.routes';
import aiRoutes from './routes/ai.routes';
import uploadRoutes from './routes/upload.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import path from 'path';

import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Tạo HTTP Server chuẩn của Node.js từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.IO
initSocket(server);

// Middleware bảo mật và logging
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Giới hạn lượt truy cập API (Rate limiting: tối đa 300 requests / 15 phút mỗi IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { status: 429, error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Swagger API Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files (Uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Chào mừng đến với API Backend Điện Lạnh Hồng Thái!');
});

// Basic Health Check Endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Thử kết nối tới Supabase bằng cách fetch time từ database 
    // (hoặc một query đơn giản bất kỳ để kiểm tra kết nối)
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error && error.code !== '42P01') { 
      // 42P01 là lỗi table không tồn tại - nếu ra lỗi này tức là kết nối Supabase ok nhưng table chưa có
      throw error;
    }

    res.status(200).json({
      status: 'OK',
      message: 'Backend is running and connected to Supabase!',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to connect to Supabase',
      error: error.message
    });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server is active on ws://localhost:${PORT}`);
  console.log(`📖 Swagger API Docs are available at http://localhost:${PORT}/api-docs`);
});
