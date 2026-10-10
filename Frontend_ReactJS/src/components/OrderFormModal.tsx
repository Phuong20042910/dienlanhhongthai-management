import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../utils/api';
import { CustomerSection } from './CustomerSection';
import { QuoteSection } from './QuoteSection';

const orderSchema = z.object({
  customer_id: z.string().min(1, 'Vui lòng chọn khách hàng'),
  service_type: z.string().min(2, 'Vui lòng nhập loại dịch vụ'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ cụ thể'),
  description: z.string().optional(),
  priority: z.enum(['NORMAL', 'URGENT']),
  technician_id: z.string().optional().nullable(),
  discount: z.number().optional(),
  note: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
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
      fetchData().then(() => {
        if (initialData) {
          // Mode: Chỉnh sửa / Cập nhật
          reset({
            customer_id: initialData.customer_id || '',
            service_type: initialData.service_type || '',
            address: initialData.address || '',
            description: initialData.description || '',
            priority: initialData.priority || 'NORMAL',
            technician_id: initialData.technician_id || '',
            discount: initialData.discount || 0,
            note: initialData.note || ''
          });
        } else {
          // Mode: Tạo mới
          reset({
            priority: 'NORMAL',
            technician_id: '',
            customer_id: '',
            service_type: '',
            address: '',
            description: ''
          });
        }
      });
    } else {
      setIsCreatingCustomer(false);
    }
  }, [isOpen, initialData, reset]);

  // Cập nhật địa chỉ tự động khi chọn khách hàng
  useEffect(() => {
    if (selectedCustomerId && !initialData) {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (cust && cust.address) {
        setValue('address', cust.address);
      }
    }
  }, [selectedCustomerId, customers, setValue, initialData]);

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
      
      if (initialData) {
        // Mode: Cập nhật
        // Nếu có discount thì tính lại total_amount
        const discountAmount = data.discount || 0;
        const subTotal = initialData.sub_total || 0;
        
        await api.patch(`/orders/${initialData.id}`, {
          ...payload,
          discount: discountAmount,
          total_amount: Math.max(0, subTotal - discountAmount)
        });
        toast.success('Cập nhật đơn hàng thành công');
      } else {
        // Mode: Tạo mới
        await api.post('/orders', payload);
        toast.success('Tạo đơn hàng thành công');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi lưu đơn hàng');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 sm:p-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Cập Nhật / Phân Công Đơn' : 'Tạo Đơn Hàng Mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          <CustomerSection 
            isCreatingCustomer={isCreatingCustomer}
            setIsCreatingCustomer={setIsCreatingCustomer}
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            handleCreateCustomer={handleCreateCustomer}
            isSubmittingCustomer={isSubmittingCustomer}
            customers={customers}
            register={register}
            errors={errors}
            initialData={initialData}
          />

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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Ghi chú bệnh (Từ Khách hàng)</label>
              <textarea 
                {...register('description')}
                rows={2}
                placeholder="Khách báo máy lạnh kêu to, chảy nước..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <QuoteSection initialData={initialData} register={register} watch={watch} />
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
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (initialData ? 'Cập Nhật' : 'Tạo Đơn Hàng')}
          </button>
        </div>
      </div>
    </div>
  );
};
