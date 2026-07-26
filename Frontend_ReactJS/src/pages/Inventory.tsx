import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Package, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Tên vật tư là bắt buộc'),
  sku: z.string().optional(),
  unit: z.string().optional(),
  unit_price: z.number({ message: 'Giá phải là số' }).min(0).optional(),
  stock_quantity: z.number({ message: 'Số lượng phải là số' }).min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (error) {
      console.error('Lỗi khi tải kho:', error);
    }
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await api.put(`/inventory/${editingId}`, data);
      } else {
        await api.post('/inventory', data);
      }
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      fetchInventory(); // Reload data
    } catch (error) {
      console.error('Lỗi khi lưu vật tư:', error);
      alert('Có lỗi xảy ra khi lưu vật tư');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    reset({
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      unit_price: item.unit_price,
      stock_quantity: item.stock_quantity,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
      try {
        await api.delete(`/inventory/${id}`);
        fetchInventory();
        alert('Xóa thành công');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Lỗi khi xóa vật tư');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="text-blue-600 dark:text-blue-400" /> Quản lý Kho vật tư
        </h1>
        <button 
          onClick={() => { setEditingId(null); reset({}); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Thêm vật tư
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vật tư</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ĐVT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Chưa có dữ liệu vật tư.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock_quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(item.unit_price).toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold mr-4 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
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

      {/* Modal Thêm Vật Tư */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Sửa Vật Tư' : 'Thêm Vật Tư Mới'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingId(null); reset({}); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư *</label>
                <input {...register('name')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="VD: Tụ quạt, Ống đồng..." />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã SKU</label>
                  <input {...register('sku')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                  <input {...register('unit')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Cái, Mét..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                  <input type="number" {...register('unit_price', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng đầu kỳ</label>
                  <input type="number" disabled={!!editingId} {...register('stock_quantity', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500" defaultValue={0} />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); reset({}); }} className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu vật tư'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
