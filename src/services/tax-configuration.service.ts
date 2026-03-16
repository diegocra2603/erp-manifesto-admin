/**
 * ============================================
 * TAX CONFIGURATION SERVICE
 * ============================================
 * API calls for Tax Configurations
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  TaxConfiguration,
  TaxConfigurationCreateRequest,
  TaxConfigurationUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/taxconfiguration';

export async function getTaxConfigurations() {
  return get<TaxConfiguration[]>(ENDPOINT);
}

export async function createTaxConfiguration(data: TaxConfigurationCreateRequest) {
  return post<TaxConfiguration>(ENDPOINT, data);
}

export async function updateTaxConfiguration(id: string, data: TaxConfigurationUpdateRequest) {
  return put<TaxConfiguration>(`${ENDPOINT}/${id}`, data);
}

export async function deleteTaxConfiguration(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
