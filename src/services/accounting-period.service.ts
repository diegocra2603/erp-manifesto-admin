/**
 * ============================================
 * ACCOUNTING PERIOD SERVICE
 * ============================================
 * API calls for Accounting Periods
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  AccountingPeriod,
  AccountingPeriodCreateRequest,
  AccountingPeriodUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/accountingperiod';

export async function getAccountingPeriods() {
  return get<AccountingPeriod[]>(ENDPOINT);
}

export async function createAccountingPeriod(data: AccountingPeriodCreateRequest) {
  return post<AccountingPeriod>(ENDPOINT, data);
}

export async function updateAccountingPeriod(id: string, data: AccountingPeriodUpdateRequest) {
  return put<AccountingPeriod>(`${ENDPOINT}/${id}`, data);
}

export async function closeAccountingPeriod(id: string) {
  return post<AccountingPeriod>(`${ENDPOINT}/${id}/close`);
}

export async function deleteAccountingPeriod(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
