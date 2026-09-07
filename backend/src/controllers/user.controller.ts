import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/api-response.util';
import { RoleName } from '@prisma/client';

export class UserController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.query.role as RoleName | undefined;
      const isActive =
        req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

      const users = await UserService.listUsers({ role, isActive });
      return ApiResponse.success(res, users, 'Users retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return ApiResponse.success(res, user, 'User details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUserRole(
        req.params.id,
        req.body.role as RoleName
      );
      return ApiResponse.success(res, updatedUser, 'User role updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUserStatus(
        req.params.id,
        req.body.isActive
      );
      return ApiResponse.success(res, updatedUser, 'User active status updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
