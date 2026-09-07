"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_lib_1 = require("../lib/prisma.lib");
class UserRepository {
    static async findByEmail(email) {
        return prisma_lib_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }
    static async findById(id) {
        return prisma_lib_1.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    static async findRoleByName(name) {
        return prisma_lib_1.prisma.role.findUnique({
            where: { name },
        });
    }
    static async create(data) {
        return prisma_lib_1.prisma.user.create({
            data,
            include: { role: true },
        });
    }
    static async findAll(params) {
        const where = {};
        if (params?.role) {
            where.role = { name: params.role };
        }
        if (params?.isActive !== undefined) {
            where.isActive = params.isActive;
        }
        return prisma_lib_1.prisma.user.findMany({
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
    static async updateRole(userId, roleId) {
        return prisma_lib_1.prisma.user.update({
            where: { id: userId },
            data: { roleId },
            include: { role: true },
        });
    }
    static async updateStatus(userId, isActive) {
        return prisma_lib_1.prisma.user.update({
            where: { id: userId },
            data: { isActive },
            include: { role: true },
        });
    }
}
exports.UserRepository = UserRepository;
