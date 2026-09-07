import { prisma } from '../lib/prisma.lib';
import { Report, ReportStatus, Prisma } from '@prisma/client';

export interface ReportFilterOptions {
  userId?: string;
  projectId?: string;
  status?: ReportStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class ReportRepository {
  static async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        project: true,
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        versions: {
          orderBy: { versionNumber: 'desc' },
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
        },
        reviewHistories: {
          include: {
            reviewer: {
              select: { id: true, fullName: true, email: true },
            },
            reportVersion: {
              select: { versionNumber: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async findExistingUserWeekReport(
    userId: string,
    weekStartDate: Date,
    projectId: string
  ): Promise<Report | null> {
    return prisma.report.findUnique({
      where: {
        user_week_project_unique: {
          userId,
          weekStartDate,
          projectId,
        },
      },
    });
  }

  static async createReportWithTasks(data: {
    userId: string;
    projectId: string;
    weekStartDate: Date;
    weekEndDate: Date;
    tasksPlannedNextWeek?: string;
    blockers?: string;
    isKeyBlocker?: boolean;
    achievements?: string;
    isKeyAchievement?: boolean;
    optionalNotes?: string;
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
  }) {
    const { tasks, ...reportData } = data;

    return prisma.report.create({
      data: {
        ...reportData,
        status: ReportStatus.DRAFT,
        currentVersionNumber: 1,
        tasks: {
          create: tasks.map((t) => ({
            name: t.name,
            priority: t.priority,
            taskType: t.taskType,
            status: t.status,
            plannedPercentage: new Prisma.Decimal(t.plannedPercentage),
            actualPercentage: new Prisma.Decimal(t.actualPercentage),
            plannedHours: new Prisma.Decimal(t.plannedHours),
            timeSpentHours: new Prisma.Decimal(t.timeSpentHours),
            outputDeliverable: t.outputDeliverable,
          })),
        },
      },
      include: {
        project: true,
        tasks: true,
      },
    });
  }

  static async updateDraftOrNeedsCorrectionReport(
    id: string,
    data: {
      projectId?: string;
      weekStartDate?: Date;
      weekEndDate?: Date;
      tasksPlannedNextWeek?: string;
      blockers?: string;
      isKeyBlocker?: boolean;
      achievements?: string;
      isKeyAchievement?: boolean;
      optionalNotes?: string;
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
    const { tasks, ...reportFields } = data;

    return prisma.$transaction(async (tx) => {
      if (tasks) {
        // Delete old tasks and replace with new set
        await tx.reportTask.deleteMany({
          where: { reportId: id },
        });
        await tx.reportTask.createMany({
          data: tasks.map((t) => ({
            reportId: id,
            name: t.name,
            priority: t.priority,
            taskType: t.taskType,
            status: t.status,
            plannedPercentage: new Prisma.Decimal(t.plannedPercentage),
            actualPercentage: new Prisma.Decimal(t.actualPercentage),
            plannedHours: new Prisma.Decimal(t.plannedHours),
            timeSpentHours: new Prisma.Decimal(t.timeSpentHours),
            outputDeliverable: t.outputDeliverable,
          })),
        });
      }

      return tx.report.update({
        where: { id },
        data: reportFields,
        include: {
          project: true,
          tasks: true,
        },
      });
    });
  }

  static async submitReportWithVersionSnapshot(
    reportId: string,
    userId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const report = await tx.report.findUnique({
        where: { id: reportId },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          project: true,
          tasks: true,
        },
      });

      if (!report) {
        throw new Error('Report not found');
      }

      // Determine next version number
      const existingVersions = await tx.reportVersion.count({
        where: { reportId },
      });
      const versionNumber = existingVersions + 1;

      // Construct snapshot JSON object
      const snapshotPayload = {
        reportId: report.id,
        versionNumber,
        weekStartDate: report.weekStartDate,
        weekEndDate: report.weekEndDate,
        projectId: report.projectId,
        projectName: report.project.name,
        user: report.user,
        tasksPlannedNextWeek: report.tasksPlannedNextWeek,
        blockers: report.blockers,
        isKeyBlocker: report.isKeyBlocker,
        achievements: report.achievements,
        isKeyAchievement: report.isKeyAchievement,
        optionalNotes: report.optionalNotes,
        submittedAt: new Date().toISOString(),
        tasks: report.tasks.map((t) => ({
          id: t.id,
          name: t.name,
          priority: t.priority,
          taskType: t.taskType,
          status: t.status,
          plannedPercentage: Number(t.plannedPercentage),
          actualPercentage: Number(t.actualPercentage),
          plannedHours: Number(t.plannedHours),
          timeSpentHours: Number(t.timeSpentHours),
          outputDeliverable: t.outputDeliverable,
        })),
      };

      // Create ReportVersion snapshot row
      const newVersion = await tx.reportVersion.create({
        data: {
          reportId: report.id,
          versionNumber,
          snapshotData: snapshotPayload as any,
          statusAtSubmission: ReportStatus.SUBMITTED,
          submittedByUserId: userId,
        },
      });

      // Update report status to SUBMITTED and update currentVersionNumber
      const updatedReport = await tx.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.SUBMITTED,
          currentVersionNumber: versionNumber,
        },
        include: {
          project: true,
          tasks: true,
          versions: true,
        },
      });

      return { report: updatedReport, version: newVersion };
    });
  }

  static async findManyWithFilters(options: ReportFilterOptions) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    if (options.userId) {
      where.userId = options.userId;
    }
    if (options.projectId) {
      where.projectId = options.projectId;
    }
    if (options.status) {
      where.status = options.status;
    }
    if (options.startDate || options.endDate) {
      where.weekStartDate = {};
      if (options.startDate) {
        where.weekStartDate.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        where.weekStartDate.lte = new Date(options.endDate);
      }
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
          project: true,
          tasks: true,
          _count: {
            select: { versions: true, reviewHistories: true },
          },
        },
        orderBy: [{ weekStartDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
