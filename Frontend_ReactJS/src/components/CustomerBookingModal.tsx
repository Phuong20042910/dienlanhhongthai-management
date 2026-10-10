import React from 'react';
import { Wrench, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  bookingData: { service_type: string, description: string, address: string };
  setBookingData: (val: any) => void;
  isSubmitting: boolean;
}

export const CustomerBookingModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, bookingData, setBookingData, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench className="text-blue-600" /> Đặt lịch sửa chữa
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại thiết bị <span className="text-red-500">*</span></label>
            <select
              value={bookingData.service_type}
              onChange={(e) => setBookingData({...bookingData, service_type: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none transition-shadow"
            >
              <option value="MÁY LẠNH">Máy lạnh</option>
              <option value="TỦ LẠNH">Tủ lạnh</option>
              <option value="MÁY GIẶT">Máy giặt</option>
              <option value="KHÁC">Khác</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ của bạn <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={bookingData.address}
              onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none transition-shadow"
              placeholder="Ví dụ: 123 Lê Lợi, Q1, TP.HCM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả tình trạng lỗi <span className="text-red-500">*</span></label>
            <textarea
              value={bookingData.description}
              onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none transition-shadow min-h-[100px]"
              placeholder="Ví dụ: Máy lạnh không mát, bị chảy nước..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? 'Đang gửi...' : 'Xác nhận Đặt lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
