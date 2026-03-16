/**
 * ============================================
 * JOURNAL ENTRY LIST COMPONENT
 * ============================================
 * Listado de partidas contables con TanStack Query y DataTable
 */

import { useState } from 'react';
import type { JournalEntry } from '@/lib/api-types';
import {
  useJournalEntries,
  useApproveJournalEntry,
  useVoidJournalEntry,
  useDeleteJournalEntry,
} from '@/hooks/useJournalEntries';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { currencyFormat } from '@/lib/currency';
import { Plus, AlertCircle, Eye, Trash2, Check, XCircle, ClipboardList } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

type DialogAction = 'approve' | 'void' | 'delete';

export function JournalEntryList() {
  const { data: entries = [], isLoading, error, refetch } = useJournalEntries();
  const approveMutation = useApproveJournalEntry();
  const voidMutation = useVoidJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    item: JournalEntry | null;
    action: DialogAction | null;
  }>({ open: false, item: null, action: null });

  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateClick = () => {
    window.location.href = '/admin/accounting/journal-entries/create';
  };

  const handleViewClick = (item: JournalEntry) => {
    window.location.href = `/admin/accounting/journal-entries/${item.id}`;
  };

  const handleActionClick = (item: JournalEntry, action: DialogAction) => {
    setActionDialog({ open: true, item, action });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.item || !actionDialog.action) return;
    const { item, action } = actionDialog;
    try {
      if (action === 'approve') {
        await approveMutation.mutateAsync(item.id);
        showSuccess('Partida aprobada correctamente.');
      } else if (action === 'void') {
        await voidMutation.mutateAsync(item.id);
        showSuccess('Partida anulada correctamente.');
      } else if (action === 'delete') {
        await deleteMutation.mutateAsync(item.id);
        showSuccess('Partida eliminada correctamente.');
      }
      setActionDialog({ open: false, item: null, action: null });
    } catch {
      // Error handled by mutation state
    }
  };

  const getStatusChipColor = (statusName: string): 'default' | 'success' | 'error' => {
    switch (statusName) {
      case 'Aprobado':
        return 'success';
      case 'Anulado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDialogTitle = () => {
    switch (actionDialog.action) {
      case 'approve':
        return 'Aprobar partida';
      case 'void':
        return 'Anular partida';
      case 'delete':
        return 'Eliminar partida';
      default:
        return '';
    }
  };

  const getDialogMessage = () => {
    const number = actionDialog.item?.entryNumber;
    switch (actionDialog.action) {
      case 'approve':
        return `¿Estás seguro de que deseas aprobar la partida #${number}? Una vez aprobada no podrá ser editada.`;
      case 'void':
        return `¿Estás seguro de que deseas anular la partida #${number}? Esta acción no se puede deshacer.`;
      case 'delete':
        return `¿Estás seguro de que deseas eliminar la partida #${number}? Esta acción no se puede deshacer.`;
      default:
        return '';
    }
  };

  const getDialogButtonColor = (): 'success' | 'error' => {
    return actionDialog.action === 'approve' ? 'success' : 'error';
  };

  const getDialogButtonLabel = () => {
    const isPending =
      approveMutation.isPending || voidMutation.isPending || deleteMutation.isPending;
    if (isPending) {
      switch (actionDialog.action) {
        case 'approve':
          return 'Aprobando...';
        case 'void':
          return 'Anulando...';
        case 'delete':
          return 'Eliminando...';
        default:
          return '';
      }
    }
    switch (actionDialog.action) {
      case 'approve':
        return 'Aprobar';
      case 'void':
        return 'Anular';
      case 'delete':
        return 'Eliminar';
      default:
        return '';
    }
  };

  const isPending =
    approveMutation.isPending || voidMutation.isPending || deleteMutation.isPending;

  const mutationError = approveMutation.error || voidMutation.error || deleteMutation.error;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const columns: Column<JournalEntry>[] = [
    {
      id: 'entryNumber',
      label: 'No.',
      sortable: true,
      width: 80,
      getValue: (row) => String(row.entryNumber),
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
      id: 'description',
      label: 'Descripcion',
      sortable: true,
      getValue: (row) => row.description,
    },
    {
      id: 'entryTypeName',
      label: 'Tipo',
      sortable: true,
      width: 120,
      getValue: (row) => row.entryTypeName,
    },
    {
      id: 'statusName',
      label: 'Estado',
      sortable: true,
      width: 120,
      render: (row) => (
        <Chip
          label={row.statusName}
          size="small"
          color={getStatusChipColor(row.statusName)}
          variant="filled"
        />
      ),
      getValue: (row) => row.statusName,
    },
    {
      id: 'currencyCode',
      label: 'Moneda',
      sortable: true,
      width: 90,
      getValue: (row) => row.currencyCode,
    },
    {
      id: 'totalDebit',
      label: 'Total Debe',
      sortable: true,
      width: 140,
      render: (row) => (
        <span className="font-semibold">{currencyFormat(row.totalDebit)}</span>
      ),
      getValue: (row) => String(row.totalDebit),
    },
    {
      id: 'totalCredit',
      label: 'Total Haber',
      sortable: true,
      width: 140,
      render: (row) => (
        <span className="font-semibold">{currencyFormat(row.totalCredit)}</span>
      ),
      getValue: (row) => String(row.totalCredit),
    },
    {
      id: 'isBalanced',
      label: 'Cuadrada',
      sortable: false,
      width: 90,
      render: (row) =>
        row.isBalanced ? (
          <Check className="size-5 text-green-600" />
        ) : (
          <XCircle className="size-5 text-red-500" />
        ),
      getValue: (row) => (row.isBalanced ? 'Si' : 'No'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partidas Contables</h1>
          <p className="text-muted-foreground">
            Gestiona las partidas contables del sistema
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus className="size-5" />}
          onClick={handleCreateClick}
          size="large"
        >
          Nueva Partida
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
          {error instanceof Error ? error.message : 'Error al cargar las partidas contables'}
        </Alert>
      )}

      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      {mutationError && (
        <Alert severity="error">
          {mutationError instanceof Error ? mutationError.message : 'Ocurrio un error'}
        </Alert>
      )}

      {!error && (
        <DataTable
          data={entries}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Buscar por descripcion, tipo, estado..."
          emptyMessage="No hay partidas contables"
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          actions={(item) => (
            <div className="flex gap-1 justify-end">
              <Tooltip title="Ver detalle" arrow>
                <IconButton size="small" onClick={() => handleViewClick(item)} color="info">
                  <Eye className="size-4" />
                </IconButton>
              </Tooltip>
              {item.statusName === 'Borrador' && (
                <Tooltip title="Aprobar partida" arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(item, 'approve')}
                    color="success"
                  >
                    <Check className="size-4" />
                  </IconButton>
                </Tooltip>
              )}
              {item.statusName === 'Aprobado' && (
                <Tooltip title="Anular partida" arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(item, 'void')}
                    color="warning"
                  >
                    <XCircle className="size-4" />
                  </IconButton>
                </Tooltip>
              )}
              {item.statusName === 'Borrador' && (
                <Tooltip title="Eliminar partida" arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleActionClick(item, 'delete')}
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

      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, item: null, action: null })}
      >
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          <DialogContentText>{getDialogMessage()}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, item: null, action: null })}>
            Cancelar
          </Button>
          <Button
            onClick={handleActionConfirm}
            color={getDialogButtonColor()}
            variant="contained"
            disabled={isPending}
          >
            {getDialogButtonLabel()}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
