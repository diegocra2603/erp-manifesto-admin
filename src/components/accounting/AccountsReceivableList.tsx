/**
 * ============================================
 * ACCOUNTS RECEIVABLE LIST COMPONENT
 * ============================================
 * Listado de facturas por cobrar con acciones y respuesta fiscal
 */

import { useState } from 'react';
import type { Invoice } from '@/interfaces/accounting';
import {
  useReceivableInvoices,
  useEmitInvoice,
  useVoidInvoice,
  useDeleteInvoice,
} from '@/hooks/useInvoices';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { currencyFormat } from '@/lib/currency';
import {
  AlertCircle,
  TrendingUp,
  Plus,
  Send,
  Ban,
  Trash2,
  CheckCircle2,
  FileCheck,
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
    case 3: return 'default';   // Pagada
    case 4: return 'error';     // Anulada
    default: return 'default';
  }
};

export function AccountsReceivableList() {
  const { data: invoices = [], isLoading, error, refetch } = useReceivableInvoices();
  const emitMutation = useEmitInvoice();
  const voidMutation = useVoidInvoice();
  const deleteMutation = useDeleteInvoice();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'emit' | 'void' | 'delete';
    item: Invoice | null;
  }>({ open: false, action: 'emit', item: null });

  // Dialog to show Ainnova fiscal response after emitting
  const [fiscalResultDialog, setFiscalResultDialog] = useState<{
    open: boolean;
    invoice: Invoice | null;
    error: string | null;
  }>({ open: false, invoice: null, error: null });

  const handleConfirmAction = async () => {
    if (!confirmDialog.item) return;
    try {
      switch (confirmDialog.action) {
        case 'emit': {
          const result = await emitMutation.mutateAsync(confirmDialog.item.id);
          setConfirmDialog({ open: false, action: 'emit', item: null });
          // Show fiscal response dialog
          if (result) {
            setFiscalResultDialog({ open: true, invoice: result as Invoice, error: null });
          }
          return;
        }
        case 'void':
          await voidMutation.mutateAsync(confirmDialog.item.id);
          break;
        case 'delete':
          await deleteMutation.mutateAsync(confirmDialog.item.id);
          break;
      }
      setConfirmDialog({ open: false, action: 'emit', item: null });
    } catch (err) {
      setConfirmDialog({ open: false, action: 'emit', item: null });
      // Show error in fiscal dialog for emit actions
      if (confirmDialog.action === 'emit') {
        setFiscalResultDialog({
          open: true,
          invoice: null,
          error: err instanceof Error ? err.message : 'Error al emitir la factura en el servicio fiscal',
        });
      }
    }
  };

  const actionPending = emitMutation.isPending || voidMutation.isPending || deleteMutation.isPending;

  const getDialogTexts = () => {
    switch (confirmDialog.action) {
      case 'emit':
        return {
          title: 'Emitir factura',
          message: `¿Estás seguro de que deseas emitir la factura ${confirmDialog.item?.invoiceNumber}? Se enviará al servicio fiscal (Ainnova) para su certificación.`,
          button: 'Emitir',
        };
      case 'void':
        return {
          title: 'Anular factura',
          message: `¿Estás seguro de que deseas anular la factura ${confirmDialog.item?.invoiceNumber}?`,
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
      id: 'clientName',
      label: 'Cliente',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium">{row.clientName ?? row.name}</div>
          <div className="text-xs text-muted-foreground">{row.nit || 'CF'}</div>
        </div>
      ),
      getValue: (row) => row.clientName ?? row.name,
    },
    {
      id: 'total',
      label: 'Total',
      sortable: true,
      width: 140,
      render: (row) => <span className="font-semibold">{currencyFormat(row.total)}</span>,
      getValue: (row) => String(row.total),
    },
    {
      id: 'fiscal',
      label: 'Datos Fiscales',
      sortable: false,
      width: 180,
      render: (row) => (
        row.fiscalSerie ? (
          <div className="text-xs">
            <div>Serie: <strong>{row.fiscalSerie}</strong></div>
            <div>No: <strong>{row.fiscalNumero}</strong></div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Sin certificar</span>
        )
      ),
      getValue: (row) => row.fiscalSerie ?? '',
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
          <TrendingUp className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Cuentas por Cobrar</h1>
            <p className="text-muted-foreground">
              Facturas emitidas a clientes
            </p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={() => (window.location.href = '/admin/accounting/receivable/create')}
          size="large"
        >
          Nueva Factura
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

      {(voidMutation.isSuccess || deleteMutation.isSuccess) && (
        <Alert severity="success">Operación realizada correctamente.</Alert>
      )}

      {(voidMutation.error || deleteMutation.error) && (
        <Alert severity="error">
          {(voidMutation.error ?? deleteMutation.error) instanceof Error
            ? (voidMutation.error ?? deleteMutation.error)!.message
            : 'Error al realizar la operación'}
        </Alert>
      )}

      {/* Table */}
      {!error && (
        <DataTable
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por número, cliente, NIT..."
          emptyMessage="No hay facturas por cobrar registradas"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              {item.status === 1 && (
                <Tooltip title="Emitir factura (enviar a Ainnova)" arrow>
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

      {/* ── Fiscal Result Dialog (Ainnova Response) ──────── */}
      <Dialog
        open={fiscalResultDialog.open}
        onClose={() => setFiscalResultDialog({ open: false, invoice: null, error: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          {fiscalResultDialog.error ? (
            <>
              <AlertCircle className="size-6 text-red-500" />
              Error del Servicio Fiscal
            </>
          ) : (
            <>
              <FileCheck className="size-6 text-green-500" />
              Factura Emitida Exitosamente
            </>
          )}
        </DialogTitle>
        <DialogContent>
          {fiscalResultDialog.error ? (
            <Alert severity="error" className="!mt-2">
              {fiscalResultDialog.error}
            </Alert>
          ) : fiscalResultDialog.invoice ? (
            <div className="space-y-4 mt-2">
              <Alert severity="success" icon={<CheckCircle2 className="size-5" />}>
                La factura fue certificada por el servicio fiscal (Ainnova).
              </Alert>

              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-lg">Respuesta de Ainnova</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">No. Factura</p>
                    <p className="font-medium">{fiscalResultDialog.invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <Chip
                      label={fiscalResultDialog.invoice.statusName}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Serie</p>
                    <p className="font-bold text-lg">{fiscalResultDialog.invoice.fiscalSerie || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Numero (DTE)</p>
                    <p className="font-bold text-lg">{fiscalResultDialog.invoice.fiscalNumero || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Numero de Autorizacion</p>
                    <p className="font-mono text-sm break-all">{fiscalResultDialog.invoice.fiscalAutorizacion || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">NIT Receptor</p>
                    <p className="font-medium">{fiscalResultDialog.invoice.nit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold">{currencyFormat(fiscalResultDialog.invoice.total)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setFiscalResultDialog({ open: false, invoice: null, error: null })}
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
