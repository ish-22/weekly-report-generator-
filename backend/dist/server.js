"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_lib_1 = require("./lib/prisma.lib");
const PORT = env_1.env.PORT;
const server = app_1.default.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Weekly Report Generator API Server Started`);
    console.log(`📍 Environment: ${env_1.env.NODE_ENV}`);
    console.log(`🌐 Running on Port: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
// Graceful Shutdown Handlers
const gracefulShutdown = async (signal) => {
    console.log(`\n[${signal}] Received. Shutting down gracefully...`);
    server.close(async () => {
        console.log('HTTP Server closed.');
        await prisma_lib_1.prisma.$disconnect();
        console.log('Prisma Database client disconnected.');
        process.exit(0);
    });
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
exports.default = server;
