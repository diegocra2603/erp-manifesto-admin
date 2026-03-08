/**
 * ============================================
 * USER LIST COMPONENT
 * ============================================
 * Listado de usuarios con TanStack Query y DataTable
 */

import { useState } from 'react';
import type { User } from '@/lib/api-types';
import { useUsers, useDeleteUser, useResetPassword } from '@/hooks/useUsers';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatPhone } from '@/lib/phone';
import { Plus, AlertCircle, Edit, Trash2, KeyRound } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export function UserList() {
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const deleteMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [resetDialog, setResetDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const handleCreateClick = () => {
    window.location.href = '/admin/users/create';
  };

  const handleEditClick = (user: User) => {
    window.location.href = `/admin/users/edit/${user.id}`;
  };

  const handleDeleteClick = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.user) return;
    try {
      await deleteMutation.mutateAsync(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const handleResetPasswordClick = (user: User) => {
    setResetDialog({ open: true, user });
  };

  const handleResetPasswordConfirm = async () => {
    if (!resetDialog.user) return;
    try {
      await resetPasswordMutation.mutateAsync(resetDialog.user.id);
      setResetDialog({ open: false, user: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      getValue: (row) => row.email,
    },
    {
      id: 'code',
      label: 'Código',
      sortable: true,
      width: 130,
      render: (row) => <Chip label={row.code} size="small" variant="outlined" />,
      getValue: (row) => row.code,
    },
    {
      id: 'phoneNumber',
      label: 'Teléfono',
      sortable: true,
      width: 200,
      render: (row) => <span dangerouslySetInnerHTML={{ __html: formatPhone(row.phoneNumber) }} />,
      getValue: (row) => row.phoneNumber,
    },
    {
      id: 'role',
      label: 'Rol',
      sortable: true,
      width: 140,
      render: (row) => (
        <Chip label={row.role?.name ?? '—'} size="small" color="primary" variant="outlined" />
      ),
      getValue: (row) => row.role?.name ?? '',
    },
    {
      id: 'isActive',
      label: 'Estado',
      sortable: true,
      width: 120,
      render: (row) => (
        <Chip
          label={row.isActive ? 'Activo' : 'Inactivo'}
          size="small"
          color={row.isActive ? 'success' : 'default'}
        />
      ),
      getValue: (row) => (row.isActive ? 'Activo' : 'Inactivo'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Usuario
        </Button>
      </div>

      {error && (
        <Alert
          severity="error"
          icon={<AlertCircle className="size-5" />}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        >
          {error instanceof Error ? error.message : 'Error al cargar los usuarios'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Usuario eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el usuario'}
        </Alert>
      )}

      {resetPasswordMutation.isSuccess && (
        <Alert severity="success">Contraseña reseteada correctamente. Se envió un correo al usuario.</Alert>
      )}

      {resetPasswordMutation.error && (
        <Alert severity="error">
          {resetPasswordMutation.error instanceof Error
            ? resetPasswordMutation.error.message
            : 'Error al resetear la contraseña'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={users}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre, email, código..."
          emptyMessage="No hay usuarios"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(user) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar usuario" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(user)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Resetear contraseña" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleResetPasswordClick(user)}
                  color="warning"
                >
                  <KeyRound className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar usuario" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(user)}
                  color="error"
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{deleteDialog.user?.name}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetDialog.open}
        onClose={() => setResetDialog({ open: false, user: null })}
      >
        <DialogTitle>Resetear contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas resetear la contraseña del usuario{' '}
            <strong>{resetDialog.user?.name}</strong>? Se enviará un correo con las instrucciones.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog({ open: false, user: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleResetPasswordConfirm}
            color="warning"
            variant="contained"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Reseteando...' : 'Resetear'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
