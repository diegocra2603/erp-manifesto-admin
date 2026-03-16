/**
 * ============================================
 * PAYABLE INVOICE CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { PayableInvoiceForm } from '@/components/accounting/PayableInvoiceForm';

interface PayableInvoiceCreatePageProps {
  currentPath?: string;
}

export function PayableInvoiceCreatePage({ currentPath = '/admin/accounting/payable' }: PayableInvoiceCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <PayableInvoiceForm />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
