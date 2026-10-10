import { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShoppingCart, Search, Filter, Tag, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/ConfirmModal';

export const CustomerShop = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/inventory');
        // Chỉ hiện những sản phẩm được phép bán công khai (hoặc đang active)
        const publicProducts = res.data.filter((p: any) => p.is_active !== false);
        setProducts(publicProducts);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [productToBuy, setProductToBuy] = useState<any>(null);

  const confirmBuyAction = async () => {
    if (!productToBuy) return;
    try {
      setIsLoading(true);
      const profileRes = await api.get('/profiles/me');
      const address = profileRes.data.address || 'Vui lòng liên hệ để lấy địa chỉ';

      await api.post('/orders/book', {
        service_type: 'Mua vật tư / Linh kiện',
        description: `Mua sản phẩm: ${productToBuy.name} (SKU: ${productToBuy.sku || 'N/A'})\nGiá: ${productToBuy.unit_price} VNĐ. Khách hàng sẽ thanh toán khi nhận hàng.`,
        address: address,
        priority: 'NORMAL'
      });
      
      toast.success(`Đã đặt hàng ${productToBuy.name} thành công! Vui lòng theo dõi trong mục "Đơn hàng của tôi".`);
    } catch (error: any) {
      console.error('Lỗi khi mua hàng:', error);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsLoading(false);
      setProductToBuy(null);
    }
  };

  const handleBuy = (product: any) => {
    setProductToBuy(product);
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <ShoppingCart className="text-blue-200" size={32} /> Cửa Hàng Vật Tư
          </h1>
          <p className="text-blue-100 mt-2 max-w-lg">
            Khám phá linh kiện, phụ kiện chính hãng hoặc thiết bị cũ giá tốt. 
            Thợ sẽ giao hàng và lắp đặt tận nơi cho bạn!
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
            placeholder="Tìm kiếm máy lạnh, remote, linh kiện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 transition-colors">
          <Filter size={20} /> <span className="hidden sm:inline">Lọc</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <PackageSearch size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 mt-1">Vui lòng thử từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingCart size={40} opacity={0.5} />
                  </div>
                )}
                {product.stock_quantity > 0 ? (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                    Còn hàng
                  </span>
                ) : (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-md">
                    Hết hàng
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={14} className="text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {product.category || 'Vật tư'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                  {product.description || 'Sản phẩm chính hãng, đảm bảo chất lượng, bảo hành đầy đủ theo quy định của cửa hàng.'}
                </p>

                <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Giá bán lẻ</p>
                    <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.unit_price)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleBuy(product)}
                    disabled={product.stock_quantity <= 0}
                    className="px-4 py-2.5 bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 shadow-md"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!productToBuy}
        title="Xác nhận mua hàng"
        message={`Bạn muốn đặt mua: ${productToBuy?.name}?\nGiá: ${productToBuy ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productToBuy.unit_price) : ''}\n\nThanh toán tiền mặt cho thợ khi nhận hàng.`}
        confirmText="Xác nhận đặt hàng"
        cancelText="Hủy"
        onConfirm={confirmBuyAction}
        onCancel={() => setProductToBuy(null)}
        isDestructive={false}
      />
    </div>
  );
};
