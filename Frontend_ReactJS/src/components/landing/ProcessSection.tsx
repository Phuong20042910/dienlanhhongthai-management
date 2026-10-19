import React from 'react';
import { CalendarCheck, Navigation, Camera, QrCode } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: CalendarCheck,
    title: 'Đặt Lịch Trong 30 Giây',
    desc: 'Chọn loại dịch vụ, khung giờ bạn rảnh rỗi và nhập địa chỉ. Nhân viên sẽ xác nhận đơn tức thì.',
    highlight: 'Nhanh chóng & Tiện lợi'
  },
  {
    step: '02',
    icon: Navigation,
    title: 'Thợ Đến Sau 30 Phút',
    desc: 'Hệ thống định vị Goong.io dẫn đường thợ chính xác đến từng số nhà, ngách hẻm. Thợ gọi điện báo giờ đến trước 15 phút.',
    highlight: 'Bản đồ Goong Map'
  },
  {
    step: '03',
    icon: Camera,
    title: 'Báo Giá & Nghiệm Thu Có Ảnh',
    desc: 'Kiểm tra máy và báo giá trước khi làm. Thợ chụp ảnh Trước/Sau và bạn ký nghiệm thu trực tiếp trên điện thoại thợ.',
    highlight: 'Minh bạch 100%'
  },
  {
    step: '04',
    icon: QrCode,
    title: 'Thanh Toán QR & Bảo Hành Điện Tử',
    desc: 'Quét mã VietQR tiện lợi không cần tiền mặt. Hệ thống tự động kích hoạt Sổ bảo hành điện tử tra cứu online bất kỳ lúc nào.',
    highlight: 'Bảo hành điện tử'
  }
];

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="scroll-mt-20 py-20 bg-gray-50/70 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full uppercase tracking-wider">
            Quy trình làm việc
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quy Trình 4 Bước Số Hóa Chuyên Nghiệp
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Không còn nỗi lo thợ chặt chém, trễ giờ hay mất giấy bảo hành. Điện Lạnh Hồng Thái số hóa toàn bộ trải nghiệm của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-7 shadow-sm border border-gray-200/80 dark:border-gray-700 relative flex flex-col group hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                {/* Con số thứ tự */}
                <span className="text-4xl font-black text-gray-200 dark:text-gray-700 font-mono absolute top-6 right-6 select-none group-hover:text-blue-500/20 transition-colors">
                  {item.step}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>

                <span className="inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-md text-[11px] font-bold w-fit mb-2">
                  {item.highlight}
                </span>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
