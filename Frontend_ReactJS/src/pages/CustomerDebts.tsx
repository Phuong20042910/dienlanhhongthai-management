import { useState, useEffect } from 'react';
import { CreditCard, History, AlertCircle, CheckCircle2, ChevronRight, Wallet } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { PromptModal } from '../components/PromptModal';

export const CustomerDebts = () => {
  const [debts, setDebts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promptPaymentDebt, setPromptPaymentDebt] = useState<any>(null);
  
  const token = useAuthStore((state) => state.token);

  const fetchDebts = async () => {
    try {
      const res = await api.get('/orders');
      
      // Lọc các đơn nợ (PARTIAL hoặc UNPAID)
      const debtOrders = res.data.filter((o: any) => 
        (o.payment_status === 'PARTIAL' || o.payment_status === 'UNPAID') && 
        (o.status === 'COMPLETED') &&
        (o.total_amount > 0 || o.sub_total > 0)
      ).map((o: any) => ({
        id: o.id,
        order_code: o.order_code,
        service_type: o.service_type || 'Dịch vụ sửa chữa',
        total_debt: Number(o.total_amount > 0 ? o.total_amount : o.sub_total),
        paid_amount: Number(o.paid_amount || 0),
        due_date: new Date(new Date(o.created_at).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mặc định nợ 15 ngày
        status: o.payment_status,
        created_at: o.created_at
      }));
      
      setDebts(debtOrders);
      
      // Giả lập lịch sử trả nợ từ chính thông tin các đơn (vì hệ thống chưa có bảng lịch sử thanh toán riêng)
      const paymentHistory = res.data
        .filter((o: any) => Number(o.paid_amount) > 0)
        .map((o: any) => ({
          id: o.id + '_hist',
          order_code: o.order_code,
          amount: Number(o.paid_amount),
          payment_method: 'CASH', // Mặc định hiển thị CASH
          created_at: o.updated_at || o.created_at
        }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
      setHistory(paymentHistory);
    } catch (error) {
      toast.error('Lỗi lấy danh sách nợ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDebts();
    }
  }, [token]);

  const calculateRemaining = (total: number, paid: number) => Math.max(total - paid, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Wallet className="text-blue-600 dark:text-blue-400" size={32} /> Sổ Nợ Cá Nhân
        </h1>
        <p className="text-gray-500 mt-2">Quản lý và thanh toán các khoản chi phí sửa chữa còn thiếu.</p>
      </div>

      {isLoading ? (
        <div className="text-center p-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách Công nợ */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <CreditCard size={20} /> Các khoản nợ hiện tại
            </h2>

            {debts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tuyệt vời!</h3>
                <p className="text-gray-500 mt-2">Bạn không có khoản nợ nào cần thanh toán.</p>
              </div>
            ) : (
              debts.map(debt => {
                const remaining = calculateRemaining(debt.total_debt, debt.paid_amount);
                const progress = Math.min((debt.paid_amount / debt.total_debt) * 100, 100);

                return (
                  <div key={debt.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{debt.service_type}</h3>
                      <p className="text-sm font-mono text-gray-500 mt-1">Đơn hàng: {debt.order_code}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-bold uppercase">
                      Chưa thanh toán đủ
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Cần thanh toán thêm</p>
                      <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remaining)}
                      </p>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hạn chót</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertCircle size={18} className="text-orange-500" />
                        {new Date(debt.due_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-500">Đã trả: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt.paid_amount)}</span>
                      <span className="text-gray-500">Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt.total_debt)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPromptPaymentDebt({
                        debt,
                        remaining
                      });
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md transition-transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                  >
                    <CreditCard size={20} /> Thanh toán Online ngay
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Lịch sử thanh toán */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <History size={20} /> Lịch sử trả nợ
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Chưa có giao dịch nào.</p>
            ) : (
              <div className="space-y-4">
                {history.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                        {tx.payment_method === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      <PromptModal
        isOpen={!!promptPaymentDebt}
        title="Thanh toán nợ"
        message={`Nhập số tiền bạn muốn THANH TOÁN THÊM cho khoản nợ này (Còn nợ ${
          promptPaymentDebt ? new Intl.NumberFormat('vi-VN').format(promptPaymentDebt.remaining) : 0
        }đ):`}
        defaultValue={promptPaymentDebt ? promptPaymentDebt.remaining.toString() : '0'}
        inputType="text"
        confirmText="Xác nhận thanh toán"
        onConfirm={(val) => {
          if (!promptPaymentDebt) return;
          const { debt, remaining } = promptPaymentDebt;
          const paidExtra = Number(val.replace(/[^0-9]/g, ''));
          if (paidExtra > 0) {
            const newPaidAmount = debt.paid_amount + paidExtra;
            const newStatus = newPaidAmount >= debt.total_debt ? 'PAID' : 'PARTIAL';
            
            api.patch(`/orders/${debt.id}`, {
              payment_status: newStatus,
              paid_amount: newPaidAmount
            }).then(() => {
              if (newStatus === 'PAID') {
                toast.success('Tuyệt vời! Bạn đã thanh toán hết nợ cho đơn hàng này.');
              } else {
                toast.success(`Đã thanh toán thêm ${new Intl.NumberFormat('vi-VN').format(paidExtra)}đ`);
              }
              fetchDebts();
            }).catch(() => toast.error('Lỗi khi thanh toán nợ'));
          } else {
            toast.error('Số tiền không hợp lệ');
          }
        }}
        onCancel={() => setPromptPaymentDebt(null)}
      />
    </div>
  );
};
