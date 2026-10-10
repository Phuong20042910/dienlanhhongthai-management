import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const profilesController = {
  // Thực tế là lấy danh sách Technicians
  async getProfiles(req: Request, res: Response) {
    try {
      // Query từ bảng technicians và join với bảng users
      const { data, error } = await supabase
        .from('technicians')
        .select(`
          id,
          phone,
          specialization,
          status,
          rating,
          total_completed,
          users (
            id,
            email,
            full_name,
            role,
            is_active
          )
        `);

      if (error) throw error;
      
      // Format lại data cho giống API cũ trả về mảng profiles
      const formattedData = data.map((t: any) => ({
        id: t.id,
        user_id: t.users?.id,
        full_name: t.users?.full_name,
        email: t.users?.email,
        phone: t.phone,
        role: t.users?.role,
        status: t.status,
        specialization: t.specialization,
        rating: t.rating,
        total_completed: t.total_completed
      }));

      res.json(formattedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật trạng thái
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const { data, error } = await supabase
        .from('technicians')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin cá nhân (Profile)
  async updateProfile(req: Request, res: Response) {
    try {
      // req.user được set từ requireAuth middleware
      const userId = (req as any).user.id; 
      const { full_name, phone } = req.body;

      const { data, error } = await supabase
        .from('users')
        .update({ full_name, phone })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy thông tin cá nhân của người đang đăng nhập (kèm role specific data)
  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      // 1. Lấy thông tin cơ bản từ bảng users
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      let extraData = {};

      // 2. Lấy thêm thông tin tùy theo Role
      if (user.role === 'TECHNICIAN') {
        const { data: techData } = await supabase
          .from('technicians')
          .select('specialization, status, rating, total_completed')
          .eq('user_id', userId)
          .single();
        if (techData) extraData = techData;
      } else if (user.role === 'CUSTOMER') {
        // Khách hàng có thể được link bằng phone hoặc id
        const { data: customerData } = await supabase
          .from('customers')
          .select('address, note')
          .eq('phone', user.phone)
          .single();
        if (customerData) extraData = customerData;
      }

      // 3. Gộp và trả về
      res.json({ ...user, ...extraData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
