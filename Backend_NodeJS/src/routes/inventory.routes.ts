import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/inventory:
 *   get:
 *     summary: Lấy danh sách sản phẩm / vật tư
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', requireRole(['BOSS', 'ADMIN']), inventoryController.getProducts);

/**
 * @openapi
 * /api/inventory:
 *   post:
 *     summary: Thêm vật tư mới
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', requireRole(['BOSS', 'ADMIN']), inventoryController.createProduct);

/**
 * @openapi
 * /api/inventory/{id}/stock:
 *   patch:
 *     summary: Nhập/Xuất kho (Cập nhật số lượng)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/stock', requireRole(['BOSS', 'ADMIN']), inventoryController.updateStock);

/**
 * @openapi
 * /api/inventory/{id}/logs:
 *   get:
 *     summary: Lấy lịch sử kho của 1 vật tư
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id/logs', requireRole(['BOSS', 'ADMIN']), inventoryController.getProductLogs);

router.get('/:id', requireRole(['BOSS', 'ADMIN']), inventoryController.getProductById);
router.put('/:id', requireRole(['BOSS', 'ADMIN']), inventoryController.updateProduct);
router.delete('/:id', requireRole(['BOSS', 'ADMIN']), inventoryController.deleteProduct);

export default router;
