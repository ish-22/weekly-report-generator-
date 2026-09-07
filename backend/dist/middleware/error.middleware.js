"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_util_1 = require("../utils/errors.util");
const api_response_util_1 = require("../utils/api-response.util");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof errors_util_1.AppError) {
        return api_response_util_1.ApiResponse.error(res, err.message, err.statusCode, err.errors);
    }
    // Handle Prisma Known Request Errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err;
        if (prismaErr.code === 'P2002') {
            const target = prismaErr.meta?.target ? ` (${prismaErr.meta.target})` : '';
            return api_response_util_1.ApiResponse.error(res, `A record with this value already exists${target}.`, 409);
        }
        if (prismaErr.code === 'P2025') {
            return api_response_util_1.ApiResponse.error(res, 'Record to update/delete not found.', 404);
        }
    }
    console.error('[Unhandled Error]:', err);
    const message = process.env.NODE_ENV === 'production'
        ? 'An unexpected internal server error occurred'
        : err.message || 'Internal server error';
    return api_response_util_1.ApiResponse.error(res, message, 500);
};
exports.errorHandler = errorHandler;
