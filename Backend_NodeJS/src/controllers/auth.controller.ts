import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const authController = {
  // Tạo người dùng mới (Chỉ dành cho Boss/Admin)
  async createUser(req: Request, res: Response) {
    try {
      const { email, password, full_name, role, phone, specialization } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đủ email, password và full_name' });
      }

      // 1. Tạo user trong hệ thống Auth của Supabase (sử dụng Admin API, bypass RLS)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name }
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // 2. Lưu thông tin phụ vào bảng `users`
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            full_name,
            role: role || 'TECHNICIAN',
            phone,
            is_active: true
          }
        ]);

      if (userError) {
        await supabase.auth.admin.deleteUser(userId);
        throw userError;
      }

      // 3. Nếu là thợ, thêm dữ liệu vào bảng `technicians`
      if (role === 'TECHNICIAN' || !role) {
        const { error: techError } = await supabase
          .from('technicians')
          .insert([
            {
              user_id: userId,
              phone: phone || '',
              specialization: specialization || [],
              status: 'ACTIVE'
            }
          ]);
        
        if (techError) {
          console.error("Lỗi tạo technician profile:", techError);
        }
      }

      res.status(201).json({ message: 'Tạo tài khoản thành công', userId });
    } catch (error: any) {
      console.error('Lỗi createUser:', error);
      res.status(500).json({ error: error.message || 'Lỗi server' });
    }
  },

  // Đăng nhập (Dành cho mọi người)
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 1. Authenticate qua Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
      }

      // 2. Lấy thêm thông tin role từ bảng users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      res.json({
        token: authData.session.access_token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: userData.full_name,
          role: userData.role
        }
      });
    } catch (error: any) {
      console.error('Lỗi login:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
  }
};
