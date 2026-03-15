/**
 * ============================================
 * SYSTEM SETTING SERVICE
 * ============================================
 * API calls for System Settings
 */

import { get, put } from '@/lib/fetch-api';
import type {
  SystemSetting,
  SystemSettingUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/systemsetting';

/**
 * Get all system settings
 */
export async function getSystemSettings() {
  return get<SystemSetting[]>(ENDPOINT);
}

/**
 * Update a system setting
 */
export async function updateSystemSetting(id: string, data: SystemSettingUpdateRequest) {
  return put<SystemSetting>(`${ENDPOINT}/${id}`, data);
}
