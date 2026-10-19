import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Search, User, UserPlus, Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20 gap-4">
          {/* Logo & Thương hiệu */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              HT
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap leading-tight">
                ĐIỆN LẠNH HỒNG THÁI
              </span>
              <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase flex items-center gap-1 whitespace-nowrap leading-none mt-0.5">
                <ShieldCheck size={12} className="text-blue-500 shrink-0" /> Dịch vụ uy tín tận tâm
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs xl:text-sm font-semibold text-gray-600 dark:text-gray-300">
            <a href="#services" className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Dịch vụ
            </a>
            <a href="#pricing" className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Bảng giá niêm yết
            </a>
            <a href="#process" className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Quy trình 4 bước
            </a>
            <a href="#booking" className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Đặt lịch online
            </a>
            <Link to="/tra-cuu" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold whitespace-nowrap transition-colors">
              <Search size={14} />
              <span>Tra cứu đơn</span>
            </Link>
          </nav>

          {/* Actions & Hotline */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Nút chuyển đổi Giao diện Sáng / Tối */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 cursor-pointer"
              title={isDarkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-gray-700" />
              )}
            </button>

            <a
              href="tel:0901234567"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              <Phone size={13} className="text-blue-600 shrink-0" />
              <span>090 123 4567</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/orders"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm whitespace-nowrap transition-all"
              >
                Vào Quản Lý ({user?.full_name || 'Tài khoản'})
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 whitespace-nowrap"
                >
                  <User size={13} />
                  <span>Đăng nhập</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm whitespace-nowrap transition-all"
                >
                  <UserPlus size={13} />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Toggle */}
          <div className="lg:hidden flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
              title={isDarkMode ? 'Giao diện Sáng' : 'Giao diện Tối'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>
            <Link
              to="/tra-cuu"
              className="p-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl"
              title="Tra cứu"
            >
              <Search size={18} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 space-y-2.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chế độ hiển thị</span>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {isDarkMode ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>Đang bật: Tối (Bấm để sang Sáng)</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-indigo-600" />
                  <span>Đang bật: Sáng (Bấm để sang Tối)</span>
                </>
              )}
            </button>
          </div>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dịch vụ
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Bảng giá niêm yết
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Quy trình 4 bước
          </a>
          <a
            href="#booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Đặt lịch online
          </a>
          <Link
            to="/tra-cuu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            🔍 Tra cứu đơn & Bảo hành
          </Link>
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <a
              href="tel:0901234567"
              className="w-full text-center py-2.5 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/40 rounded-xl"
            >
              📞 Gọi Hotline: 090 123 4567
            </a>
            {isAuthenticated ? (
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Vào Hệ Thống Quản Lý
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-1"
                >
                  <User size={14} />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm flex items-center justify-center gap-1"
                >
                  <UserPlus size={14} />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

