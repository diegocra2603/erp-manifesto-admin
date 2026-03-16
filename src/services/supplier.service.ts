/**
 * ============================================
 * SUPPLIER SERVICE
 * ============================================
 * API calls for Suppliers
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type { Supplier, SupplierCreateRequest, SupplierUpdateRequest } from '@/lib/api-types';

const ENDPOINT = '/api/supplier';

export async function getSuppliers() {
  return get<Supplier[]>(ENDPOINT);
}

export async function createSupplier(data: SupplierCreateRequest) {
  return post<Supplier>(ENDPOINT, data);
}

export async function updateSupplier(id: string, data: SupplierUpdateRequest) {
  return put<Supplier>(`${ENDPOINT}/${id}`, data);
}

export async function deleteSupplier(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
