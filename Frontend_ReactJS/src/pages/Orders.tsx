import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { ClipboardList, Plus } from 'lucide-react';
import { OrderFormModal } from '../components/OrderFormModal';

export const Orders = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'IN_PROGRESS': return 'Đang thực hiện';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
        alert('Xóa thành công');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Lỗi khi xóa đơn hàng');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="text-blue-600 dark:text-blue-400" /> Quản lý Đơn Hàng
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tạo Đơn Mới
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thợ phụ trách</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Chưa có đơn hàng nào.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900">{order.order_code}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.customers?.full_name || 'Khách lẻ'}</div>
                    <div className="text-sm text-gray-500">{order.customers?.phone}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{order.service_type}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.technicians?.users?.full_name ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {order.technicians.users.full_name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{order.technicians.users.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold mr-4 transition-colors">Chi tiết</button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-semibold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchOrders()} 
      />
    </div>
  );
};
