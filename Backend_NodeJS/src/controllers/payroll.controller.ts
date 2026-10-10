import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const payrollController = {
  // Hàm nội bộ để đồng bộ hóa lương tháng hiện tại (cơ chế 50/50 chia đôi doanh thu)
  async syncCurrentMonthPayslip(userId: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 0. Tìm tech_id từ user_id vì bảng orders dùng tech_id (technicians.id)
    const { data: techProfile } = await supabase
      .from('technicians')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!techProfile) return; // Nếu user này chưa phải thợ, bỏ qua

    const techId = techProfile.id;

    // 1. Tính tổng doanh thu từ các đơn hàng hoàn thành trong tháng này
    const targetMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    // Dùng created_at hoặc updated_at để thay thế nếu completed_at chưa có
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, sub_total, completed_at, updated_at, created_at')
      .eq('technician_id', techId)
      .eq('status', 'COMPLETED');

    let totalRevenue = 0;
    let completedOrdersCount = 0;

    if (orders) {
      orders.forEach((o: any) => {
        // Ưu tiên ngày hoàn thành thực tế, nếu không có thì lấy created_at
        const dateString = o.completed_at || o.updated_at || o.created_at;
        
        // Nếu chuỗi ngày tháng chứa YYYY-MM tương ứng với tháng hiện tại
        if (dateString && dateString.includes(targetMonthStr)) {
          totalRevenue += Number(o.total_amount || o.sub_total || 0);
          completedOrdersCount++;
        }
      });
    }

    // Tiền công thợ = 50% tổng doanh thu
    const commission = totalRevenue * 0.5;

    // 2. Kiểm tra xem đã có phiếu lương tháng này chưa
    const { data: existingPayslip } = await supabase
      .from('payslips')
      .select('*')
      .eq('technician_id', userId)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .single();

    if (existingPayslip) {
      // Cập nhật lại base_salary (tiền công 50%) và total_salary
      if (existingPayslip.status !== 'FINALIZED') {
        const bonus = Number(existingPayslip.bonus || 0);
        const deductions = Number(existingPayslip.deductions || 0);
        const total_salary = commission + bonus - deductions;

        await supabase
          .from('payslips')
          .update({
            base_salary: commission,
            working_days: completedOrdersCount, // Dùng working_days để lưu số đơn hoàn thành
            total_salary: total_salary
          })
          .eq('id', existingPayslip.id);
      }
    } else {
      // Tạo mới phiếu lương DRAFT
      await supabase
        .from('payslips')
        .insert([{
          technician_id: userId,
          month: currentMonth,
          year: currentYear,
          base_salary: commission,
          working_days: completedOrdersCount,
          bonus: 0,
          deductions: 0,
          total_salary: commission,
          status: 'DRAFT'
        }]);
    }
  },

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

      // Tự động đồng bộ lương DRAFT tháng hiện tại trước khi lấy danh sách
      await payrollController.syncCurrentMonthPayslip(userId);

      // Lấy danh sách payslips
      const { data, error } = await supabase
        .from('payslips')
        .select(`
          *,
          users!payslips_technician_id_fkey(full_name, phone)
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
      // 1. Đồng bộ lương tháng hiện tại cho TẤT CẢ thợ
      const { data: allTechs } = await supabase
        .from('technicians')
        .select('user_id');

      if (allTechs) {
        // Chạy đồng bộ song song cho tất cả thợ (chỉ tạo/cập nhật phiếu DRAFT)
        await Promise.all(
          allTechs
            .filter(t => t.user_id)
            .map(t => payrollController.syncCurrentMonthPayslip(t.user_id))
        );
      }

      // 2. Lấy dữ liệu phiếu lương sau khi đồng bộ
      const { data, error } = await supabase
        .from('payslips')
        .select(`
          *,
          users!payslips_technician_id_fkey(full_name, phone)
        `)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('created_at', { ascending: false });

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
      // Theo cơ chế mới, base_salary là tiền hoa hồng 50%
      if (updates.base_salary !== undefined) {
        const bonus = updates.bonus !== undefined ? Number(updates.bonus) : 0;
        const deductions = updates.deductions !== undefined ? Number(updates.deductions) : 0;
        updates.total_salary = Number(updates.base_salary) + bonus - deductions;
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
