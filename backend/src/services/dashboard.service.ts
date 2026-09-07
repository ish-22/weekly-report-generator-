import { prisma } from '../lib/prisma.lib';
import { ReportStatus, RoleName, TaskStatus } from '@prisma/client';

export class DashboardService {
  static async getDashboardMetrics() {
    // 1. Calculate active week range (Monday of current week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const currentWeekStart = new Date(today.setDate(diffToMonday));
    currentWeekStart.setHours(0, 0, 0, 0);

    const [
      totalTeamMembers,
      submittedThisWeek,
      pendingReviewCount,
      needsCorrectionCount,
      approvedCount,
      openBlockersCount,
      totalHoursThisWeek,
    ] = await Promise.all([
      // Total active team members
      prisma.user.count({
        where: { role: { name: RoleName.TEAM_MEMBER }, isActive: true },
      }),
      // Total submitted/approved reports for current week
      prisma.report.count({
        where: {
          weekStartDate: { gte: currentWeekStart },
          status: { in: [ReportStatus.SUBMITTED, ReportStatus.APPROVED] },
        },
      }),
      // Reports currently pending review (SUBMITTED status)
      prisma.report.count({
        where: { status: ReportStatus.SUBMITTED },
      }),
      // Reports currently in NEEDS_CORRECTION status
      prisma.report.count({
        where: { status: ReportStatus.NEEDS_CORRECTION },
      }),
      // Total approved reports overall
      prisma.report.count({
        where: { status: ReportStatus.APPROVED },
      }),
      // Open blockers count
      prisma.report.count({
        where: { isKeyBlocker: true, status: { not: ReportStatus.APPROVED } },
      }),
      // Total time spent hours logged in current week
      prisma.reportTask.aggregate({
        where: {
          report: {
            weekStartDate: { gte: currentWeekStart },
          },
        },
        _sum: { timeSpentHours: true },
      }),
    ]);

    const complianceRate =
      totalTeamMembers > 0
        ? Math.round((submittedThisWeek / totalTeamMembers) * 100)
        : 0;

    return {
      currentWeekStart: currentWeekStart.toISOString().split('T')[0],
      totalTeamMembers,
      submittedThisWeek,
      complianceRate,
      pendingReviewCount,
      needsCorrectionCount,
      approvedCount,
      openBlockersCount,
      totalHoursLoggedThisWeek: Number(totalHoursThisWeek._sum.timeSpentHours || 0),
    };
  }

  static async getAnalyticsCharts() {
    // 1. Time spent by task type
    const taskTypeAggregations = await prisma.reportTask.groupBy({
      by: ['taskType'],
      _sum: { timeSpentHours: true, plannedHours: true },
      _count: { id: true },
    });

    const hoursByTaskType = taskTypeAggregations.map((item) => ({
      taskType: item.taskType,
      timeSpentHours: Number(item._sum.timeSpentHours || 0),
      plannedHours: Number(item._sum.plannedHours || 0),
      taskCount: item._count.id,
    }));

    // 2. Status distribution by report status
    const reportStatusGroup = await prisma.report.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const statusDistribution = reportStatusGroup.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // 3. Workload by project
    const projectWorkload = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        reports: {
          select: {
            id: true,
            status: true,
            tasks: {
              select: { timeSpentHours: true },
            },
          },
        },
      },
    });

    const workloadByProject = projectWorkload.map((p) => {
      let totalHours = 0;
      let totalReports = p.reports.length;
      p.reports.forEach((r) => {
        r.tasks.forEach((t) => {
          totalHours += Number(t.timeSpentHours || 0);
        });
      });

      return {
        projectId: p.id,
        projectName: p.name,
        projectCode: p.code,
        totalReports,
        totalHoursSpent: Math.round(totalHours * 100) / 100,
      };
    });

    // 4. Completed task trends
    const taskStatusCounts = await prisma.reportTask.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const taskStatusDistribution = taskStatusCounts.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // 5. Recent Activity Feed
    const recentReviews = await prisma.reviewHistory.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, fullName: true, email: true } },
        report: {
          select: {
            id: true,
            user: { select: { fullName: true } },
            project: { select: { name: true } },
          },
        },
      },
    });

    const recentActivity = recentReviews.map((r) => ({
      id: r.id,
      reportId: r.reportId,
      reviewerName: r.reviewer.fullName,
      teamMemberName: r.report.user.fullName,
      projectName: r.report.project.name,
      action: r.action,
      comment: r.comment,
      timestamp: r.createdAt,
    }));

    return {
      hoursByTaskType,
      statusDistribution,
      workloadByProject,
      taskStatusDistribution,
      recentActivity,
    };
  }
}
