import { prisma } from '../lib/prisma.lib';
import { ReportStatus, ReviewAction } from '@prisma/client';

export class ReviewRepository {
  static async createReviewAndUpdateReport(data: {
    reportId: string;
    reportVersionId: string;
    reviewerId: string;
    action: ReviewAction;
    comment?: string | null;
    targetStatus: ReportStatus;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create ReviewHistory record
      const review = await tx.reviewHistory.create({
        data: {
          reportId: data.reportId,
          reportVersionId: data.reportVersionId,
          reviewerId: data.reviewerId,
          action: data.action,
          comment: data.comment,
        },
        include: {
          reviewer: {
            select: { id: true, fullName: true, email: true },
          },
          reportVersion: {
            select: { versionNumber: true },
          },
        },
      });

      // 2. Update report status
      const updatedReport = await tx.report.update({
        where: { id: data.reportId },
        data: { status: data.targetStatus },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          project: true,
          tasks: true,
          reviewHistories: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return { review, report: updatedReport };
    });
  }

  static async findByReportId(reportId: string) {
    return prisma.reviewHistory.findMany({
      where: { reportId },
      include: {
        reviewer: {
          select: { id: true, fullName: true, email: true },
        },
        reportVersion: {
          select: { versionNumber: true, submittedAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
