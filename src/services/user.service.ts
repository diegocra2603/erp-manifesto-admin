/**
 * ============================================
 * USER SERVICE
 * ============================================
 * API calls for User
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  User,
  UserCreateRequest,
  UserCreateWithPasswordRequest,
  UserUpdateRequest,
  ResetPasswordRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/user';

/**
 * Get all users
 */
export async function getUsers() {
  return get<User[]>(ENDPOINT);
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string) {
  return get<User>(`${ENDPOINT}/${id}`);
}

/**
 * Create a new user (without password)
 */
export async function createUser(data: UserCreateRequest) {
  return post<User>(ENDPOINT, data);
}

/**
 * Create a new user with password
 */
export async function createUserWithPassword(data: UserCreateWithPasswordRequest) {
  return post<User>(`${ENDPOINT}/with-password`, data);
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, data: UserUpdateRequest) {
  return put<User>(`${ENDPOINT}/${id}`, { id, ...data });
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  return del(`${ENDPOINT}/${id}`);
}

/**
 * Reset a user's password by admin
 */
export async function resetPasswordByAdmin(data: ResetPasswordRequest) {
  return post(`${ENDPOINT}/reset-password-by-admin`, data);
}
