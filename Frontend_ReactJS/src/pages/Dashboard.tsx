import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { ClipboardList, UserCheck, Wrench, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setData(res.data);
      } catch (error) {
        console.error('Lỗi lấy thống kê', error);
      }
    };
    if (token) fetchStats();
  }, [token]);

  const stats = [
    { name: 'Đơn cần phân công', value: data?.stats?.unassigned ?? 0, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    { name: 'Đang thực hiện', value: data?.stats?.inProgress ?? 0, icon: Wrench, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Hoàn thành', value: data?.stats?.completed ?? 0, icon: ClipboardList, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Thợ đang nghỉ', value: data?.stats?.techLeave ?? 0, icon: UserCheck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng Quan</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
          <span className="hidden sm:inline">Tạo đơn mới</span>
          <span className="sm:hidden">+ Mới</span>
        </button>
      </div>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bảng Đơn hàng Gấp / Chưa phân công */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Đơn hàng mới nhất cần phân công</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Mã Đơn</th>
                <th className="px-6 py-3 font-medium">Khách hàng</th>
                <th className="px-6 py-3 font-medium">Dịch vụ</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.urgentOrders?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Tuyệt vời, không có đơn hàng nào bị tồn đọng!</td></tr>
              ) : (
                data?.urgentOrders?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.customers?.full_name || 'Khách lẻ'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.service_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
    </div>
  );
};
