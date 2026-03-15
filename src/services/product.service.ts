/**
 * ============================================
 * PRODUCT SERVICE
 * ============================================
 * API calls for Products
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  AddJobPositionToProductRequest,
} from '@/lib/api-types';

const PRODUCT_ENDPOINT = '/api/product';

// ==================== PRODUCTS ====================

export async function getProducts() {
  return get<Product[]>(PRODUCT_ENDPOINT);
}

export async function getProductById(id: string) {
  return get<Product>(`${PRODUCT_ENDPOINT}/${id}`);
}

export async function createProduct(data: ProductCreateRequest) {
  return post<Product>(PRODUCT_ENDPOINT, data);
}

export async function updateProduct(id: string, data: ProductUpdateRequest) {
  return put<Product>(`${PRODUCT_ENDPOINT}/${id}`, data);
}

export async function deleteProduct(id: string) {
  return del(`${PRODUCT_ENDPOINT}/${id}`);
}

export async function addJobPositionToProduct(id: string, data: AddJobPositionToProductRequest) {
  return post<Product>(`${PRODUCT_ENDPOINT}/${id}/job-positions`, data);
}

export async function removeJobPositionFromProduct(productId: string, productJobPositionId: string) {
  return del<Product>(`${PRODUCT_ENDPOINT}/${productId}/job-positions/${productJobPositionId}`);
}
