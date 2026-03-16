/**
 * ============================================
 * ACCOUNTING PERIODS HOOKS
 * ============================================
 * TanStack Query hooks for Accounting Period operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as accountingPeriodService from '@/services/accounting-period.service';
import type { AccountingPeriodCreateRequest, AccountingPeriodUpdateRequest } from '@/lib/api-types';

export const accountingPeriodKeys = {
  all: ['accountingPeriods'] as const,
  lists: () => [...accountingPeriodKeys.all, 'list'] as const,
};

export function useAccountingPeriods() {
  return useQuery({
    queryKey: accountingPeriodKeys.lists(),
    queryFn: async () => {
      const { data, error } = await accountingPeriodService.getAccountingPeriods();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateAccountingPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AccountingPeriodCreateRequest) => {
      const { data: accountingPeriod, error } = await accountingPeriodService.createAccountingPeriod(data);
      if (error) throw new Error(error);
      return accountingPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountingPeriodKeys.lists() });
    },
  });
}

export function useUpdateAccountingPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AccountingPeriodUpdateRequest }) => {
      const { data: accountingPeriod, error } = await accountingPeriodService.updateAccountingPeriod(id, data);
      if (error) throw new Error(error);
      return accountingPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountingPeriodKeys.lists() });
    },
  });
}

export function useCloseAccountingPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: accountingPeriod, error } = await accountingPeriodService.closeAccountingPeriod(id);
      if (error) throw new Error(error);
      return accountingPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountingPeriodKeys.lists() });
    },
  });
}

export function useDeleteAccountingPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await accountingPeriodService.deleteAccountingPeriod(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountingPeriodKeys.lists() });
    },
  });
}
