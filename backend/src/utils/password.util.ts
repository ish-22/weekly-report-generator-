import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export class PasswordUtil {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
