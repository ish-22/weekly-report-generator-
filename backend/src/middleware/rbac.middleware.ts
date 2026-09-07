import { Request, Response, NextFunction } from 'express';
import { RoleName } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.util';

export const requireRole = (...allowedRoles: RoleName[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication required'));
    }

    const userRole = req.user.role as RoleName;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ForbiddenError(
          `Access denied. Role '${userRole}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export const requireOwnershipOrRole = (
  getResourceUserId: (req: Request) => Promise<string | null> | string | null,
  ...elevatedRoles: RoleName[]
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('User authentication required'));
      }

      const userRole = req.user.role as RoleName;

      // Elevated roles bypass individual ownership check
      if (elevatedRoles.includes(userRole)) {
        return next();
      }

      const resourceUserId = await getResourceUserId(req);

      if (!resourceUserId || resourceUserId !== req.user.userId) {
        return next(
          new ForbiddenError('Access denied. You can only view or modify your own records.')
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
