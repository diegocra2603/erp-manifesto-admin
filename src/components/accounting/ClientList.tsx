/**
 * ============================================
 * CLIENT LIST COMPONENT
 * ============================================
 * Listado de clientes con navegación a páginas de crear/editar
 */

import { useState } from 'react';
import type { Client } from '@/lib/api-types';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, AlertCircle, Edit, Trash2, UserCheck } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export function ClientList() {
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const deleteMutation = useDeleteClient();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: Client | null }>({
    open: false,
    item: null,
  });

  const handleCreateClick = () => {
    window.location.href = '/admin/accounting/clients/create';
  };

  const handleEditClick = (item: Client) => {
    window.location.href = `/admin/accounting/clients/edit/${item.id}`;
  };

  const handleDeleteClick = (item: Client) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;
    try {
      await deleteMutation.mutateAsync(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const columns: Column<Client>[] = [
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'legalName',
      label: 'Nombre Legal',
      sortable: true,
      getValue: (row) => row.legalName ?? '-',
    },
    {
      id: 'nit',
      label: 'NIT',
      sortable: true,
      width: 140,
      getValue: (row) => row.nit ?? 'CF',
    },
    {
      id: 'phone',
      label: 'Teléfono',
      sortable: false,
      width: 140,
      getValue: (row) => row.phone ?? '',
    },
    {
      id: 'email',
      label: 'Email',
      sortable: false,
      width: 200,
      getValue: (row) => row.email ?? '',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gestiona los clientes del sistema
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Cliente
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
          {error instanceof Error ? error.message : 'Error al cargar los clientes'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Cliente eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el cliente'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={clients}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre, NIT..."
          emptyMessage="No hay clientes registrados"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar cliente" arrow>
                <IconButton size="small" onClick={() => handleEditClick(item)} color="primary">
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar cliente" arrow>
                <IconButton size="small" onClick={() => handleDeleteClick(item)} color="error">
                  <Trash2 className="size-4" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Eliminar cliente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al cliente{' '}
            <strong>{deleteDialog.item?.name}</strong>?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
