/**
 * ============================================
 * DASHBOARD PAGE WRAPPER
 * ============================================
 * Wrapper component that provides contexts to Dashboard
 */

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp, Users, ShoppingCart, DollarSign, User as UserIcon } from 'lucide-react';
import Chip from '@mui/material/Chip';
import { currencyFormat } from '@/lib/currency';

interface DashboardPageProps {
  currentPath?: string;
}

function DashboardContent({ currentPath = '/admin' }: DashboardPageProps) {
  const { user } = useAuth();

  return (
    <DashboardLayout currentPath={currentPath}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {user?.name || 'Usuario'}
        </p>
      </div>

      {/* User Welcome Card */}
      <Card className="mb-6 bg-linear-to-r from-primary/10 to-accent/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <UserIcon className="size-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex gap-2">
                <Chip label={user?.role.name} size="small" color="primary" />
                {user?.isActive && (
                  <Chip label="Activo" size="small" color="success" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Revenue Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos del Día</CardTitle>
                  <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currencyFormat(4231)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+12.5%</span> desde ayer
                  </p>
                </CardContent>
              </Card>

              {/* Orders Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                  <ShoppingCart className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+8.2%</span> desde ayer
                  </p>
                </CardContent>
              </Card>

              {/* Customers Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">86</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+5.1%</span> desde ayer
                  </p>
                </CardContent>
              </Card>

              {/* Growth Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+18.3%</div>
                  <p className="text-xs text-muted-foreground">vs. mes anterior</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Últimas órdenes y actualizaciones del sistema
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">Nueva orden #1234</p>
                        <p className="text-sm text-muted-foreground">Mesa 5 - $45.50</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Hace 5 min</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">Reservación confirmada</p>
                        <p className="text-sm text-muted-foreground">Mesa 12 - 4 personas</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Hace 12 min</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">Nueva orden #1233</p>
                        <p className="text-sm text-muted-foreground">Mesa 8 - $78.90</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Hace 23 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DashboardLayout>
  );
}

export function DashboardPage({ currentPath = '/admin' }: DashboardPageProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedRoute>
          <DashboardContent currentPath={currentPath} />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
}
