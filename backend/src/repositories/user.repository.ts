import { prisma } from '../lib/prisma.lib';
import { RoleName, User } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  static async findRoleByName(name: RoleName) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  static async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    roleId: string;
    avatarUrl?: string;
  }) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  }

  static async findAll(params?: { role?: RoleName; isActive?: boolean }) {
    const where: any = {};
    if (params?.role) {
      where.role = { name: params.role };
    }
    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  static async updateRole(userId: string, roleId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true },
    });
  }

  static async updateStatus(userId: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      include: { role: true },
    });
  }
}
