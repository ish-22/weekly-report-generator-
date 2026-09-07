import { UserRepository } from '../repositories/user.repository';
import { NotFoundError } from '../utils/errors.util';
import { RoleName } from '@prisma/client';

export class UserService {
  static async listUsers(params?: { role?: RoleName; isActive?: boolean }) {
    return UserRepository.findAll(params);
  }

  static async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async updateUserRole(userId: string, newRoleName: RoleName) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const role = await UserRepository.findRoleByName(newRoleName);
    if (!role) {
      throw new NotFoundError(`Role '${newRoleName}' not found`);
    }

    return UserRepository.updateRole(userId, role.id);
  }

  static async updateUserStatus(userId: string, isActive: boolean) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return UserRepository.updateStatus(userId, isActive);
  }
}
