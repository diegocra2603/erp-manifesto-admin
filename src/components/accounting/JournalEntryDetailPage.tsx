/**
 * ============================================
 * JOURNAL ENTRY DETAIL PAGE COMPONENT
 * ============================================
 * Detalle de partida contable con lineas y acciones
 */

import { useState } from 'react';
import {
  useJournalEntry,
  useApproveJournalEntry,
  useVoidJournalEntry,
} from '@/hooks/useJournalEntries';
import { currencyFormat } from '@/lib/currency';
import { ArrowLeft, AlertCircle, Check, XCircle, ClipboardList } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface JournalEntryDetailPageProps {
  entryId: string;
}

export function JournalEntryDetailPage({ entryId }: JournalEntryDetailPageProps) {
  const { data: entry, isLoading, error, refetch } = useJournalEntry(entryId);
  const approveMutation = useApproveJournalEntry();
  const voidMutation = useVoidJournalEntry();

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'void' | null;
  }>({ open: false, action: null });

  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.action) return;
    try {
      if (actionDialog.action === 'approve') {
        await approveMutation.mutateAsync(entryId);
        showSuccess('Partida aprobada correctamente.');
      } else {
        await voidMutation.mutateAsync(entryId);
        showSuccess('Partida anulada correctamente.');
      }
      setActionDialog({ open: false, action: null });
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPending = approveMutation.isPending || voidMutation.isPending;
  const mutationError = approveMutation.error || voidMutation.error;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="space-y-6">
        <Alert
          severity="error"
          icon={<AlertCircle className="size-5" />}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Reintentar
            </Button>
          }
        >
          {error instanceof Error ? error.message : 'Partida no encontrada'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft className="size-4" />}
            onClick={() => (window.location.href = '/admin/accounting/journal-entries')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Partida #{entry.entryNumber}
            </h1>
            <p className="text-muted-foreground">{entry.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Chip
            label={entry.statusName}
            color={getStatusChipColor(entry.statusName)}
            variant="filled"
            size="medium"
          />
          {entry.statusName === 'Borrador' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Check className="size-4" />}
              onClick={() => setActionDialog({ open: true, action: 'approve' })}
              disabled={isPending}
            >
              Aprobar
            </Button>
          )}
          {entry.statusName === 'Aprobado' && (
            <Button
              variant="contained"
              color="error"
              startIcon={<XCircle className="size-4" />}
              onClick={() => setActionDialog({ open: true, action: 'void' })}
              disabled={isPending}
            >
              Anular
            </Button>
          )}
        </div>
      </div>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {mutationError && (
        <Alert severity="error">
          {mutationError instanceof Error ? mutationError.message : 'Ocurrio un error'}
        </Alert>
      )}

      {/* Entry Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informacion General</CardTitle>
          <CardDescription>Datos de la partida contable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Numero</p>
              <p className="text-lg font-semibold">{entry.entryNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-lg font-semibold">{formatDate(entry.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-lg font-semibold">{entry.entryTypeName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Periodo</p>
              <p className="text-lg font-semibold">{entry.periodName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Moneda</p>
              <p className="text-lg font-semibold">{entry.currencyCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Cambio</p>
              <p className="text-lg font-semibold">{entry.exchangeRate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cuadrada</p>
              <p className="text-lg font-semibold">
                {entry.isBalanced ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="size-5" /> Si
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    <XCircle className="size-5" /> No
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Debe</p>
            <p className="text-2xl font-bold">{currencyFormat(entry.totalDebit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Haber</p>
            <p className="text-2xl font-bold">{currencyFormat(entry.totalCredit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Debe (Funcional)</p>
            <p className="text-2xl font-bold">{currencyFormat(entry.totalDebitFunctional)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Haber (Funcional)</p>
            <p className="text-2xl font-bold">{currencyFormat(entry.totalCreditFunctional)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Lineas de la Partida</CardTitle>
          <CardDescription>Detalle de las cuentas afectadas</CardDescription>
        </CardHeader>
        <CardContent>
          {entry.lines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay lineas en esta partida.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cuenta</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descripcion</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Debe</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Haber</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Debe (Func.)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Haber (Func.)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entry.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.lineOrder}</TableCell>
                      <TableCell>
                        <span className="font-medium">{line.accountCode}</span>
                        <span className="text-muted-foreground ml-2">{line.accountName}</span>
                      </TableCell>
                      <TableCell>{line.description}</TableCell>
                      <TableCell align="right">
                        {line.debit > 0 ? (
                          <span className="font-semibold">{currencyFormat(line.debit)}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {line.credit > 0 ? (
                          <span className="font-semibold">{currencyFormat(line.credit)}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {line.debitFunctional > 0 ? currencyFormat(line.debitFunctional) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {line.creditFunctional > 0 ? currencyFormat(line.creditFunctional) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: null })}
      >
        <DialogTitle>
          {actionDialog.action === 'approve' ? 'Aprobar partida' : 'Anular partida'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionDialog.action === 'approve'
              ? `¿Estas seguro de que deseas aprobar la partida #${entry.entryNumber}? Una vez aprobada no podra ser editada.`
              : `¿Estas seguro de que deseas anular la partida #${entry.entryNumber}? Esta accion no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: null })}>Cancelar</Button>
          <Button
            onClick={handleActionConfirm}
            color={actionDialog.action === 'approve' ? 'success' : 'error'}
            variant="contained"
            disabled={isPending}
          >
            {isPending
              ? actionDialog.action === 'approve'
                ? 'Aprobando...'
                : 'Anulando...'
              : actionDialog.action === 'approve'
                ? 'Aprobar'
                : 'Anular'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
