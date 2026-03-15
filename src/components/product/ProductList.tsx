/**
 * ============================================
 * PRODUCT LIST COMPONENT
 * ============================================
 * Listado de productos con TanStack Query y DataTable
 */

import { useState } from 'react';
import type { Product } from '@/lib/api-types';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { currencyFormat } from '@/lib/currency';
import { Plus, AlertCircle, Edit, Trash2, Eye } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';

export function ProductList() {
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const deleteMutation = useDeleteProduct();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: Product | null }>({
    open: false,
    item: null,
  });

  const handleCreateClick = () => {
    window.location.href = '/admin/products/create';
  };

  const handleViewClick = (item: Product) => {
    window.location.href = `/admin/products/${item.id}`;
  };

  const handleEditClick = (item: Product) => {
    window.location.href = `/admin/products/edit/${item.id}`;
  };

  const handleDeleteClick = (item: Product) => {
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

  const columns: Column<Product>[] = [
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
      id: 'jobPositions',
      label: 'Puestos Asignados',
      sortable: true,
      width: 180,
      render: (row) => (
        <Chip
          label={`${row.jobPositions.length} puesto${row.jobPositions.length !== 1 ? 's' : ''}`}
          size="small"
          color={row.jobPositions.length > 0 ? 'primary' : 'default'}
          variant="outlined"
        />
      ),
      getValue: (row) => String(row.jobPositions.length),
    },
    {
      id: 'totalCost',
      label: 'Costo Total',
      sortable: true,
      width: 160,
      render: (row) => (
        <span className="font-semibold">{currencyFormat(row.totalCost)}</span>
      ),
      getValue: (row) => String(row.totalCost),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona los productos y servicios de la empresa
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nuevo Producto
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
          {error instanceof Error ? error.message : 'Error al cargar los productos'}
        </Alert>
      )}

      {deleteMutation.isSuccess && (
        <Alert severity="success">Producto eliminado correctamente.</Alert>
      )}

      {deleteMutation.error && (
        <Alert severity="error">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : 'Error al eliminar el producto'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={products}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por nombre, descripción..."
          emptyMessage="No hay productos"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Ver detalle" arrow>
                <IconButton size="small" onClick={() => handleViewClick(item)} color="info">
                  <Eye className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar producto" arrow>
                <IconButton size="small" onClick={() => handleEditClick(item)} color="primary">
                  <Edit className="size-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar producto" arrow>
                <IconButton size="small" onClick={() => handleDeleteClick(item)} color="error">
                  <Trash2 className="size-4" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong>{deleteDialog.item?.name}</strong>? Esta acción no se puede deshacer.
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
