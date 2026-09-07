import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createReportSchema,
  updateReportSchema,
  reportIdParamSchema,
  reportVersionParamSchema,
  listReportsQuerySchema,
} from '../validators/report.validator';

const router = Router();

router.use(authenticate);

// Create report draft
router.post('/', validateRequest(createReportSchema), ReportController.createReport);

// Get authenticated user's own reports
router.get('/my-reports', validateRequest(listReportsQuerySchema), ReportController.getMyReports);

// Get own report by ID
router.get('/:id', validateRequest(reportIdParamSchema), ReportController.getOwnReportById);

// Update own draft or needs-correction report
router.put('/:id', validateRequest(updateReportSchema), ReportController.updateOwnReport);

// Submit or resubmit report
router.post('/:id/submit', validateRequest(reportIdParamSchema), ReportController.submitReport);

// Get version history list of report
router.get('/:id/versions', validateRequest(reportIdParamSchema), ReportController.getReportVersions);

// Get specific historic version snapshot detail
router.get(
  '/:id/versions/:versionNumber',
  validateRequest(reportVersionParamSchema),
  ReportController.getReportVersionDetail
);

export default router;
