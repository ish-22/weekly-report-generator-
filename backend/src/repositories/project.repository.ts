import { prisma } from '../lib/prisma.lib';
import { Project } from '@prisma/client';

export class ProjectRepository {
  static async findAll(includeInactive: boolean = false): Promise<Project[]> {
    return prisma.project.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  static async findByCode(code: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { code },
    });
  }

  static async create(data: {
    name: string;
    code: string;
    description?: string;
    isActive?: boolean;
  }): Promise<Project> {
    return prisma.project.create({
      data,
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      code?: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  static async deleteOrArchive(id: string): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
