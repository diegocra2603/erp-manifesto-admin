/**
 * ============================================
 * USER EDIT PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { UserFormPage } from '@/components/user/UserFormPage';

interface UserEditPageProps {
  userId: string;
  currentPath?: string;
}

export function UserEditPage({
  userId,
  currentPath = '/admin/users',
}: UserEditPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <UserFormPage userId={userId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
