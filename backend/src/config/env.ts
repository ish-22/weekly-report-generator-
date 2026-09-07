import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/weekly_report_db',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_access_key_weekly_report_2026_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '12', 10),
};
