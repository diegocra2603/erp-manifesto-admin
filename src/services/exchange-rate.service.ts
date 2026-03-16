/**
 * ============================================
 * EXCHANGE RATE SERVICE
 * ============================================
 * API calls for Exchange Rates
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  ExchangeRate,
  ExchangeRateCreateRequest,
  ExchangeRateUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/exchangerate';

export async function getExchangeRates() {
  return get<ExchangeRate[]>(ENDPOINT);
}

export async function createExchangeRate(data: ExchangeRateCreateRequest) {
  return post<ExchangeRate>(ENDPOINT, data);
}

export async function updateExchangeRate(id: string, data: ExchangeRateUpdateRequest) {
  return put<ExchangeRate>(`${ENDPOINT}/${id}`, data);
}

export async function deleteExchangeRate(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
