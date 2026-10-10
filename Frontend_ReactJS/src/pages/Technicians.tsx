import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Users, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateTechnicianModal } from '../components/CreateTechnicianModal';
import { ResetPasswordModal } from '../components/ResetPasswordModal';
import { ConfirmStatusModal } from '../components/ConfirmStatusModal';

export const Technicians = () => {
  const [techs, setTechs] = useState<any[]>([]);
  const token = useAuthStore((state) => state.token);
  
  const [resetModal, setResetModal] = useState<{isOpen: boolean, tech: any}>({isOpen: false, tech: null});
  const [newPassword, setNewPassword] = useState('');
  
  const [createModal, setCreateModal] = useState(false);
  const [newTechData, setNewTechData] = useState({ full_name: '', email: '', phone: '', password: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModal, setStatusModal] = useState<{isOpen: boolean, tech: any, newStatus: string}>({isOpen: false, tech: null, newStatus: ''});

  const fetchTechs = async () => {
    try {
      const res = await api.get('/profiles?role=TECHNICIAN');
      setTechs(res.data);
    } catch (error) {
      console.error('Lỗi tải thợ:', error);
    }
  };

  useEffect(() => {
    if (token) fetchTechs();
  }, [token]);

  const handleCreateTech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechData.full_name || !newTechData.email || !newTechData.password) {
      toast.error('Vui lòng điền đầy đủ Tên, Email và Mật khẩu');
      return;
    }
    if (newTechData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/auth/register', { ...newTechData, role: 'TECHNICIAN' });
      toast.success('Tạo tài khoản nhân viên thành công!');
      setCreateModal(false);
      setNewTechData({ full_name: '', email: '', phone: '', password: '' });
      fetchTechs();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi khi tạo tài khoản');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.trim().length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/auth/admin-reset-password', {
        targetUserId: resetModal.tech.user_id, // Lấy ID của bảng users/auth, không phải của bảng technicians
        newPassword: newPassword.trim()
      });
      toast.success('Đổi mật khẩu thành công! Hãy báo cho nhân viên.');
      setResetModal({isOpen: false, tech: null});
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/profiles/${statusModal.tech.id}/status`, { status: statusModal.newStatus });
      fetchTechs();
      toast.success('Cập nhật trạng thái thành công');
      setStatusModal({isOpen: false, tech: null, newStatus: ''});
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-400" /> Kỹ thuật viên
        </h1>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <UserPlus size={18} />
          <span>Thêm nhân viên</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.length === 0 ? (
          <p className="text-gray-500">Chưa có kỹ thuật viên nào.</p>
        ) : (
          techs.map((tech) => (
            <div key={tech.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                {tech.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tech.full_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tech.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tech.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {tech.status === 'ACTIVE' ? 'Đang làm việc' : 'Đang nghỉ'}
                  </span>
                  <button
                    onClick={() => {
                      const newStatus = tech.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                      setStatusModal({ isOpen: true, tech, newStatus });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold shadow-sm transition-all hover:-translate-y-0.5 ${tech.status === 'ACTIVE' ? 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30' : 'border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'}`}
                  >
                    {tech.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                  </button>

                  <button
                    onClick={() => {
                      setResetModal({ isOpen: true, tech });
                      setNewPassword('');
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateTechnicianModal 
        isOpen={createModal} 
        onClose={() => setCreateModal(false)} 
        onSubmit={handleCreateTech} 
        data={newTechData} 
        setData={setNewTechData} 
        isSubmitting={isSubmitting} 
      />

      <ResetPasswordModal 
        isOpen={resetModal.isOpen} 
        onClose={() => setResetModal({isOpen: false, tech: null})} 
        onSubmit={handleResetPassword} 
        tech={resetModal.tech} 
        password={newPassword} 
        setPassword={setNewPassword} 
        isSubmitting={isSubmitting} 
      />

      <ConfirmStatusModal 
        isOpen={statusModal.isOpen} 
        onClose={() => setStatusModal({isOpen: false, tech: null, newStatus: ''})} 
        onSubmit={handleUpdateStatus} 
        tech={statusModal.tech} 
        newStatus={statusModal.newStatus} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

