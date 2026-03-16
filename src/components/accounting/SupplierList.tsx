/**
 * ============================================
 * SUPPLIER LIST COMPONENT
 * ============================================
 * Listado de proveedores con formulario en diálogo para crear/editar
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Supplier } from '@/lib/api-types';
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '@/hooks/useSuppliers';
import { useValidateFiscalData } from '@/hooks/useFiscalData';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, Edit, Trash2, AlertCircle, Truck, Search } from 'lucide-react';
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
import CircularProgress from '@mui/material/CircularProgress';

// ── Zod Schema ──────────────────────────────────────────────
const supplierSchema = z.object({
  nit: z.string().min(1, 'El NIT es requerido'),
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  address: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  phone: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

// ── Component ───────────────────────────────────────────────
export function SupplierList() {
  const { data: suppliers = [], isLoading, error, refetch } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  const validateNitMutation = useValidateFiscalData();

  // Dialog state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    item: Supplier | null;
  }>({ open: false, mode: 'create', item: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: Supplier | null;
  }>({ open: false, item: null });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nit: '',
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (formDialog.open) {
      if (formDialog.mode === 'edit' && formDialog.item) {
        reset({
          nit: formDialog.item.nit,
          name: formDialog.item.name,
          address: formDialog.item.address ?? '',
          phone: formDialog.item.phone ?? '',
          email: formDialog.item.email ?? '',
        });
      } else {
        reset({
          nit: '',
          name: '',
          address: '',
          phone: '',
          email: '',
        });
      }
      createMutation.reset();
      updateMutation.reset();
      validateNitMutation.reset();
    }
  }, [formDialog.open, formDialog.mode, formDialog.item]);

  // ── Handlers ────────────────────────────────────────────
  const handleOpenCreate = () => {
    setFormDialog({ open: true, mode: 'create', item: null });
  };

  const handleOpenEdit = (item: Supplier) => {
    setFormDialog({ open: true, mode: 'edit', item });
  };

  const handleCloseForm = () => {
    setFormDialog({ open: false, mode: 'create', item: null });
  };

  const handleValidateNit = async () => {
    const nit = getValues('nit');
    if (!nit) return;
    try {
      const result = await validateNitMutation.mutateAsync(nit);
      if (result?.fiscalName) {
        setValue('name', result.fiscalName, { shouldValidate: true });
      }
    } catch {
      // Error handled by mutation state
    }
  };

  const handleFormSubmit = async (values: SupplierFormValues) => {
    try {
      const payload = {
        nit: values.nit,
        name: values.name,
        address: values.address || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
      };
      if (formDialog.mode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (formDialog.item) {
        await updateMutation.mutateAsync({
          id: formDialog.item.id,
          data: { id: formDialog.item.id, ...payload },
        });
      }
      handleCloseForm();
    } catch {
      // Error handled by mutation state
    }
  };

  const handleDeleteClick = (item: Supplier) => {
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

  // ── Columns ─────────────────────────────────────────────
  const columns: Column<Supplier>[] = [
    {
      id: 'nit',
      label: 'NIT',
      sortable: true,
      width: 140,
      getValue: (row) => row.nit,
    },
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'address',
      label: 'Dirección',
      sortable: false,
      getValue: (row) => row.address ?? '',
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

  // ── Mutation error helper ───────────────────────────────
  const formMutationError =
    formDialog.mode === 'create' ? createMutation.error : updateMutation.error;
  const formMutationPending =
    formDialog.mode === 'create' ? createMutation.isPending : updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <p className="text-muted-foreground">
              Gestiona los proveedores del sistema
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleOpenCreate}
          size="large"
        >
          Nuevo Proveedor
        </Button>
      </div>

      {/* Alerts */}
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
          {error instanceof Error ? error.message : 'Error al cargar los proveedores'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Proveedor eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el proveedor'}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <DataTable
          data={suppliers}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por NIT, nombre..."
          emptyMessage="No hay proveedores registrados"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar proveedor" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(item)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar proveedor" arrow>
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

      {/* ── Create / Edit Dialog ─────────────────────────── */}
      <Dialog
        open={formDialog.open}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogTitle>
            {formDialog.mode === 'create' ? 'Nuevo Proveedor' : 'Editar Proveedor'}
          </DialogTitle>
          <DialogContent className="space-y-4 !pt-4">
            {formMutationError && (
              <Alert severity="error" className="!mb-4">
                {formMutationError instanceof Error
                  ? formMutationError.message
                  : 'Error al guardar el proveedor'}
              </Alert>
            )}

            <div className="flex gap-2 items-start">
              <Controller
                name="nit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="NIT"
                    placeholder="Ej: 1234567-8"
                    fullWidth
                    error={!!errors.nit}
                    helperText={errors.nit?.message}
                    size="small"
                  />
                )}
              />
              <Tooltip title="Validar NIT en SAT" arrow>
                <Button
                  variant="outlined"
                  onClick={handleValidateNit}
                  disabled={validateNitMutation.isPending}
                  sx={{ minWidth: 'auto', px: 2, mt: '1px' }}
                  size="medium"
                >
                  {validateNitMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Search className="size-5" />
                  )}
                </Button>
              </Tooltip>
            </div>

            {validateNitMutation.isSuccess && validateNitMutation.data && (
              <Alert severity="success" className="!mt-2">
                NIT válido: {validateNitMutation.data.fiscalName}
              </Alert>
            )}

            {validateNitMutation.error && (
              <Alert severity="warning" className="!mt-2">
                {validateNitMutation.error instanceof Error
                  ? validateNitMutation.error.message
                  : 'No se pudo validar el NIT'}
              </Alert>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  placeholder="Nombre del proveedor"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dirección"
                  placeholder="Dirección del proveedor"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  placeholder="Ej: 5555-1234"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  placeholder="proveedor@ejemplo.com"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  size="small"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formMutationPending || isSubmitting}
            >
              {formMutationPending
                ? 'Guardando...'
                : formDialog.mode === 'create'
                ? 'Crear'
                : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Delete Confirmation Dialog ───────────────────── */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Eliminar proveedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al proveedor{' '}
            <strong>{deleteDialog.item?.name} ({deleteDialog.item?.nit})</strong>?
            Esta acción no se puede deshacer.
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
