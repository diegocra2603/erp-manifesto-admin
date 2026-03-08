/**
 * ============================================
 * ROLES HOOKS
 * ============================================
 * TanStack Query hooks for Role operations
 */

import { useQuery } from '@tanstack/react-query';
import * as roleService from '@/services/role.service';

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: async () => {
      const { data, error } = await roleService.getRoles();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}
