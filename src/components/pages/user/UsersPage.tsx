/**
 * ============================================
 * USERS PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { UserList } from '@/components/user/UserList';

interface UsersPageProps {
  currentPath?: string;
}

export function UsersPage({ currentPath = '/admin/users' }: UsersPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <UserList />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
