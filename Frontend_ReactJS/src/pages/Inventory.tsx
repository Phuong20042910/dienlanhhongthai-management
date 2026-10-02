import { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Package, Plus, X, Camera, Sparkles, Loader2, Search, Globe, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Tên vật tư là bắt buộc'),
  sku: z.string().optional(),
  unit: z.string().optional(),
  unit_price: z.number({ message: 'Giá phải là số' }).min(0).optional(),
  technician_price: z.number({ message: 'Giá thợ phải là số' }).min(0).optional(),
  stock_quantity: z.number({ message: 'Số lượng phải là số' }).min(0).optional(),
  image_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuggestingSKU, setIsSuggestingSKU] = useState(false);
  const [isFetchingExternal, setIsFetchingExternal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // State phục vụ cho việc tự động tải lại ảnh (Realtime/Polling)
  const [isAIFilling, setIsAIFilling] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const productName = watch('name');

  // Effect để tự động tải lại danh sách sau mỗi 3 giây khi AI đang điền ảnh ngầm
  useEffect(() => {
    if (isAIFilling && pollCount < 20) { // Chạy tối đa 20 lần (60 giây)
      const timer = setTimeout(() => {
        fetchInventory();
        setPollCount(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (pollCount >= 20) {
      setIsAIFilling(false);
      setPollCount(0);
    }
  }, [isAIFilling, pollCount]);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (error) {
      console.error('Lỗi khi tải kho:', error);
    }
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await api.put(`/inventory/${editingId}`, data);
      } else {
        await api.post('/inventory', data);
      }
      setIsModalOpen(false);
      setEditingId(null);
      reset();
      toast.success('Lưu vật tư thành công');
      fetchInventory(); // Reload data
    } catch (error) {
      console.error('Lỗi khi lưu vật tư:', error);
      toast.error('Có lỗi xảy ra khi lưu vật tư');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    reset({
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      unit_price: item.unit_price,
      technician_price: item.technician_price,
      stock_quantity: item.stock_quantity,
      image_url: item.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
      try {
        await api.delete(`/inventory/${id}`);
        fetchInventory();
        toast.success('Xóa thành công');
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Lỗi khi xóa vật tư');
      }
    }
  };

  // Hàm quét ảnh tem nhãn bằng AI
  const handleScanLabel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/ai/scan-label', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data;
      if (data.name) setValue('name', data.name);
      if (data.sku) setValue('sku', data.sku);
      if (data.unit) setValue('unit', data.unit);
      if (data.suggested_price) setValue('unit_price', data.suggested_price);

      toast.success(`✨ Đã nhận diện xong:\n${data.name}\nMã SKU: ${data.sku}`, { duration: 4000 });
    } catch (err: any) {
      console.error('Lỗi quét tem nhãn AI:', err);
      toast.error(err.response?.data?.error || 'Lỗi khi gọi AI quét tem nhãn. Vui lòng đảm bảo Python AI Service đang chạy.', { duration: 5000 });
    } finally {
      setIsScanning(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setValue('image_url', res.data.url);
      toast.success('Tải ảnh thành công!');
    } catch (err: any) {
      console.error('Lỗi upload ảnh:', err);
      toast.error('Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:4000${url}`;
  };

  // Hàm tự động gợi ý mã SKU từ tên bằng AI
  const handleSuggestSKU = async () => {
    if (!productName || !productName.trim()) {
      toast.error('Vui lòng nhập tên vật tư trước khi dùng AI gợi ý SKU');
      return;
    }

    setIsSuggestingSKU(true);
    try {
      const res = await api.post('/ai/suggest-sku', { product_name: productName });
      if (res.data.suggested_sku) setValue('sku', res.data.suggested_sku);
      if (res.data.unit) setValue('unit', res.data.unit);
      toast.success('Gợi ý SKU thành công');
    } catch (err: any) {
      console.error('Lỗi gợi ý SKU AI:', err);
      toast.error('Không thể tạo SKU tự động.');
    } finally {
      setIsSuggestingSKU(false);
    }
  };

  // Hàm cào dữ liệu và thông số từ Internet
  const handleFetchExternalProduct = async () => {
    if (!productName || !productName.trim()) {
      toast.error('Vui lòng nhập tên vật tư (VD: Daikin 1HP) vào ô "Tên vật tư" trước khi tìm kiếm');
      return;
    }
    
    setIsFetchingExternal(true);
    try {
      const res = await api.get(`/ai/fetch-product?q=${encodeURIComponent(productName)}`);
      const data = res.data;
      
      // Cập nhật form
      if (data.name) setValue('name', data.name);
      if (data.sku) setValue('sku', data.sku);
      if (data.unit) setValue('unit', data.unit);
      if (data.suggested_price) setValue('unit_price', data.suggested_price);
      if (data.image_url) setValue('image_url', data.image_url);
      
      let successMsg = `✨ Đã cào được từ Internet:\n- Tên: ${data.name}\n- Giá tham khảo: ${data.suggested_price?.toLocaleString('vi-VN')} đ`;
      if (data.specs && Object.keys(data.specs).length > 0) {
        successMsg += `\n\nThông số kỹ thuật:\n`;
        for (const [key, val] of Object.entries(data.specs)) {
          successMsg += `- ${key}: ${val}\n`;
        }
      }
      toast.success(successMsg, { duration: 5000 });
    } catch (err: any) {
      console.error('Lỗi khi fetch sản phẩm ngoài:', err);
      toast.error('Không thể tìm thấy thông tin trên mạng hoặc có lỗi xảy ra.');
    } finally {
      setIsFetchingExternal(false);
    }
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      "Tên vật tư": "Máy lạnh Daikin 1HP",
      "Mã SKU": "DK-1HP",
      "Đơn vị tính": "Cái",
      "Giá bán": 10000000,
      "Giá thợ": 9500000,
      "Số lượng tồn kho": 10
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mau_Nhap_Vat_Tu");
    XLSX.writeFile(wb, "Mau_Nhap_Vat_Tu.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target?.result;
        const wb = XLSX.read(buffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          toast.error('File Excel trống!');
          return;
        }

        // Helper để parse số an toàn
        const parseNum = (val: any) => {
          if (!val) return 0;
          const num = Number(String(val).replace(/,/g, '').replace(/\./g, ''));
          return isNaN(num) ? 0 : num;
        };

        // Map keys từ tiếng Việt sang tiếng Anh cho backend
        const formattedProducts = data.map((row: any) => ({
          name: row['Tên vật tư']?.toString().trim() || '',
          sku: row['Mã SKU']?.toString().trim() || undefined,
          unit: row['Đơn vị tính']?.toString().trim() || undefined,
          unit_price: parseNum(row['Giá bán']),
          technician_price: parseNum(row['Giá thợ']),
          stock_quantity: parseNum(row['Số lượng tồn kho']),
          image_url: row['Link ảnh']?.toString().trim() || undefined
        })).filter((p: any) => p.name !== ''); // Loại bỏ dòng rỗng

        if (formattedProducts.length === 0) {
          toast.error('Không tìm thấy dữ liệu hợp lệ trong file Excel.');
          return;
        }

        const res = await api.post('/inventory/bulk', { products: formattedProducts });
        toast.success(res.data.message || 'Import thành công');
        fetchInventory();
      } catch (err: any) {
        console.error('Lỗi import excel:', err);
        toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi đọc file Excel (Lỗi định dạng)');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAutoFillImages = async () => {
    try {
      const res = await api.post('/inventory/ai-fill-images');
      toast.success(res.data.message || 'AI đang chạy ngầm!', { duration: 5000 });
      
      // Bật chế độ tự động làm mới trang
      setIsAIFilling(true);
      setPollCount(0);
    } catch (err: any) {
      toast.error('Lỗi khi gọi AI điền ảnh');
    }
  };

  const handleGenerateExcel = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Vui lòng nhập yêu cầu của bạn');
      return;
    }
    
    setIsAIGenerating(true);
    try {
      // Vì file tải về là binary/blob, ta cần fetch riêng
      const res = await fetch('http://127.0.0.1:8000/api/ai/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!res.ok) throw new Error('Lỗi khi gọi AI');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Tạo tên file từ prompt (loại bỏ dấu tiếng Việt và ký tự đặc biệt)
      const removeAccents = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
      };
      
      const safeName = removeAccents(aiPrompt)
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .substring(0, 40);
        
      const finalFileName = safeName ? `${safeName}_${Date.now()}.xlsx` : `Danh_Sach_Vat_Tu_${Date.now()}.xlsx`;

      const a = document.createElement('a');
      a.href = url;
      a.download = finalFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Đã tải file Excel thành công!');
      setIsAIModalOpen(false);
      setAiPrompt('');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi tạo file Excel bằng AI');
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="text-blue-600 dark:text-blue-400" /> Quản lý Kho vật tư
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 border border-green-200"
          >
            <Download size={20} /> Tải mẫu Excel
          </button>
          
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 border border-purple-200"
          >
            <Sparkles size={20} /> AI tạo file mẫu
          </button>

          <button 
            onClick={handleAutoFillImages}
            disabled={isAIFilling}
            className={`px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 border ${
              isAIFilling ? 'bg-orange-100 text-orange-400 border-orange-200 cursor-wait' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
            }`}
            title="Tự động tìm và lấp đầy ảnh cho các vật tư bị thiếu"
          >
            {isAIFilling ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            {isAIFilling ? 'Đang lấp ảnh...' : 'AI tìm ảnh thiếu'}
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isImporting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            Nhập từ Excel
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          <button 
            onClick={() => { setEditingId(null); reset({}); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus size={20} /> Thêm vật tư
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên vật tư</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ĐVT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán (Khách)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá nội bộ (Thợ)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Chưa có dữ liệu vật tư.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                    {item.image_url ? (
                      <img src={getFullImageUrl(item.image_url)} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        <Package size={20} />
                      </div>
                    )}
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock_quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(item.unit_price).toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(item.technician_price || 0).toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold mr-4 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-semibold transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm Vật Tư */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Sửa Vật Tư' : 'Thêm Vật Tư Mới'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingId(null); reset({}); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* AI Auto-Fill Helper Bar */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
                  <Sparkles size={16} className="text-blue-600 animate-pulse" />
                  <span>Điền nhanh thông tin bằng AI:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFetchExternalProduct}
                    disabled={isFetchingExternal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isFetchingExternal ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                    <span>{isFetchingExternal ? 'Đang quét mạng...' : '🌐 Tìm từ Internet'}</span>
                  </button>

                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm">
                    {isScanning ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    <span>{isScanning ? 'Đang đọc tem...' : '📸 Quét tem nhãn AI'}</span>
                    <input type="file" accept="image/*" onChange={handleScanLabel} className="hidden" disabled={isScanning} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư *</label>
                <input {...register('name')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="VD: Máy lạnh Daikin, Tụ quạt, Ống đồng..." />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>
                <div className="flex items-center gap-4">
                  {watch('image_url') ? (
                    <div className="relative">
                      <img src={getFullImageUrl(watch('image_url') as string)} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" crossOrigin="anonymous" />
                      <button 
                        type="button" 
                        onClick={() => setValue('image_url', '')} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      {isUploading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Camera size={16} className="text-gray-400" />}
                      <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" disabled={isUploading} />
                    </label>
                  )}
                  <div className="text-xs text-gray-500">
                    <p>Hỗ trợ: JPG, PNG, WEBP.</p>
                    <p>Tối đa 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Mã SKU</label>
                    <button
                      type="button"
                      onClick={handleSuggestSKU}
                      disabled={isSuggestingSKU}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      {isSuggestingSKU ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      <span>Gợi ý SKU</span>
                    </button>
                  </div>
                  <input {...register('sku')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Tự sinh nếu để rỗng" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                  <input {...register('unit')} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Bộ, Cái, Mét..." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (Khách)</label>
                  <input type="number" {...register('unit_price', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá nội bộ (Thợ)</label>
                  <input type="number" {...register('technician_price', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                  <input type="number" {...register('stock_quantity', { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" defaultValue={0} />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); reset({}); }} className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu vật tư'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal AI Tạo Excel */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-purple-50/50">
              <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" /> Nhờ AI Tạo File Excel
              </h2>
              <button onClick={() => setIsAIModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Hãy nhập yêu cầu của bạn, AI sẽ tìm kiếm thông tin, hình ảnh và tạo ra một file Excel mẫu để bạn tải về máy. (Quá trình có thể mất từ 10-30 giây).
              </p>
              <textarea 
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="VD: Tạo cho tôi danh sách 10 loại vật tư ống đồng máy lạnh thường dùng nhất..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none text-sm"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setIsAIModalOpen(false)} 
                  className="px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleGenerateExcel} 
                  disabled={isAIGenerating}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isAIGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isAIGenerating ? 'Đang tạo...' : 'Tạo File Excel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

