import React, { useState, useEffect } from 'react';
import { X, Plus, PackageSearch, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { PromptModal } from './PromptModal';

interface AddMaterialModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, orderId, onClose }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [promptAddMaterial, setPromptAddMaterial] = useState<any>(null); // Lưu id sản phẩm đang được add

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/inventory');
      setProducts(res.data.filter((p: any) => p.is_active));
    } catch (error) {
      console.error('Lỗi tải danh sách vật tư:', error);
      toast.error('Lỗi tải danh sách vật tư');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (product: any, qtyStr: string) => {
    if (!qtyStr) return;

    const quantity = parseInt(qtyStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Số lượng không hợp lệ');
      return;
    }

    if (quantity > product.stock_quantity) {
      toast.error('Không đủ hàng trong kho');
      return;
    }

    try {
      setIsSubmitting(product.id);
      await api.post(`/orders/${orderId}/items`, {
        product_id: product.id,
        quantity: quantity
      });
      toast.success(`Đã thêm ${quantity} ${product.name} vào đơn hàng!`);
      // Lấy lại danh sách để cập nhật tồn kho
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Lỗi khi thêm vật tư');
    } finally {
      setIsSubmitting(null);
    }
  };

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PackageSearch className="text-blue-600" /> Chọn Vật Tư Bổ Sung
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
            <input 
              type="text"
              placeholder="Tìm theo tên hoặc mã SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy vật tư phù hợp.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Kho: <span className="font-semibold text-blue-600">{product.stock_quantity}</span> {product.unit}</p>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.unit_price)}
                      </p>
                    </div>
                    <button 
                      onClick={() => setPromptAddMaterial(product)}
                      disabled={product.stock_quantity <= 0 || isSubmitting === product.id}
                      className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting === product.id ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Thêm
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-end shrink-0">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <PromptModal
        isOpen={!!promptAddMaterial}
        title="Nhập số lượng"
        message={promptAddMaterial ? `Nhập số lượng cho ${promptAddMaterial.name} (Tồn kho: ${promptAddMaterial.stock_quantity}):` : ''}
        defaultValue="1"
        inputType="number"
        confirmText="Thêm vào đơn"
        onConfirm={(val) => {
          if (promptAddMaterial) {
            handleAdd(promptAddMaterial, val);
          }
        }}
        onCancel={() => setPromptAddMaterial(null)}
      />
    </>
  );
};
