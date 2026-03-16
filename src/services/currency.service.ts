/**
 * ============================================
 * CURRENCY SERVICE
 * ============================================
 * API calls for Currencies
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  Currency,
  CurrencyCreateRequest,
  CurrencyUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/currency';

export async function getCurrencies() {
  return get<Currency[]>(ENDPOINT);
}

export async function createCurrency(data: CurrencyCreateRequest) {
  return post<Currency>(ENDPOINT, data);
}

export async function updateCurrency(id: string, data: CurrencyUpdateRequest) {
  return put<Currency>(`${ENDPOINT}/${id}`, data);
}

export async function deleteCurrency(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
