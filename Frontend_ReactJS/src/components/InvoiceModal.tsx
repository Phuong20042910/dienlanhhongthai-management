import React from 'react';
import { X, Printer, ShieldCheck, Phone, MapPin, Wrench } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.created_at 
    ? new Date(order.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('vi-VN');

  const finalAmount = order.total_amount > 0 ? order.total_amount : (order.sub_total || 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* CSS In ấn chuyên nghiệp */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Header Modal - Không in */}
        <div className="no-print p-4 bg-gray-100 dark:bg-gray-700/50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Printer className="text-blue-600" size={20} />
            <span className="font-bold text-gray-900 dark:text-white">Phiếu Dịch Vụ & Nghiệm Thu Bàn Giao</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer size={16} /> In Phiếu
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nội dung Hóa đơn / Phiếu nghiệm thu in ấn */}
        <div id="printable-invoice" className="p-8 bg-white text-gray-900 space-y-6">
          {/* Thông tin Cửa hàng */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">ĐIỆN LẠNH HỒNG THÁI</h1>
              <p className="text-xs text-gray-600 uppercase font-semibold mt-0.5">Dịch Vụ Sửa Chữa & Bảo Dưỡng Điện Lạnh Uy Tín</p>
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                <p className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-600" /> Địa chỉ: Phục vụ tận nơi khắp khu vực</p>
                <p className="flex items-center gap-1.5"><Phone size={12} className="text-blue-600" /> Hotline / Zalo: 090 123 4567 - 098 765 4321</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
                PHIẾU BÀN GIAO & BẢO HÀNH
              </span>
              <p className="text-sm font-mono font-bold mt-2 text-gray-800">Số: {order.order_code}</p>
              <p className="text-xs text-gray-500">Ngày lập: {formattedDate}</p>
            </div>
          </div>

          {/* Thông tin Khách hàng & Thợ phụ trách */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Khách Hàng</p>
              <p className="font-bold text-gray-800">{order.customers?.full_name || 'Khách vãng lai'}</p>
              <p className="text-gray-600 mt-0.5">SĐT: {order.customers?.phone || 'Chưa cập nhật'}</p>
              <p className="text-gray-600 mt-0.5">Đ/c: {order.address}</p>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Kỹ Thuật Viên Phụ Trách</p>
              <p className="font-bold text-gray-800">{order.technicians?.users?.full_name || 'Kỹ thuật viên Hồng Thái'}</p>
              <p className="text-gray-600 mt-0.5">Loại dịch vụ: <span className="font-semibold text-blue-700">{order.service_type}</span></p>
              <p className="text-gray-600 mt-0.5">Tình trạng thanh toán: <span className="font-semibold">{order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></p>
            </div>
          </div>

          {/* Chi tiết Hạng mục thi công */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 flex items-center gap-1.5">
              <Wrench size={16} className="text-blue-600" /> Nội dung công việc & Hạng mục thi công
            </h3>
            <table className="w-full text-sm border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left text-xs uppercase">
                  <th className="border border-gray-200 p-2.5 w-12 text-center">STT</th>
                  <th className="border border-gray-200 p-2.5">Hạng mục / Dịch vụ / Linh kiện thay thế</th>
                  <th className="border border-gray-200 p-2.5 w-32 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2.5 text-center font-mono">1</td>
                  <td className="border border-gray-200 p-2.5">
                    <p className="font-bold text-gray-800">{order.service_type}</p>
                    {order.description && (
                      <p className="text-xs text-gray-500 italic mt-0.5">Tình trạng: {order.description}</p>
                    )}
                    {order.note && (
                      <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-100">
                        {order.note}
                      </p>
                    )}
                  </td>
                  <td className="border border-gray-200 p-2.5 text-right font-semibold font-mono">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.sub_total || finalAmount)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                {order.discount > 0 && (
                  <tr>
                    <td colSpan={2} className="border border-gray-200 p-2 text-right text-gray-600">Giảm giá / Ưu đãi:</td>
                    <td className="border border-gray-200 p-2 text-right text-red-600 font-semibold font-mono">
                      - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-blue-50 font-bold">
                  <td colSpan={2} className="border border-gray-200 p-3 text-right text-blue-900 uppercase">Tổng cộng thanh toán:</td>
                  <td className="border border-gray-200 p-3 text-right text-blue-700 font-mono text-base">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cam kết bảo hành */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Chính sách bảo hành Điện Lạnh Hồng Thái:</p>
              <p className="mt-0.5">Bảo hành các lỗi sửa chữa và linh kiện thay thế từ 03 - 06 tháng (tùy hạng mục). Vui lòng giữ lại phiếu này hoặc cung cấp số điện thoại khi cần hỗ trợ bảo hành.</p>
            </div>
          </div>

          {/* Ảnh nghiệm thu hiện trường Trước / Sau (nếu có) */}
          {((order.before_images && order.before_images.length > 0) || (order.after_images && order.after_images.length > 0)) && (
            <div className="pt-2 border-t border-gray-200 text-xs">
              <p className="font-bold text-gray-700 uppercase mb-2">Hình ảnh nghiệm thu hiện trường:</p>
              <div className="grid grid-cols-2 gap-4">
                {order.before_images && order.before_images.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-700">Trước khi sửa ({order.before_images.length} ảnh):</span>
                    <div className="flex gap-2 mt-1">
                      {order.before_images.slice(0, 3).map((imgUrl: string, idx: number) => (
                        <img key={idx} src={imgUrl} alt={`Before ${idx}`} className="w-16 h-16 object-cover rounded border border-gray-300" />
                      ))}
                    </div>
                  </div>
                )}
                {order.after_images && order.after_images.length > 0 && (
                  <div>
                    <span className="font-semibold text-green-700">Sau khi hoàn thành ({order.after_images.length} ảnh):</span>
                    <div className="flex gap-2 mt-1">
                      {order.after_images.slice(0, 3).map((imgUrl: string, idx: number) => (
                        <img key={idx} src={imgUrl} alt={`After ${idx}`} className="w-16 h-16 object-cover rounded border border-gray-300" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chữ ký nghiệm thu */}
          <div className="grid grid-cols-2 gap-8 pt-4 text-center text-sm">
            <div>
              <p className="font-bold text-gray-800">KHÁCH HÀNG NGHIỆM THU</p>
              <p className="text-xs text-gray-400 italic">(Đã kiểm tra máy chạy êm, làm mát tốt)</p>
              <div className="h-20 flex items-center justify-center">
                {order.customer_signature ? (
                  <img 
                    src={order.customer_signature} 
                    alt="Chữ ký khách hàng" 
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400 border-b border-dashed border-gray-400 w-36 pb-1">Ký & ghi rõ họ tên</span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-semibold">{order.customers?.full_name}</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">ĐẠI DIỆN ĐIỆN LẠNH HỒNG THÁI</p>
              <p className="text-xs text-gray-400 italic">(Kỹ thuật viên bàn giao)</p>
              <div className="h-20 flex items-end justify-center">
                <span className="text-xs text-gray-700 font-semibold">{order.technicians?.users?.full_name || 'KTV Hồng Thái'}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Footer Modal - Không in */}
        <div className="no-print p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <Printer size={16} /> In Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
