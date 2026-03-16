/**
 * ============================================
 * INVOICES HOOKS
 * ============================================
 * TanStack Query hooks for Invoice operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as invoiceService from '@/services/invoice.service';
import type { CreateReceivableInvoiceRequest, CreatePayableInvoiceRequest } from '@/lib/api-types';

export const invoiceKeys = {
  all: ['invoices'] as const,
  receivable: () => [...invoiceKeys.all, 'receivable'] as const,
  payable: () => [...invoiceKeys.all, 'payable'] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export function useReceivableInvoices() {
  return useQuery({
    queryKey: invoiceKeys.receivable(),
    queryFn: async () => {
      const { data, error } = await invoiceService.getReceivableInvoices();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function usePayableInvoices() {
  return useQuery({
    queryKey: invoiceKeys.payable(),
    queryFn: async () => {
      const { data, error } = await invoiceService.getPayableInvoices();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: invoiceKeys.detail(id!),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await invoiceService.getInvoiceById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateReceivableInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReceivableInvoiceRequest) => {
      const { data: invoice, error } = await invoiceService.createReceivableInvoice(data);
      if (error) throw new Error(error);
      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.receivable() });
    },
  });
}

export function useCreatePayableInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePayableInvoiceRequest) => {
      const { data: invoice, error } = await invoiceService.createPayableInvoice(data);
      if (error) throw new Error(error);
      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.payable() });
    },
  });
}

export function useEmitInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: invoice, error } = await invoiceService.emitInvoice(id);
      if (error) throw new Error(error);
      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}

export function useVoidInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: invoice, error } = await invoiceService.voidInvoice(id);
      if (error) throw new Error(error);
      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await invoiceService.deleteInvoice(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}

export function useUploadContingency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await invoiceService.uploadContingency();
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}
