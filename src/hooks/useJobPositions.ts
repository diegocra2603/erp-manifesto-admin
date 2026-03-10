/**
 * ============================================
 * JOB POSITIONS HOOKS
 * ============================================
 * TanStack Query hooks for Job Position operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobPositionService from '@/services/job-position.service';
import type {
  JobPositionCreateRequest,
  JobPositionUpdateRequest,
} from '@/lib/api-types';

export const jobPositionKeys = {
  all: ['jobPositions'] as const,
  lists: () => [...jobPositionKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...jobPositionKeys.lists(), filters] as const,
  details: () => [...jobPositionKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobPositionKeys.details(), id] as const,
};

export function useJobPositions() {
  return useQuery({
    queryKey: jobPositionKeys.lists(),
    queryFn: async () => {
      const { data, error } = await jobPositionService.getJobPositions();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useJobPosition(id: string | undefined) {
  return useQuery({
    queryKey: jobPositionKeys.detail(id!),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await jobPositionService.getJobPositionById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateJobPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobPositionCreateRequest) => {
      const { data: jobPosition, error } = await jobPositionService.createJobPosition(data);
      if (error) throw new Error(error);
      return jobPosition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
    },
  });
}

export function useUpdateJobPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobPositionUpdateRequest }) => {
      const { data: jobPosition, error } = await jobPositionService.updateJobPosition(id, data);
      if (error) throw new Error(error);
      return jobPosition;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.detail(variables.id) });
    },
  });
}

export function useDeleteJobPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await jobPositionService.deleteJobPosition(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
    },
  });
}
