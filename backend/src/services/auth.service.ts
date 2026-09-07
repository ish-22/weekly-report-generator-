import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors.util';
import { RoleName } from '@prisma/client';
import { AuthResponseDTO, UserResponseDTO } from '../types/auth.types';

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponseDTO> {
    const existingUser = await UserRepository.findByEmail(data.email.toLowerCase());
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Default role for registration is TEAM_MEMBER
    let teamMemberRole = await UserRepository.findRoleByName(RoleName.TEAM_MEMBER);

    if (!teamMemberRole) {
      throw new NotFoundError('Default TEAM_MEMBER role not found in database system');
    }

    const passwordHash = await PasswordUtil.hashPassword(data.password);

    const user = await UserRepository.create({
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName,
      roleId: teamMemberRole.id,
    });

    const roleName = RoleName.TEAM_MEMBER;
    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: roleName,
      roleId: user.roleId,
    });

    const userDto: UserResponseDTO = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: roleName,
      roleId: user.roleId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userDto, token };
  }

  static async login(data: { email: string; password: string }): Promise<AuthResponseDTO> {
    const user = await UserRepository.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact an admin.');
    }

    const isPasswordValid = await PasswordUtil.comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    const roleName = user.role.name;
    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: roleName,
      roleId: user.roleId,
    });

    const userDto: UserResponseDTO = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: roleName,
      roleId: user.roleId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: userDto, token };
  }

  static async getMe(userId: string): Promise<UserResponseDTO> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Authenticated user account not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role.name,
      roleId: user.roleId,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
