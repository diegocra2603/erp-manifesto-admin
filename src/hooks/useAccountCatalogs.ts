/**
 * ============================================
 * ACCOUNT CATALOGS HOOKS
 * ============================================
 * TanStack Query hooks for Account Catalog operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as accountCatalogService from '@/services/account-catalog.service';
import type { AccountCatalogCreateRequest, AccountCatalogUpdateRequest } from '@/lib/api-types';

export const accountCatalogKeys = {
  all: ['accountCatalogs'] as const,
  lists: () => [...accountCatalogKeys.all, 'list'] as const,
};

export function useAccountCatalogs() {
  return useQuery({
    queryKey: accountCatalogKeys.lists(),
    queryFn: async () => {
      const { data, error } = await accountCatalogService.getAccountCatalogs();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateAccountCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AccountCatalogCreateRequest) => {
      const { data: accountCatalog, error } = await accountCatalogService.createAccountCatalog(data);
      if (error) throw new Error(error);
      return accountCatalog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountCatalogKeys.lists() });
    },
  });
}

export function useUpdateAccountCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AccountCatalogUpdateRequest }) => {
      const { data: accountCatalog, error } = await accountCatalogService.updateAccountCatalog(id, data);
      if (error) throw new Error(error);
      return accountCatalog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountCatalogKeys.lists() });
    },
  });
}

export function useDeleteAccountCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await accountCatalogService.deleteAccountCatalog(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountCatalogKeys.lists() });
    },
  });
}
