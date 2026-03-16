/**
 * ============================================
 * CLIENTS HOOKS
 * ============================================
 * TanStack Query hooks for Client operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as clientService from '@/services/client.service';
import type { ClientCreateRequest, ClientUpdateRequest } from '@/lib/api-types';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

export function useClients() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: async () => {
      const { data, error } = await clientService.getClients();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: clientKeys.detail(id!),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await clientService.getClientById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClientCreateRequest) => {
      const { data: client, error } = await clientService.createClient(data);
      if (error) throw new Error(error);
      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientUpdateRequest }) => {
      const { data: client, error } = await clientService.updateClient(id, data);
      if (error) throw new Error(error);
      return client;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await clientService.deleteClient(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
