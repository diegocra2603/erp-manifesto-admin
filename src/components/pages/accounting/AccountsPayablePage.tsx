/**
 * ============================================
 * ACCOUNTS PAYABLE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { AccountsPayableList } from '@/components/accounting/AccountsPayableList';

interface AccountsPayablePageProps {
  currentPath?: string;
}

export function AccountsPayablePage({ currentPath = '/admin/accounting/payable' }: AccountsPayablePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <AccountsPayableList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
