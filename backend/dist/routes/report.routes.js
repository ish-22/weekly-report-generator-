"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const report_validator_1 = require("../validators/report.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Create report draft
router.post('/', (0, validate_middleware_1.validateRequest)(report_validator_1.createReportSchema), report_controller_1.ReportController.createReport);
// Get authenticated user's own reports
router.get('/my-reports', (0, validate_middleware_1.validateRequest)(report_validator_1.listReportsQuerySchema), report_controller_1.ReportController.getMyReports);
// Get own report by ID
router.get('/:id', (0, validate_middleware_1.validateRequest)(report_validator_1.reportIdParamSchema), report_controller_1.ReportController.getOwnReportById);
// Update own draft or needs-correction report
router.put('/:id', (0, validate_middleware_1.validateRequest)(report_validator_1.updateReportSchema), report_controller_1.ReportController.updateOwnReport);
// Submit or resubmit report
router.post('/:id/submit', (0, validate_middleware_1.validateRequest)(report_validator_1.reportIdParamSchema), report_controller_1.ReportController.submitReport);
// Get version history list of report
router.get('/:id/versions', (0, validate_middleware_1.validateRequest)(report_validator_1.reportIdParamSchema), report_controller_1.ReportController.getReportVersions);
// Get specific historic version snapshot detail
router.get('/:id/versions/:versionNumber', (0, validate_middleware_1.validateRequest)(report_validator_1.reportVersionParamSchema), report_controller_1.ReportController.getReportVersionDetail);
exports.default = router;
