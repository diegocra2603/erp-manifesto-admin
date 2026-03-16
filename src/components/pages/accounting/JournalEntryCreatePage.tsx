/**
 * ============================================
 * JOURNAL ENTRY CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JournalEntryFormPage } from '@/components/accounting/JournalEntryFormPage';

interface JournalEntryCreatePageProps {
  currentPath?: string;
}

export function JournalEntryCreatePage({ currentPath = '/admin/accounting/journal-entries' }: JournalEntryCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JournalEntryFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
