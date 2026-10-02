import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = useAuthStore((state) => state.token);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Lỗi tải khách hàng:', error);
    }
  };

  useEffect(() => {
    if (token) fetchCustomers();
  }, [token]);

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-400" /> Quản lý Khách Hàng
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Tìm kiếm theo SĐT hoặc Tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ gần nhất</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  {searchQuery ? 'Không tìm thấy khách hàng nào phù hợp.' : 'Chưa có dữ liệu khách hàng.'}
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id || c.phone} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => toast.error('Chức năng sửa đang được cập nhật!')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold mr-4 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={async () => {
                        if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                          try {
                            await api.delete(`/customers/${c.id}`);
                            fetchCustomers();
                            toast.success('Xóa thành công');
                          } catch (err: any) {
                            toast.error(err.response?.data?.error || 'Lỗi khi xóa khách hàng');
                          }
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-semibold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
