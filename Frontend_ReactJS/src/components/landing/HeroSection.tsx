import React from 'react';
import { ArrowRight, ShieldCheck, Clock, MapPin, Star, Wrench, Sparkles, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Subtle Background Radial Gradient (Zero Lag) */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Văn bản & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
              <Sparkles size={14} className="text-blue-600" />
              <span>Thợ có mặt sau 30 phút • Định vị Goong Map chuẩn từng ngõ ngách</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.15]">
              Dịch Vụ Sửa Chữa & Bảo Dưỡng{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Điện Lạnh Toàn Diện
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Điện Lạnh Hồng Thái chuyên bảo trì, vệ sinh máy lạnh, nạp gas, sửa bo mạch tủ lạnh, máy giặt tận nơi. Báo giá niêm yết rõ ràng, nghiệm thu có ảnh thực tế & chữ ký điện tử minh bạch.
            </p>

            {/* Các nút CTA */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#booking"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
              >
                <span>Đặt Lịch Hẹn Ngay</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/tra-cuu"
                className="px-7 py-4 rounded-2xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-100 font-bold text-base border border-gray-200 dark:border-gray-700 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Tra Cứu Đơn & Bảo Hành</span>
              </Link>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chưa có tài khoản quản lý hay thợ?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Đăng ký tài khoản ngay →
              </Link>
            </p>

            {/* Cam kết ngắn */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <Clock className="text-blue-600 shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Nhanh chóng</p>
                  <p className="text-[11px] text-gray-500">Đến sau 30 phút</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Bảo hành dài</p>
                  <p className="text-[11px] text-gray-500">Từ 03 - 12 tháng</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="text-rose-600 shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Đúng địa chỉ</p>
                  <p className="text-[11px] text-gray-500">Bản đồ Goong.io</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Card đồ họa dịch vụ trực quan */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Card chính */}
              <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-7 shadow-2xl border border-gray-200/80 dark:border-gray-700 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white">
                      <Wrench size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Hồ Sơ Điện Lạnh Hồng Thái</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Trung tâm cứu hộ điện lạnh tận nhà</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 font-bold text-xs rounded-full">
                    Sẵn sàng 24/7
                  </span>
                </div>

                {/* Thống kê con số */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">10.000+</p>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Khách hàng tin chọn</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Linh kiện chính hãng</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">30+</p>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Kỹ thuật viên lành nghề</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center text-amber-500 font-black text-2xl gap-1">
                      <span>4.9</span>
                      <Star size={20} fill="currentColor" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">Đánh giá chất lượng</p>
                  </div>
                </div>

                {/* Hộp gọi khẩn cấp */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-xs text-blue-100 font-medium">Cần hỗ trợ gấp hôm nay?</p>
                    <p className="text-lg font-black tracking-wide">090 123 4567</p>
                  </div>
                  <a
                    href="tel:0901234567"
                    className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                    title="Gọi ngay"
                  >
                    <PhoneCall size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
