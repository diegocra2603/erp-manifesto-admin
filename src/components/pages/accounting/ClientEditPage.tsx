/**
 * ============================================
 * CLIENT EDIT PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { ClientFormPage } from '@/components/accounting/ClientFormPage';

interface ClientEditPageProps {
  clientId: string;
  currentPath?: string;
}

export function ClientEditPage({ clientId, currentPath = '/admin/accounting/clients' }: ClientEditPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <ClientFormPage clientId={clientId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
