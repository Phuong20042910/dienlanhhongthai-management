import { useEffect, useState } from 'react';
import api from '../utils/api';
import { MapPin, Phone, CheckCircle, Clock, Banknote, Power } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const TechnicianDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [activeTasks, setActiveTasks] = useState<Record<string, any>[]>([]);
  const [earnings, setEarnings] = useState({ total_salary: 0, working_days: 0, bonus: 0 });
  const [isOnline, setIsOnline] = useState(user?.status === 'ACTIVE');

  const fetchTasks = async () => {
    try {
      // Gọi API lấy danh sách đơn (Backend đã tự động filter đơn của thợ đăng nhập)
      const res = await api.get('/orders');
      
      // Lọc ra các đơn đang chưa hoàn thành (PENDING, ASSIGNED, IN_PROGRESS)
      const tasks = res.data.filter((order: Record<string, any>) => 
        order.status !== 'COMPLETED' && order.status !== 'CANCELLED'
      ).map((order: Record<string, any>) => ({
        id: order.id,
        order_code: order.order_code,
        customer_name: order.customers?.full_name || 'Khách vãng lai',
        customer_phone: order.customers?.phone || 'Chưa cập nhật',
        address: order.address,
        service_type: order.service_type,
        status: order.status,
        time: new Date(order.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
      }));
      
      setActiveTasks(tasks);
    } catch (error) {
      console.error('Lỗi lấy công việc', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await api.get('/payroll/my-payslip');
      if (res.data && res.data.length > 0) {
        const latest = res.data[0];
        setEarnings({
          total_salary: latest.total_salary || 0,
          working_days: latest.working_days || 0,
          bonus: latest.bonus || 0
        });
      }
    } catch (error) {
      console.error('Lỗi lấy thu nhập', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchEarnings();
    }
  }, [token]);

  const handleToggleStatus = () => {
    setIsOnline(!isOnline);
    // TODO: Gọi API cập nhật trạng thái lên server
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header riêng cho Thợ */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chào {user?.full_name?.split(' ').pop() || 'Thợ'},</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        
        {/* Nút gạt trạng thái */}
        <div className="flex flex-col items-center">
          <button 
            onClick={handleToggleStatus}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className={`text-xs font-medium mt-1 ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {isOnline ? 'Sẵn sàng' : 'Đang nghỉ'}
          </span>
        </div>
      </div>

      {/* Thẻ Thu nhập (Động lực) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 rounded-2xl p-5 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-2">
          <Banknote size={24} className="text-blue-200" />
          <h2 className="text-lg font-semibold text-blue-100">Thu nhập tạm tính tháng này</h2>
        </div>
        <p className="text-3xl font-bold">{earnings.total_salary.toLocaleString('vi-VN')} đ</p>
        <div className="mt-4 flex gap-4 text-sm text-blue-200">
          <div><span className="font-semibold text-white">{earnings.working_days}</span> ngày công</div>
          <div><span className="font-semibold text-white">{earnings.bonus.toLocaleString('vi-VN')} đ</span> tiền thưởng</div>
        </div>
      </div>

      {/* Danh sách Công việc */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Công việc hiện tại</h2>
          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {activeTasks.length} Đơn
          </span>
        </div>
        
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <CheckCircle size={40} className="mx-auto text-green-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Bạn đã hoàn thành hết công việc!</p>
            </div>
          ) : (
            activeTasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
                    {task.order_code}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                    task.status === 'IN_PROGRESS' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
                  }`}>
                    <Clock size={12} />
                    {task.status === 'IN_PROGRESS' ? 'Đang sửa' : 'Chờ tới'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{task.service_type}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">{task.customer_name}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                    <span>{task.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={16} className="flex-shrink-0 text-green-500" />
                    <span>{task.customer_phone}</span>
                  </div>
                </div>
                
                {/* Hành động */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <a 
                    href={`tel:${task.customer_phone}`}
                    className="flex justify-center items-center gap-2 py-2.5 rounded-xl border-2 border-green-500 text-green-600 dark:text-green-500 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Phone size={18} />
                    Gọi điện
                  </a>
                  <button className="flex justify-center items-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                    {task.status === 'IN_PROGRESS' ? 'Hoàn thành' : 'Bắt đầu đi'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
