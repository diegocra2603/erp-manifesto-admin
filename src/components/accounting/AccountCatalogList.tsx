/**
 * ============================================
 * ACCOUNT CATALOG LIST COMPONENT
 * ============================================
 * Catálogo de cuentas con vista de árbol jerárquico y formulario en diálogo
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AccountCatalog } from '@/lib/api-types';
import {
  useAccountCatalogs,
  useCreateAccountCatalog,
  useUpdateAccountCatalog,
  useDeleteAccountCatalog,
} from '@/hooks/useAccountCatalogs';
import { Plus, Edit, Trash2, AlertCircle, FolderTree, ChevronDown, ChevronRight } from 'lucide-react';
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
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

// ── Options ────────────────────────────────────────────────
const ACCOUNT_TYPE_OPTIONS = [
  { value: 1, label: 'Activo' },
  { value: 2, label: 'Pasivo' },
  { value: 3, label: 'Capital' },
  { value: 4, label: 'Ingreso' },
  { value: 5, label: 'Gasto' },
  { value: 6, label: 'Costo' },
];

const NATURE_OPTIONS = [
  { value: 1, label: 'Deudora' },
  { value: 2, label: 'Acreedora' },
];

// ── Zod Schema ─────────────────────────────────────────────
const accountCatalogSchema = z.object({
  accountCode: z
    .string()
    .min(1, 'El código de cuenta es requerido')
    .max(50, 'Máximo 50 caracteres'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'Máximo 200 caracteres'),
  accountType: z
    .number({ invalid_type_error: 'El tipo de cuenta es requerido' })
    .min(1, 'El tipo de cuenta es requerido')
    .max(6),
  nature: z
    .number({ invalid_type_error: 'La naturaleza es requerida' })
    .min(1, 'La naturaleza es requerida')
    .max(2),
  parentId: z.string().nullable(),
  level: z
    .number({ invalid_type_error: 'El nivel es requerido' })
    .int()
    .min(1, 'El nivel mínimo es 1'),
  acceptsMovements: z.boolean(),
});

type AccountCatalogFormValues = z.infer<typeof accountCatalogSchema>;

// ── Helpers ────────────────────────────────────────────────

/** Flatten the tree into a list for parent selection */
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

// ── Component ──────────────────────────────────────────────
export function AccountCatalogList() {
  const { data: accounts = [], isLoading, error, refetch } = useAccountCatalogs();
  const createMutation = useCreateAccountCatalog();
  const updateMutation = useUpdateAccountCatalog();
  const deleteMutation = useDeleteAccountCatalog();

  // Expanded state for tree nodes
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Dialog state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    item: AccountCatalog | null;
  }>({ open: false, mode: 'create', item: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: AccountCatalog | null;
  }>({ open: false, item: null });

  // Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountCatalogFormValues>({
    resolver: zodResolver(accountCatalogSchema),
    defaultValues: {
      accountCode: '',
      name: '',
      accountType: 1,
      nature: 1,
      parentId: null,
      level: 1,
      acceptsMovements: false,
    },
  });

  const watchParentId = watch('parentId');
  const allFlat = flattenAccounts(accounts);

  // Auto-calculate level from parent
  useEffect(() => {
    if (watchParentId) {
      const parent = allFlat.find((a) => a.id === watchParentId);
      if (parent) {
        setValue('level', parent.level + 1);
      }
    } else {
      setValue('level', 1);
    }
  }, [watchParentId]);

  // Reset form when dialog opens
  useEffect(() => {
    if (formDialog.open) {
      if (formDialog.mode === 'edit' && formDialog.item) {
        reset({
          accountCode: formDialog.item.accountCode,
          name: formDialog.item.name,
          accountType: formDialog.item.accountType,
          nature: formDialog.item.nature,
          parentId: formDialog.item.parentId,
          level: formDialog.item.level,
          acceptsMovements: formDialog.item.acceptsMovements,
        });
      } else {
        reset({
          accountCode: '',
          name: '',
          accountType: 1,
          nature: 1,
          parentId: null,
          level: 1,
          acceptsMovements: false,
        });
      }
      createMutation.reset();
      updateMutation.reset();
    }
  }, [formDialog.open, formDialog.mode, formDialog.item]);

  // ── Toggle expand/collapse ───────────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleOpenCreate = () => {
    setFormDialog({ open: true, mode: 'create', item: null });
  };

  const handleOpenEdit = (item: AccountCatalog) => {
    setFormDialog({ open: true, mode: 'edit', item });
  };

  const handleCloseForm = () => {
    setFormDialog({ open: false, mode: 'create', item: null });
  };

  const handleFormSubmit = async (values: AccountCatalogFormValues) => {
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

  const handleDeleteClick = (item: AccountCatalog) => {
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

  // ── Mutation error helper ────────────────────────────────
  const formMutationError =
    formDialog.mode === 'create' ? createMutation.error : updateMutation.error;
  const formMutationPending =
    formDialog.mode === 'create' ? createMutation.isPending : updateMutation.isPending;

  // ── Render tree row recursively ──────────────────────────
  const renderAccountRow = (account: AccountCatalog) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedIds.has(account.id);
    const indentPx = (account.level - 1) * 32;

    return (
      <div key={account.id}>
        <div
          className="flex items-center justify-between py-2 px-3 border-b border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0" style={{ paddingLeft: indentPx }}>
            {hasChildren ? (
              <IconButton size="small" onClick={() => toggleExpand(account.id)}>
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </IconButton>
            ) : (
              <span className="w-8" />
            )}

            <span className="font-mono text-sm font-semibold text-primary min-w-[100px]">
              {account.accountCode}
            </span>
            <span className="text-sm font-medium truncate">
              {account.name}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground min-w-[70px] text-center">
              {account.accountTypeName}
            </span>
            <span className="text-xs text-muted-foreground min-w-[70px] text-center">
              {account.natureName}
            </span>
            <span className="text-xs text-muted-foreground min-w-[40px] text-center">
              Nv. {account.level}
            </span>
            <Chip
              label={account.acceptsMovements ? 'Movimientos' : 'Agrupadora'}
              size="small"
              color={account.acceptsMovements ? 'success' : 'default'}
              variant={account.acceptsMovements ? 'filled' : 'outlined'}
              sx={{ minWidth: 110 }}
            />

            <div className="flex gap-1">
              <Tooltip title="Editar cuenta" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(account)}
                  color="primary"
                >
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar cuenta" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(account)}
                  color="error"
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>

        {hasChildren && (
          <Collapse in={isExpanded}>
            {account.children.map((child) => renderAccountRow(child))}
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Catálogo de Cuentas</h1>
            <p className="text-muted-foreground">
              Gestiona el catálogo de cuentas contables del sistema
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleOpenCreate}
          size="large"
        >
          Nueva Cuenta
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
          {error instanceof Error ? error.message : 'Error al cargar el catálogo de cuentas'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Cuenta eliminada correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar la cuenta'}
        </Alert>
      )}

      {/* Tree View */}
      {!error && (
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {/* Header Row */}
          <div className="flex items-center justify-between py-3 px-3 border-b-2 border-border bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2 flex-1">
              <span className="w-8" />
              <span className="text-xs font-semibold uppercase text-muted-foreground min-w-[100px]">
                Código
              </span>
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Nombre
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold uppercase text-muted-foreground min-w-[70px] text-center">
                Tipo
              </span>
              <span className="text-xs font-semibold uppercase text-muted-foreground min-w-[70px] text-center">
                Naturaleza
              </span>
              <span className="text-xs font-semibold uppercase text-muted-foreground min-w-[40px] text-center">
                Nivel
              </span>
              <span className="text-xs font-semibold uppercase text-muted-foreground" style={{ minWidth: 110 }}>
                Estado
              </span>
              <span className="text-xs font-semibold uppercase text-muted-foreground w-[72px] text-center">
                Acciones
              </span>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <CircularProgress />
            </div>
          )}

          {/* Tree Rows */}
          {!isLoading && accounts.length > 0 && (
            <div>
              {accounts.map((account) => renderAccountRow(account))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && accounts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FolderTree className="size-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay cuentas registradas</p>
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Dialog ──────────────────────────── */}
      <Dialog
        open={formDialog.open}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogTitle>
            {formDialog.mode === 'create' ? 'Nueva Cuenta' : 'Editar Cuenta'}
          </DialogTitle>
          <DialogContent className="space-y-4 !pt-4">
            {formMutationError && (
              <Alert severity="error" className="!mb-4">
                {formMutationError instanceof Error
                  ? formMutationError.message
                  : 'Error al guardar la cuenta'}
              </Alert>
            )}

            <Controller
              name="accountCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código de Cuenta"
                  placeholder="Ej: 1100, 1100.01"
                  fullWidth
                  error={!!errors.accountCode}
                  helperText={errors.accountCode?.message}
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
                  placeholder="Ej: Activos Corrientes"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
                />
              )}
            />

            <Controller
              name="accountType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.accountType}>
                  <InputLabel>Tipo de Cuenta</InputLabel>
                  <Select
                    {...field}
                    label="Tipo de Cuenta"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="nature"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.nature}>
                  <InputLabel>Naturaleza</InputLabel>
                  <Select
                    {...field}
                    label="Naturaleza"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {NATURE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Cuenta Padre</InputLabel>
                  <Select
                    {...field}
                    value={field.value ?? ''}
                    label="Cuenta Padre"
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? null : val);
                    }}
                  >
                    <MenuItem value="">
                      <em>Ninguna (cuenta raíz)</em>
                    </MenuItem>
                    {allFlat
                      .filter((a) => formDialog.item ? a.id !== formDialog.item.id : true)
                      .map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.accountCode} - {account.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Nivel"
                  type="number"
                  fullWidth
                  error={!!errors.level}
                  helperText={errors.level?.message ?? 'Se calcula automáticamente según la cuenta padre'}
                  size="small"
                  inputProps={{ min: 1 }}
                  disabled
                />
              )}
            />

            <Controller
              name="acceptsMovements"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Acepta movimientos"
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

      {/* ── Delete Confirmation Dialog ────────────────────── */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la cuenta{' '}
            <strong>{deleteDialog.item?.accountCode} - {deleteDialog.item?.name}</strong>?
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
