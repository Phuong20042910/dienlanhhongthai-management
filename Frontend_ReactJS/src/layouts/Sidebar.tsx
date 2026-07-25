import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Wrench, 
  Users, 
  BarChart3, 
  LogOut,
  Banknote
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const adminNavItems = [
  { name: 'Tổng quan', icon: LayoutDashboard, path: '/' },
  { name: 'Đơn hàng', icon: ClipboardList, path: '/orders' },
  { name: 'Kỹ thuật viên', icon: Wrench, path: '/technicians' },
  { name: 'Khách hàng', icon: Users, path: '/customers' },
  { name: 'Báo cáo / Kho', icon: BarChart3, path: '/reports' },
];

const techNavItems = [
  { name: 'Tổng quan', icon: LayoutDashboard, path: '/' },
  { name: 'Đơn của tôi', icon: ClipboardList, path: '/orders' },
  { name: 'Phiếu lương', icon: Banknote, path: '/payslips' },
];

export const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'TECHNICIAN' ? techNavItems : adminNavItems;

  return (
    <>
      {/* Overlay cho Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar chính */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <span className="bg-blue-600 text-white p-1 rounded-md">
                <Wrench size={24} />
              </span>
              Hồng Thái EMS
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
