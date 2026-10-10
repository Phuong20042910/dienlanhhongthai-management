import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Banknote, Edit, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/ConfirmModal';

export const PayrollManagement = () => {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bonus, setBonus] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [bonusReason, setBonusReason] = useState<string>('');
  const [deductionReason, setDeductionReason] = useState<string>('');
  const [confirmFinalizeId, setConfirmFinalizeId] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);

  const fetchPayslips = async () => {
    try {
      const res = await api.get('/payroll');
      setPayslips(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách lương');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPayslips();
  }, [token]);

  const handleEditClick = (ps: any) => {
    setEditingId(ps.id);
    setBonus(Number(ps.bonus) || 0);
    setDeductions(Number(ps.deductions) || 0);
    setBonusReason(ps.bonus_reason || '');
    setDeductionReason(ps.deduction_reason || '');
  };

  const handleSaveEdits = async (id: string, base_salary: number, working_days: number) => {
    try {
      await api.patch(`/payroll/${id}`, {
        bonus,
        deductions,
        bonus_reason: bonusReason,
        deduction_reason: deductionReason,
        base_salary,
        working_days
      });
      toast.success('Đã cập nhật Thưởng / Phạt thành công');
      setEditingId(null);
      fetchPayslips();
    } catch (error) {
      toast.error('Lỗi khi cập nhật lương');
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      await api.patch(`/payroll/${id}`, { status: 'FINALIZED' });
      toast.success('Đã chốt lương thành công!');
      fetchPayslips();
    } catch (error) {
      toast.error('Lỗi khi chốt lương');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Banknote className="text-emerald-600" size={32} /> Quản Lý Lương Thưởng
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Điều chỉnh Thưởng / Phạt & Chốt lương cuối tháng</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : payslips.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Chưa có dữ liệu lương nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Tháng</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Nhân viên</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Hoa hồng (50%)</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Thưởng / Phạt</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Thực lãnh</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Trạng thái</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payslips.map((ps) => (
                  <tr key={ps.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {ps.month}/{ps.year}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{ps.users?.full_name || 'Không rõ'}</div>
                      <div className="text-sm text-gray-500">{ps.working_days} đơn xong</div>
                    </td>
                    <td className="p-4 font-medium text-blue-600">
                      {Number(ps.base_salary).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4">
                      {editingId === ps.id ? (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 text-xs font-bold w-10">+</span>
                              <input
                                type="number"
                                value={bonus}
                                onChange={(e) => setBonus(Number(e.target.value))}
                                className="w-24 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Tiền thưởng"
                              />
                            </div>
                            <input
                              type="text"
                              value={bonusReason}
                              onChange={(e) => setBonusReason(e.target.value)}
                              className="w-full text-xs p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                              placeholder="Lý do thưởng..."
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-red-600 text-xs font-bold w-10">-</span>
                              <input
                                type="number"
                                value={deductions}
                                onChange={(e) => setDeductions(Number(e.target.value))}
                                className="w-24 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Tiền phạt"
                              />
                            </div>
                            <input
                              type="text"
                              value={deductionReason}
                              onChange={(e) => setDeductionReason(e.target.value)}
                              className="w-full text-xs p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                              placeholder="Lý do phạt..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm space-y-2">
                          {Number(ps.bonus) > 0 && (
                            <div>
                              <div className="text-green-600 font-medium">+{Number(ps.bonus).toLocaleString('vi-VN')} đ</div>
                              {ps.bonus_reason && <div className="text-xs text-gray-500 italic">Lý do: {ps.bonus_reason}</div>}
                            </div>
                          )}
                          {Number(ps.deductions) > 0 && (
                            <div>
                              <div className="text-red-600 font-medium">-{Number(ps.deductions).toLocaleString('vi-VN')} đ</div>
                              {ps.deduction_reason && <div className="text-xs text-gray-500 italic">Lý do: {ps.deduction_reason}</div>}
                            </div>
                          )}
                          {Number(ps.bonus) === 0 && Number(ps.deductions) === 0 && (
                            <span className="text-gray-400 italic">Không có</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-gray-900 dark:text-white">
                      {editingId === ps.id
                        ? Number(Number(ps.base_salary) + bonus - deductions).toLocaleString('vi-VN') + ' đ'
                        : Number(ps.total_salary).toLocaleString('vi-VN') + ' đ'}
                    </td>
                    <td className="p-4">
                      {ps.status === 'DRAFT' ? (
                        <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold w-max">
                          <Clock size={14} /> Đang tạm tính
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold w-max">
                          <CheckCircle size={14} /> Đã chốt
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {ps.status === 'DRAFT' && (
                        <div className="flex items-center justify-center gap-2">
                          {editingId === ps.id ? (
                            <button
                              onClick={() => handleSaveEdits(ps.id, ps.base_salary, ps.working_days)}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                              Lưu
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditClick(ps)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa Thưởng/Phạt"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmFinalizeId(ps.id)}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700"
                          >
                            Chốt
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={!!confirmFinalizeId}
        title="Xác nhận chốt lương"
        message="Bạn có chắc chắn muốn CHỐT phiếu lương này? Sau khi chốt, thợ sẽ thấy phiếu lương và bạn sẽ không thể chỉnh sửa (Thưởng/Phạt) được nữa!"
        onConfirm={() => confirmFinalizeId && handleFinalize(confirmFinalizeId)}
        onCancel={() => setConfirmFinalizeId(null)}
        isDestructive={false}
        confirmText="Chốt lương"
      />
    </div>
  );
};
