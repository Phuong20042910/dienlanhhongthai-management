import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

// Hàm helper tạo order_code ngẫu nhiên
const generateOrderCode = () => {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const ordersController = {
  // Lấy danh sách đơn hàng
  async getOrders(req: AuthRequest, res: Response) {
    try {
      const userRole = req.user?.role;
      const userId = req.user?.id;

      let query = supabase
        .from('orders')
        .select(`
          *,
          customers(id, full_name, phone, address),
          technicians(id, users(full_name, phone))
        `)
        .order('created_at', { ascending: false });

      // Nếu là thợ, chỉ lấy đơn của mình
      if (userRole === 'TECHNICIAN') {
        // Tìm technician_id tương ứng với user_id
        const { data: tech } = await supabase.from('technicians').select('id').eq('user_id', userId).single();
        if (tech) {
          query = query.eq('technician_id', tech.id);
        } else {
          return res.json([]); // Nếu user chưa có tech profile thì trả mảng rỗng
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo đơn hàng mới
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const { 
        customer_id, 
        service_type, 
        description, 
        address, 
        priority,
        technician_id
      } = req.body;

      if (!customer_id || !service_type || !address) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (customer_id, service_type, address)' });
      }

      const order_code = generateOrderCode();

      const { data, error } = await supabase
        .from('orders')
        .insert([{ 
          order_code,
          customer_id,
          service_type,
          description,
          address,
          priority: priority || 'NORMAL',
          technician_id: technician_id || null,
          created_by: req.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật trạng thái hoặc phân công thợ
  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body; // { status, technician_id, note... }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy chi tiết 1 đơn hàng
  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers(*),
          technicians(id, users(full_name, phone))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa đơn hàng
  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Có thể thêm kiểm tra quyền: chỉ Admin/Boss mới được xóa đơn hàng
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
