import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { Technicians } from './pages/Technicians';
import { Customers } from './pages/Customers';
import { Payslips } from './pages/Payslips';
import { AIChat } from './pages/AIChat';
import { CustomerOrders } from './pages/CustomerOrders';
import { TechnicianOrders } from './pages/TechnicianOrders';
import { CustomerShop } from './pages/CustomerShop';
import { CustomerDebts } from './pages/CustomerDebts';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Toaster } from 'react-hot-toast';

import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { PayrollManagement } from './pages/PayrollManagement';
import { PublicOrderLookup } from './pages/PublicOrderLookup';
import { LandingPage } from './pages/LandingPage';



// Protected Route Component
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

// Wrapper để tự động phân luồng giao diện Orders
const OrdersRoute = () => {
  const role = useAuthStore((state) => state.user?.role);
  if (role === 'CUSTOMER') {
    return <CustomerOrders />;
  }
  if (role === 'TECHNICIAN') {
    return <TechnicianOrders />;
  }
  return <Orders />;
};

// Wrapper để tự động phân luồng giao diện Lương (Boss xem quản lý, Thợ xem cá nhân)
const PayrollRoute = () => {
  const role = useAuthStore((state) => state.user?.role);
  if (role === 'BOSS' || role === 'ADMIN') {
    return <PayrollManagement />;
  }
  return <Payslips />;
};

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tra-cuu" element={<PublicOrderLookup />} />

        {/* Protected Routes (Hệ thống quản lý nội bộ) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersRoute />} />
            <Route path="/shop" element={<CustomerShop />} />
            <Route path="/debts" element={<CustomerDebts />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/payslips" element={<PayrollRoute />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>


        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
