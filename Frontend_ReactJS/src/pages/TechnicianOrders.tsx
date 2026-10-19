import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Wrench, CheckCircle, Clock, MapPin, Phone, Navigation, MessageCircle, Printer, ExternalLink, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

import { AddMaterialModal } from '../components/AddMaterialModal';
import { QuoteModal } from '../components/QuoteModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { InspectionModal } from '../components/InspectionModal';
import { getGoongMapUrl, getGoogleNavUrl, getZaloChatUrl } from '../utils/goongMap';


export const TechnicianOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quoteOrderId, setQuoteOrderId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const [inspectionOrder, setInspectionOrder] = useState<any | null>(null);
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    title="In Phiếu Dịch Vụ / Bàn Giao"
                    className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-blue-400 rounded-xl transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex-1">
                {/* Địa chỉ & Goong Map */}
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Địa chỉ khách hàng</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{order.address}</p>
                    
                    {/* Các nút Bản đồ Goong & Chỉ đường */}
                    {order.address && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <a
                          href={getGoongMapUrl(order.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all border border-emerald-200 dark:border-emerald-800"
                        >
                          <Navigation size={13} className="text-emerald-600" />
                          <span>Bản đồ Goong</span>
                          <ExternalLink size={11} />
                        </a>

                        <a
                          href={getGoogleNavUrl(order.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition-all border border-blue-200 dark:border-blue-800"
                        >
                          <span>Chỉ đường (Maps)</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Khách hàng & Gọi/Zalo 1 chạm */}
                <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Phone size={18} className="text-blue-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-0.5">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{order.customers?.full_name || 'Khách hàng'}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{order.customers?.phone || 'Chưa có SĐT'}</p>
                      </div>

                      {order.customers?.phone && (
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${order.customers.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105"
                          >
                            <Phone size={13} />
                            <span>Gọi ngay</span>
                          </a>

                          <a
                            href={getZaloChatUrl(order.customers.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105"
                          >
                            <MessageCircle size={13} />
                            <span>Zalo</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {order.description && (
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
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
                      onClick={() => setInspectionOrder(order)}
                      className="col-span-2 py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Camera size={18} /> Nghiệm Thu & Ký Nhận
                      {(order.before_images?.length > 0 || order.after_images?.length > 0 || order.customer_signature) && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </button>
                    <button 
                      onClick={() => updateStatus(order.id, 'COMPLETED')}
                      className="col-span-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
                    >
                      Đã hoàn thành công việc
                    </button>
                  </>
                ) : (
                  <div className="col-span-2 flex gap-2">
                    <button 
                      onClick={() => setInspectionOrder(order)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Camera size={16} /> Xem Ảnh & Chữ Ký
                    </button>
                    <button 
                      onClick={() => setInvoiceOrder(order)}
                      className="py-3 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Printer size={16} /> In Phiếu
                    </button>
                  </div>
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

      {/* Modal In Phiếu Dịch Vụ / Bàn Giao */}
      {invoiceOrder && (
        <InvoiceModal
          isOpen={true}
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Modal Nghiệm Thu, Chụp Ảnh Trước/Sau & Ký Nhận */}
      {inspectionOrder && (
        <InspectionModal
          isOpen={true}
          order={inspectionOrder}
          onClose={() => setInspectionOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};


