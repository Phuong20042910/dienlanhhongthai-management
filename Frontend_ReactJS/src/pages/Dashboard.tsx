import { useAuthStore } from '../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import { Navigate } from 'react-router-dom';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/orders" replace />;
  }

  if (user?.role === 'TECHNICIAN') {
    return <TechnicianDashboard />;
  }

  return <AdminDashboard />;
};
