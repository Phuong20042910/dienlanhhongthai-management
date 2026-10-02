import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Vùng nội dung chính, thụt lề khi có sidebar trên desktop */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Nội dung trang */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
