/**
 * ============================================
 * SYSTEM SETTINGS HOOKS
 * ============================================
 * TanStack Query hooks for System Settings operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as systemSettingService from '@/services/system-setting.service';
import type { SystemSettingUpdateRequest } from '@/lib/api-types';

export const systemSettingKeys = {
  all: ['systemSettings'] as const,
  lists: () => [...systemSettingKeys.all, 'list'] as const,
};

export function useSystemSettings() {
  return useQuery({
    queryKey: systemSettingKeys.lists(),
    queryFn: async () => {
      const { data, error } = await systemSettingService.getSystemSettings();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SystemSettingUpdateRequest }) => {
      const { data: setting, error } = await systemSettingService.updateSystemSetting(id, data);
      if (error) throw new Error(error);
      return setting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemSettingKeys.lists() });
    },
  });
}
