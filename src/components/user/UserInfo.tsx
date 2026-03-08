/**
 * ============================================
 * USER INFO COMPONENT
 * ============================================
 * Display user information with role badge
 */

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import Chip from '@mui/material/Chip';

export function UserInfo() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Usuario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Correo</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{user.phoneNumber || 'No registrado'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rol</p>
              <Chip
                label={user.role.name}
                size="small"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 space-y-2 rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email confirmado</span>
            {user.confirmEmail ? (
              <CheckCircle className="size-4 text-success" />
            ) : (
              <XCircle className="size-4 text-error" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Chip
              label={user.isActive ? 'Activo' : 'Inactivo'}
              size="small"
              color={user.isActive ? 'success' : 'error'}
            />
          </div>

          {user.biometricEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Biométrico</span>
              <CheckCircle className="size-4 text-success" />
            </div>
          )}
        </div>

        {/* Role Description */}
        {user.role.description && (
          <div className="mt-4 rounded-md bg-muted/50 p-3">
            <p className="text-sm font-medium">Descripción del rol</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.role.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
