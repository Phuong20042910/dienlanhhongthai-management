import { Router } from 'express';
import { ordersController } from '../controllers/orders.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', ordersController.getOrders);

router.post('/', ordersController.createOrder);
router.patch('/:id', ordersController.updateOrder);
router.get('/:id', ordersController.getOrderById);
router.delete('/:id', ordersController.deleteOrder);

export default router;
