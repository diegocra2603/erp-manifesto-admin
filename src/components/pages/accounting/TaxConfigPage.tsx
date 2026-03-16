/**
 * ============================================
 * TAX CONFIGURATION PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { TaxConfigurationList } from '@/components/accounting/TaxConfigurationList';

interface TaxConfigPageProps {
  currentPath?: string;
}

export function TaxConfigPage({ currentPath = '/admin/accounting/tax-config' }: TaxConfigPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <TaxConfigurationList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
