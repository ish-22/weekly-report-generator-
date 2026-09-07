"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const api_response_util_1 = require("../utils/api-response.util");
class DashboardController {
    static async getMetrics(_req, res, next) {
        try {
            const metrics = await dashboard_service_1.DashboardService.getDashboardMetrics();
            return api_response_util_1.ApiResponse.success(res, metrics, 'Dashboard KPI metrics fetched successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAnalytics(_req, res, next) {
        try {
            const analytics = await dashboard_service_1.DashboardService.getAnalyticsCharts();
            return api_response_util_1.ApiResponse.success(res, analytics, 'Dashboard analytics data fetched successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
