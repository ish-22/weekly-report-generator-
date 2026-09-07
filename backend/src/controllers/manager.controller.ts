import { Request, Response, NextFunction } from 'express';
import { ManagerService } from '../services/manager.service';
import { ApiResponse } from '../utils/api-response.util';
import { ReportStatus } from '@prisma/client';

export class ManagerController {
  static async listAllTeamReports(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        status: req.query.status as ReportStatus | undefined,
        projectId: req.query.projectId as string | undefined,
        userId: req.query.userId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };

      const result = await ManagerService.listAllTeamReports(filters);
      return ApiResponse.success(
        res,
        result.reports,
        'Team reports retrieved successfully',
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getReportDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ManagerService.getReportDetail(req.params.id);
      return ApiResponse.success(res, report, 'Report detail retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async approveReport(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user!.userId;
      const result = await ManagerService.approveReport(
        req.params.id,
        reviewerId,
        req.body.comment
      );
      return ApiResponse.success(res, result, 'Report approved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async requestChanges(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user!.userId;
      const result = await ManagerService.requestChanges(
        req.params.id,
        reviewerId,
        req.body.comment
      );
      return ApiResponse.success(res, result, 'Report change request submitted successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
