/**
 * ============================================
 * PRODUCT DETAIL PAGE WRAPPER
 * ============================================
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { ProductDetailPage } from '@/components/product/ProductDetailPage';

interface ProductDetailPageWrapperProps {
  productId: string;
  currentPath?: string;
}

export function ProductDetailPageWrapper({ productId, currentPath = '/admin/products' }: ProductDetailPageWrapperProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout currentPath={currentPath}>
              <ProductDetailPage productId={productId} />
            </DashboardLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
