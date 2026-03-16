/**
 * ============================================
 * FISCAL DATA SERVICE
 * ============================================
 * API calls for Fiscal Data validation (NIT)
 */

import { get } from '@/lib/fetch-api';
import type { FiscalData } from '@/lib/api-types';

export async function validateFiscalData(nit: string) {
  return get<FiscalData>(`/api/fiscaldata/validate/${nit}`);
}
