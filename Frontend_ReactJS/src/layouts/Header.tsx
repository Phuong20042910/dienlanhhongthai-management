import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Nút mở menu trên Mobile */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu size={24} />
        </button>
        
        {/* Ngày giờ (chỉ hiện trên Desktop) */}
        <div className="hidden md:block text-sm text-gray-500 font-medium">
          Hôm nay: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Thông báo */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            <User size={18} />
          </div>
          <div className="hidden sm:block text-sm mr-1">
            <p className="font-semibold text-gray-700 leading-none">{user?.full_name || 'Người dùng'}</p>
            <p className="text-xs text-gray-500 mt-1">{user?.role || 'Khách'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
