/**
 * ============================================
 * JOURNAL ENTRY DETAIL PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JournalEntryDetailPage } from '@/components/accounting/JournalEntryDetailPage';

interface JournalEntryDetailPageWrapperProps {
  entryId: string;
  currentPath?: string;
}

export function JournalEntryDetailPageWrapper({ entryId, currentPath = '/admin/accounting/journal-entries' }: JournalEntryDetailPageWrapperProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JournalEntryDetailPage entryId={entryId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
