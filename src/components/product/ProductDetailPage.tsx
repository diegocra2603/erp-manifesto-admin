/**
 * ============================================
 * PRODUCT DETAIL PAGE COMPONENT
 * ============================================
 * Detalle del producto con costos por puesto de trabajo
 */

import { useState } from 'react';
import type { ProductJobPosition } from '@/lib/api-types';
import {
  useProduct,
  useAddJobPositionToProduct,
  useRemoveJobPositionFromProduct,
} from '@/hooks/useProducts';
import { useJobPositions } from '@/hooks/useJobPositions';
import { currencyFormat } from '@/lib/currency';
import {
  ArrowLeft, Plus, Trash2, AlertCircle, DollarSign,
  Briefcase, Clock, Users,
} from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const { data: allJobPositions = [] } = useJobPositions();

  const addJobPositionMutation = useAddJobPositionToProduct();
  const removeJobPositionMutation = useRemoveJobPositionFromProduct();

  const [selectedJobPositionId, setSelectedJobPositionId] = useState('');
  const [hours, setHours] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [deleteJpDialog, setDeleteJpDialog] = useState<{ open: boolean; item: ProductJobPosition | null }>({ open: false, item: null });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Filter out already-assigned job positions
  const availableJobPositions = allJobPositions.filter(
    (jp) => !product?.jobPositions.some((pjp) => pjp.jobPositionId === jp.id)
  );

  const handleAddJobPosition = async () => {
    if (!selectedJobPositionId || !hours || Number(hours) <= 0) return;
    try {
      await addJobPositionMutation.mutateAsync({
        productId,
        data: {
          productId,
          jobPositionId: selectedJobPositionId,
          hours: Number(hours),
        },
      });
      setSelectedJobPositionId('');
      setHours('');
      showSuccess('Puesto agregado correctamente.');
    } catch {}
  };

  const handleRemoveJobPosition = async () => {
    if (!deleteJpDialog.item) return;
    try {
      await removeJobPositionMutation.mutateAsync({
        productId,
        productJobPositionId: deleteJpDialog.item.id,
      });
      setDeleteJpDialog({ open: false, item: null });
      showSuccess('Puesto removido correctamente.');
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Alert severity="error" icon={<AlertCircle className="size-5" />}
          action={<Button color="inherit" size="small" onClick={() => refetch()}>Reintentar</Button>}>
          {error instanceof Error ? error.message : 'Producto no encontrado'}
        </Alert>
      </div>
    );
  }

  const mutationError = addJobPositionMutation.error || removeJobPositionMutation.error;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outlined" startIcon={<ArrowLeft className="size-4" />}
            onClick={() => (window.location.href = '/admin/products')}>
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Chip
            icon={<DollarSign className="size-4" />}
            label={`Costo Total: ${currencyFormat(product.totalCost)}`}
            color="primary"
            variant="outlined"
            size="medium"
          />
        </div>
      </div>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {mutationError && (
        <Alert severity="error">
          {mutationError instanceof Error ? mutationError.message : 'Ocurrió un error'}
        </Alert>
      )}

      {/* Add job position form */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Puesto</CardTitle>
          <CardDescription>Selecciona un puesto de trabajo y las horas asignadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <TextField
              select
              label="Puesto de Trabajo"
              value={selectedJobPositionId}
              onChange={(e) => setSelectedJobPositionId(e.target.value)}
              sx={{ minWidth: 300 }}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Briefcase className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {availableJobPositions.length === 0 ? (
                <MenuItem disabled>No hay puestos disponibles</MenuItem>
              ) : (
                availableJobPositions.map((jp) => (
                  <MenuItem key={jp.id} value={jp.id}>
                    {jp.name} ({currencyFormat(jp.hourlyCost)}/hr)
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              label="Horas"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              sx={{ width: 140 }}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Clock className="size-4 text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { min: 0.5, step: 0.5 },
              }}
            />

            <Button
              variant="contained"
              startIcon={<Plus className="size-4" />}
              onClick={handleAddJobPosition}
              disabled={!selectedJobPositionId || !hours || Number(hours) <= 0 || addJobPositionMutation.isPending}
              size="medium"
            >
              {addJobPositionMutation.isPending ? 'Agregando...' : 'Agregar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job positions table */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Costos</CardTitle>
          <CardDescription>Puestos asignados al producto con sus horas y costos</CardDescription>
        </CardHeader>
        <CardContent>
          {product.jobPositions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay puestos asignados. Agrega puestos para calcular el costo.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Puesto</th>
                    <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Costo/Hora</th>
                    <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Horas</th>
                    <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Subtotal</th>
                    <th className="py-3 px-4 text-right font-semibold text-muted-foreground w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {product.jobPositions.map((jp) => (
                    <tr key={jp.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-medium">{jp.jobPositionName}</td>
                      <td className="py-3 px-4 text-right">{currencyFormat(jp.hourlyCost)}</td>
                      <td className="py-3 px-4 text-right">{jp.hours}</td>
                      <td className="py-3 px-4 text-right font-semibold">{currencyFormat(jp.subtotal)}</td>
                      <td className="py-3 px-4 text-right">
                        <Tooltip title="Remover puesto" arrow>
                          <IconButton size="small" color="error"
                            onClick={() => setDeleteJpDialog({ open: true, item: jp })}>
                            <Trash2 className="size-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={3} className="py-3 px-4 text-right font-bold">Total</td>
                    <td className="py-3 px-4 text-right font-bold text-lg">{currencyFormat(product.totalCost)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Job Position Dialog */}
      <Dialog open={deleteJpDialog.open} onClose={() => setDeleteJpDialog({ open: false, item: null })}>
        <DialogTitle>Remover puesto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas remover <strong>{deleteJpDialog.item?.jobPositionName}</strong> de este producto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteJpDialog({ open: false, item: null })}>Cancelar</Button>
          <Button onClick={handleRemoveJobPosition} color="error" variant="contained"
            disabled={removeJobPositionMutation.isPending}>
            {removeJobPositionMutation.isPending ? 'Removiendo...' : 'Remover'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
