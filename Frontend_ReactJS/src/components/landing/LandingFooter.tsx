import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                HT
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                ĐIỆN LẠNH HỒNG THÁI
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hệ thống sửa chữa, bảo dưỡng và lắp đặt điện lạnh dân dụng & công nghiệp uy tín hàng đầu. Cam kết chất lượng, bảo hành điện tử minh bạch.
            </p>
            <div className="space-y-2 text-xs text-gray-400 pt-2">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-blue-500 shrink-0" />
                <span>Phục vụ tận nơi khắp khu vực nội ngoại thành</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-blue-500 shrink-0" />
                <a href="tel:0901234567" className="hover:text-white font-bold text-white">
                  Hotline / Zalo: 090 123 4567
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-blue-500 shrink-0" />
                <span>hotro@dienlanhhongthai.vn</span>
              </p>
            </div>
          </div>

          {/* Cột 2: Dịch vụ tiêu biểu */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Dịch Vụ Cung Cấp</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Sửa chữa máy lạnh không lạnh / chảy nước</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Vệ sinh & bảo dưỡng máy lạnh gia đình</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Bơm nạp gas R32, R410A, R22 chính hãng</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Sửa tủ lạnh không đông đá, xì gas</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Sửa chữa & vệ sinh lồng máy giặt</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Thi công ống đồng & lắp đặt máy lạnh</a></li>
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/tra-cuu" className="hover:text-white font-semibold text-emerald-400">🔍 Tra cứu đơn & sổ bảo hành</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Bảng giá niêm yết công khai</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">Quy trình 4 bước tiếp nhận</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Đặt lịch trực tuyến 30 giây</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Cổng đăng nhập nội bộ (Thợ & QL)</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Đăng ký tài khoản mới</Link></li>
            </ul>
          </div>

          {/* Cột 4: Giờ làm việc & Cam kết */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thời Gian Phục Vụ</h4>
            <div className="p-4 bg-gray-800/80 rounded-2xl border border-gray-700/60 space-y-2 text-xs">
              <p className="flex items-center gap-2 text-white font-semibold">
                <Clock size={16} className="text-blue-400" /> 07:30 – 21:00 Hàng ngày
              </p>
              <p className="text-gray-400">Làm việc cả Thứ 7, Chủ Nhật và các ngày nghỉ lễ.</p>
              <div className="pt-2 border-t border-gray-700 flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck size={16} /> 100% Bảo hành điện tử
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Điện Lạnh Hồng Thái. Bản quyền đã được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Ứng dụng số hóa vận hành thông minh bởi <span className="text-gray-400 font-bold">Điện Lạnh Hồng Thái EMS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
