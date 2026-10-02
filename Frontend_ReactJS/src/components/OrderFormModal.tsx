import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../utils/api';

const orderSchema = z.object({
  customer_id: z.string().min(1, 'Vui lòng chọn khách hàng'),
  service_type: z.string().min(2, 'Vui lòng nhập loại dịch vụ'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ cụ thể'),
  description: z.string().optional(),
  priority: z.enum(['NORMAL', 'URGENT']),
  technician_id: z.string().optional().nullable(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  
  // Trạng thái cho việc tạo khách hàng nhanh
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ full_name: '', phone: '', address: '' });
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: 'NORMAL',
      technician_id: '',
      customer_id: ''
    }
  });

  const selectedCustomerId = watch('customer_id');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      // Reset form khi đóng
      reset();
      setIsCreatingCustomer(false);
    }
  }, [isOpen]);

  // Cập nhật địa chỉ tự động khi chọn khách hàng
  useEffect(() => {
    if (selectedCustomerId) {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (cust && cust.address) {
        setValue('address', cust.address);
      }
    }
  }, [selectedCustomerId, customers, setValue]);

  const fetchData = async () => {
    try {
      const [custRes, techRes] = await Promise.all([
        api.get('/customers'),
        api.get('/profiles?role=TECHNICIAN')
      ]);
      setCustomers(custRes.data);
      // Chỉ lấy thợ đang làm việc
      setTechnicians(techRes.data.filter((t: any) => t.status === 'ACTIVE'));
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.full_name || !newCustomer.phone) {
      toast.error('Vui lòng nhập đủ Tên và Số điện thoại');
      return;
    }
    try {
      setIsSubmittingCustomer(true);
      const res = await api.post('/customers', newCustomer);
      setCustomers([res.data, ...customers]);
      setValue('customer_id', res.data.id);
      setValue('address', res.data.address || '');
      setIsCreatingCustomer(false);
      setNewCustomer({ full_name: '', phone: '', address: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi tạo khách hàng');
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      // Chuyển technician_id rỗng thành null
      const payload = {
        ...data,
        technician_id: data.technician_id === '' ? null : data.technician_id
      };
      
      await api.post('/orders', payload);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi tạo đơn hàng');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 sm:p-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tạo Đơn Hàng Mới</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Phần Chọn / Tạo Khách Hàng */}
          <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Thông tin Khách hàng <span className="text-red-500">*</span>
              </label>
              {!isCreatingCustomer && (
                <button 
                  type="button"
                  onClick={() => setIsCreatingCustomer(true)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Khách mới
                </button>
              )}
            </div>

            {isCreatingCustomer ? (
              <div className="space-y-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tên khách hàng *"
                    value={newCustomer.full_name}
                    onChange={e => setNewCustomer({...newCustomer, full_name: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại *"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Địa chỉ (không bắt buộc)"
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsCreatingCustomer(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Hủy
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCreateCustomer}
                    disabled={isSubmittingCustomer}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
                  >
                    {isSubmittingCustomer ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Lưu khách hàng
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <select 
                  {...register('customer_id')}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name} - {c.phone}</option>
                  ))}
                </select>
                {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id.message}</p>}
              </div>
            )}
          </div>

          <form id="orderForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Loại dịch vụ <span className="text-red-500">*</span></label>
                <input 
                  {...register('service_type')}
                  placeholder="VD: Sửa máy lạnh, Vệ sinh máy giặt..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                {errors.service_type && <p className="mt-1 text-xs text-red-500">{errors.service_type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Độ ưu tiên</label>
                <select 
                  {...register('priority')}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="NORMAL">Bình thường</option>
                  <option value="URGENT">Gấp / Xử lý ngay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Địa chỉ thực hiện <span className="text-red-500">*</span></label>
              <input 
                {...register('address')}
                placeholder="Nhập địa chỉ nhà khách hàng..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phân công thợ (Tùy chọn)</label>
              <select 
                {...register('technician_id')}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">-- Chưa phân công --</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Ghi chú thêm</label>
              <textarea 
                {...register('description')}
                rows={3}
                placeholder="Khách báo máy lạnh kêu to, chảy nước..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            form="orderForm"
            disabled={isSubmitting} 
            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Tạo Đơn Hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};
