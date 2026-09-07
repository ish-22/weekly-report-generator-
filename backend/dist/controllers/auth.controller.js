"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const api_response_util_1 = require("../utils/api-response.util");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            return api_response_util_1.ApiResponse.success(res, result, 'User registered successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            return api_response_util_1.ApiResponse.success(res, result, 'User authenticated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(_req, res, next) {
        try {
            return api_response_util_1.ApiResponse.success(res, null, 'User logged out successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await auth_service_1.AuthService.getMe(userId);
            return api_response_util_1.ApiResponse.success(res, user, 'User profile fetched successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
