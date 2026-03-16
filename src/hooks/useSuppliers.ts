/**
 * ============================================
 * SUPPLIERS HOOKS
 * ============================================
 * TanStack Query hooks for Supplier operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as supplierService from '@/services/supplier.service';
import type { SupplierCreateRequest, SupplierUpdateRequest } from '@/lib/api-types';

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
};

export function useSuppliers() {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supplierService.getSuppliers();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SupplierCreateRequest) => {
      const { data: supplier, error } = await supplierService.createSupplier(data);
      if (error) throw new Error(error);
      return supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SupplierUpdateRequest }) => {
      const { data: supplier, error } = await supplierService.updateSupplier(id, data);
      if (error) throw new Error(error);
      return supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supplierService.deleteSupplier(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}
