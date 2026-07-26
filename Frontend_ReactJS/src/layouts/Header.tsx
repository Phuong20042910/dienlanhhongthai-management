import React from 'react';
import { Menu, Bell, User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const user = useAuthStore((state) => state.user);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Nút mở menu trên Mobile */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden transition-colors"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu size={24} />
        </button>
        
        {/* Ngày giờ (chỉ hiện trên Desktop) */}
        <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 font-medium">
          Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Nút chuyển Dark/Light Mode */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title={isDarkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Thông báo */}
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ml-1">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center overflow-hidden">
            <User size={18} />
          </div>
          <div className="hidden sm:block text-sm mr-1">
            <p className="font-semibold text-gray-700 dark:text-gray-200 leading-none">{user?.full_name || 'Người dùng'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.role || 'Khách'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
