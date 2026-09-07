import { ProjectRepository } from '../repositories/project.repository';
import { ConflictError, NotFoundError } from '../utils/errors.util';

export class ProjectService {
  static async listProjects(includeInactive: boolean = false) {
    return ProjectRepository.findAll(includeInactive);
  }

  static async getProjectById(id: string) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  }

  static async createProject(data: { name: string; code: string; description?: string; isActive?: boolean }) {
    const existingCode = await ProjectRepository.findByCode(data.code.toUpperCase());
    if (existingCode) {
      throw new ConflictError(`Project with code '${data.code.toUpperCase()}' already exists`);
    }

    return ProjectRepository.create({
      ...data,
      code: data.code.toUpperCase(),
    });
  }

  static async updateProject(
    id: string,
    data: { name?: string; code?: string; description?: string; isActive?: boolean }
  ) {
    const existing = await ProjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    if (data.code && data.code.toUpperCase() !== existing.code) {
      const existingCode = await ProjectRepository.findByCode(data.code.toUpperCase());
      if (existingCode) {
        throw new ConflictError(`Project with code '${data.code.toUpperCase()}' already exists`);
      }
    }

    return ProjectRepository.update(id, {
      ...data,
      code: data.code ? data.code.toUpperCase() : undefined,
    });
  }

  static async deleteProject(id: string) {
    const existing = await ProjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    return ProjectRepository.deleteOrArchive(id);
  }
}
