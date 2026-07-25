import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Users } from 'lucide-react';

export const Technicians = () => {
  const [techs, setTechs] = useState<any[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await api.get('/profiles?role=TECHNICIAN');
        setTechs(res.data);
      } catch (error) {
        console.error('Lỗi tải thợ:', error);
      }
    };
    if (token) fetchTechs();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-blue-600" /> Kỹ thuật viên
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techs.length === 0 ? (
          <p className="text-gray-500">Chưa có kỹ thuật viên nào.</p>
        ) : (
          techs.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {tech.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tech.full_name}</h3>
                <p className="text-sm text-gray-500">{tech.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tech.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {tech.status === 'ACTIVE' ? 'Đang làm việc' : 'Đang nghỉ'}
                  </span>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái của ${tech.full_name} sang ${tech.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}?`)) {
                        try {
                          await api.patch(`/profiles/${tech.id}/status`, {
                            status: tech.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                          });
                          setTechs(techs.map(t => t.id === tech.id ? { ...t, status: tech.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : t));
                        } catch (err: any) {
                          alert(err.response?.data?.error || 'Lỗi khi cập nhật trạng thái');
                        }
                      }
                    }}
                    className={`text-xs px-2 py-1 rounded border ${tech.status === 'ACTIVE' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                  >
                    {tech.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
