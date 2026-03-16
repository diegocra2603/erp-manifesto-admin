/**
 * ============================================
 * FISCAL DATA HOOKS
 * ============================================
 * TanStack Query hooks for Fiscal Data validation
 */

import { useMutation } from '@tanstack/react-query';
import * as fiscalDataService from '@/services/fiscal-data.service';

export function useValidateFiscalData() {
  return useMutation({
    mutationFn: async (nit: string) => {
      const { data, error } = await fiscalDataService.validateFiscalData(nit);
      if (error) throw new Error(error);
      return data;
    },
  });
}
