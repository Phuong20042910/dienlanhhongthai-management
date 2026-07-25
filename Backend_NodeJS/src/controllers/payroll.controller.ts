import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const payrollController = {
  // Tạo hoặc chốt phiếu lương cho một thợ
  async generatePayslip(req: AuthRequest, res: Response) {
    try {
      const {
        technician_id,
        month,
        year,
        base_salary,
        working_days,
        leave_days,
        bonus,
        deductions
      } = req.body;

      const dailyRate = base_salary / 26;
      const calculatedSalary = (dailyRate * working_days) + bonus - deductions;

      const { data, error } = await supabase
        .from('payslips')
        .insert([{
          technician_id, // Lệnh reference technicians(id) hoặc users(id) tuỳ theo đã fix
          month,
          year,
          base_salary,
          working_days,
          leave_days,
          bonus,
          deductions,
          total_salary: calculatedSalary,
          status: 'FINALIZED'
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy danh sách phiếu lương của bản thân
  async getMyPayslips(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id; 

      if (!userId) {
        return res.status(401).json({ error: 'Không xác định được danh tính' });
      }

      // Lấy danh sách payslips. Ở đây giả định technician_id lưu `users.id`. Nếu lưu id của technicians thì phải query lấy tech id.
      const { data, error } = await supabase
        .from('payslips')
        .select(`
          *,
          users(full_name, phone)
        `)
        .eq('technician_id', userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy toàn bộ danh sách phiếu lương (Cho Admin/Boss)
  async getAllPayslips(req: AuthRequest, res: Response) {
    try {
      const { data, error } = await supabase
        .from('payslips')
        .select(`
          *,
          users(full_name, phone)
        `)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy chi tiết 1 phiếu lương
  async getPayslipById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('payslips')
        .select(`*, users(full_name, phone)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Không tìm thấy phiếu lương' });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật phiếu lương
  async updatePayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body; // status, bonus, deductions, base_salary, v.v.

      // Nếu có cập nhật liên quan tới tính toán lương, tính toán lại total_salary
      let calculatedSalary = undefined;
      if (updates.base_salary !== undefined && updates.working_days !== undefined) {
        const dailyRate = updates.base_salary / 26;
        calculatedSalary = (dailyRate * updates.working_days) + (updates.bonus || 0) - (updates.deductions || 0);
        updates.total_salary = calculatedSalary;
      }

      const { data, error } = await supabase
        .from('payslips')
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

  // Xóa phiếu lương
  async deletePayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('payslips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      res.json({ message: 'Xóa phiếu lương thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
