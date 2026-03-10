/**
 * ============================================
 * JOB POSITION LIST COMPONENT
 * ============================================
 * Listado de puestos de trabajo con TanStack Query y DataTable
 */

import { useState } from 'react';
import type { JobPosition } from '@/lib/api-types';
import { useJobPositions, useDeleteJobPosition } from '@/hooks/useJobPositions';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { currencyFormat } from '@/lib/currency';
import { Plus, AlertCircle, Edit, Trash2 } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

export function JobPositionList() {
  const { data: jobPositions = [], isLoading, error, refetch } = useJobPositions();
  const deleteMutation = useDeleteJobPosition();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: JobPosition | null }>({
    open: false,
    item: null,
  });

  const handleCreateClick = () => {
    window.location.href = '/admin/job-positions/create';
  };

  const handleEditClick = (item: JobPosition) => {
    window.location.href = `/admin/job-positions/edit/${item.id}`;
  };

  const handleDeleteClick = (item: JobPosition) => {
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

  const columns: Column<JobPosition>[] = [
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'description',
      label: 'Descripción',
      sortable: true,
      getValue: (row) => row.description,
    },
    {
      id: 'hourlyCost',
      label: 'Costo por Hora',
      sortable: true,
      width: 180,
      render: (row) => currencyFormat(row.hourlyCost),
      getValue: (row) => String(row.hourlyCost),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Puestos de Trabajo</h1>
          <p className="text-muted-foreground">
            Gestiona los puestos de trabajo del sistema
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Puesto
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
          {error instanceof Error ? error.message : 'Error al cargar los puestos de trabajo'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Puesto de trabajo eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el puesto de trabajo'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={jobPositions}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre, descripción..."
          emptyMessage="No hay puestos de trabajo"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar puesto" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(item)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar puesto" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(item)}
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
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Eliminar puesto de trabajo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el puesto{' '}
            <strong>{deleteDialog.item?.name}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
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
    </div>
  );
}
