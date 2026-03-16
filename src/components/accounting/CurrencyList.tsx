/**
 * ============================================
 * CURRENCY LIST COMPONENT
 * ============================================
 * Listado de monedas con formulario en diálogo para crear/editar
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Currency } from '@/lib/api-types';
import {
  useCurrencies,
  useCreateCurrency,
  useUpdateCurrency,
  useDeleteCurrency,
} from '@/hooks/useCurrencies';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, Edit, Trash2, AlertCircle, CircleDollarSign } from 'lucide-react';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';

// ── Zod Schema ──────────────────────────────────────────────
const currencySchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(10, 'Máximo 10 caracteres'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  symbol: z
    .string()
    .min(1, 'El símbolo es requerido')
    .max(5, 'Máximo 5 caracteres'),
  isFunctional: z.boolean(),
  decimalPlaces: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(0, 'Mínimo 0')
    .max(6, 'Máximo 6'),
});

type CurrencyFormValues = z.infer<typeof currencySchema>;

// ── Component ───────────────────────────────────────────────
export function CurrencyList() {
  const { data: currencies = [], isLoading, error, refetch } = useCurrencies();
  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency();
  const deleteMutation = useDeleteCurrency();

  // Dialog state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    item: Currency | null;
  }>({ open: false, mode: 'create', item: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: Currency | null;
  }>({ open: false, item: null });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
      isFunctional: false,
      decimalPlaces: 2,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (formDialog.open) {
      if (formDialog.mode === 'edit' && formDialog.item) {
        reset({
          code: formDialog.item.code,
          name: formDialog.item.name,
          symbol: formDialog.item.symbol,
          isFunctional: formDialog.item.isFunctional,
          decimalPlaces: formDialog.item.decimalPlaces,
        });
      } else {
        reset({
          code: '',
          name: '',
          symbol: '',
          isFunctional: false,
          decimalPlaces: 2,
        });
      }
      createMutation.reset();
      updateMutation.reset();
    }
  }, [formDialog.open, formDialog.mode, formDialog.item]);

  // ── Handlers ────────────────────────────────────────────
  const handleOpenCreate = () => {
    setFormDialog({ open: true, mode: 'create', item: null });
  };

  const handleOpenEdit = (item: Currency) => {
    setFormDialog({ open: true, mode: 'edit', item });
  };

  const handleCloseForm = () => {
    setFormDialog({ open: false, mode: 'create', item: null });
  };

  const handleFormSubmit = async (values: CurrencyFormValues) => {
    try {
      if (formDialog.mode === 'create') {
        await createMutation.mutateAsync(values);
      } else if (formDialog.item) {
        await updateMutation.mutateAsync({
          id: formDialog.item.id,
          data: { id: formDialog.item.id, ...values },
        });
      }
      handleCloseForm();
    } catch {
      // Error handled by mutation state
    }
  };

  const handleDeleteClick = (item: Currency) => {
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
  const columns: Column<Currency>[] = [
    {
      id: 'code',
      label: 'Código',
      sortable: true,
      width: 120,
      getValue: (row) => row.code,
    },
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'symbol',
      label: 'Símbolo',
      sortable: false,
      width: 100,
      getValue: (row) => row.symbol,
    },
    {
      id: 'isFunctional',
      label: 'Tipo',
      sortable: true,
      width: 140,
      render: (row) =>
        row.isFunctional ? (
          <Chip label="Principal" size="small" color="primary" />
        ) : (
          <Chip label="Secundaria" size="small" variant="outlined" />
        ),
      getValue: (row) => (row.isFunctional ? 'Principal' : 'Secundaria'),
    },
    {
      id: 'decimalPlaces',
      label: 'Decimales',
      sortable: true,
      width: 120,
      getValue: (row) => row.decimalPlaces,
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
          <CircleDollarSign className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Monedas</h1>
            <p className="text-muted-foreground">
              Gestiona las monedas del sistema
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleOpenCreate}
          size="large"
        >
          Nueva Moneda
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
          {error instanceof Error ? error.message : 'Error al cargar las monedas'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Moneda eliminada correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar la moneda'}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <DataTable
          data={currencies}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por código, nombre..."
          emptyMessage="No hay monedas registradas"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar moneda" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(item)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar moneda" arrow>
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
            {formDialog.mode === 'create' ? 'Nueva Moneda' : 'Editar Moneda'}
          </DialogTitle>
          <DialogContent className="space-y-4 !pt-4">
            {formMutationError && (
              <Alert severity="error" className="!mb-4">
                {formMutationError instanceof Error
                  ? formMutationError.message
                  : 'Error al guardar la moneda'}
              </Alert>
            )}

            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código"
                  placeholder="Ej: USD, GTQ"
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  placeholder="Ej: Dólar estadounidense"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="symbol"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Símbolo"
                  placeholder="Ej: $, Q"
                  fullWidth
                  error={!!errors.symbol}
                  helperText={errors.symbol?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="decimalPlaces"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Decimales"
                  type="number"
                  fullWidth
                  error={!!errors.decimalPlaces}
                  helperText={errors.decimalPlaces?.message}
                  size="small"
                  inputProps={{ min: 0, max: 6 }}
                />
              )}
            />

            <Controller
              name="isFunctional"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Moneda funcional (principal)"
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
        <DialogTitle>Eliminar moneda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la moneda{' '}
            <strong>{deleteDialog.item?.name} ({deleteDialog.item?.code})</strong>?
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
