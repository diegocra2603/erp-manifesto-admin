import type { Role } from './auth';
import type { JobPosition } from './job-position';

export interface User {
  id: string;
  email: string;
  name: string;
  code: string;
  phoneNumber: string;
  biometricEnabled: boolean;
  confirmEmail: boolean;
  isActive: boolean;
  role: Role;
  storeId?: string | null;
  neoNetToken?: string | null;
  jobPositionId?: string | null;
  jobPosition?: JobPosition | null;
}

export interface UserCreateRequest {
  email: string;
  name: string;
  code: string;
  phoneNumber: string;
  roleId: string;
  storeId?: string;
  neoNetToken?: string;
  jobPositionId?: string;
}

export interface UserCreateWithPasswordRequest {
  email: string;
  name: string;
  code: string;
  phoneNumber: string;
  roleId: string;
  password: string;
  confirmPassword: string;
  storeId?: string;
  neoNetToken?: string;
  jobPositionId?: string;
}

export interface UserUpdateRequest {
  email: string;
  name: string;
  code: string;
  phoneNumber: string;
  roleId: string;
  storeId?: string;
  neoNetToken?: string;
  jobPositionId?: string;
}

export interface ResetPasswordRequest {
  userId: string;
}
