/**
 * ============================================
 * CLIENT CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { ClientFormPage } from '@/components/accounting/ClientFormPage';

interface ClientCreatePageProps {
  currentPath?: string;
}

export function ClientCreatePage({ currentPath = '/admin/accounting/clients' }: ClientCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <ClientFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
