"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerService = void 0;
const report_repository_1 = require("../repositories/report.repository");
const version_repository_1 = require("../repositories/version.repository");
const review_repository_1 = require("../repositories/review.repository");
const errors_util_1 = require("../utils/errors.util");
const client_1 = require("@prisma/client");
class ManagerService {
    static async listAllTeamReports(filters) {
        return report_repository_1.ReportRepository.findManyWithFilters(filters);
    }
    static async getReportDetail(reportId) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        return report;
    }
    static async approveReport(reportId, reviewerId, comment) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        // Workflow guard: Manager can ONLY approve reports in SUBMITTED state
        if (report.status !== client_1.ReportStatus.SUBMITTED) {
            throw new errors_util_1.BadRequestError(`Invalid status transition: Cannot approve report with status '${report.status}'. Only SUBMITTED reports can be approved.`);
        }
        // Find active version snapshot
        const activeVersion = await version_repository_1.VersionRepository.findLatestVersion(reportId);
        if (!activeVersion) {
            throw new errors_util_1.NotFoundError('Active report version snapshot not found');
        }
        return review_repository_1.ReviewRepository.createReviewAndUpdateReport({
            reportId,
            reportVersionId: activeVersion.id,
            reviewerId,
            action: client_1.ReviewAction.APPROVED,
            comment: comment || 'Report reviewed and approved.',
            targetStatus: client_1.ReportStatus.APPROVED,
        });
    }
    static async requestChanges(reportId, reviewerId, comment) {
        if (!comment || comment.trim().length === 0) {
            throw new errors_util_1.BadRequestError('Review comment is required when requesting changes');
        }
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        // Workflow guard: Manager can ONLY request changes on reports in SUBMITTED state
        if (report.status !== client_1.ReportStatus.SUBMITTED) {
            throw new errors_util_1.BadRequestError(`Invalid status transition: Cannot request changes on report with status '${report.status}'. Only SUBMITTED reports can be sent for correction.`);
        }
        // Find active version snapshot
        const activeVersion = await version_repository_1.VersionRepository.findLatestVersion(reportId);
        if (!activeVersion) {
            throw new errors_util_1.NotFoundError('Active report version snapshot not found');
        }
        return review_repository_1.ReviewRepository.createReviewAndUpdateReport({
            reportId,
            reportVersionId: activeVersion.id,
            reviewerId,
            action: client_1.ReviewAction.REQUESTED_CHANGES,
            comment,
            targetStatus: client_1.ReportStatus.NEEDS_CORRECTION,
        });
    }
}
exports.ManagerService = ManagerService;
