import React, { useState, useEffect } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

interface QuoteModalProps {
  isOpen: boolean;
  orderId: string;
  initialSubTotal?: number;
  initialNote?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, orderId, initialSubTotal, initialNote, onClose, onSuccess }) => {
  const [subTotal, setSubTotal] = useState<string>(initialSubTotal?.toString() || '');
  const [note, setNote] = useState<string>(initialNote || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubTotal(initialSubTotal?.toString() || '');
      setNote(initialNote || '');
    }
  }, [isOpen, initialSubTotal, initialNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTotal || isNaN(Number(subTotal))) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      const amount = Number(subTotal);
      // Khi thợ báo giá, discount tạm bằng 0, total_amount = sub_total
      await api.patch(`/orders/${orderId}`, {
        sub_total: amount,
        total_amount: amount,
        note: note
      });
      toast.success('Gửi báo giá thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Lỗi khi gửi báo giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             Báo Giá / Báo Cáo Công Việc
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-xl text-sm mb-4">
            Gửi báo giá cho Quản lý để xem xét. Quản lý có thể điều chỉnh lại giá (Giảm giá) nếu đây là khách quen.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Tổng tiền dự kiến báo khách (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number"
              value={subTotal}
              onChange={(e) => setSubTotal(e.target.value)}
              placeholder="VD: 500000"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Chi tiết công việc / Ghi chú cho Quản lý
            </label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Vệ sinh 2 máy lạnh, thay 1 tụ block..."
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Gửi Báo Giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
