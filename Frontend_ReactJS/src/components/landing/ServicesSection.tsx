import React from 'react';
import { Wind, Wrench, Droplets, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: Wind,
    title: 'Sửa Chữa Máy Lạnh',
    desc: 'Xử lý triệt để các sự cố máy không mát, chảy nước, chớp đèn mã lỗi, hỏng tụ, thay máy nén (block), sửa bo mạch inverter.',
    tags: ['Daikin', 'Panasonic', 'Casper', 'Toshiba', 'LG'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Droplets,
    title: 'Vệ Sinh & Bảo Dưỡng Điều Hòa',
    desc: 'Xịt rửa áp lực cao dàn lạnh & dàn nóng, diệt khuẩn lồng sóc, thông đường ống nước xả, kiểm tra dòng điện ampe an toàn.',
    tags: ['Sạch 99% bụi bẩn', 'Tiết kiệm 30% điện', 'Bảo hành chảy nước'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    icon: Zap,
    title: 'Bơm Nạp Gas Máy Lạnh Chuẩn PSI',
    desc: 'Nạp bổ sung hoặc thay mới toàn bộ gas R32, R410A, R22 nhập khẩu chính hãng. Đo đồng hồ áp suất chuẩn trước và sau khi nạp.',
    tags: ['Gas R32', 'Gas R410A', 'Gas R22', 'Không pha tạp'],
    color: 'from-indigo-500 to-purple-600'
  },
  {
    icon: Wrench,
    title: 'Sửa Chữa Tủ Lạnh / Tủ Đông',
    desc: 'Chuyên trị tủ không lạnh, ngăn đá không đông, tủ đóng tuyết, xì gas, hỏng rơ le nhiệt, thay ron cửa cao su kín khít.',
    tags: ['Side by side', 'Inverter', 'Tủ đông mini', 'Bảo hành 6T'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Wind,
    title: 'Sửa & Vệ Sinh Máy Giặt',
    desc: 'Tháo lồng xịt rửa cặn bẩn xà phòng lâu năm, sửa máy giặt không vắt, không cấp nước, kêu rung lắc mạnh khi hoạt động.',
    tags: ['Lồng ngang', 'Lồng đứng', 'Electrolux', 'LG', 'Toshiba'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Shield,
    title: 'Lắp Đặt & Di Dời Máy Lạnh',
    desc: 'Tháo lắp an toàn, thi công ống đồng thẩm mỹ, hút chân không khử ẩm tuyệt đối theo tiêu chuẩn lắp đặt của các hãng hàng đầu.',
    tags: ['Hút chân không', 'Ống đồng dày', 'Đẹp thẩm mỹ'],
    color: 'from-rose-500 to-pink-600'
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="scroll-mt-20 py-20 bg-gray-50/70 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-full uppercase tracking-wider">
            Dịch vụ của chúng tôi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Giải Pháp Điện Lạnh Toàn Diện & Uy Tín
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Đội ngũ thợ tay nghề cao, được trang bị dụng cụ hiện đại và quy trình kiểm tra nghiêm ngặt, luôn sẵn sàng phục vụ quý khách tại mọi ngõ ngách.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((srv, index) => {
            const Icon = srv.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-200/80 dark:border-gray-700/80 transition-all hover:-translate-y-1 flex flex-col group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${srv.color} flex items-center justify-center text-white mb-6 shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1 leading-relaxed">
                  {srv.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 dark:border-gray-700/60 mb-6">
                  {srv.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle size={10} className="text-emerald-500" />
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="#booking"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 group-hover:gap-2.5 transition-all mt-auto"
                >
                  <span>Đặt lịch dịch vụ này</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
