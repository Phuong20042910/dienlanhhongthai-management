import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Wrench, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { AddMaterialModal } from '../components/AddMaterialModal';
import { QuoteModal } from '../components/QuoteModal';

export const TechnicianOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quoteOrderId, setQuoteOrderId] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch (error: any) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Chờ xử lý</span>;
      case 'CONFIRMED': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">Đã xác nhận</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">Đang thực hiện</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Hoàn thành</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Wrench className="text-blue-200" size={32} /> Đơn Của Tôi
          </h1>
          <p className="text-blue-100 mt-2">
            Danh sách các công việc bạn được phân công. Hãy cập nhật trạng thái khi hoàn thành nhé!
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bạn đang rảnh việc!</h3>
          <p className="text-gray-500 mt-2">Hiện tại không có đơn hàng nào được phân công cho bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{order.service_type}</h3>
                  <p className="text-sm font-mono text-gray-500 mt-1">{order.order_code}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex-1">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Địa chỉ khách hàng</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{order.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{order.customers?.full_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{order.customers?.phone}</p>
                  </div>
                </div>

                {order.description && (
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <Clock size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ghi chú bệnh</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 italic">{order.description}</p>
                    </div>
                  </div>
                )}
                
                {/* Thông tin báo giá nếu đã có */}
                {(order.sub_total > 0 || order.note) && (
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <CheckCircle size={18} className="text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Báo giá / Ghi chú quản lý</p>
                      
                      {order.sub_total > 0 && (
                        <div className="mt-1 space-y-1">
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Báo giá gốc:</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.sub_total)}</span>
                          </div>
                          
                          {(order.discount > 0) && (
                            <div className="flex justify-between items-center text-sm font-medium text-red-500">
                              <span>Sếp giảm giá:</span>
                              <span>- {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-base font-bold text-blue-600 pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span>Thực thu Khách:</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount || order.sub_total)}</span>
                          </div>
                          
                          {/* Dòng hiển thị Hoa Hồng cho thợ (50%) - Chỉ hiện khi đã hoàn thành */}
                          {order.status === 'COMPLETED' && (order.total_amount > 0 || order.sub_total > 0) && (
                            <div className="flex justify-between items-center text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mt-2 border border-green-100 dark:border-green-900/30">
                              <span>Hoa hồng của bạn (50%):</span>
                              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((order.total_amount || order.sub_total) * 0.5)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {order.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">{order.note}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions for Technician */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                {order.status === 'PENDING' || order.status === 'CONFIRMED' ? (
                  <>
                    <button 
                      onClick={() => setQuoteOrderId(order.id)}
                      className="py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-xl font-semibold transition-all"
                    >
                      Báo Giá
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'IN_PROGRESS')}
                      className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
                    >
                      Bắt đầu thực hiện
                    </button>
                  </>
                ) : order.status === 'IN_PROGRESS' ? (
                  <>
                    <button 
                      onClick={() => setSelectedOrderId(order.id)}
                      className="py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Thêm vật tư
                    </button>
                    <button 
                      onClick={() => setQuoteOrderId(order.id)}
                      className="py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-xl font-semibold transition-all"
                    >
                      Cập nhật Báo Giá
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'COMPLETED')}
                      className="col-span-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
                    >
                      Đã hoàn thành
                    </button>
                  </>
                ) : (
                  <button 
                    disabled
                    className="col-span-2 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl font-semibold"
                  >
                    Không có thao tác
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm Vật Tư */}
      {selectedOrderId && (
        <AddMaterialModal 
          isOpen={true} 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}

      {/* Modal Báo Giá */}
      {quoteOrderId && (
        <QuoteModal
          isOpen={true}
          orderId={quoteOrderId}
          initialSubTotal={orders.find(o => o.id === quoteOrderId)?.sub_total}
          initialNote={orders.find(o => o.id === quoteOrderId)?.note}
          onClose={() => setQuoteOrderId(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};
