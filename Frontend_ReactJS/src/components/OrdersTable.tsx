import React from 'react';
import { Printer, Navigation } from 'lucide-react';
import { getGoongMapUrl } from '../utils/goongMap';

interface OrdersTableProps {
  orders: any[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onDelete: (id: string) => void;
  onEdit: (order: any) => void;
  onPrint?: (order: any) => void;
}


export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, getStatusColor, getStatusText, onDelete, onEdit, onPrint }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng & Địa chỉ</th>
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
                  {order.address && (
                    <a
                      href={getGoongMapUrl(order.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-1"
                      title="Mở trên Goong Map"
                    >
                      <Navigation size={11} />
                      <span className="truncate max-w-xs">{order.address}</span>
                    </a>
                  )}
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
                  <div className="flex items-center justify-end gap-2">
                    {onPrint && (
                      <button
                        onClick={() => onPrint(order)}
                        title="In Phiếu Dịch Vụ"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Printer size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onEdit(order)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
                    >
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => onDelete(order.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-semibold transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

