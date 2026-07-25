import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const statsController = {
  // Lấy các chỉ số tổng quan
  async getDashboardStats(req: Request, res: Response) {
    try {
      // 1. Đơn cần phân công (status = 'PENDING')
      const { count: unassignedCount, error: err1 } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      // 2. Đơn đang thực hiện (status = 'IN_PROGRESS' or 'CONFIRMED')
      const { count: inProgressCount, error: err2 } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['IN_PROGRESS', 'CONFIRMED']);

      // 3. Đơn hoàn thành (status = 'COMPLETED')
      const { count: completedCount, error: err3 } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED');

      // 4. Thợ đang nghỉ (status = 'ON_LEAVE' or 'INACTIVE') trong bảng technicians
      const { count: techLeaveCount, error: err4 } = await supabase
        .from('technicians')
        .select('*', { count: 'exact', head: true })
        .in('status', ['ON_LEAVE', 'INACTIVE']);

      // 5. Lấy danh sách 5 đơn hàng mới nhất cần phân công (cho bảng chú ý)
      const { data: urgentOrders, error: err5 } = await supabase
        .from('orders')
        .select(`
          id, 
          order_code, 
          service_type, 
          status,
          customers(full_name)
        `)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(5);

      if (err1 || err2 || err3 || err4 || err5) {
        throw new Error('Lỗi truy vấn thống kê');
      }

      res.json({
        stats: {
          unassigned: unassignedCount || 0,
          inProgress: inProgressCount || 0,
          completed: completedCount || 0,
          techLeave: techLeaveCount || 0
        },
        urgentOrders: urgentOrders || []
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
