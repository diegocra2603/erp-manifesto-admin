/**
 * ============================================
 * CURRENCIES PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { CurrencyList } from '@/components/accounting/CurrencyList';
import { ExchangeRateList } from '@/components/accounting/ExchangeRateList';

interface CurrenciesPageProps {
  currentPath?: string;
}

export function CurrenciesPage({ currentPath = '/admin/accounting/currencies' }: CurrenciesPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <div className="space-y-8">
                <CurrencyList />
                <ExchangeRateList />
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
