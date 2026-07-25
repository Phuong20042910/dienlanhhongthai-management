import { Router } from 'express';
import { profilesController } from '../controllers/profiles.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Lấy danh sách nhân viên / thợ
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', profilesController.getProfiles);
router.patch('/:id/status', profilesController.updateStatus);

export default router;
