"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const report_service_1 = require("../services/report.service");
const api_response_util_1 = require("../utils/api-response.util");
class ReportController {
    static async createReport(req, res, next) {
        try {
            const userId = req.user.userId;
            const report = await report_service_1.ReportService.createReport(userId, req.body);
            return api_response_util_1.ApiResponse.success(res, report, 'Report draft created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyReports(req, res, next) {
        try {
            const userId = req.user.userId;
            const filters = {
                page: Number(req.query.page || 1),
                limit: Number(req.query.limit || 10),
                status: req.query.status,
                projectId: req.query.projectId,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await report_service_1.ReportService.getOwnReports(userId, filters);
            return api_response_util_1.ApiResponse.success(res, result.reports, 'Reports retrieved successfully', 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getOwnReportById(req, res, next) {
        try {
            const userId = req.user.userId;
            const report = await report_service_1.ReportService.getOwnReportById(req.params.id, userId);
            return api_response_util_1.ApiResponse.success(res, report, 'Report details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateOwnReport(req, res, next) {
        try {
            const userId = req.user.userId;
            const updatedReport = await report_service_1.ReportService.updateOwnReport(req.params.id, userId, req.body);
            return api_response_util_1.ApiResponse.success(res, updatedReport, 'Report updated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async submitReport(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await report_service_1.ReportService.submitReport(req.params.id, userId);
            return api_response_util_1.ApiResponse.success(res, result, 'Report submitted and snapshot version created successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getReportVersions(req, res, next) {
        try {
            const userId = req.user.userId;
            const isElevated = req.user.role === 'MANAGER' || req.user.role === 'ADMIN';
            const versions = await report_service_1.ReportService.getReportVersions(req.params.id, userId, isElevated);
            return api_response_util_1.ApiResponse.success(res, versions, 'Report versions retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getReportVersionDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const isElevated = req.user.role === 'MANAGER' || req.user.role === 'ADMIN';
            const versionNumber = parseInt(req.params.versionNumber, 10);
            const version = await report_service_1.ReportService.getReportVersionDetail(req.params.id, versionNumber, userId, isElevated);
            return api_response_util_1.ApiResponse.success(res, version, 'Report version details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportController = ReportController;
