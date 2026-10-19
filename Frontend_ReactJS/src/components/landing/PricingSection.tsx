import React from 'react';
import { Check, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

const PRICING_PLANS = [
  {
    name: 'Vệ Sinh Máy Lạnh Treo Tường',
    price: '150.000đ',
    unit: 'máy',
    desc: 'Dành cho máy lạnh gia đình từ 1.0 HP – 2.5 HP',
    features: [
      'Xịt rửa áp lực cao dàn lạnh & dàn nóng',
      'Vệ sinh lưới lọc, lồng sóc khử khuẩn',
      'Thông đường ống nước xả, chống chảy nước',
      'Đo kiểm tra dòng điện và áp suất gas',
      'Giảm còn 130.000đ/máy từ máy thứ 2',
      'Bảo hành chống chảy nước 30 ngày'
    ],
    isPopular: true
  },
  {
    name: 'Bơm Nạp Gas Bổ Sung',
    price: '250.000đ',
    unit: 'lần',
    desc: 'Gas R32, R410A hoặc R22 chính hãng 100%',
    features: [
      'Đo áp suất gas bằng đồng hồ chuyên dụng',
      'Kiểm tra rò rỉ tại các đầu tán, co nối',
      'Nạp bổ sung gas đạt chuẩn PSI của hãng',
      'Kiểm tra độ lạnh sâu sau khi nạp',
      'Tặng kèm vệ sinh lưới lọc dàn lạnh',
      'Bảo hành áp suất gas 03 tháng'
    ],
    isPopular: false
  },
  {
    name: 'Vệ Sinh Máy Giặt Cửa Ngang / Đứng',
    price: '250.000đ',
    unit: 'máy',
    desc: 'Cửa trên từ 250k • Cửa ngang từ 450k',
    features: [
      'Tháo rời lồng giặt xịt rửa cặn bẩn bám cứng',
      'Tẩy sạch nấm mốc và mùi hôi bằng dung dịch',
      'Bôi mỡ bò trục quay, căn chỉnh dây curoa',
      'Vệ sinh bơm xả và lưới lọc van cấp',
      'Khử mùi lồng giặt triệt để',
      'Bảo hành êm ái, sạch sẽ 30 ngày'
    ],
    isPopular: false
  }
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="scroll-mt-20 py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full uppercase tracking-wider">
            Minh bạch & Rõ ràng
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Bảng Giá Dịch Vụ Niêm Yết Công Khai
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Cam kết 100% báo giá trước khi làm. Thợ không tự ý thu thêm tiền ngoài thỏa thuận. Mọi dịch vụ đều xuất hóa đơn và bảo hành điện tử.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 flex flex-col transition-all relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 md:-translate-y-3'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-extrabold text-xs rounded-full shadow-md uppercase tracking-wider">
                  Gói Được Chọn Nhiều Nhất
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-extrabold ${plan.isPopular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-1 ${plan.isPopular ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {plan.desc}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black font-mono">
                    {plan.price}
                  </span>
                  <span className={`text-xs font-semibold ${plan.isPopular ? 'text-blue-200' : 'text-gray-500'}`}>
                    / {plan.unit}
                  </span>
                </div>
              </div>

              {/* Danh sách quyền lợi */}
              <ul className="space-y-3.5 mb-8 flex-1 text-sm">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      size={18}
                      className={`shrink-0 mt-0.5 ${
                        plan.isPopular ? 'text-blue-200' : 'text-emerald-500'
                      }`}
                    />
                    <span className={plan.isPopular ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#booking"
                className={`w-full py-3.5 rounded-2xl font-bold text-center text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                <span>Chọn Gói & Đặt Lịch</span>
                <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>

        {/* Cam kết thêm */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Chính sách bảo hành không hỏi khó</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Bảo hành lại miễn phí 100% nếu sự cố tái phát trong thời hạn bảo hành ghi trên hóa đơn điện tử.
              </p>
            </div>
          </div>
          <a
            href="tel:0901234567"
            className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-blue-200 dark:border-gray-700 hover:bg-blue-50 transition-colors shrink-0"
          >
            Tư vấn báo giá khác: 090 123 4567
          </a>
        </div>
      </div>
    </section>
  );
};
