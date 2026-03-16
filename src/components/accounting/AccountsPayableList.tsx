/**
 * ============================================
 * ACCOUNTS PAYABLE LIST COMPONENT
 * ============================================
 * Listado de facturas por pagar con acciones
 */

import { useState } from 'react';
import type { Invoice } from '@/interfaces/accounting';
import {
  usePayableInvoices,
  useEmitInvoice,
  useVoidInvoice,
  useDeleteInvoice,
} from '@/hooks/useInvoices';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { currencyFormat } from '@/lib/currency';
import {
  AlertCircle,
  TrendingDown,
  Plus,
  Send,
  Ban,
  Trash2,
} from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getStatusColor = (status: number): 'default' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 1: return 'warning';   // Borrador
    case 2: return 'success';   // Emitida
    case 3: return 'error';     // Anulada
    default: return 'default';
  }
};

export function AccountsPayableList() {
  const { data: invoices = [], isLoading, error, refetch } = usePayableInvoices();
  const emitMutation = useEmitInvoice();
  const voidMutation = useVoidInvoice();
  const deleteMutation = useDeleteInvoice();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'emit' | 'void' | 'delete';
    item: Invoice | null;
  }>({ open: false, action: 'emit', item: null });

  const handleConfirmAction = async () => {
    if (!confirmDialog.item) return;
    try {
      switch (confirmDialog.action) {
        case 'emit':
          await emitMutation.mutateAsync(confirmDialog.item.id);
          break;
        case 'void':
          await voidMutation.mutateAsync(confirmDialog.item.id);
          break;
        case 'delete':
          await deleteMutation.mutateAsync(confirmDialog.item.id);
          break;
      }
      setConfirmDialog({ open: false, action: 'emit', item: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const actionPending = emitMutation.isPending || voidMutation.isPending || deleteMutation.isPending;

  const getDialogTexts = () => {
    switch (confirmDialog.action) {
      case 'emit':
        return {
          title: 'Emitir factura',
          message: `¿Estás seguro de que deseas emitir la factura ${confirmDialog.item?.invoiceNumber}? Esta acción generará la partida contable correspondiente.`,
          button: 'Emitir',
        };
      case 'void':
        return {
          title: 'Anular factura',
          message: `¿Estás seguro de que deseas anular la factura ${confirmDialog.item?.invoiceNumber}? Esta acción revertirá la partida contable.`,
          button: 'Anular',
        };
      case 'delete':
        return {
          title: 'Eliminar factura',
          message: `¿Estás seguro de que deseas eliminar la factura ${confirmDialog.item?.invoiceNumber}? Esta acción no se puede deshacer.`,
          button: 'Eliminar',
        };
    }
  };

  const columns: Column<Invoice>[] = [
    {
      id: 'invoiceNumber',
      label: 'No. Factura',
      sortable: true,
      width: 140,
      getValue: (row) => row.invoiceNumber,
    },
    {
      id: 'date',
      label: 'Fecha',
      sortable: true,
      width: 120,
      render: (row) => formatDate(row.date),
      getValue: (row) => row.date,
    },
    {
      id: 'supplierName',
      label: 'Proveedor',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.supplierName ?? row.name}</div>
          <div className="text-xs text-muted-foreground">{row.nit}</div>
        </div>
      ),
      getValue: (row) => row.supplierName ?? row.name,
    },
    {
      id: 'total',
      label: 'Total',
      sortable: true,
      width: 160,
      render: (row) => <span className="font-semibold">{currencyFormat(row.total)}</span>,
      getValue: (row) => String(row.total),
    },
    {
      id: 'status',
      label: 'Estado',
      sortable: true,
      width: 130,
      render: (row) => (
        <Chip
          label={row.statusName}
          size="small"
          color={getStatusColor(row.status)}
          variant="outlined"
        />
      ),
      getValue: (row) => row.statusName,
    },
  ];

  const dialogTexts = getDialogTexts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingDown className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Cuentas por Pagar</h1>
            <p className="text-muted-foreground">
              Facturas recibidas de proveedores
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={() => (window.location.href = '/admin/accounting/payable/create')}
          size="large"
        >
          Registrar Factura
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
          {error instanceof Error ? error.message : 'Error al cargar las facturas'}
        </Alert>
      )}

      {(emitMutation.isSuccess || voidMutation.isSuccess || deleteMutation.isSuccess) && (
        <Alert severity="success">Operación realizada correctamente.</Alert>
      )}

      {(emitMutation.error || voidMutation.error || deleteMutation.error) && (
        <Alert severity="error">
          {(emitMutation.error ?? voidMutation.error ?? deleteMutation.error) instanceof Error
            ? (emitMutation.error ?? voidMutation.error ?? deleteMutation.error)!.message
            : 'Error al realizar la operación'}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <DataTable
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por número, proveedor, NIT..."
          emptyMessage="No hay facturas por pagar registradas"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              {item.status === 1 && (
                <Tooltip title="Emitir factura" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setConfirmDialog({ open: true, action: 'emit', item })}
                    color="success"
                  >
                    <Send className="size-4" />
                  </IconButton>
                </Tooltip>
              )}
              {item.status === 2 && (
                <Tooltip title="Anular factura" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setConfirmDialog({ open: true, action: 'void', item })}
                    color="warning"
                  >
                    <Ban className="size-4" />
                  </IconButton>
                </Tooltip>
              )}
              {item.status === 1 && (
                <Tooltip title="Eliminar factura" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setConfirmDialog({ open: true, action: 'delete', item })}
                    color="error"
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        />
      )}

      {/* ── Confirm Action Dialog ────────────────────────── */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: 'emit', item: null })}
      >
        <DialogTitle>{dialogTexts.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogTexts.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: 'emit', item: null })}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.action === 'delete' ? 'error' : confirmDialog.action === 'void' ? 'warning' : 'success'}
            variant="contained"
            disabled={actionPending}
          >
            {actionPending ? 'Procesando...' : dialogTexts.button}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
