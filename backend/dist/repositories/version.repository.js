"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRepository = void 0;
const prisma_lib_1 = require("../lib/prisma.lib");
class VersionRepository {
    static async findByReportId(reportId) {
        return prisma_lib_1.prisma.reportVersion.findMany({
            where: { reportId },
            include: {
                submittedByUser: {
                    select: { id: true, fullName: true, email: true },
                },
                reviews: {
                    include: {
                        reviewer: {
                            select: { id: true, fullName: true, email: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { versionNumber: 'desc' },
        });
    }
    static async findByReportIdAndVersionNumber(reportId, versionNumber) {
        return prisma_lib_1.prisma.reportVersion.findUnique({
            where: {
                reportId_versionNumber: {
                    reportId,
                    versionNumber,
                },
            },
            include: {
                submittedByUser: {
                    select: { id: true, fullName: true, email: true },
                },
                reviews: {
                    include: {
                        reviewer: {
                            select: { id: true, fullName: true, email: true },
                        },
                    },
                },
            },
        });
    }
    static async findLatestVersion(reportId) {
        return prisma_lib_1.prisma.reportVersion.findFirst({
            where: { reportId },
            orderBy: { versionNumber: 'desc' },
            include: {
                reviews: true,
            },
        });
    }
}
exports.VersionRepository = VersionRepository;
