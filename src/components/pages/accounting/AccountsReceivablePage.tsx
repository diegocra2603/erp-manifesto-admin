/**
 * ============================================
 * ACCOUNTS RECEIVABLE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { AccountsReceivableList } from '@/components/accounting/AccountsReceivableList';

interface AccountsReceivablePageProps {
  currentPath?: string;
}

export function AccountsReceivablePage({ currentPath = '/admin/accounting/receivable' }: AccountsReceivablePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <AccountsReceivableList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
