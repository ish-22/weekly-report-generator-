"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerController = void 0;
const manager_service_1 = require("../services/manager.service");
const api_response_util_1 = require("../utils/api-response.util");
class ManagerController {
    static async listAllTeamReports(req, res, next) {
        try {
            const filters = {
                page: Number(req.query.page || 1),
                limit: Number(req.query.limit || 10),
                status: req.query.status,
                projectId: req.query.projectId,
                userId: req.query.userId,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await manager_service_1.ManagerService.listAllTeamReports(filters);
            return api_response_util_1.ApiResponse.success(res, result.reports, 'Team reports retrieved successfully', 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getReportDetail(req, res, next) {
        try {
            const report = await manager_service_1.ManagerService.getReportDetail(req.params.id);
            return api_response_util_1.ApiResponse.success(res, report, 'Report detail retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async approveReport(req, res, next) {
        try {
            const reviewerId = req.user.userId;
            const result = await manager_service_1.ManagerService.approveReport(req.params.id, reviewerId, req.body.comment);
            return api_response_util_1.ApiResponse.success(res, result, 'Report approved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async requestChanges(req, res, next) {
        try {
            const reviewerId = req.user.userId;
            const result = await manager_service_1.ManagerService.requestChanges(req.params.id, reviewerId, req.body.comment);
            return api_response_util_1.ApiResponse.success(res, result, 'Report change request submitted successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ManagerController = ManagerController;
