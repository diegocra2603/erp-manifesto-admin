/**
 * ============================================
 * TAX CONFIGURATION LIST COMPONENT
 * ============================================
 * Listado de configuraciones de impuestos con TanStack Query y DataTable
 */

import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaxConfiguration, AccountCatalog } from '@/interfaces/accounting';
import {
  useTaxConfigurations,
  useCreateTaxConfiguration,
  useUpdateTaxConfiguration,
  useDeleteTaxConfiguration,
} from '@/hooks/useTaxConfigurations';
import { useAccountCatalogs } from '@/hooks/useAccountCatalogs';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Plus, AlertCircle, Edit, Trash2, Receipt } from 'lucide-react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

const taxConfigSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  percentage: z.coerce.number().min(0, 'El porcentaje debe ser mayor o igual a 0'),
  taxType: z.coerce.number().min(1, 'El tipo de impuesto es requerido'),
  debitAccountId: z.string().min(1, 'La cuenta de débito es requerida'),
  creditAccountId: z.string().min(1, 'La cuenta de crédito es requerida'),
});

type TaxConfigFormData = z.infer<typeof taxConfigSchema>;

function flattenAccounts(accounts: AccountCatalog[]): AccountCatalog[] {
  const result: AccountCatalog[] = [];
  for (const account of accounts) {
    result.push(account);
    if (account.children && account.children.length > 0) {
      result.push(...flattenAccounts(account.children));
    }
  }
  return result;
}

const TAX_TYPES = [
  { value: 1, label: 'Sobre Venta' },
  { value: 2, label: 'Sobre Compra' },
  { value: 3, label: 'Retención' },
];

export function TaxConfigurationList() {
  const { data: taxConfigs = [], isLoading, error, refetch } = useTaxConfigurations();
  const { data: accounts = [] } = useAccountCatalogs();
  const createMutation = useCreateTaxConfiguration();
  const updateMutation = useUpdateTaxConfiguration();
  const deleteMutation = useDeleteTaxConfiguration();

  const flatAccounts = useMemo(() => flattenAccounts(accounts), [accounts]);

  const [formDialog, setFormDialog] = useState<{ open: boolean; item: TaxConfiguration | null }>({
    open: false,
    item: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: TaxConfiguration | null }>({
    open: false,
    item: null,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaxConfigFormData>({
    resolver: zodResolver(taxConfigSchema),
  });

  const handleCreateClick = () => {
    reset({ name: '', percentage: 0, taxType: 0, debitAccountId: '', creditAccountId: '' });
    createMutation.reset();
    updateMutation.reset();
    setFormDialog({ open: true, item: null });
  };

  const handleEditClick = (item: TaxConfiguration) => {
    reset({
      name: item.name,
      percentage: item.percentage,
      taxType: item.taxType,
      debitAccountId: item.debitAccountId,
      creditAccountId: item.creditAccountId,
    });
    createMutation.reset();
    updateMutation.reset();
    setFormDialog({ open: true, item });
  };

  const handleDeleteClick = (item: TaxConfiguration) => {
    setDeleteDialog({ open: true, item });
  };

  const handleFormSubmit = async (data: TaxConfigFormData) => {
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

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;
    try {
      await deleteMutation.mutateAsync(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const columns: Column<TaxConfiguration>[] = [
    {
      id: 'name',
      label: 'Nombre',
      sortable: true,
      getValue: (row) => row.name,
    },
    {
      id: 'percentage',
      label: 'Porcentaje',
      sortable: true,
      width: 120,
      render: (row) => `${row.percentage}%`,
      getValue: (row) => String(row.percentage),
    },
    {
      id: 'taxTypeName',
      label: 'Tipo de Impuesto',
      sortable: true,
      getValue: (row) => row.taxTypeName,
    },
    {
      id: 'debitAccountName',
      label: 'Cuenta Débito',
      sortable: true,
      getValue: (row) => row.debitAccountName,
    },
    {
      id: 'creditAccountName',
      label: 'Cuenta Crédito',
      sortable: true,
      getValue: (row) => row.creditAccountName,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Impuestos</h1>
          <p className="text-muted-foreground">
            Gestiona las configuraciones de impuestos del sistema
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Impuesto
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
          {error instanceof Error ? error.message : 'Error al cargar las configuraciones de impuestos'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Impuesto eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el impuesto'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={taxConfigs}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre, tipo..."
          emptyMessage="No hay configuraciones de impuestos"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Editar impuesto" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(item)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar impuesto" arrow>
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
            {formDialog.item ? 'Editar Impuesto' : 'Nuevo Impuesto'}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-2">
              {(createMutation.error || updateMutation.error) && (
                <Alert severity="error">
                  {(createMutation.error || updateMutation.error) instanceof Error
                    ? (createMutation.error || updateMutation.error)?.message
                    : 'Error al guardar el impuesto'}
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
                label="Porcentaje"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                {...register('percentage')}
                error={!!errors.percentage}
                helperText={errors.percentage?.message}
              />
              <Controller
                name="taxType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.taxType}>
                    <InputLabel>Tipo de Impuesto</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Impuesto"
                      value={field.value || ''}
                    >
                      {TAX_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.taxType && (
                      <FormHelperText>{errors.taxType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="debitAccountId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.debitAccountId}>
                    <InputLabel>Cuenta Débito</InputLabel>
                    <Select
                      {...field}
                      label="Cuenta Débito"
                      value={field.value || ''}
                    >
                      {flatAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.accountCode} - {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.debitAccountId && (
                      <FormHelperText>{errors.debitAccountId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="creditAccountId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.creditAccountId}>
                    <InputLabel>Cuenta Crédito</InputLabel>
                    <Select
                      {...field}
                      label="Cuenta Crédito"
                      value={field.value || ''}
                    >
                      {flatAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.accountCode} - {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.creditAccountId && (
                      <FormHelperText>{errors.creditAccountId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Eliminar impuesto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el impuesto{' '}
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
