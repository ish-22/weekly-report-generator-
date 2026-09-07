"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const api_response_util_1 = require("../utils/api-response.util");
class UserController {
    static async listUsers(req, res, next) {
        try {
            const role = req.query.role;
            const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
            const users = await user_service_1.UserService.listUsers({ role, isActive });
            return api_response_util_1.ApiResponse.success(res, users, 'Users retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserById(req, res, next) {
        try {
            const user = await user_service_1.UserService.getUserById(req.params.id);
            return api_response_util_1.ApiResponse.success(res, user, 'User details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRole(req, res, next) {
        try {
            const updatedUser = await user_service_1.UserService.updateUserRole(req.params.id, req.body.role);
            return api_response_util_1.ApiResponse.success(res, updatedUser, 'User role updated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const updatedUser = await user_service_1.UserService.updateUserStatus(req.params.id, req.body.isActive);
            return api_response_util_1.ApiResponse.success(res, updatedUser, 'User active status updated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
