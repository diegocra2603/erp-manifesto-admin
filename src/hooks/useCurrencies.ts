/**
 * ============================================
 * CURRENCIES HOOKS
 * ============================================
 * TanStack Query hooks for Currency operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as currencyService from '@/services/currency.service';
import type { CurrencyCreateRequest, CurrencyUpdateRequest } from '@/lib/api-types';

export const currencyKeys = {
  all: ['currencies'] as const,
  lists: () => [...currencyKeys.all, 'list'] as const,
};

export function useCurrencies() {
  return useQuery({
    queryKey: currencyKeys.lists(),
    queryFn: async () => {
      const { data, error } = await currencyService.getCurrencies();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CurrencyCreateRequest) => {
      const { data: currency, error } = await currencyService.createCurrency(data);
      if (error) throw new Error(error);
      return currency;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CurrencyUpdateRequest }) => {
      const { data: currency, error } = await currencyService.updateCurrency(id, data);
      if (error) throw new Error(error);
      return currency;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await currencyService.deleteCurrency(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currencyKeys.lists() });
    },
  });
}
