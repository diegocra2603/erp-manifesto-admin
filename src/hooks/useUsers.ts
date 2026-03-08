/**
 * ============================================
 * USERS HOOKS
 * ============================================
 * TanStack Query hooks for User operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '@/services/user.service';
import type {
  UserCreateRequest,
  UserCreateWithPasswordRequest,
  UserUpdateRequest,
} from '@/lib/api-types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const { data, error } = await userService.getUsers();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await userService.getUserById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserCreateRequest) => {
      const { data: user, error } = await userService.createUser(data);
      if (error) throw new Error(error);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useCreateUserWithPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserCreateWithPasswordRequest) => {
      const { data: user, error } = await userService.createUserWithPassword(data);
      if (error) throw new Error(error);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserUpdateRequest }) => {
      const { data: user, error } = await userService.updateUser(id, data);
      if (error) throw new Error(error);
      return user;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await userService.deleteUser(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await userService.resetPasswordByAdmin({ userId });
      if (error) throw new Error(error);
    },
  });
}
