import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Enable CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Express Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root Help Route to stop "Cannot GET /" Confusion
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center; max-w: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Database Connected! API is Running! 🚀</h1>
      <p style="font-size: 18px; color: #475569;">You are currently viewing the Backend API port (5000).</p>
      <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-weight: bold; margin-bottom: 10px;">To access the actual application interface,<br>please go to your frontend port:</p>
        <a href="http://localhost:3000" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">Click here to open Frontend (Port 3000)</a>
      </div>
    </div>
  `);
});

// Primary API Routes Mounted under /api
app.use('/api', routes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
