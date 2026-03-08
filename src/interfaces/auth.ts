export interface LoginRequest {
  email: string;
  password: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  code: string;
  phoneNumber: string;
  biometricEnabled: boolean;
  confirmEmail: boolean;
  isActive: boolean;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  emailConfirmed: boolean;
  sessionId: string;
  user: ApiUser;
}

export interface JWTPayload {
  uid: string;
  username: string;
  roleId: string;
  roleName: string;
  permission: string[];
  exp: number;
  iat: number;
  nbf: number;
}
