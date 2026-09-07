import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiResponse } from '../utils/api-response.util';

export class ProjectController {
  static async listProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const projects = await ProjectService.listProjects(includeInactive);
      return ApiResponse.success(res, projects, 'Projects retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      return ApiResponse.success(res, project, 'Project details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const newProject = await ProjectService.createProject(req.body);
      return ApiResponse.success(res, newProject, 'Project created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProject = await ProjectService.updateProject(req.params.id, req.body);
      return ApiResponse.success(res, updatedProject, 'Project updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const archivedProject = await ProjectService.deleteProject(req.params.id);
      return ApiResponse.success(
        res,
        archivedProject,
        'Project archived/deactivated successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
