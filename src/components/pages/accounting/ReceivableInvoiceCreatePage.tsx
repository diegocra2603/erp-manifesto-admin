/**
 * ============================================
 * RECEIVABLE INVOICE CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { ReceivableInvoiceForm } from '@/components/accounting/ReceivableInvoiceForm';

interface ReceivableInvoiceCreatePageProps {
  currentPath?: string;
}

export function ReceivableInvoiceCreatePage({ currentPath = '/admin/accounting/receivable' }: ReceivableInvoiceCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <ReceivableInvoiceForm />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
