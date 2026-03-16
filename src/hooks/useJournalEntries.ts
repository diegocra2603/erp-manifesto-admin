/**
 * ============================================
 * JOURNAL ENTRIES HOOKS
 * ============================================
 * TanStack Query hooks for Journal Entry operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as journalEntryService from '@/services/journal-entry.service';
import type { JournalEntryCreateRequest } from '@/lib/api-types';

export const journalEntryKeys = {
  all: ['journalEntries'] as const,
  lists: () => [...journalEntryKeys.all, 'list'] as const,
  details: () => [...journalEntryKeys.all, 'detail'] as const,
  detail: (id: string) => [...journalEntryKeys.details(), id] as const,
};

export function useJournalEntries() {
  return useQuery({
    queryKey: journalEntryKeys.lists(),
    queryFn: async () => {
      const { data, error } = await journalEntryService.getJournalEntries();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: journalEntryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await journalEntryService.getJournalEntryById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: JournalEntryCreateRequest) => {
      const { data: journalEntry, error } = await journalEntryService.createJournalEntry(data);
      if (error) throw new Error(error);
      return journalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });
    },
  });
}

export function useApproveJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: journalEntry, error } = await journalEntryService.approveJournalEntry(id);
      if (error) throw new Error(error);
      return journalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.all });
    },
  });
}

export function useVoidJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: journalEntry, error } = await journalEntryService.voidJournalEntry(id);
      if (error) throw new Error(error);
      return journalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.all });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await journalEntryService.deleteJournalEntry(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() });
    },
  });
}
