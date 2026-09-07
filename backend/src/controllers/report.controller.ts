import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { ApiResponse } from '../utils/api-response.util';
import { ReportStatus } from '@prisma/client';

export class ReportController {
  static async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const report = await ReportService.createReport(userId, req.body);
      return ApiResponse.success(res, report, 'Report draft created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyReports(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const filters = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        status: req.query.status as ReportStatus | undefined,
        projectId: req.query.projectId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };

      const result = await ReportService.getOwnReports(userId, filters);
      return ApiResponse.success(
        res,
        result.reports,
        'Reports retrieved successfully',
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOwnReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const report = await ReportService.getOwnReportById(req.params.id, userId);
      return ApiResponse.success(res, report, 'Report details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateOwnReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updatedReport = await ReportService.updateOwnReport(
        req.params.id,
        userId,
        req.body
      );
      return ApiResponse.success(res, updatedReport, 'Report updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async submitReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await ReportService.submitReport(req.params.id, userId);
      return ApiResponse.success(
        res,
        result,
        'Report submitted and snapshot version created successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async getReportVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isElevated = req.user!.role === 'MANAGER' || req.user!.role === 'ADMIN';
      const versions = await ReportService.getReportVersions(req.params.id, userId, isElevated);
      return ApiResponse.success(res, versions, 'Report versions retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getReportVersionDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isElevated = req.user!.role === 'MANAGER' || req.user!.role === 'ADMIN';
      const versionNumber = parseInt(req.params.versionNumber, 10);
      const version = await ReportService.getReportVersionDetail(
        req.params.id,
        versionNumber,
        userId,
        isElevated
      );
      return ApiResponse.success(res, version, 'Report version details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
