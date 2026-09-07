import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma.lib';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Weekly Report Generator API Server Started`);
  console.log(`📍 Environment: ${env.NODE_ENV}`);
  console.log(`🌐 Running on Port: http://localhost:${PORT}`);
  console.log(`==================================================`);
});

// Graceful Shutdown Handlers
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] Received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP Server closed.');
    await prisma.$disconnect();
    console.log('Prisma Database client disconnected.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default server;
