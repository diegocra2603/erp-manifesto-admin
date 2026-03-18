/**
 * ============================================
 * CREDIT NOTE FORM COMPONENT
 * ============================================
 * Formulario para crear notas de credito basadas en una factura emitida.
 * Permite seleccionar items parciales o totales de la factura original.
 */

import { useState, useMemo } from 'react';
import type { Invoice, InvoiceItem } from '@/interfaces/accounting';
import { useCreateCreditNote } from '@/hooks/useInvoices';
import { currencyFormat } from '@/lib/currency';
import { AlertCircle, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface CreditNoteFormProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: (creditNote: Invoice) => void;
}

interface CreditNoteLineItem {
  selected: boolean;
  description: string;
  quantity: number;
  unitPrice: number;
  maxQuantity: number;
  maxUnitPrice: number;
}

export function CreditNoteForm({ invoice, onClose, onSuccess }: CreditNoteFormProps) {
  const createCreditNoteMutation = useCreateCreditNote();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState('');

  // Initialize line items from original invoice
  const [lineItems, setLineItems] = useState<CreditNoteLineItem[]>(
    invoice.items.map((item) => ({
      selected: false,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      maxQuantity: item.quantity,
      maxUnitPrice: item.unitPrice,
    }))
  );

  // Custom items added manually
  const [customItems, setCustomItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([]);

  const selectedItems = lineItems.filter((item) => item.selected);

  const allItems = [
    ...selectedItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    ...customItems.filter((item) => item.description && item.quantity > 0 && item.unitPrice > 0),
  ];

  const totalSubtotal = allItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalTax = Math.round(totalSubtotal * 0.12 * 100) / 100;
  const totalAmount = totalSubtotal + totalTax;

  const exceedsOriginal = totalAmount > invoice.total;
  const hasItems = allItems.length > 0;

  const toggleItem = (index: number) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.min(Math.max(0.01, quantity), item.maxQuantity) } : item
      )
    );
  };

  const updateItemPrice = (index: number, unitPrice: number) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, unitPrice: Math.min(Math.max(0.01, unitPrice), item.maxUnitPrice) } : item
      )
    );
  };

  const selectAll = () => {
    setLineItems((prev) => prev.map((item) => ({ ...item, selected: true })));
  };

  const deselectAll = () => {
    setLineItems((prev) => prev.map((item) => ({ ...item, selected: false })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasItems || exceedsOriginal) return;

    try {
      const result = await createCreditNoteMutation.mutateAsync({
        invoiceId: invoice.id,
        data: {
          date,
          notes: notes || undefined,
          items: allItems,
        },
      });
      if (result) {
        onSuccess(result as Invoice);
      }
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft className="size-4" />}
            onClick={onClose}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nueva Nota de Credito</h1>
            <p className="text-muted-foreground">
              Basada en factura <strong>{invoice.invoiceNumber}</strong> - {invoice.clientName ?? invoice.name}
            </p>
          </div>
        </div>
      </div>

      {/* Original Invoice Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Factura Original</p>
              <p className="font-bold">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Serie / Numero DTE</p>
              <p className="font-medium">{invoice.fiscalSerie} / {invoice.fiscalNumero}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-medium">{invoice.clientName ?? invoice.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Original</p>
              <p className="font-bold text-lg">{currencyFormat(invoice.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {createCreditNoteMutation.isSuccess && (
        <Alert severity="success">Nota de credito creada correctamente!</Alert>
      )}

      {createCreditNoteMutation.error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {createCreditNoteMutation.error instanceof Error
            ? createCreditNoteMutation.error.message
            : 'Error al crear la nota de credito'}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Notas / Motivo"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Motivo de la nota de credito..."
                fullWidth
              />
            </div>
          </CardContent>
        </Card>

        {/* Items from original invoice */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Items de la Factura Original</CardTitle>
                <CardDescription>Selecciona los items a incluir en la nota de credito. Puedes ajustar cantidades y precios.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outlined" size="small" onClick={selectAll}>
                  Seleccionar Todos
                </Button>
                <Button variant="outlined" size="small" onClick={deselectAll}>
                  Deseleccionar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '5%' }} />
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Descripcion</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">Precio Unit.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">Subtotal</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">Total (IVA)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item, index) => {
                    const subtotal = item.quantity * item.unitPrice;
                    const total = subtotal + subtotal * 0.12;
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          opacity: item.selected ? 1 : 0.5,
                          backgroundColor: item.selected ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            checked={item.selected}
                            onChange={() => toggleItem(index)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.description}</span>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                            disabled={!item.selected}
                            slotProps={{ htmlInput: { min: 0.01, max: item.maxQuantity, step: 0.01 } }}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                            disabled={!item.selected}
                            slotProps={{ htmlInput: { min: 0.01, max: item.maxUnitPrice, step: 0.01 } }}
                            sx={{ width: 110 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <span className="text-sm">{item.selected ? currencyFormat(subtotal) : '-'}</span>
                        </TableCell>
                        <TableCell align="right">
                          <span className="text-sm font-semibold">{item.selected ? currencyFormat(total) : '-'}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Custom items */}
                  {customItems.map((item, index) => (
                    <TableRow key={`custom-${index}`}>
                      <TableCell>
                        <Chip label="Nuevo" size="small" color="info" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Descripcion..."
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...customItems];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setCustomItems(updated);
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...customItems];
                            updated[index] = { ...updated[index], quantity: Number(e.target.value) };
                            setCustomItems(updated);
                          }}
                          slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const updated = [...customItems];
                            updated[index] = { ...updated[index], unitPrice: Number(e.target.value) };
                            setCustomItems(updated);
                          }}
                          slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                          sx={{ width: 110 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-sm">{currencyFormat(item.quantity * item.unitPrice)}</span>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Eliminar" arrow>
                          <IconButton size="small" color="error" onClick={() => setCustomItems(customItems.filter((_, i) => i !== index))}>
                            <Trash2 className="size-4" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3">
              <Button
                variant="outlined"
                size="small"
                startIcon={<Plus className="size-4" />}
                onClick={() => setCustomItems([...customItems, { description: '', quantity: 1, unitPrice: 0 }])}
              >
                Agregar item manual
              </Button>
            </div>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">{currencyFormat(totalSubtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-semibold">IVA (12%):</span>
                  <span className="font-semibold">{currencyFormat(totalTax)}</span>
                </div>
                <div className={`flex justify-between py-2 rounded px-2 ${exceedsOriginal ? 'bg-red-100' : 'bg-primary/10'}`}>
                  <span className="font-bold text-lg">Total Nota de Credito:</span>
                  <span className="font-bold text-lg">{currencyFormat(totalAmount)}</span>
                </div>
                {exceedsOriginal && (
                  <Alert severity="error" className="!mt-2">
                    El total de la nota de credito no puede exceder el total de la factura original ({currencyFormat(invoice.total)}).
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={createCreditNoteMutation.isPending}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={!hasItems || exceedsOriginal || createCreditNoteMutation.isPending}
              startIcon={
                createCreditNoteMutation.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Save className="size-4" />
                )
              }
              size="large"
            >
              {createCreditNoteMutation.isPending ? 'Creando...' : 'Crear Nota de Credito'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
