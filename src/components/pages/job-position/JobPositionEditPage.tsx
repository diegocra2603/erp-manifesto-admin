/**
 * ============================================
 * JOB POSITION EDIT PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { JobPositionFormPage } from '@/components/job-position/JobPositionFormPage';

interface JobPositionEditPageProps {
  jobPositionId: string;
  currentPath?: string;
}

export function JobPositionEditPage({
  jobPositionId,
  currentPath = '/admin/job-positions',
}: JobPositionEditPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <JobPositionFormPage jobPositionId={jobPositionId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
