/**
 * ============================================
 * PRODUCTS HOOKS
 * ============================================
 * TanStack Query hooks for Product operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productService from '@/services/product.service';
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
  AddJobPositionToProductRequest,
} from '@/lib/api-types';

// ==================== QUERY KEYS ====================

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// ==================== PRODUCT HOOKS ====================

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const { data, error } = await productService.getProducts();
      if (error) throw new Error(error);
      return data ?? [];
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await productService.getProductById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductCreateRequest) => {
      const { data: product, error } = await productService.createProduct(data);
      if (error) throw new Error(error);
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductUpdateRequest }) => {
      const { data: product, error } = await productService.updateProduct(id, data);
      if (error) throw new Error(error);
      return product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await productService.deleteProduct(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useAddJobPositionToProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: AddJobPositionToProductRequest }) => {
      const { data: product, error } = await productService.addJobPositionToProduct(productId, data);
      if (error) throw new Error(error);
      return product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useRemoveJobPositionFromProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, productJobPositionId }: { productId: string; productJobPositionId: string }) => {
      const { error } = await productService.removeJobPositionFromProduct(productId, productJobPositionId);
      if (error) throw new Error(error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
