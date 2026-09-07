import { RoleName } from '@prisma/client';

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  role: RoleName;
  roleId: string;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}
