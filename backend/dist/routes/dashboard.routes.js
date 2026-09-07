"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// KPI Metrics & Summary Counters (Manager & Admin)
router.get('/metrics', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), dashboard_controller_1.DashboardController.getMetrics);
// Analytics charts data (Manager & Admin)
router.get('/analytics', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), dashboard_controller_1.DashboardController.getAnalytics);
exports.default = router;
