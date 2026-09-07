"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_repository_1 = require("../repositories/project.repository");
const errors_util_1 = require("../utils/errors.util");
class ProjectService {
    static async listProjects(includeInactive = false) {
        return project_repository_1.ProjectRepository.findAll(includeInactive);
    }
    static async getProjectById(id) {
        const project = await project_repository_1.ProjectRepository.findById(id);
        if (!project) {
            throw new errors_util_1.NotFoundError('Project not found');
        }
        return project;
    }
    static async createProject(data) {
        const existingCode = await project_repository_1.ProjectRepository.findByCode(data.code.toUpperCase());
        if (existingCode) {
            throw new errors_util_1.ConflictError(`Project with code '${data.code.toUpperCase()}' already exists`);
        }
        return project_repository_1.ProjectRepository.create({
            ...data,
            code: data.code.toUpperCase(),
        });
    }
    static async updateProject(id, data) {
        const existing = await project_repository_1.ProjectRepository.findById(id);
        if (!existing) {
            throw new errors_util_1.NotFoundError('Project not found');
        }
        if (data.code && data.code.toUpperCase() !== existing.code) {
            const existingCode = await project_repository_1.ProjectRepository.findByCode(data.code.toUpperCase());
            if (existingCode) {
                throw new errors_util_1.ConflictError(`Project with code '${data.code.toUpperCase()}' already exists`);
            }
        }
        return project_repository_1.ProjectRepository.update(id, {
            ...data,
            code: data.code ? data.code.toUpperCase() : undefined,
        });
    }
    static async deleteProject(id) {
        const existing = await project_repository_1.ProjectRepository.findById(id);
        if (!existing) {
            throw new errors_util_1.NotFoundError('Project not found');
        }
        return project_repository_1.ProjectRepository.deleteOrArchive(id);
    }
}
exports.ProjectService = ProjectService;
