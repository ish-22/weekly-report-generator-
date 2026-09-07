"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const report_repository_1 = require("../repositories/report.repository");
const version_repository_1 = require("../repositories/version.repository");
const errors_util_1 = require("../utils/errors.util");
const client_1 = require("@prisma/client");
class ReportService {
    static async createReport(userId, data) {
        const startDate = new Date(data.weekStartDate);
        const endDate = new Date(data.weekEndDate);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new errors_util_1.BadRequestError('Invalid weekStartDate or weekEndDate format');
        }
        if (startDate > endDate) {
            throw new errors_util_1.BadRequestError('weekStartDate cannot be after weekEndDate');
        }
        // Check for duplicate report for user, project, and week
        const existing = await report_repository_1.ReportRepository.findExistingUserWeekReport(userId, startDate, data.projectId);
        if (existing) {
            throw new errors_util_1.ConflictError('A report already exists for this project in the specified week.');
        }
        return report_repository_1.ReportRepository.createReportWithTasks({
            userId,
            projectId: data.projectId,
            weekStartDate: startDate,
            weekEndDate: endDate,
            tasksPlannedNextWeek: data.tasksPlannedNextWeek || undefined,
            blockers: data.blockers || undefined,
            isKeyBlocker: data.isKeyBlocker,
            achievements: data.achievements || undefined,
            isKeyAchievement: data.isKeyAchievement,
            optionalNotes: data.optionalNotes || undefined,
            tasks: data.tasks,
        });
    }
    static async getOwnReports(userId, filters) {
        return report_repository_1.ReportRepository.findManyWithFilters({
            ...filters,
            userId,
        });
    }
    static async getOwnReportById(reportId, userId) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        if (report.userId !== userId) {
            throw new errors_util_1.ForbiddenError('Access denied. You can only view your own reports.');
        }
        return report;
    }
    static async updateOwnReport(reportId, userId, data) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        if (report.userId !== userId) {
            throw new errors_util_1.ForbiddenError('Access denied. You can only edit your own reports.');
        }
        // Workflow guard: Team Members can ONLY edit when status is DRAFT or NEEDS_CORRECTION
        if (report.status !== client_1.ReportStatus.DRAFT && report.status !== client_1.ReportStatus.NEEDS_CORRECTION) {
            throw new errors_util_1.BadRequestError(`Cannot edit report content when status is '${report.status}'. Editing is only allowed in DRAFT or NEEDS_CORRECTION state.`);
        }
        let startDate;
        let endDate;
        if (data.weekStartDate) {
            startDate = new Date(data.weekStartDate);
        }
        if (data.weekEndDate) {
            endDate = new Date(data.weekEndDate);
        }
        return report_repository_1.ReportRepository.updateDraftOrNeedsCorrectionReport(reportId, {
            projectId: data.projectId,
            weekStartDate: startDate,
            weekEndDate: endDate,
            tasksPlannedNextWeek: data.tasksPlannedNextWeek || undefined,
            blockers: data.blockers || undefined,
            isKeyBlocker: data.isKeyBlocker,
            achievements: data.achievements || undefined,
            isKeyAchievement: data.isKeyAchievement,
            optionalNotes: data.optionalNotes || undefined,
            tasks: data.tasks,
        });
    }
    static async submitReport(reportId, userId) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        if (report.userId !== userId) {
            throw new errors_util_1.ForbiddenError('Access denied. You can only submit your own reports.');
        }
        // State machine check: Valid transitions to SUBMITTED are from DRAFT or NEEDS_CORRECTION
        if (report.status !== client_1.ReportStatus.DRAFT && report.status !== client_1.ReportStatus.NEEDS_CORRECTION) {
            throw new errors_util_1.BadRequestError(`Invalid status transition: Cannot submit report when status is '${report.status}'. Only DRAFT or NEEDS_CORRECTION reports can be submitted.`);
        }
        return report_repository_1.ReportRepository.submitReportWithVersionSnapshot(reportId, userId);
    }
    static async getReportVersions(reportId, userId, isElevated = false) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        if (!isElevated && report.userId !== userId) {
            throw new errors_util_1.ForbiddenError('Access denied. You can only view versions of your own reports.');
        }
        return version_repository_1.VersionRepository.findByReportId(reportId);
    }
    static async getReportVersionDetail(reportId, versionNumber, userId, isElevated = false) {
        const report = await report_repository_1.ReportRepository.findById(reportId);
        if (!report) {
            throw new errors_util_1.NotFoundError('Report not found');
        }
        if (!isElevated && report.userId !== userId) {
            throw new errors_util_1.ForbiddenError('Access denied. You can only view versions of your own reports.');
        }
        const version = await version_repository_1.VersionRepository.findByReportIdAndVersionNumber(reportId, versionNumber);
        if (!version) {
            throw new errors_util_1.NotFoundError(`Report version #${versionNumber} not found`);
        }
        return version;
    }
}
exports.ReportService = ReportService;
