import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';
import { payrollController } from './payroll.controller';

// Hàm helper tạo order_code ngẫu nhiên
const generateOrderCode = () => {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const ordersController = {
  // Lấy danh sách đơn hàng
  async getOrders(req: AuthRequest, res: Response) {
    try {
      const userRole = req.user?.role;
      const userId = req.user?.id;

      let query = supabase
        .from('orders')
        .select(`
          *,
          customers(id, full_name, phone, address),
          technicians(id, users(full_name, phone))
        `)
        .order('created_at', { ascending: false });

      // Nếu là thợ, chỉ lấy đơn của mình
      if (userRole === 'TECHNICIAN') {
        // Tìm technician_id tương ứng với user_id
        const { data: tech } = await supabase.from('technicians').select('id').eq('user_id', userId).single();
        if (tech) {
          query = query.eq('technician_id', tech.id);
        } else {
          return res.json([]); // Nếu user chưa có tech profile thì trả mảng rỗng
        }
      } else if (userRole === 'CUSTOMER') {
        // Lấy phone từ users
        const { data: userData } = await supabase.from('users').select('phone').eq('id', userId).single();
        if (userData?.phone) {
          const { data: cus } = await supabase.from('customers').select('id').eq('phone', userData.phone).single();
          if (cus) {
            query = query.eq('customer_id', cus.id);
          } else {
            return res.json([]);
          }
        } else {
          return res.json([]);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Khách hàng tự đặt lịch (Customer Booking)
  async bookOrder(req: AuthRequest, res: Response) {
    try {
      const { service_type, description, address, priority } = req.body;
      const userId = req.user?.id;

      if (!service_type || !address) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (service_type, address)' });
      }

      // Tìm customer_id qua phone
      const { data: userData } = await supabase.from('users').select('phone').eq('id', userId).single();
      if (!userData?.phone) {
        return res.status(400).json({ error: 'Tài khoản chưa cập nhật số điện thoại' });
      }

      let { data: cus } = await supabase.from('customers').select('id').eq('phone', userData.phone).single();
      
      // Nếu chưa có trong bảng customers, tự động tạo mới (fallback)
      if (!cus) {
        const { data: newUser } = await supabase.from('users').select('full_name').eq('id', userId).single();
        const { data: newCus, error: createErr } = await supabase.from('customers').insert([{
          full_name: newUser?.full_name || 'Khách hàng',
          phone: userData.phone,
          address: address,
          note: 'Tạo tự động khi đặt lịch'
        }]).select('id').single();
        
        if (createErr) throw createErr;
        cus = newCus;
      }

      const order_code = generateOrderCode();

      const { data, error } = await supabase
        .from('orders')
        .insert([{ 
          order_code,
          customer_id: cus.id,
          service_type,
          description,
          address,
          priority: priority || 'NORMAL',
          is_warranty: false,
          created_by: userId
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tạo đơn hàng mới (Dành cho Admin/Boss)
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const { 
        customer_id, 
        service_type, 
        description, 
        address, 
        priority,
        technician_id,
        is_warranty
      } = req.body;

      if (!customer_id || !service_type || !address) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (customer_id, service_type, address)' });
      }

      const order_code = generateOrderCode();

      const { data, error } = await supabase
        .from('orders')
        .insert([{ 
          order_code,
          customer_id,
          service_type,
          description,
          address,
          priority: priority || 'NORMAL',
          technician_id: technician_id || null,
          is_warranty: is_warranty || false,
          created_by: req.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật trạng thái hoặc phân công thợ
  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body; // { status, technician_id, note... }

      // Lấy thông tin order cũ
      const { data: oldOrder } = await supabase
        .from('orders')
        .select('status, technician_id, completed_at')
        .eq('id', id)
        .single();

      // Nếu chuyển sang COMPLETED mà chưa có completed_at thì set
      if (updates.status === 'COMPLETED' && oldOrder && oldOrder.status !== 'COMPLETED') {
        if (!updates.completed_at && !oldOrder.completed_at) {
          updates.completed_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Luôn đồng bộ lại KPI và Lương cho Thợ nếu có technician_id
      // Điều này đảm bảo dữ liệu luôn chính xác theo thời gian thực (realtime sync)
      const techIdToSync = data.technician_id || (oldOrder ? oldOrder.technician_id : null);
      
      if (techIdToSync) {
        // Đếm lại chính xác số đơn hoàn thành
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('technician_id', techIdToSync)
          .eq('status', 'COMPLETED');

        // Cập nhật vào profile
        await supabase
          .from('technicians')
          .update({ total_completed: count || 0 })
          .eq('id', techIdToSync);

        // Lấy user_id để đồng bộ lương
        const { data: tech } = await supabase
          .from('technicians')
          .select('user_id')
          .eq('id', techIdToSync)
          .single();

        if (tech && tech.user_id) {
          await payrollController.syncCurrentMonthPayslip(tech.user_id);
        }
      }

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy chi tiết 1 đơn hàng
  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers(*),
          technicians(id, users(full_name, phone))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa đơn hàng
  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Có thể thêm kiểm tra quyền: chỉ Admin/Boss mới được xóa đơn hàng
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Thêm vật tư vào đơn hàng (Dành cho thợ)
  async addOrderItem(req: Request, res: Response) {
    try {
      const { id } = req.params; // order_id
      const { product_id, quantity } = req.body;

      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Sản phẩm và số lượng không hợp lệ' });
      }

      // Lấy giá của vật tư
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .select('unit_price, stock_quantity')
        .eq('id', product_id)
        .single();

      if (prodErr || !product) {
        return res.status(404).json({ error: 'Không tìm thấy vật tư' });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({ error: 'Số lượng vật tư trong kho không đủ' });
      }

      const total = product.unit_price * quantity;

      // 1. Thêm vào bảng order_items
      const { error: itemErr } = await supabase
        .from('order_items')
        .insert([{
          order_id: id,
          product_id,
          quantity,
          unit_price: product.unit_price,
          total
        }]);

      if (itemErr) throw itemErr;

      // 2. Trừ tồn kho
      await supabase
        .from('products')
        .update({ stock_quantity: product.stock_quantity - quantity })
        .eq('id', product_id);

      res.status(201).json({ message: 'Đã thêm vật tư thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tra cứu đơn hàng công khai không cần login (Public Tracking)
  async lookupOrder(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Vui lòng nhập Số điện thoại hoặc Mã đơn hàng' });
      }

      const searchVal = q.trim();

      let query = supabase
        .from('orders')
        .select(`
          id, order_code, status, service_type, description, address,
          created_at, completed_at, total_amount, sub_total, discount, payment_status,
          before_images, after_images, customer_signature, rating, review, device_brand, device_type,
          customers(id, full_name, phone),
          technicians(id, users(full_name, phone))
        `);

      if (searchVal.toUpperCase().startsWith('ORD-') || searchVal.toUpperCase().startsWith('DH-')) {
        query = query.ilike('order_code', searchVal);
      } else {
        // Tìm theo số điện thoại khách hàng
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', searchVal)
          .single();

        if (customer) {
          query = query.eq('customer_id', customer.id);
        } else {
          return res.json([]);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(10);
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Đánh giá đơn hàng công khai (Rating & Review)
  async publicReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Đánh giá số sao từ 1 đến 5' });
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ rating, review })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Đặt lịch hẹn công khai từ Landing Page không cần đăng nhập
  async publicBookOrder(req: Request, res: Response) {

    try {
      const { full_name, phone, service_type, device_brand, address, description } = req.body;

      if (!full_name || !phone || !address || !service_type) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ Họ tên, Số điện thoại, Dịch vụ và Địa chỉ' });
      }

      const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

      // 1. Kiểm tra hoặc tạo mới khách hàng
      let { data: cus } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', cleanPhone)
        .single();

      if (!cus) {
        const { data: newCus, error: createCusErr } = await supabase
          .from('customers')
          .insert([{
            full_name: full_name.trim(),
            phone: cleanPhone,
            address: address.trim(),
            note: 'Khách đặt từ Landing Page'
          }])
          .select('id')
          .single();

        if (createCusErr) throw createCusErr;
        cus = newCus;
      }

      // 2. Tạo mã đơn và đơn hàng
      const order_code = generateOrderCode();

      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_code,
          customer_id: cus.id,
          service_type: service_type.trim(),
          device_brand: device_brand || null,
          description: description || null,
          address: address.trim(),
          priority: 'NORMAL',
          status: 'PENDING',
          payment_status: 'UNPAID',
          is_warranty: false
        }])
        .select(`
          *,
          customers(id, full_name, phone)
        `)
        .single();

      if (orderErr) throw orderErr;

      res.status(201).json(newOrder);
    } catch (error: any) {
      console.error('Lỗi đặt lịch công khai:', error);
      res.status(500).json({ error: error.message });
    }
  }
};


