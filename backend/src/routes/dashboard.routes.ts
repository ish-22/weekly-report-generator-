import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticate);

// KPI Metrics & Summary Counters (Manager & Admin)
router.get(
  '/metrics',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  DashboardController.getMetrics
);

// Analytics charts data (Manager & Admin)
router.get(
  '/analytics',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  DashboardController.getAnalytics
);

export default router;
