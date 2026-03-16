/**
 * ============================================
 * TAX CONFIGURATIONS HOOKS
 * ============================================
 * TanStack Query hooks for Tax Configuration operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taxConfigurationService from '@/services/tax-configuration.service';
import type { TaxConfigurationCreateRequest, TaxConfigurationUpdateRequest } from '@/lib/api-types';

export const taxConfigurationKeys = {
  all: ['taxConfigurations'] as const,
  lists: () => [...taxConfigurationKeys.all, 'list'] as const,
};

export function useTaxConfigurations() {
  return useQuery({
    queryKey: taxConfigurationKeys.lists(),
    queryFn: async () => {
      const { data, error } = await taxConfigurationService.getTaxConfigurations();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateTaxConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TaxConfigurationCreateRequest) => {
      const { data: taxConfiguration, error } = await taxConfigurationService.createTaxConfiguration(data);
      if (error) throw new Error(error);
      return taxConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxConfigurationKeys.lists() });
    },
  });
}

export function useUpdateTaxConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaxConfigurationUpdateRequest }) => {
      const { data: taxConfiguration, error } = await taxConfigurationService.updateTaxConfiguration(id, data);
      if (error) throw new Error(error);
      return taxConfiguration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxConfigurationKeys.lists() });
    },
  });
}

export function useDeleteTaxConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await taxConfigurationService.deleteTaxConfiguration(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxConfigurationKeys.lists() });
    },
  });
}
