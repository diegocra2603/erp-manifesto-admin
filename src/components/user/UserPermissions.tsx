/**
 * ============================================
 * USER PERMISSIONS COMPONENT
 * ============================================
 * Display user permissions in a card
 */

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Chip from '@mui/material/Chip';
import { Shield } from 'lucide-react';

export function UserPermissions() {
  const { user } = useAuth();

  if (!user || !user.permissions || user.permissions.length === 0) {
    return null;
  }

  // Group permissions by category
  const groupedPermissions = user.permissions.reduce((acc, permission) => {
    const [category] = permission.split('.');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5" />
          Permisos del Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category}>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                {category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <Chip
                    key={permission}
                    label={permission.split('.')[1]}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
