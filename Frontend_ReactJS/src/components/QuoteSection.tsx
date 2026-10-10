import React from 'react';

interface QuoteSectionProps {
  initialData: any;
  register: any;
  watch: any;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ initialData, register, watch }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-4">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
         Thông tin Báo Giá & Nội bộ
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tiền Báo Giá của Thợ (VNĐ)</label>
          <input 
            type="text"
            value={initialData?.sub_total ? new Intl.NumberFormat('vi-VN').format(initialData.sub_total) : '0'}
            disabled
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 font-semibold cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Giảm giá cho Khách (VNĐ)</label>
          <input 
            type="number"
            {...register('discount', { valueAsNumber: true })}
            placeholder="VD: 50000"
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Hiển thị Tổng Tiền Cuối Cùng */}
      {(initialData?.sub_total > 0 || watch('discount') > 0) && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex justify-between items-center border border-green-200 dark:border-green-900/30 mb-4">
          <span className="font-semibold text-green-800 dark:text-green-300">Tổng tiền thu khách:</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((initialData?.sub_total || 0) - (watch('discount') || 0))}
          </span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Chi tiết bệnh / Ghi chú Báo Giá của Thợ</label>
        <textarea 
          {...register('note')}
          rows={4}
          placeholder="Ghi chú nội bộ giữa Quản lý và Thợ..."
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
        ></textarea>
      </div>
    </div>
  );
};
