/**
 * ============================================
 * ACCOUNTING PERIODS PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { AccountingPeriodList } from '@/components/accounting/AccountingPeriodList';

interface AccountingPeriodsPageProps {
  currentPath?: string;
}

export function AccountingPeriodsPage({ currentPath = '/admin/accounting/periods' }: AccountingPeriodsPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <AccountingPeriodList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
