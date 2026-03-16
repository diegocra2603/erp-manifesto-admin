/**
 * ============================================
 * JOURNAL ENTRIES PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JournalEntryList } from '@/components/accounting/JournalEntryList';

interface JournalEntriesPageProps {
  currentPath?: string;
}

export function JournalEntriesPage({ currentPath = '/admin/accounting/journal-entries' }: JournalEntriesPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JournalEntryList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
