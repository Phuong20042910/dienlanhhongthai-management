import React from 'react';
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
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Protected Route Component
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="technicians" element={<Technicians />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Inventory />} /> {/* Tạm gán báo cáo sang Inventory để xem chức năng Kho */}
            <Route path="payslips" element={<Payslips />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
