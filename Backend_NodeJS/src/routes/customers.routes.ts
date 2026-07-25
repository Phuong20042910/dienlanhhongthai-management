import { Router } from 'express';
import { customersController } from '../controllers/customers.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/customers:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requireRole(['BOSS', 'ADMIN']), customersController.getCustomers);

/**
 * @openapi
 * /api/customers:
 *   post:
 *     summary: Tạo khách hàng mới
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', requireRole(['BOSS', 'ADMIN']), customersController.createCustomer);

/**
 * @openapi
 * /api/customers/{id}:
 *   patch:
 *     summary: Cập nhật thông tin khách hàng
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id', requireRole(['BOSS', 'ADMIN']), customersController.updateCustomer);

router.get('/:id', requireRole(['BOSS', 'ADMIN']), customersController.getCustomerById);
router.delete('/:id', requireRole(['BOSS', 'ADMIN']), customersController.deleteCustomer);

export default router;
