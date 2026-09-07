"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const errors_util_1 = require("../utils/errors.util");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_util_1.UnauthorizedError('Authentication token missing or invalid format');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_util_1.UnauthorizedError('Token not provided');
        }
        const payload = jwt_util_1.JwtUtil.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new errors_util_1.UnauthorizedError('Invalid or expired authentication token'));
        }
        next(error);
    }
};
exports.authenticate = authenticate;
