"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const project_validator_1 = require("../validators/project.validator");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// All authenticated users can list active projects (for selecting in report form)
router.get('/', project_controller_1.ProjectController.listProjects);
// Get single project
router.get('/:id', (0, validate_middleware_1.validateRequest)(project_validator_1.projectIdParamSchema), project_controller_1.ProjectController.getProjectById);
// Create project (Manager & Admin only)
router.post('/', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(project_validator_1.createProjectSchema), project_controller_1.ProjectController.createProject);
// Update project (Manager & Admin only)
router.put('/:id', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(project_validator_1.updateProjectSchema), project_controller_1.ProjectController.updateProject);
// Delete/Archive project (Manager & Admin only)
router.delete('/:id', (0, rbac_middleware_1.requireRole)(client_1.RoleName.MANAGER, client_1.RoleName.ADMIN), (0, validate_middleware_1.validateRequest)(project_validator_1.projectIdParamSchema), project_controller_1.ProjectController.deleteProject);
exports.default = router;
