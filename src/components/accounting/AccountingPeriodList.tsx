/**
 * ============================================
 * ACCOUNTING PERIOD LIST COMPONENT
 * ============================================
 * Listado de períodos contables con TanStack Query y DataTable
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AccountingPeriod } from '@/interfaces/accounting';
import {
  useAccountingPeriods,
  useCreateAccountingPeriod,
  useUpdateAccountingPeriod,
  useCloseAccountingPeriod,
  useDeleteAccountingPeriod,
} from '@/hooks/useAccountingPeriods';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, AlertCircle, Edit, Trash2, Lock, Calendar } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const periodSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
});

type PeriodFormData = z.infer<typeof periodSchema>;

export function AccountingPeriodList() {
  const { data: periods = [], isLoading, error, refetch } = useAccountingPeriods();
  const createMutation = useCreateAccountingPeriod();
  const updateMutation = useUpdateAccountingPeriod();
  const closeMutation = useCloseAccountingPeriod();
  const deleteMutation = useDeleteAccountingPeriod();

  const [formDialog, setFormDialog] = useState<{ open: boolean; item: AccountingPeriod | null }>({
    open: false,
    item: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: AccountingPeriod | null }>({
    open: false,
    item: null,
  });
  const [closeDialog, setCloseDialog] = useState<{ open: boolean; item: AccountingPeriod | null }>({
    open: false,
    item: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PeriodFormData>({
    resolver: zodResolver(periodSchema),
  });

  const handleCreateClick = () => {
    reset({ name: '', startDate: '', endDate: '' });
    createMutation.reset();
    updateMutation.reset();
    setFormDialog({ open: true, item: null });
  };

  const handleEditClick = (item: AccountingPeriod) => {
    reset({
      name: item.name,
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate.split('T')[0],
    });
    createMutation.reset();
    updateMutation.reset();
    setFormDialog({ open: true, item });
  };

  const handleCloseClick = (item: AccountingPeriod) => {
    setCloseDialog({ open: true, item });
  };

  const handleDeleteClick = (item: AccountingPeriod) => {
    setDeleteDialog({ open: true, item });
  };

  const handleFormSubmit = async (data: PeriodFormData) => {
    try {
      if (formDialog.item) {
        await updateMutation.mutateAsync({
          id: formDialog.item.id,
          data: { id: formDialog.item.id, ...data },
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setFormDialog({ open: false, item: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const handleCloseConfirm = async () => {
    if (!closeDialog.item) return;
    try {
      await closeMutation.mutateAsync(closeDialog.item.id);
      setCloseDialog({ open: false, item: null });
    } catch {
      // Error handled by mutation state
    }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const columns: Column<AccountingPeriod>[] = [
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'startDate',
      label: 'Fecha Inicio',
      sortable: true,
      render: (row) => formatDate(row.startDate),
      getValue: (row) => row.startDate,
    },
    {
      id: 'endDate',
      label: 'Fecha Fin',
      sortable: true,
      render: (row) => formatDate(row.endDate),
      getValue: (row) => row.endDate,
    },
    {
      id: 'status',
      label: 'Estado',
      sortable: true,
      width: 140,
      render: (row) => (
        <Chip
          label={row.statusName}
          size="small"
          color={row.status === 1 ? 'success' : 'default'}
          variant="outlined"
        />
      ),
      getValue: (row) => row.statusName,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Períodos Contables</h1>
          <p className="text-muted-foreground">
            Gestiona los períodos contables del sistema
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Período
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
          {error instanceof Error ? error.message : 'Error al cargar los períodos contables'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Período eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el período'}
        </Alert>
      )}

      {closeMutation.isSuccess && (
        <Alert severity="success">Período cerrado correctamente.</Alert>
      )}

      {closeMutation.error && (
        <Alert severity="error">
          {closeMutation.error instanceof Error
            ? closeMutation.error.message
            : 'Error al cerrar el período'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={periods}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre..."
          emptyMessage="No hay períodos contables"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              {item.status === 1 && (
                <>
                  <Tooltip title="Editar período" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      color="primary"
                    >
                      <Edit className="size-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cerrar período" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleCloseClick(item)}
                      color="warning"
                    >
                      <Lock className="size-4" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Eliminar período" arrow>
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

      {/* Create/Edit Form Dialog */}
      <Dialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogTitle>
            {formDialog.item ? 'Editar Período Contable' : 'Nuevo Período Contable'}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-2">
              {(createMutation.error || updateMutation.error) && (
                <Alert severity="error">
                  {(createMutation.error || updateMutation.error) instanceof Error
                    ? (createMutation.error || updateMutation.error)?.message
                    : 'Error al guardar el período'}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Nombre"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('startDate')}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('endDate')}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormDialog({ open: false, item: null })}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <Dialog
        open={closeDialog.open}
        onClose={() => setCloseDialog({ open: false, item: null })}
      >
        <DialogTitle>Cerrar período contable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cerrar el período{' '}
            <strong>{closeDialog.item?.name}</strong>? Una vez cerrado, no se podrán
            registrar más movimientos en este período.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialog({ open: false, item: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleCloseConfirm}
            color="warning"
            variant="contained"
            disabled={closeMutation.isPending}
          >
            {closeMutation.isPending ? 'Cerrando...' : 'Cerrar Período'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Eliminar período contable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el período{' '}
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
