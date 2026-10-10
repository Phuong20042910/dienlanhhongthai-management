import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Banknote } from 'lucide-react';

export const Payslips = () => {
  const [payslips, setPayslips] = useState<any[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const res = await api.get('/payroll/my-payslip');
        setPayslips(res.data);
      } catch (error) {
        console.error('Lỗi tải phiếu lương:', error);
      }
    };
    if (token) fetchPayslips();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Banknote className="text-blue-600" /> Bảng Lương & Hoa Hồng
        </h1>
      </div>

      <div className="space-y-4">
        {payslips.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center text-gray-500 dark:text-gray-400">
            Chưa có dữ liệu lương. Hãy bắt đầu hoàn thành các đơn hàng nhé!
          </div>
        ) : (
          payslips.map((ps) => (
            <div key={ps.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-sm font-semibold shadow-sm ${ps.status === 'DRAFT' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                {ps.status === 'DRAFT' ? 'Đang tạm tính' : 'Đã chốt'}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Tháng {ps.month} / {ps.year}
              </h2>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-gray-500">Lương hoa hồng (50% Doanh thu):</div>
                <div className="font-medium text-right text-blue-600">{Number(ps.base_salary).toLocaleString('vi-VN')} đ</div>

                <div className="text-gray-500">Số đơn hoàn thành:</div>
                <div className="font-medium text-right">{ps.working_days} đơn</div>

                <div className="text-gray-500">Tiền thưởng (Boss tặng):</div>
                <div className="text-right">
                  <div className="font-medium text-green-600">+{Number(ps.bonus).toLocaleString('vi-VN')} đ</div>
                  {ps.bonus_reason && <div className="text-xs text-gray-400 italic font-normal">Lý do: {ps.bonus_reason}</div>}
                </div>

                <div className="text-gray-500">Các khoản trừ (Phạt):</div>
                <div className="text-right">
                  <div className="font-medium text-red-600">-{Number(ps.deductions).toLocaleString('vi-VN')} đ</div>
                  {ps.deduction_reason && <div className="text-xs text-gray-400 italic font-normal">Lý do: {ps.deduction_reason}</div>}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <span className="text-gray-600 font-semibold">TỔNG THỰC LÃNH</span>
                <span className="text-2xl font-black text-blue-600">
                  {Number(ps.total_salary).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
