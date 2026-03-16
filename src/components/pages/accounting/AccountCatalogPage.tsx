/**
 * ============================================
 * ACCOUNT CATALOG PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { AccountCatalogList } from '@/components/accounting/AccountCatalogList';

interface AccountCatalogPageProps {
  currentPath?: string;
}

export function AccountCatalogPage({ currentPath = '/admin/accounting/account-catalog' }: AccountCatalogPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <AccountCatalogList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
