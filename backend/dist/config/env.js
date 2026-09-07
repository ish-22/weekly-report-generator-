"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.env = {
    PORT: process.env.PORT || '5000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/weekly_report_db',
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_access_key_weekly_report_2026_dev',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '12', 10),
};
