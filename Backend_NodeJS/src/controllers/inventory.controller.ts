import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth.middleware';

export const inventoryController = {
  // Lấy danh sách sản phẩm/vật tư
  async getProducts(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo sản phẩm/vật tư mới
  async createProduct(req: AuthRequest, res: Response) {
    try {
      const { name, sku, category, unit, unit_price, technician_price, stock_quantity, image_url } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tên vật tư là bắt buộc' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ name, sku, category, unit, unit_price, technician_price, stock_quantity, image_url }])
        .select()
        .single();

      if (error) throw error;

      // Nếu có số lượng kho ban đầu, ghi log nhập kho khởi tạo
      if (stock_quantity > 0 && req.user) {
        await supabase.from('inventory_logs').insert([{
          product_id: data.id,
          type: 'IMPORT',
          quantity: stock_quantity,
          reference_type: 'MANUAL',
          note: 'Khởi tạo kho ban đầu',
          created_by: req.user.id
        }]);
      }

      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo hàng loạt vật tư từ Excel
  async createProductsBulk(req: AuthRequest, res: Response) {
    try {
      const { products } = req.body;
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Danh sách vật tư không hợp lệ' });
      }

      // Supabase hỗ trợ insert array
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (error) {
        // Kiểm tra lỗi trùng SKU
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Có mã SKU bị trùng lặp, vui lòng kiểm tra lại file Excel.' });
        }
        throw error;
      }

      // Ghi log nhập kho khởi tạo cho các sản phẩm có số lượng > 0
      const logs = data
        .filter(p => p.stock_quantity > 0)
        .map(p => ({
          product_id: p.id,
          type: 'IMPORT',
          quantity: p.stock_quantity,
          reference_type: 'MANUAL',
          note: 'Khởi tạo kho ban đầu từ Excel',
          created_by: req.user?.id
        }));

      if (logs.length > 0) {
        await supabase.from('inventory_logs').insert(logs);
      }

      res.status(201).json({ message: `Đã import thành công ${data.length} vật tư`, data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Kích hoạt AI điền ảnh chạy ngầm
  async autoFillImages(req: Request, res: Response) {
    try {
      // 1. Phản hồi ngay lập tức cho Frontend
      res.status(200).json({ message: 'AI đang bắt đầu chạy ngầm để điền ảnh. Việc này có thể mất vài phút!' });

      // 2. Chạy ngầm trong background (không await)
      (async () => {
        try {
          // Lấy danh sách sản phẩm chưa có ảnh
          const { data: products, error } = await supabase
            .from('products')
            .select('id, name')
            .or('image_url.is.null,image_url.eq.""');
            
          if (error || !products || products.length === 0) return;

          for (const product of products) {
            try {
              // Gọi sang Python AI Service
              const aiRes = await axios.get(`http://127.0.0.1:8000/api/external/fetch-product?q=${encodeURIComponent(product.name)}`);
              
              if (aiRes.data && aiRes.data.image_url) {
                // Update vào Supabase
                await supabase
                  .from('products')
                  .update({ image_url: aiRes.data.image_url })
                  .eq('id', product.id);
              }
            } catch (err) {
              console.error(`Lỗi khi AI tìm ảnh cho SP ${product.name}:`, err);
            }
            
            // Nghỉ 2 giây để tránh block / rate limit
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (bgError) {
          console.error('Lỗi quá trình autoFillImages (Background):', bgError);
        }
      })();
      
    } catch (error: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Cập nhật số lượng tồn kho (Nhập/Xuất)
  async updateStock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { type, quantity, note, reference_type, reference_id } = req.body; 
      // type: 'IMPORT' | 'EXPORT' | 'ADJUSTMENT'

      if (!['IMPORT', 'EXPORT', 'ADJUSTMENT'].includes(type) || !quantity) {
        return res.status(400).json({ error: 'Loại thao tác và số lượng không hợp lệ' });
      }

      // Lấy thông tin sản phẩm hiện tại
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', id)
        .single();

      if (fetchError || !product) {
        return res.status(404).json({ error: 'Không tìm thấy vật tư' });
      }

      const numQuantity = parseInt(quantity);
      let newStock = product.stock_quantity;
      if (type === 'IMPORT' || (type === 'ADJUSTMENT' && numQuantity > 0)) {
        newStock += Math.abs(numQuantity);
      } else {
        newStock -= Math.abs(numQuantity);
        if (newStock < 0) {
          return res.status(400).json({ error: 'Số lượng tồn kho không đủ để xuất' });
        }
      }

      // Cập nhật bảng products
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', id);

      if (updateError) throw updateError;

      // Ghi log
      await supabase.from('inventory_logs').insert([{
        product_id: id,
        type,
        quantity: numQuantity,
        reference_type: reference_type || 'MANUAL',
        reference_id,
        note,
        created_by: req.user?.id
      }]);

      res.json({ message: 'Cập nhật kho thành công', new_stock: newStock });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy lịch sử xuất/nhập kho của 1 sản phẩm
  async getProductLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
          *,
          users(full_name)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy chi tiết 1 vật tư
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Không tìm thấy vật tư' });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin vật tư
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Chỉ cho phép cập nhật thông tin cơ bản và số lượng tồn kho (nếu người dùng sửa thủ công)
      const { name, sku, category, unit, unit_price, technician_price, stock_quantity, image_url } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({ name, sku, category, unit, unit_price, technician_price, stock_quantity, image_url })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa vật tư
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Có thể cần kiểm tra xem có logs không, hoặc dùng foreign key cascade
      // Ở đây tạm thời cứ xóa cứng
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') { // Foreign key violation
          return res.status(400).json({ error: 'Không thể xóa vật tư đã có lịch sử nhập/xuất kho' });
        }
        throw error;
      }
      
      res.json({ message: 'Xóa vật tư thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
