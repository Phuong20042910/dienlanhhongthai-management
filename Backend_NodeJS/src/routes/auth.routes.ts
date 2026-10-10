import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Tạo tài khoản mới (Admin/Boss)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 */
// Tạm thời mở public để test, sau này có thể thêm lại requireAuth và requireRole
router.post('/register', authController.createUser);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Gửi email khôi phục mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vui lòng kiểm tra email để đặt lại mật khẩu
 *       400:
 *         description: Lỗi đầu vào hoặc lỗi từ Supabase
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @openapi
 * /api/auth/admin-reset-password:
 *   post:
 *     summary: Boss/Admin cấp lại mật khẩu mới cho nhân viên
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUserId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã đặt lại mật khẩu thành công
 *       400:
 *         description: Lỗi đầu vào
 */
router.post('/admin-reset-password', requireAuth, requireRole(['BOSS', 'ADMIN']), authController.resetPasswordByAdmin);

export default router;
