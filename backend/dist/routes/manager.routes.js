"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manager_controller_1 = require("../controllers/manager.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const report_validator_1 = require("../validators/report.validator");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN));
// List all team reports with pagination & filtering
router.get('/reports', (0, validate_middleware_1.validateRequest)(report_validator_1.listReportsQuerySchema), manager_controller_1.ManagerController.listAllTeamReports);
// Get specific report details
router.get('/reports/:id', (0, validate_middleware_1.validateRequest)(report_validator_1.reportIdParamSchema), manager_controller_1.ManagerController.getReportDetail);
// Approve report
router.post('/reports/:id/approve', (0, validate_middleware_1.validateRequest)(report_validator_1.approveReportSchema), manager_controller_1.ManagerController.approveReport);
// Request changes on report
router.post('/reports/:id/request-changes', (0, validate_middleware_1.validateRequest)(report_validator_1.requestChangesSchema), manager_controller_1.ManagerController.requestChanges);
exports.default = router;
