"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const errors_util_1 = require("../utils/errors.util");
class UserService {
    static async listUsers(params) {
        return user_repository_1.UserRepository.findAll(params);
    }
    static async getUserById(id) {
        const user = await user_repository_1.UserRepository.findById(id);
        if (!user) {
            throw new errors_util_1.NotFoundError('User not found');
        }
        return user;
    }
    static async updateUserRole(userId, newRoleName) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_util_1.NotFoundError('User not found');
        }
        const role = await user_repository_1.UserRepository.findRoleByName(newRoleName);
        if (!role) {
            throw new errors_util_1.NotFoundError(`Role '${newRoleName}' not found`);
        }
        return user_repository_1.UserRepository.updateRole(userId, role.id);
    }
    static async updateUserStatus(userId, isActive) {
        const user = await user_repository_1.UserRepository.findById(userId);
        if (!user) {
            throw new errors_util_1.NotFoundError('User not found');
        }
        return user_repository_1.UserRepository.updateStatus(userId, isActive);
    }
}
exports.UserService = UserService;
