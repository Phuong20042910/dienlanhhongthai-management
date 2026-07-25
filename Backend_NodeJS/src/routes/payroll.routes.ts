import { Router } from 'express';
import { payrollController } from '../controllers/payroll.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/payroll/generate:
 *   post:
 *     summary: Tạo/Chốt phiếu lương (Chỉ Boss/Admin)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 */
router.post('/generate', requireRole(['BOSS', 'ADMIN']), payrollController.generatePayslip);

/**
 * @openapi
 * /api/payroll/my-payslip:
 *   get:
 *     summary: Xem danh sách phiếu lương của bản thân
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-payslip', requireRole(['TECHNICIAN']), payrollController.getMyPayslips);

router.get('/', requireRole(['BOSS', 'ADMIN']), payrollController.getAllPayslips);
router.get('/:id', requireRole(['BOSS', 'ADMIN']), payrollController.getPayslipById);
router.patch('/:id', requireRole(['BOSS', 'ADMIN']), payrollController.updatePayslip);
router.delete('/:id', requireRole(['BOSS', 'ADMIN']), payrollController.deletePayslip);

export default router;
