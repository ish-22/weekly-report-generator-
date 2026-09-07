import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  getUserByIdSchema,
  updateRoleSchema,
  updateStatusSchema,
} from '../validators/user.validator';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticate);

// List users (Manager & Admin)
router.get('/', requireRole(RoleName.MANAGER, RoleName.ADMIN), UserController.listUsers);

// Get user profile by ID (Manager & Admin)
router.get(
  '/:id',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest(getUserByIdSchema),
  UserController.getUserById
);

// Update user role (Admin only)
router.patch(
  '/:id/role',
  requireRole(RoleName.ADMIN),
  validateRequest(updateRoleSchema),
  UserController.updateRole
);

// Update user active status (Admin only)
router.patch(
  '/:id/status',
  requireRole(RoleName.ADMIN),
  validateRequest(updateStatusSchema),
  UserController.updateStatus
);

export default router;
