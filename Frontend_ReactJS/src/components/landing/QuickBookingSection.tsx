import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Phone, MapPin, Wrench, Clock, CheckCircle2, Send, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const SERVICE_OPTIONS = [
  'Vệ sinh máy lạnh treo tường',
  'Vệ sinh máy lạnh âm trần / tủ đứng',
  'Sửa chữa máy lạnh không lạnh / chảy nước',
  'Nạp gas bổ sung (R32 / R410A / R22)',
  'Sửa chữa tủ lạnh / tủ đông',
  'Sửa chữa & Vệ sinh máy giặt',
  'Lắp đặt / Di dời máy lạnh',
  'Khác (Cần tư vấn trực tiếp)'
];

const BRAND_OPTIONS = ['Daikin', 'Panasonic', 'Casper', 'Toshiba', 'LG', 'Funiki', 'Samsung', 'Khác'];

const TIME_SLOTS = [
  'Sáng (08:00 - 11:30)',
  'Chiều (13:30 - 17:00)',
  'Tối (17:30 - 20:00)',
  'Càng sớm càng tốt (Cấp cứu)'
];

export const QuickBookingSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    serviceType: SERVICE_OPTIONS[0],
    deviceBrand: BRAND_OPTIONS[0],
    timeSlot: TIME_SLOTS[0],
    address: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedOrder, setBookedOrder] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_URL}/orders/public-book`, {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        service_type: formData.serviceType,
        device_brand: formData.deviceBrand,
        scheduled_slot: formData.timeSlot,
        address: formData.address.trim(),
        description: `[Hãng máy: ${formData.deviceBrand}] [Khung giờ: ${formData.timeSlot}]\n${formData.description.trim()}`
      });

      setBookedOrder(res.data);
      toast.success('Đặt lịch thành công! Nhân viên sẽ gọi xác nhận trong 5 phút.');
    } catch (error: any) {
      console.error('Lỗi đặt lịch:', error);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi đặt lịch. Vui lòng gọi trực tiếp hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="scroll-mt-20 py-20 bg-white dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200/80 dark:border-gray-700">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="px-3.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-full uppercase tracking-wider">
              Đặt lịch nhanh trong 30 giây
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Yêu Cầu Kỹ Thuật Viên Tận Nơi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nhập thông tin bên dưới, nhân viên điều phối sẽ liên hệ xác nhận và thợ sẽ có mặt đúng giờ hẹn.
            </p>
          </div>

          {bookedOrder ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-200 dark:border-emerald-800 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                Đặt Lịch Thành Công!
              </h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Mã đơn dịch vụ của bạn là:{' '}
                <span className="font-mono font-black text-lg text-emerald-700 dark:text-emerald-400 bg-white dark:bg-gray-900 px-3 py-1 rounded-lg border border-emerald-300 inline-block mt-1">
                  {bookedOrder.order_code}
                </span>
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Bạn có thể dùng Số điện thoại hoặc Mã đơn này để tra cứu tiến độ thợ di chuyển trên trang{' '}
                <a href="/tra-cuu" className="font-bold underline">
                  Tra cứu đơn hàng
                </a>.
              </p>
              <button
                onClick={() => {
                  setBookedOrder(null);
                  setFormData({
                    fullName: '',
                    phone: '',
                    serviceType: SERVICE_OPTIONS[0],
                    deviceBrand: BRAND_OPTIONS[0],
                    timeSlot: TIME_SLOTS[0],
                    address: '',
                    description: ''
                  });
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Đặt thêm yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Anh Minh"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="VD: 0901234567"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Loại dịch vụ */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Dịch vụ cần phục vụ *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    {SERVICE_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hãng máy & Khung giờ */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Hãng máy
                    </label>
                    <select
                      value={formData.deviceBrand}
                      onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                      className="w-full px-3 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    >
                      {BRAND_OPTIONS.map((brand, i) => (
                        <option key={i} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Khung giờ
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-3 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    >
                      {TIME_SLOTS.map((slot, i) => (
                        <option key={i} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Địa chỉ số nhà, ngõ/ngách cụ thể *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="VD: Số 24 ngõ 180 đường Nguyễn Trãi, Thanh Xuân, Hà Nội"
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  * Hệ thống tích hợp Goong Map sẽ định vị chính xác địa chỉ của bạn để thợ đến nhanh nhất.
                </p>
              </div>

              {/* Mô tả lỗi thêm */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Mô tả tình trạng lỗi (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="VD: Máy lạnh bật không mát, kêu to ở cục nóng ngoài ban công..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Đang gửi thông tin...' : 'Xác Nhận Đặt Lịch Hẹn Ngay'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
