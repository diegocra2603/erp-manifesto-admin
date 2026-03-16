/**
 * ============================================
 * EXCHANGE RATE LIST COMPONENT
 * ============================================
 * Listado de tipos de cambio con formulario en diálogo para crear/editar
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ExchangeRate } from '@/lib/api-types';
import {
  useExchangeRates,
  useCreateExchangeRate,
  useUpdateExchangeRate,
  useDeleteExchangeRate,
} from '@/hooks/useExchangeRates';
import { useCurrencies } from '@/hooks/useCurrencies';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

// ── Zod Schema ──────────────────────────────────────────────
const exchangeRateSchema = z.object({
  currencyId: z.string().min(1, 'La moneda es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  buyRate: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .positive('Debe ser mayor a 0'),
  sellRate: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .positive('Debe ser mayor a 0'),
  source: z
    .string()
    .min(1, 'La fuente es requerida')
    .max(200, 'Máximo 200 caracteres'),
});

type ExchangeRateFormValues = z.infer<typeof exchangeRateSchema>;

// ── Component ───────────────────────────────────────────────
export function ExchangeRateList() {
  const { data: exchangeRates = [], isLoading, error, refetch } = useExchangeRates();
  const { data: currencies = [] } = useCurrencies();
  const createMutation = useCreateExchangeRate();
  const updateMutation = useUpdateExchangeRate();
  const deleteMutation = useDeleteExchangeRate();

  // Dialog state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    item: ExchangeRate | null;
  }>({ open: false, mode: 'create', item: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: ExchangeRate | null;
  }>({ open: false, item: null });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExchangeRateFormValues>({
    resolver: zodResolver(exchangeRateSchema),
    defaultValues: {
      currencyId: '',
      date: '',
      buyRate: 0,
      sellRate: 0,
      source: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (formDialog.open) {
      if (formDialog.mode === 'edit' && formDialog.item) {
        reset({
          currencyId: formDialog.item.currencyId,
          date: formDialog.item.date.split('T')[0], // formato yyyy-MM-dd
          buyRate: formDialog.item.buyRate,
          sellRate: formDialog.item.sellRate,
          source: formDialog.item.source,
        });
      } else {
        reset({
          currencyId: '',
          date: '',
          buyRate: 0,
          sellRate: 0,
          source: '',
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

  const handleOpenEdit = (item: ExchangeRate) => {
    setFormDialog({ open: true, mode: 'edit', item });
  };

  const handleCloseForm = () => {
    setFormDialog({ open: false, mode: 'create', item: null });
  };

  const handleFormSubmit = async (values: ExchangeRateFormValues) => {
    try {
      if (formDialog.mode === 'create') {
        await createMutation.mutateAsync(values);
      } else if (formDialog.item) {
        await updateMutation.mutateAsync({
          id: formDialog.item.id,
          data: {
            id: formDialog.item.id,
            buyRate: values.buyRate,
            sellRate: values.sellRate,
            source: values.source,
          },
        });
      }
      handleCloseForm();
    } catch {
      // Error handled by mutation state
    }
  };

  const handleDeleteClick = (item: ExchangeRate) => {
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

  // ── Date formatter ──────────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // ── Columns ─────────────────────────────────────────────
  const columns: Column<ExchangeRate>[] = [
    {
      id: 'currencyCode',
      label: 'Moneda',
      sortable: true,
      width: 140,
      render: (row) => (
        <span>
          {row.currencyCode} - {row.currencyName}
        </span>
      ),
      getValue: (row) => row.currencyCode,
    },
    {
      id: 'date',
      label: 'Fecha',
      sortable: true,
      width: 140,
      render: (row) => formatDate(row.date),
      getValue: (row) => row.date,
    },
    {
      id: 'buyRate',
      label: 'Tipo Compra',
      sortable: true,
      width: 140,
      render: (row) => row.buyRate.toFixed(4),
      getValue: (row) => row.buyRate,
    },
    {
      id: 'sellRate',
      label: 'Tipo Venta',
      sortable: true,
      width: 140,
      render: (row) => row.sellRate.toFixed(4),
      getValue: (row) => row.sellRate,
    },
    {
      id: 'source',
      label: 'Fuente',
      sortable: true,
      getValue: (row) => row.source,
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
        <div>
          <h2 className="text-2xl font-bold">Tipos de Cambio</h2>
          <p className="text-muted-foreground">
            Gestiona los tipos de cambio entre monedas
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleOpenCreate}
          size="large"
        >
          Nuevo Tipo de Cambio
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
          {error instanceof Error
            ? error.message
            : 'Error al cargar los tipos de cambio'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Tipo de cambio eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el tipo de cambio'}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <DataTable
          data={exchangeRates}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por moneda, fuente..."
          emptyMessage="No hay tipos de cambio registrados"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar tipo de cambio" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(item)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar tipo de cambio" arrow>
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
            {formDialog.mode === 'create'
              ? 'Nuevo Tipo de Cambio'
              : 'Editar Tipo de Cambio'}
          </DialogTitle>
          <DialogContent className="space-y-4 !pt-4">
            {formMutationError && (
              <Alert severity="error" className="!mb-4">
                {formMutationError instanceof Error
                  ? formMutationError.message
                  : 'Error al guardar el tipo de cambio'}
              </Alert>
            )}

            <Controller
              name="currencyId"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.currencyId}
                  disabled={formDialog.mode === 'edit'}
                >
                  <InputLabel>Moneda</InputLabel>
                  <Select {...field} label="Moneda">
                    {currencies.map((currency) => (
                      <MenuItem key={currency.id} value={currency.id}>
                        {currency.code} - {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.currencyId && (
                    <FormHelperText>{errors.currencyId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha"
                  type="date"
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  disabled={formDialog.mode === 'edit'}
                />
              )}
            />

            <Controller
              name="buyRate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Tipo de Compra"
                  type="number"
                  fullWidth
                  error={!!errors.buyRate}
                  helperText={errors.buyRate?.message}
                  size="small"
                  inputProps={{ step: '0.0001', min: 0 }}
                />
              )}
            />

            <Controller
              name="sellRate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Tipo de Venta"
                  type="number"
                  fullWidth
                  error={!!errors.sellRate}
                  helperText={errors.sellRate?.message}
                  size="small"
                  inputProps={{ step: '0.0001', min: 0 }}
                />
              )}
            />

            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fuente"
                  placeholder="Ej: Banco de Guatemala"
                  fullWidth
                  error={!!errors.source}
                  helperText={errors.source?.message}
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
        <DialogTitle>Eliminar tipo de cambio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el tipo de cambio de{' '}
            <strong>{deleteDialog.item?.currencyCode}</strong> del{' '}
            <strong>{deleteDialog.item ? formatDate(deleteDialog.item.date) : ''}</strong>?
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
