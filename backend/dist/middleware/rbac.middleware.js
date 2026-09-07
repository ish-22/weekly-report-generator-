"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnershipOrRole = exports.requireRole = void 0;
const errors_util_1 = require("../utils/errors.util");
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_util_1.UnauthorizedError('User authentication required'));
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return next(new errors_util_1.ForbiddenError(`Access denied. Role '${userRole}' is not authorized to access this resource.`));
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireOwnershipOrRole = (getResourceUserId, ...elevatedRoles) => {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                return next(new errors_util_1.UnauthorizedError('User authentication required'));
            }
            const userRole = req.user.role;
            // Elevated roles bypass individual ownership check
            if (elevatedRoles.includes(userRole)) {
                return next();
            }
            const resourceUserId = await getResourceUserId(req);
            if (!resourceUserId || resourceUserId !== req.user.userId) {
                return next(new errors_util_1.ForbiddenError('Access denied. You can only view or modify your own records.'));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireOwnershipOrRole = requireOwnershipOrRole;
