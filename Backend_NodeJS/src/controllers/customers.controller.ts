import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const customersController = {
  // Lấy danh sách khách hàng
  async getCustomers(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Thêm mới khách hàng (có thể tạo tự động từ lúc đặt đơn nếu SĐT chưa có)
  async createCustomer(req: Request, res: Response) {
    try {
      const { full_name, phone, address, note } = req.body;

      if (!full_name || !phone) {
        return res.status(400).json({ error: 'Tên và số điện thoại là bắt buộc' });
      }

      const { data, error } = await supabase
        .from('customers')
        .insert([{ full_name, phone, address, note }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      // Bắt lỗi trùng SĐT
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Số điện thoại này đã tồn tại trong hệ thống' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin khách hàng
  async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data, error } = await supabase
        .from('customers')
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

  // Lấy chi tiết 1 khách hàng
  async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy lịch sử sửa chữa của khách hàng
  async getCustomerHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          technicians(id, users(full_name))
        `)
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa khách hàng
  async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Kiểm tra xem khách hàng có đơn hàng nào không
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', id);
        
      if (count && count > 0) {
        return res.status(400).json({ error: 'Không thể xóa khách hàng đã có đơn hàng' });
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'Xóa khách hàng thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
