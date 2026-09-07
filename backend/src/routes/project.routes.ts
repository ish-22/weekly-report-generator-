import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from '../validators/project.validator';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticate);

// All authenticated users can list active projects (for selecting in report form)
router.get('/', ProjectController.listProjects);

// Get single project
router.get('/:id', validateRequest(projectIdParamSchema), ProjectController.getProjectById);

// Create project (Manager & Admin only)
router.post(
  '/',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest(createProjectSchema),
  ProjectController.createProject
);

// Update project (Manager & Admin only)
router.put(
  '/:id',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest(updateProjectSchema),
  ProjectController.updateProject
);

// Delete/Archive project (Manager & Admin only)
router.delete(
  '/:id',
  requireRole(RoleName.MANAGER, RoleName.ADMIN),
  validateRequest(projectIdParamSchema),
  ProjectController.deleteProject
);

export default router;
