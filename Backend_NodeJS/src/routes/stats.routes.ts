import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: Lấy dữ liệu thống kê cho Dashboard
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', statsController.getDashboardStats);

export default router;
