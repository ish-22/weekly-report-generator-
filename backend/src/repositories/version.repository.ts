import { prisma } from '../lib/prisma.lib';

export class VersionRepository {
  static async findByReportId(reportId: string) {
    return prisma.reportVersion.findMany({
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

  static async findByReportIdAndVersionNumber(reportId: string, versionNumber: number) {
    return prisma.reportVersion.findUnique({
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

  static async findLatestVersion(reportId: string) {
    return prisma.reportVersion.findFirst({
      where: { reportId },
      orderBy: { versionNumber: 'desc' },
      include: {
        reviews: true,
      },
    });
  }
}
