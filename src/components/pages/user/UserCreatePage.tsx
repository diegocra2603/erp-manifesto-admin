/**
 * ============================================
 * USER CREATE PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { UserFormPage } from '@/components/user/UserFormPage';

interface UserCreatePageProps {
  currentPath?: string;
}

export function UserCreatePage({ currentPath = '/admin/users' }: UserCreatePageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <UserFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
