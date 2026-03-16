/**
 * ============================================
 * ACCOUNT CATALOG SERVICE
 * ============================================
 * API calls for Account Catalogs
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  AccountCatalog,
  AccountCatalogCreateRequest,
  AccountCatalogUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/accountcatalog';

export async function getAccountCatalogs() {
  return get<AccountCatalog[]>(ENDPOINT);
}

export async function createAccountCatalog(data: AccountCatalogCreateRequest) {
  return post<AccountCatalog>(ENDPOINT, data);
}

export async function updateAccountCatalog(id: string, data: AccountCatalogUpdateRequest) {
  return put<AccountCatalog>(`${ENDPOINT}/${id}`, data);
}

export async function deleteAccountCatalog(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
