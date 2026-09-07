"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
const errors_util_1 = require("../utils/errors.util");
const client_1 = require("@prisma/client");
class AuthService {
    static async register(data) {
        const existingUser = await user_repository_1.UserRepository.findByEmail(data.email.toLowerCase());
        if (existingUser) {
            throw new errors_util_1.ConflictError('User with this email already exists');
        }
        // Default role for registration is TEAM_MEMBER
        let teamMemberRole = await user_repository_1.UserRepository.findRoleByName(client_1.RoleName.TEAM_MEMBER);
        if (!teamMemberRole) {
            throw new errors_util_1.NotFoundError('Default TEAM_MEMBER role not found in database system');
        }
        const passwordHash = await password_util_1.PasswordUtil.hashPassword(data.password);
        const user = await user_repository_1.UserRepository.create({
            email: data.email.toLowerCase(),
            passwordHash,
            fullName: data.fullName,
            roleId: teamMemberRole.id,
        });
        const roleName = client_1.RoleName.TEAM_MEMBER;
        const token = jwt_util_1.JwtUtil.generateToken({
            userId: user.id,
            email: user.email,
            role: roleName,
            roleId: user.roleId,
        });
        const userDto = {
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
    static async login(data) {
        const user = await user_repository_1.UserRepository.findByEmail(data.email.toLowerCase());
        if (!user) {
            throw new errors_util_1.UnauthorizedError('Invalid email or password credentials');
        }
        if (!user.isActive) {
            throw new errors_util_1.UnauthorizedError('Your account has been deactivated. Please contact an admin.');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.comparePassword(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new errors_util_1.UnauthorizedError('Invalid email or password credentials');
        }
        const roleName = user.role.name;
        const token = jwt_util_1.JwtUtil.generateToken({
            userId: user.id,
            email: user.email,
            role: roleName,
            roleId: user.roleId,
        });
        const userDto = {
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
    static async getMe(userId) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_util_1.NotFoundError('Authenticated user account not found');
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
exports.AuthService = AuthService;
