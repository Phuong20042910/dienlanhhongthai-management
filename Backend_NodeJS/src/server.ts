import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase';

import authRoutes from './routes/auth.routes';
import inventoryRoutes from './routes/inventory.routes';
import ordersRoutes from './routes/orders.routes';
import profilesRoutes from './routes/profiles.routes';
import customersRoutes from './routes/customers.routes';
import statsRoutes from './routes/stats.routes';
import payrollRoutes from './routes/payroll.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Docs Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payroll', payrollRoutes);

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
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
