import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Trash2, CheckCircle2, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSuccess: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ isOpen, onClose, order, onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setBeforeImages(order.before_images || []);
      setAfterImages(order.after_images || []);
      if (order.customer_signature) {
        setHasSignature(true);
      }
    }
  }, [order]);

  // Khởi tạo kích thước canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e3a8a'; // Xanh mực bút ký
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Nếu đã có chữ ký cũ dạng base64/url
        if (order?.customer_signature && order.customer_signature.startsWith('data:image')) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = order.customer_signature;
        }
      }
    }
  }, [isOpen, order]);

  // Xử lý vẽ trên Canvas (Chuột & Cảm ứng điện thoại)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Xử lý upload ảnh lên Backend
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      if (type === 'before') {
        setBeforeImages((prev) => [...prev, ...uploadedUrls]);
      } else {
        setAfterImages((prev) => [...prev, ...uploadedUrls]);
      }
      toast.success('Tải ảnh thành công!');
    } catch (error: any) {
      console.error('Lỗi upload ảnh:', error);
      toast.error('Lỗi khi tải ảnh lên server');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setBeforeImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAfterImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Lưu biên bản nghiệm thu vào đơn hàng
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let signatureData = order.customer_signature || '';
      if (canvasRef.current && hasSignature) {
        signatureData = canvasRef.current.toDataURL('image/png');
      }

      await api.patch(`/orders/${order.id}`, {
        before_images: beforeImages,
        after_images: afterImages,
        customer_signature: signatureData
      });

      toast.success('Đã lưu biên bản nghiệm thu & chữ ký thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi cập nhật nghiệm thu:', error);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi lưu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera size={22} /> Nghiệm Thu Hiện Trường & Ký Nhận
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Đơn hàng: <span className="font-mono font-bold">{order.order_code}</span> - {order.service_type}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-900 dark:text-gray-100">
          {/* Mục 1: Ảnh Hiện trạng Trước khi làm (Before) */}
          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-amber-500" /> 1. Ảnh Trước khi sửa chữa (Before)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Chụp hiện trạng hỏng, tem model máy, đồng hồ gas/ampe ban đầu</p>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm">
                <Camera size={14} /> Chụp / Thêm ảnh
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'before')}
                  disabled={isUploading}
                />
              </label>
            </div>

            {beforeImages.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 text-xs">
                Chưa có ảnh trước khi làm. Hãy bấm "Chụp / Thêm ảnh".
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {beforeImages.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square">
                    <img src={url} alt={`Before ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage('before', idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mục 2: Ảnh Sau khi hoàn thành (After) */}
          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-green-500" /> 2. Ảnh Sau khi hoàn thành (After)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Chụp máy sạch sẽ sau bảo dưỡng, máy đang chạy mát, đồng hồ áp suất chuẩn</p>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm">
                <Camera size={14} /> Chụp / Thêm ảnh
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'after')}
                  disabled={isUploading}
                />
              </label>
            </div>

            {afterImages.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 text-xs">
                Chưa có ảnh sau khi làm. Hãy bấm "Chụp / Thêm ảnh".
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {afterImages.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square">
                    <img src={url} alt={`After ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage('after', idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mục 3: Chữ Ký Điện Tử Khách Hàng (Touch Signature) */}
          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  ✍️ 3. Khách Hàng Ký Xác Nhận Nghiệm Thu
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Khách hàng dùng ngón tay ký trực tiếp vào khung trắng bên dưới</p>
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="px-2.5 py-1 text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <RotateCcw size={12} /> Ký lại
              </button>
            </div>

            <div className="relative border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-2xl bg-white overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                className="w-full h-40 touch-none cursor-crosshair block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 text-xs italic">
                  Chạm và vuốt để ký tên vào đây
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1 italic text-center">
              Khách hàng xác nhận máy chạy êm, làm mát tốt và kỹ thuật viên đã bàn giao xong.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu Nghiệm Thu'}
          </button>
        </div>
      </div>
    </div>
  );
};
