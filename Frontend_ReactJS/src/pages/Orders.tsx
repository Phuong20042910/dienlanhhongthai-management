import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { ClipboardList, Plus } from 'lucide-react';
import { OrderFormModal } from '../components/OrderFormModal';
import { OrdersTable } from '../components/OrdersTable';
import { ConfirmModal } from '../components/ConfirmModal';
import { InvoiceModal } from '../components/InvoiceModal';
import toast from 'react-hot-toast';


export const Orders = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'IN_PROGRESS': return 'Đang thực hiện';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const token = useAuthStore((state) => state.token);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
      toast.success('Xóa đơn hàng thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi khi xóa đơn hàng');
    }
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="text-blue-600 dark:text-blue-400" /> Quản lý Đơn Hàng
        </h1>
        <button 
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tạo Đơn Mới
        </button>
      </div>

      <OrdersTable 
        orders={orders} 
        getStatusColor={getStatusColor} 
        getStatusText={getStatusText} 
        onDelete={(id) => setDeleteId(id)}
        onEdit={handleEdit}
        onPrint={(order) => setInvoiceOrder(order)}
      />
      
      <OrderFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchOrders()}
        initialData={selectedOrder}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác."
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
        isDestructive={true}
      />

      {invoiceOrder && (
        <InvoiceModal
          isOpen={true}
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

