/**
 * ============================================
 * JOB POSITION CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JobPositionFormPage } from '@/components/job-position/JobPositionFormPage';

interface JobPositionCreatePageProps {
  currentPath?: string;
}

export function JobPositionCreatePage({ currentPath = '/admin/job-positions' }: JobPositionCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JobPositionFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
