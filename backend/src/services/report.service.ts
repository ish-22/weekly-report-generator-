import { ReportRepository, ReportFilterOptions } from '../repositories/report.repository';
import { VersionRepository } from '../repositories/version.repository';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../utils/errors.util';
import { ReportStatus } from '@prisma/client';

export class ReportService {
  static async createReport(
    userId: string,
    data: {
      projectId: string;
      weekStartDate: string;
      weekEndDate: string;
      tasksPlannedNextWeek?: string | null;
      blockers?: string | null;
      isKeyBlocker?: boolean;
      achievements?: string | null;
      isKeyAchievement?: boolean;
      optionalNotes?: string | null;
      tasks: Array<{
        name: string;
        priority: any;
        taskType: any;
        status: any;
        plannedPercentage: number;
        actualPercentage: number;
        plannedHours: number;
        timeSpentHours: number;
        outputDeliverable?: string | null;
      }>;
    }
  ) {
    const startDate = new Date(data.weekStartDate);
    const endDate = new Date(data.weekEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestError('Invalid weekStartDate or weekEndDate format');
    }

    if (startDate > endDate) {
      throw new BadRequestError('weekStartDate cannot be after weekEndDate');
    }

    // Check for duplicate report for user, project, and week
    const existing = await ReportRepository.findExistingUserWeekReport(
      userId,
      startDate,
      data.projectId
    );

    if (existing) {
      throw new ConflictError(
        'A report already exists for this project in the specified week.'
      );
    }

    return ReportRepository.createReportWithTasks({
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

  static async getOwnReports(userId: string, filters: ReportFilterOptions) {
    return ReportRepository.findManyWithFilters({
      ...filters,
      userId,
    });
  }

  static async getOwnReportById(reportId: string, userId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (report.userId !== userId) {
      throw new ForbiddenError('Access denied. You can only view your own reports.');
    }

    return report;
  }

  static async updateOwnReport(
    reportId: string,
    userId: string,
    data: {
      projectId?: string;
      weekStartDate?: string;
      weekEndDate?: string;
      tasksPlannedNextWeek?: string | null;
      blockers?: string | null;
      isKeyBlocker?: boolean;
      achievements?: string | null;
      isKeyAchievement?: boolean;
      optionalNotes?: string | null;
      tasks?: Array<{
        name: string;
        priority: any;
        taskType: any;
        status: any;
        plannedPercentage: number;
        actualPercentage: number;
        plannedHours: number;
        timeSpentHours: number;
        outputDeliverable?: string | null;
      }>;
    }
  ) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (report.userId !== userId) {
      throw new ForbiddenError('Access denied. You can only edit your own reports.');
    }

    // Workflow guard: Team Members can ONLY edit when status is DRAFT or NEEDS_CORRECTION
    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.NEEDS_CORRECTION) {
      throw new BadRequestError(
        `Cannot edit report content when status is '${report.status}'. Editing is only allowed in DRAFT or NEEDS_CORRECTION state.`
      );
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (data.weekStartDate) {
      startDate = new Date(data.weekStartDate);
    }
    if (data.weekEndDate) {
      endDate = new Date(data.weekEndDate);
    }

    return ReportRepository.updateDraftOrNeedsCorrectionReport(reportId, {
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

  static async submitReport(reportId: string, userId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (report.userId !== userId) {
      throw new ForbiddenError('Access denied. You can only submit your own reports.');
    }

    // State machine check: Valid transitions to SUBMITTED are from DRAFT or NEEDS_CORRECTION
    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.NEEDS_CORRECTION) {
      throw new BadRequestError(
        `Invalid status transition: Cannot submit report when status is '${report.status}'. Only DRAFT or NEEDS_CORRECTION reports can be submitted.`
      );
    }

    return ReportRepository.submitReportWithVersionSnapshot(reportId, userId);
  }

  static async getReportVersions(reportId: string, userId: string, isElevated: boolean = false) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (!isElevated && report.userId !== userId) {
      throw new ForbiddenError('Access denied. You can only view versions of your own reports.');
    }

    return VersionRepository.findByReportId(reportId);
  }

  static async getReportVersionDetail(
    reportId: string,
    versionNumber: number,
    userId: string,
    isElevated: boolean = false
  ) {
    const report = await ReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError('Report not found');
    }

    if (!isElevated && report.userId !== userId) {
      throw new ForbiddenError('Access denied. You can only view versions of your own reports.');
    }

    const version = await VersionRepository.findByReportIdAndVersionNumber(
      reportId,
      versionNumber
    );
    if (!version) {
      throw new NotFoundError(`Report version #${versionNumber} not found`);
    }

    return version;
  }
}
