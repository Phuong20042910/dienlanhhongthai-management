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
  }
};
