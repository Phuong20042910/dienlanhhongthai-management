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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               category:
 *                 type: string
 *               unit:
 *                 type: string
 *               unit_price:
 *                 type: number
 *               technician_price:
 *                 type: number
 *               stock_quantity:
 *                 type: number
 *               image_url:
 *                 type: string
 */
router.post('/', requireRole(['BOSS', 'ADMIN']), inventoryController.createProduct);

/**
 * @openapi
 * /api/inventory/bulk:
 *   post:
 *     summary: Import hàng loạt vật tư (Excel/CSV)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/bulk', requireRole(['BOSS', 'ADMIN']), inventoryController.createProductsBulk);

/**
 * @openapi
 * /api/inventory/ai-fill-images:
 *   post:
 *     summary: Kích hoạt AI chạy ngầm để điền ảnh vật tư
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/ai-fill-images', requireRole(['BOSS', 'ADMIN']), inventoryController.autoFillImages);

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

/**
 * @openapi
 * /api/inventory/{id}:
 *   put:
 *     summary: Cập nhật thông tin vật tư
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               category:
 *                 type: string
 *               unit:
 *                 type: string
 *               unit_price:
 *                 type: number
 *               technician_price:
 *                 type: number
 *               stock_quantity:
 *                 type: number
 *               image_url:
 *                 type: string
 */
router.put('/:id', requireRole(['BOSS', 'ADMIN']), inventoryController.updateProduct);
router.delete('/:id', requireRole(['BOSS', 'ADMIN']), inventoryController.deleteProduct);

export default router;
