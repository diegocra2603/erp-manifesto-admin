/**
 * ============================================
 * EXCHANGE RATES HOOKS
 * ============================================
 * TanStack Query hooks for Exchange Rate operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as exchangeRateService from '@/services/exchange-rate.service';
import type { ExchangeRateCreateRequest, ExchangeRateUpdateRequest } from '@/lib/api-types';

export const exchangeRateKeys = {
  all: ['exchangeRates'] as const,
  lists: () => [...exchangeRateKeys.all, 'list'] as const,
};

export function useExchangeRates() {
  return useQuery({
    queryKey: exchangeRateKeys.lists(),
    queryFn: async () => {
      const { data, error } = await exchangeRateService.getExchangeRates();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateExchangeRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExchangeRateCreateRequest) => {
      const { data: exchangeRate, error } = await exchangeRateService.createExchangeRate(data);
      if (error) throw new Error(error);
      return exchangeRate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeRateKeys.lists() });
    },
  });
}

export function useUpdateExchangeRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExchangeRateUpdateRequest }) => {
      const { data: exchangeRate, error } = await exchangeRateService.updateExchangeRate(id, data);
      if (error) throw new Error(error);
      return exchangeRate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeRateKeys.lists() });
    },
  });
}

export function useDeleteExchangeRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await exchangeRateService.deleteExchangeRate(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeRateKeys.lists() });
    },
  });
}
