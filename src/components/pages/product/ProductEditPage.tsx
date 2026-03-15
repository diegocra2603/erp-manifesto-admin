/**
 * ============================================
 * PRODUCT EDIT PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { ProductFormPage } from '@/components/product/ProductFormPage';

interface ProductEditPageProps {
  productId: string;
  currentPath?: string;
}

export function ProductEditPage({ productId, currentPath = '/admin/products' }: ProductEditPageProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <ProductFormPage productId={productId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
