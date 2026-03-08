/**
 * ============================================
 * ROLE SERVICE
 * ============================================
 * API calls for Role
 */

import { get } from '@/lib/fetch-api';
import type { Role } from '@/lib/api-types';

const ENDPOINT = '/api/role';

/**
 * Get all roles
 */
export async function getRoles() {
  return get<Role[]>(ENDPOINT);
}
