import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
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
      const { name, sku, category, unit, unit_price, stock_quantity } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tên vật tư là bắt buộc' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ name, sku, category, unit, unit_price, stock_quantity }])
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
      // Không cho phép cập nhật stock_quantity qua API này, phải qua updateStock
      const { name, sku, category, unit, unit_price } = req.body;

      const { data, error } = await supabase
        .from('products')
        .update({ name, sku, category, unit, unit_price })
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
