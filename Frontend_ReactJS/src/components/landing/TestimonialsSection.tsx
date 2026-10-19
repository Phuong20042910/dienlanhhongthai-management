import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Anh Trần Tuấn Hưng',
    role: 'Căn hộ chung cư Royal City, Thanh Xuân',
    service: 'Vệ sinh 3 máy lạnh Daikin Inverter',
    stars: 5,
    comment:
      'Thợ đến rất đúng giờ, mang bạt che chắn cẩn thận không làm văng nước ra sàn gỗ. Rửa xong máy lạnh mát sâu hẳn và không còn mùi ẩm mốc. Rất ưng ý với việc có chụp ảnh trước sau và ký nghiệm thu trên điện thoại.',
    avatar: 'H'
  },
  {
    name: 'Chị Mai Lan Anh',
    role: 'Nhà riêng phố Đội Cấn, Ba Đình',
    service: 'Sửa bo mạch & nạp gas tủ lạnh Hitachi',
    stars: 5,
    comment:
      'Tủ lạnh bị mất lạnh ngăn đông tưởng phải thay tủ mới, may nhờ thợ Hồng Thái kiểm tra phát hiện hỏng cảm biến nhiệt. Báo giá đúng giá niêm yết, sửa xong có phiếu bảo hành 6 tháng nên rất yên tâm.',
    avatar: 'L'
  },
  {
    name: 'Anh Nguyễn Quốc Bảo',
    role: 'Chủ chuỗi Cafe The Coffee House, Cầu Giấy',
    service: 'Bảo trì định kỳ máy lạnh âm trần',
    stars: 5,
    comment:
      'Quán kinh doanh đông khách nên máy lạnh chạy liên tục. Đặt lịch bảo dưỡng bên Hồng Thái thợ làm rất chuyên nghiệp, xử lý sạch sẽ vào buổi sáng sớm trước giờ mở cửa. Xuất hóa đơn công ty đầy đủ.',
    avatar: 'B'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50/70 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-full uppercase tracking-wider">
            Khách hàng nói về chúng tôi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Hơn 10.000+ Khách Hàng Đã Tin Tưởng
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Sự hài lòng và tin cậy của quý khách là thước đo thành công lớn nhất của toàn thể đội ngũ Điện Lạnh Hồng Thái.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200/80 dark:border-gray-700 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={28} className="text-blue-100 dark:text-gray-700" />
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 size={14} className="text-blue-600 fill-blue-100" />
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{rev.role}</p>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">{rev.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
