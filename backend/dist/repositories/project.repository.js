"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const prisma_lib_1 = require("../lib/prisma.lib");
class ProjectRepository {
    static async findAll(includeInactive = false) {
        return prisma_lib_1.prisma.project.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    static async findById(id) {
        return prisma_lib_1.prisma.project.findUnique({
            where: { id },
        });
    }
    static async findByCode(code) {
        return prisma_lib_1.prisma.project.findUnique({
            where: { code },
        });
    }
    static async create(data) {
        return prisma_lib_1.prisma.project.create({
            data,
        });
    }
    static async update(id, data) {
        return prisma_lib_1.prisma.project.update({
            where: { id },
            data,
        });
    }
    static async deleteOrArchive(id) {
        return prisma_lib_1.prisma.project.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
exports.ProjectRepository = ProjectRepository;
