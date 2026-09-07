"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message = 'Request successful', statusCode = 200, meta) {
        const payload = {
            success: true,
            message,
            data,
            meta,
        };
        return res.status(statusCode).json(payload);
    }
    static error(res, message = 'An error occurred', statusCode = 500, errors) {
        const payload = {
            success: false,
            message,
            errors,
        };
        return res.status(statusCode).json(payload);
    }
}
exports.ApiResponse = ApiResponse;
