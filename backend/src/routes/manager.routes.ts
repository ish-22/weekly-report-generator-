import { Router } from 'express';
import { ManagerController } from '../controllers/manager.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  listReportsQuerySchema,
  reportIdParamSchema,
  approveReportSchema,
  requestChangesSchema,
} from '../validators/report.validator';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(requireRole(RoleName.MANAGER, RoleName.ADMIN));

// List all team reports with pagination & filtering
router.get('/reports', validateRequest(listReportsQuerySchema), ManagerController.listAllTeamReports);

// Get specific report details
router.get('/reports/:id', validateRequest(reportIdParamSchema), ManagerController.getReportDetail);

// Approve report
router.post(
  '/reports/:id/approve',
  validateRequest(approveReportSchema),
  ManagerController.approveReport
);

// Request changes on report
router.post(
  '/reports/:id/request-changes',
  validateRequest(requestChangesSchema),
  ManagerController.requestChanges
);

export default router;
