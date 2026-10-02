import { useEffect, useState } from 'react';
import api from '../utils/api';
import { ClipboardList, UserCheck, Wrench, AlertCircle, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { OrderFormModal } from '../components/OrderFormModal';

export const AdminDashboard = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi lấy thống kê', error);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const stats = [
    { name: 'Đơn cần phân công', value: data?.stats?.unassigned ?? 0, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    { name: 'Đang thực hiện', value: data?.stats?.inProgress ?? 0, icon: Wrench, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Hoàn thành', value: data?.stats?.completed ?? 0, icon: ClipboardList, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Thợ đang nghỉ', value: data?.stats?.techLeave ?? 0, icon: UserCheck, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Tổng Quan Quản Lý</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Tạo đơn mới</span>
          <span className="sm:hidden">Mới</span>
        </button>
      </div>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className={`p-3.5 rounded-2xl ${stat.bgColor} ${stat.color} transition-colors`}>
                <Icon size={26} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bảng Đơn hàng Gấp / Chưa phân công */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Đơn hàng mới nhất cần phân công</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Dịch vụ</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data?.urgentOrders?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-medium bg-gray-50/30 dark:bg-gray-900/30">Tuyệt vời, không có đơn hàng nào bị tồn đọng!</td></tr>
              ) : (
                data?.urgentOrders?.map((item: Record<string, any>) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">{item.order_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">{item.customers?.full_name || 'Khách lẻ'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.service_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        {item.status === 'PENDING' ? 'Chờ phân công' : item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchStats()} 
      />
    </div>
  );
};
