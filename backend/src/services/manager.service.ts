import { ReportRepository, ReportFilterOptions } from '../repositories/report.repository';
import { VersionRepository } from '../repositories/version.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { BadRequestError, NotFoundError } from '../utils/errors.util';
import { ReportStatus, ReviewAction } from '@prisma/client';

export class ManagerService {
  static async listAllTeamReports(filters: ReportFilterOptions) {
    return ReportRepository.findManyWithFilters(filters);
  }

  static async getReportDetail(reportId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }
    return report;
  }

  static async approveReport(reportId: string, reviewerId: string, comment?: string | null) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    // Workflow guard: Manager can ONLY approve reports in SUBMITTED state
    if (report.status !== ReportStatus.SUBMITTED) {
      throw new BadRequestError(
        `Invalid status transition: Cannot approve report with status '${report.status}'. Only SUBMITTED reports can be approved.`
      );
    }

    // Find active version snapshot
    const activeVersion = await VersionRepository.findLatestVersion(reportId);
    if (!activeVersion) {
      throw new NotFoundError('Active report version snapshot not found');
    }

    return ReviewRepository.createReviewAndUpdateReport({
      reportId,
      reportVersionId: activeVersion.id,
      reviewerId,
      action: ReviewAction.APPROVED,
      comment: comment || 'Report reviewed and approved.',
      targetStatus: ReportStatus.APPROVED,
    });
  }

  static async requestChanges(reportId: string, reviewerId: string, comment: string) {
    if (!comment || comment.trim().length === 0) {
      throw new BadRequestError('Review comment is required when requesting changes');
    }

    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    // Workflow guard: Manager can ONLY request changes on reports in SUBMITTED state
    if (report.status !== ReportStatus.SUBMITTED) {
      throw new BadRequestError(
        `Invalid status transition: Cannot request changes on report with status '${report.status}'. Only SUBMITTED reports can be sent for correction.`
      );
    }

    // Find active version snapshot
    const activeVersion = await VersionRepository.findLatestVersion(reportId);
    if (!activeVersion) {
      throw new NotFoundError('Active report version snapshot not found');
    }

    return ReviewRepository.createReviewAndUpdateReport({
      reportId,
      reportVersionId: activeVersion.id,
      reviewerId,
      action: ReviewAction.REQUESTED_CHANGES,
      comment,
      targetStatus: ReportStatus.NEEDS_CORRECTION,
    });
  }
}
