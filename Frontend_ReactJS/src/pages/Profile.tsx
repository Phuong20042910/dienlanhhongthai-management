import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Shield, CheckCircle, Edit2, Phone, Save, X, MapPin, Star, Award, Briefcase } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, setAuth, token } = useAuthStore((state) => state);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me');
        setFullProfile(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          phone: res.data.phone || '',
        });
      } catch (error) {
        console.error('Lỗi tải profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  if (!user || isLoading) return <div className="p-8 text-center text-gray-500">Đang tải thông tin...</div>;

  const roleText = {
    'BOSS': 'Giám đốc',
    'ADMIN': 'Quản lý',
    'TECHNICIAN': 'Kỹ thuật viên',
    'CUSTOMER': 'Khách hàng'
  }[user.role as string] || user.role;

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast.error('Họ tên không được để trống');
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.patch('/profiles/me', formData);
      
      if (token) {
        setAuth({ ...user, ...res.data }, token);
      }
      setFullProfile({ ...fullProfile, ...res.data });
      
      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi cập nhật hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="text-blue-600 dark:text-blue-400" /> Hồ sơ cá nhân
        </h1>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <Edit2 size={16} /> Chỉnh sửa
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setFormData({ full_name: fullProfile?.full_name || '', phone: fullProfile?.phone || '' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors text-gray-700 dark:text-gray-300"
            >
              <X size={16} /> Hủy
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors text-white shadow-sm disabled:opacity-70"
            >
              <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-md border-4 border-white dark:border-gray-800">
              {fullProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold rounded-full text-sm flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 shadow-sm">
              <Shield size={14} />
              {roleText}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none w-full max-w-sm pb-1"
                  placeholder="Nhập họ và tên..."
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{fullProfile?.full_name}</h2>
              )}
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <CheckCircle size={14} className="text-green-500" /> Tài khoản đang hoạt động
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email liên hệ</p>
                  <p className="text-gray-900 dark:text-white font-medium">{fullProfile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400 shadow-sm">
                  <Phone size={20} />
                </div>
                <div className="w-full">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</p>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="text-gray-900 dark:text-white font-medium bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none w-full mt-1"
                      placeholder="Nhập số điện thoại..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">
                      {fullProfile?.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Thông tin dành riêng cho Thợ */}
              {user.role === 'TECHNICIAN' && (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-yellow-500 shadow-sm">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá trung bình</p>
                      <p className="text-gray-900 dark:text-white font-medium">{fullProfile?.rating || 'Chưa có'} / 5.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-green-500 shadow-sm">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn hoàn thành</p>
                      <p className="text-gray-900 dark:text-white font-medium">{fullProfile?.total_completed || 0} đơn</p>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-blue-500 shadow-sm">
                      <Briefcase size={20} />
                    </div>
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên môn</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {fullProfile?.specialization?.length > 0 ? (
                          fullProfile.specialization.map((spec: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-sm font-medium">
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Chưa cập nhật chuyên môn</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Thông tin dành riêng cho Khách hàng */}
              {user.role === 'CUSTOMER' && (
                <div className="col-span-1 md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="w-full">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ giao dịch</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {fullProfile?.address || <span className="text-gray-400 italic">Chưa cập nhật địa chỉ</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
