import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Package, PlusCircle, Wrench, Clock, CheckCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomerBookingModal } from '../components/CustomerBookingModal';
import { PromptModal } from '../components/PromptModal';

export const CustomerOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const token = useAuthStore((state) => state.token);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promptPaymentOrder, setPromptPaymentOrder] = useState<any>(null);

  const [bookingData, setBookingData] = useState({
    service_type: 'MÁY LẠNH',
    description: '',
    address: '',
  });

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

  const handleBookOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.description || !bookingData.address) {
      toast.error('Vui lòng nhập mô tả lỗi và địa chỉ');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/orders/book', bookingData);
      toast.success('Đặt lịch thành công! Thợ sẽ sớm liên hệ với bạn.');
      setIsBookingModalOpen(false);
      setBookingData({ service_type: 'MÁY LẠNH', description: '', address: '' });
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi khi đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ tiếp nhận';
      case 'IN_PROGRESS': return 'Đang xử lý';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-blue-600 dark:text-blue-400" /> Đơn hàng của tôi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý các yêu cầu sửa chữa và bảo hành của bạn</p>
        </div>
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <PlusCircle size={20} />
          <span>Đặt lịch ngay</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
            <Package size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium">Bạn chưa có đơn đặt lịch nào.</p>
            <p className="text-sm mt-1">Hãy nhấn nút "Đặt lịch ngay" để yêu cầu sửa chữa.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Wrench className="text-blue-600" size={18} /> {order.service_type}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono mt-1">Mã đơn: {order.order_code}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-500">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Địa chỉ</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Ngày đặt</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Mô tả lỗi / Dịch vụ (Từ bạn)</p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 italic whitespace-pre-wrap">{order.description}</p>
                </div>

                {order.note && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 uppercase font-bold mb-1 flex items-center gap-1">
                      <CheckCircle size={14} /> Chi tiết hạng mục thi công / Báo giá
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{order.note}</p>
                  </div>
                )}

                {/* Phần hiển thị Chi phí / Báo giá */}
                {(order.total_amount > 0 || order.sub_total > 0) && (
                  <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Tổng chi phí dự kiến:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount > 0 ? order.total_amount : order.sub_total)}
                      </div>
                      {order.payment_status === 'PAID' ? (
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">ĐÃ THANH TOÁN</span>
                      ) : (
                        <span className="text-xs font-bold text-red-500">CHƯA THANH TOÁN</span>
                      )}
                    </div>
                  </div>
                )}

                {order.status === 'IN_PROGRESS' && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-center">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1">Thợ đang thực hiện công việc 🛠️</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Vui lòng đợi thợ xử lý xong và xác nhận hoàn thành công việc trước khi tiến hành thanh toán nhé.
                    </p>
                  </div>
                )}

                {/* Nút thanh toán VietQR nếu chưa thanh toán và có giá, CHỈ HIỂN THỊ KHI THỢ ĐÃ HOÀN THÀNH */}
                {order.status === 'COMPLETED' && order.payment_status !== 'PAID' && order.total_amount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Thanh toán chuyển khoản (VietQR)</p>
                    <img 
                      src={`https://img.vietqr.io/image/970415-113366668888-print.png?amount=${order.total_amount}&addInfo=Thanh toan don ${order.order_code}&accountName=DIEN LANH HONG THAI`} 
                      alt="VietQR" 
                      className="w-48 h-48 object-contain rounded-lg border border-gray-200 shadow-sm mb-2"
                    />
                    
                    <button
                      onClick={() => {
                        // Gọi API để cập nhật trạng thái
                        const confirmPayment = async (paidAmount: number) => {
                          try {
                            const expectedTotal = order.total_amount > 0 ? order.total_amount : order.sub_total;
                            const newStatus = paidAmount >= expectedTotal ? 'PAID' : 'PARTIAL';
                            
                            await api.patch(`/orders/${order.id}`, { 
                              payment_status: newStatus,
                              paid_amount: (Number(order.paid_amount || 0) + paidAmount),
                              status: 'COMPLETED' 
                            });
                            
                            if (newStatus === 'PARTIAL') {
                              toast.success(`Đã ghi nhận thanh toán một phần. Bạn còn nợ ${new Intl.NumberFormat('vi-VN').format(expectedTotal - paidAmount)}đ`);
                            } else {
                              toast.success('Xác nhận thành công! Đơn hàng đã thanh toán đủ.');
                            }
                            fetchOrders();
                          } catch (err: any) {
                            toast.error(err.response?.data?.error || 'Lỗi khi xác nhận thanh toán');
                          }
                        };
                        
                        setPromptPaymentOrder({
                          order,
                          confirmPayment
                        });
                      }}
                      className="w-full mt-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-sm flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={18} /> Tôi đã chuyển khoản xong
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-3 text-center">Hoặc thanh toán tiền mặt trực tiếp cho thợ khi hoàn thành.</p>
                  </div>
                )}

                {order.technicians?.users?.full_name && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Thợ sửa: <strong className="text-gray-900 dark:text-white">{order.technicians.users.full_name}</strong>
                    </span>
                    {order.technicians.users.phone && (
                      <span className="text-sm text-gray-500">- {order.technicians.users.phone}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CustomerBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookOrder}
        bookingData={bookingData}
        setBookingData={setBookingData}
        isSubmitting={isSubmitting}
      />
      
      <PromptModal
        isOpen={!!promptPaymentOrder}
        title="Xác nhận thanh toán"
        message={`Nhập số tiền bạn ĐÃ CHUYỂN KHOẢN cho đơn hàng này (Tổng cộng là ${
          promptPaymentOrder ? new Intl.NumberFormat('vi-VN').format(promptPaymentOrder.order.total_amount > 0 ? promptPaymentOrder.order.total_amount : promptPaymentOrder.order.sub_total) : 0
        }đ):`}
        defaultValue="0"
        inputType="text"
        confirmText="Đã chuyển khoản"
        onConfirm={(val) => {
          const paidAmount = Number(val.replace(/[^0-9]/g, ''));
          if (paidAmount >= 0) {
            promptPaymentOrder?.confirmPayment(paidAmount);
          } else {
            toast.error('Số tiền không hợp lệ');
          }
        }}
        onCancel={() => setPromptPaymentOrder(null)}
      />
    </div>
  );
};
