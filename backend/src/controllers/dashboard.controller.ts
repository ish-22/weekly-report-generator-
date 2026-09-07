import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/api-response.util';

export class DashboardController {
  static async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await DashboardService.getDashboardMetrics();
      return ApiResponse.success(res, metrics, 'Dashboard KPI metrics fetched successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await DashboardService.getAnalyticsCharts();
      return ApiResponse.success(res, analytics, 'Dashboard analytics data fetched successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
