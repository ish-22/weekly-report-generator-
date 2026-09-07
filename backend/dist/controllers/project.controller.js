"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const project_service_1 = require("../services/project.service");
const api_response_util_1 = require("../utils/api-response.util");
class ProjectController {
    static async listProjects(req, res, next) {
        try {
            const includeInactive = req.query.includeInactive === 'true';
            const projects = await project_service_1.ProjectService.listProjects(includeInactive);
            return api_response_util_1.ApiResponse.success(res, projects, 'Projects retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getProjectById(req, res, next) {
        try {
            const project = await project_service_1.ProjectService.getProjectById(req.params.id);
            return api_response_util_1.ApiResponse.success(res, project, 'Project details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async createProject(req, res, next) {
        try {
            const newProject = await project_service_1.ProjectService.createProject(req.body);
            return api_response_util_1.ApiResponse.success(res, newProject, 'Project created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProject(req, res, next) {
        try {
            const updatedProject = await project_service_1.ProjectService.updateProject(req.params.id, req.body);
            return api_response_util_1.ApiResponse.success(res, updatedProject, 'Project updated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProject(req, res, next) {
        try {
            const archivedProject = await project_service_1.ProjectService.deleteProject(req.params.id);
            return api_response_util_1.ApiResponse.success(res, archivedProject, 'Project archived/deactivated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProjectController = ProjectController;
