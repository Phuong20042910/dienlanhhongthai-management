import { useAuthStore } from '../store/authStore';
import { AdminDashboard } from './AdminDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  // Mặc định trả về AdminDashboard nếu chưa phân quyền rõ ràng hoặc là ADMIN/BOSS
  if (user?.role === 'TECHNICIAN') {
    return <TechnicianDashboard />;
  }

  return <AdminDashboard />;
};
