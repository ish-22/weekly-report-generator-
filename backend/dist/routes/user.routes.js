"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_validator_1 = require("../validators/user.validator");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// List users (Manager & Admin)
router.get('/', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), user_controller_1.UserController.listUsers);
// Get user profile by ID (Manager & Admin)
router.get('/:id', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(user_validator_1.getUserByIdSchema), user_controller_1.UserController.getUserById);
// Update user role (Admin only)
router.patch('/:id/role', (0, rbac_middleware_1.requireRole)(client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(user_validator_1.updateRoleSchema), user_controller_1.UserController.updateRole);
// Update user active status (Admin only)
router.patch('/:id/status', (0, rbac_middleware_1.requireRole)(client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(user_validator_1.updateStatusSchema), user_controller_1.UserController.updateStatus);
exports.default = router;
