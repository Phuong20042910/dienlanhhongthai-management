import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, CheckCircle2, Clock, MapPin, Phone, Star, ArrowLeft, ShieldCheck, Camera, UserCheck, Sun, Moon, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const PublicOrderLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  // State cho đánh giá sao
  const [ratingOrder, setRatingOrder] = useState<any | null>(null);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Vui lòng nhập Số điện thoại hoặc Mã đơn hàng');
      return;
    }

    try {
      setIsSearching(true);
      setHasSearched(true);
      const res = await axios.get(`${API_URL}/orders/lookup`, {
        params: { q: query.trim() }
      });
      setOrders(res.data || []);
      if (res.data.length === 0) {
        toast('Không tìm thấy đơn hàng nào phù hợp.', { icon: 'ℹ️' });
      }
    } catch (error: any) {
      console.error('Lỗi tra cứu:', error);
      toast.error('Lỗi khi tra cứu đơn hàng');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendReview = async () => {
    if (!ratingOrder) return;
    try {
      setIsSubmittingReview(true);
      await axios.post(`${API_URL}/orders/public-review/${ratingOrder.id}`, {
        rating: selectedStars,
        review: reviewComment
      });
      toast.success('Cảm ơn bạn đã gửi đánh giá chất lượng dịch vụ!');
      
      // Cập nhật lại UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === ratingOrder.id
            ? { ...o, rating: selectedStars, review: reviewComment }
            : o
        )
      );
      setRatingOrder(null);
      setReviewComment('');
    } catch (error: any) {
      console.error('Lỗi đánh giá:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chờ tiếp nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', step: 1 };
      case 'CONFIRMED':
        return { text: 'Đã xác nhận & Điều thợ', color: 'bg-blue-100 text-blue-800 border-blue-200', step: 2 };
      case 'IN_PROGRESS':
        return { text: 'Thợ đang xử lý tại nhà', color: 'bg-purple-100 text-purple-800 border-purple-200', step: 3 };
      case 'COMPLETED':
        return { text: 'Đã hoàn thành', color: 'bg-green-100 text-green-800 border-green-200', step: 4 };
      case 'CANCELLED':
        return { text: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200', step: 0 };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800', step: 1 };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-16 transition-colors">
      {/* Top Navbar */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/80 dark:border-gray-800 px-6 py-4 transition-colors">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              HT
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-blue-700 dark:text-blue-400 tracking-tight leading-none">ĐIỆN LẠNH HỒNG THÁI</h1>
              <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Tra Cứu Tiến Độ & Bảo Hành Điện Tử</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer"
              title={isDarkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 bg-gray-100 dark:bg-gray-800 rounded-xl transition-all"
            >
              <Home size={14} /> Trang chủ
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft size={14} /> Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section & Search Bar */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
        <span className="inline-block px-3.5 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider mb-3">
          Tra cứu nhanh không cần tài khoản
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Kiểm Tra Tiến Độ Đơn Hàng & Bảo Hành
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Nhập số điện thoại đặt lịch hoặc mã đơn hàng (ví dụ: <span className="font-mono font-bold text-blue-600">0901234567</span> hoặc <span className="font-mono font-bold text-blue-600">ORD-XXXX</span>) để theo dõi.
        </p>

        {/* Form Tra Cứu */}
        <form onSubmit={handleSearch} className="mt-8 flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập số điện thoại hoặc mã đơn..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-50"
          >
            {isSearching ? 'Đang tìm...' : 'Tra Cứu'}
          </button>
        </form>
      </section>

      {/* Danh sách kết quả tra cứu */}
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {hasSearched && orders.length === 0 && !isSearching && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">Không tìm thấy thông tin đơn hàng</h3>
            <p className="text-xs text-gray-500 mt-1">
              Vui lòng kiểm tra lại số điện thoại hoặc liên hệ Hotline: <span className="font-bold text-blue-600">090 123 4567</span> để được hỗ trợ trực tiếp.
            </p>
          </div>
        )}

        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const finalCost = order.total_amount > 0 ? order.total_amount : (order.sub_total || 0);

          return (
            <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 hover:shadow-md transition-all">
              {/* Header Card */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-100 pb-5">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Mã Đơn Dịch Vụ</span>
                  <h3 className="text-xl font-extrabold text-blue-700 font-mono mt-0.5">{order.order_code}</h3>
                  <p className="text-base font-bold text-gray-800 mt-1">{order.service_type}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3.5 py-1 text-xs font-bold rounded-full border ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    Đặt lúc: {new Date(order.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Tiến trình 4 bước */}
              <div className="my-6">
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-gray-500">
                  <div className={`py-2 rounded-xl border ${statusInfo.step >= 1 ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-gray-50'}`}>
                    1. Tiếp nhận
                  </div>
                  <div className={`py-2 rounded-xl border ${statusInfo.step >= 2 ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-gray-50'}`}>
                    2. Phân công thợ
                  </div>
                  <div className={`py-2 rounded-xl border ${statusInfo.step >= 3 ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold' : 'bg-gray-50'}`}>
                    3. Đang xử lý
                  </div>
                  <div className={`py-2 rounded-xl border ${statusInfo.step >= 4 ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-gray-50'}`}>
                    4. Hoàn thành
                  </div>
                </div>
              </div>

              {/* Chi tiết Địa chỉ & Kỹ thuật viên */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Địa chỉ thi công</p>
                      <p className="font-medium text-gray-800">{order.address}</p>
                    </div>
                  </div>
                  {order.description && (
                    <div className="flex items-start gap-2.5 pt-2 border-t border-gray-200">
                      <Clock size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Tình trạng máy / Ghi chú</p>
                        <p className="text-gray-700 italic">{order.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4">
                  <div className="flex items-start gap-2.5">
                    <UserCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Kỹ thuật viên phụ trách</p>
                      <p className="font-bold text-gray-800">
                        {order.technicians?.users?.full_name || 'Đang điều phối thợ...'}
                      </p>
                      {order.technicians?.users?.phone && (
                        <a
                          href={`tel:${order.technicians.users.phone}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-0.5"
                        >
                          <Phone size={12} /> {order.technicians.users.phone} (Bấm để gọi)
                        </a>
                      )}
                    </div>
                  </div>

                  {finalCost > 0 && (
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Tổng chi phí:</span>
                      <span className="font-mono font-bold text-blue-700 text-base">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalCost)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hình ảnh nghiệm thu Hiện trường (Nếu thợ đã chụp) */}
              {((order.before_images && order.before_images.length > 0) || (order.after_images && order.after_images.length > 0)) && (
                <div className="mt-5 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Camera size={15} className="text-blue-600" /> Hình ảnh nghiệm thu thực tế tại nhà
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {order.before_images && order.before_images.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">Ảnh trước khi sửa:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.before_images.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`Before ${i}`} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                          ))}
                        </div>
                      </div>
                    )}
                    {order.after_images && order.after_images.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-green-700 mb-1">Ảnh sau khi hoàn thành:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.after_images.map((url: string, i: number) => (
                            <img key={i} src={url} alt={`After ${i}`} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chữ ký nghiệm thu đã lưu */}
              {order.customer_signature && (
                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-900">Đã ký nghiệm thu bàn giao</p>
                    <p className="text-[11px] text-blue-700">Biên bản bàn giao đã có chữ ký xác nhận của khách hàng.</p>
                  </div>
                  <img src={order.customer_signature} alt="Chữ ký" className="h-10 max-w-[120px] object-contain bg-white rounded p-1 border" />
                </div>
              )}

              {/* Đánh giá dịch vụ 1 - 5 sao (Nếu đơn hoàn thành) */}
              {order.status === 'COMPLETED' && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  {order.rating ? (
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex items-start gap-3">
                      <div className="flex text-amber-400 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={18} fill={s <= order.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-900">Đánh giá của bạn ({order.rating}/5 sao)</p>
                        {order.review && <p className="text-xs text-amber-800 mt-0.5 italic">"{order.review}"</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                          <Star className="text-amber-500 fill-amber-500" size={16} /> Bạn có hài lòng với dịch vụ không?
                        </h4>
                        <p className="text-xs text-blue-700 mt-0.5">Hãy đánh giá tay nghề và thái độ phục vụ của thợ nhé!</p>
                      </div>
                      <button
                        onClick={() => {
                          setRatingOrder(order);
                          setSelectedStars(5);
                          setReviewComment('');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        Đánh giá ngay
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Modal Chấm sao và Viết nhận xét */}
      {ratingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Đánh Giá Dịch Vụ</h3>
            <p className="text-xs text-gray-500">
              Đơn hàng: <span className="font-mono font-bold text-blue-600">{ratingOrder.order_code}</span> - KTV: {ratingOrder.technicians?.users?.full_name || 'Hồng Thái'}
            </p>

            {/* Chọn số sao */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStars(s)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star size={32} fill={s <= selectedStars ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-600">
              {selectedStars === 5 ? 'Tuyệt vời, rất hài lòng! ⭐⭐⭐⭐⭐' : selectedStars === 4 ? 'Hài lòng, thợ tốt! ⭐⭐⭐⭐' : selectedStars === 3 ? 'Bình thường ⭐⭐⭐' : 'Cần cải thiện ⭐⭐'}
            </p>

            {/* Ô nhận xét */}
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Nhận xét thêm về thái độ thợ, độ sạch sẽ, tính đúng giờ... (tùy chọn)"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRatingOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSendReview}
                disabled={isSubmittingReview}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
