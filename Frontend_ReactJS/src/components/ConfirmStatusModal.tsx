import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  tech: any;
  newStatus: string;
  isSubmitting: boolean;
}

export const ConfirmStatusModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, tech, newStatus, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Xác nhận</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Bạn có chắc chắn muốn chuyển trạng thái của <span className="font-semibold text-gray-900 dark:text-white">{tech?.full_name}</span> sang <span className="font-semibold text-blue-600">{newStatus === 'ACTIVE' ? 'Đang làm việc' : 'Đang nghỉ'}</span> không?
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đồng ý'}
          </button>
        </div>
      </div>
    </div>
  );
};
