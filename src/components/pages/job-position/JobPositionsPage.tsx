/**
 * ============================================
 * JOB POSITIONS PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JobPositionList } from '@/components/job-position/JobPositionList';

interface JobPositionsPageProps {
  currentPath?: string;
}

export function JobPositionsPage({ currentPath = '/admin/job-positions' }: JobPositionsPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JobPositionList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
