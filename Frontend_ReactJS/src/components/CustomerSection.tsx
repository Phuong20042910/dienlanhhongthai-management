import React from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface CustomerSectionProps {
  isCreatingCustomer: boolean;
  setIsCreatingCustomer: (val: boolean) => void;
  newCustomer: { full_name: string; phone: string; address: string };
  setNewCustomer: (val: any) => void;
  handleCreateCustomer: () => void;
  isSubmittingCustomer: boolean;
  customers: any[];
  register: any;
  errors: any;
  initialData?: any;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  isCreatingCustomer,
  setIsCreatingCustomer,
  newCustomer,
  setNewCustomer,
  handleCreateCustomer,
  isSubmittingCustomer,
  customers,
  register,
  errors,
  initialData
}) => {
  return (
    <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Thông tin Khách hàng <span className="text-red-500">*</span>
        </label>
        {!isCreatingCustomer && !initialData && (
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
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Số điện thoại *"
              value={newCustomer.phone}
              onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Địa chỉ (không bắt buộc)"
            value={newCustomer.address}
            onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsCreatingCustomer(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Hủy
            </button>
            <button 
              type="button" 
              onClick={handleCreateCustomer}
              disabled={isSubmittingCustomer}
              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              {isSubmittingCustomer ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Lưu khách hàng
            </button>
          </div>
        </div>
      ) : (
        <div>
          <select 
            {...register('customer_id')}
            disabled={!!initialData}
            className={`w-full px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${initialData ? 'opacity-70 bg-gray-100 cursor-not-allowed' : ''}`}
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
  );
};
