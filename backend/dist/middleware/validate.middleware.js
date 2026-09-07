"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errors_util_1 = require("../utils/errors.util");
const validateRequest = (schema) => {
    return async (req, _res, next) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query);
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return next(new errors_util_1.ValidationError(formattedErrors));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
