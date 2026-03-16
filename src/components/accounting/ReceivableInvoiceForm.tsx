/**
 * ============================================
 * RECEIVABLE INVOICE FORM COMPONENT
 * ============================================
 * Formulario para crear facturas por cobrar
 */

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClients } from '@/hooks/useClients';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useCreateReceivableInvoice } from '@/hooks/useInvoices';
import { useValidateFiscalData } from '@/hooks/useFiscalData';
import { currencyFormat } from '@/lib/currency';
import { AlertCircle, ArrowLeft, Save, Plus, Trash2, Search } from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const itemSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0.01, 'El precio debe ser mayor a 0'),
});

const formSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  dueDate: z.string().optional().or(z.literal('')),
  clientId: z.string().min(1, 'El cliente es requerido'),
  currencyId: z.string().min(1, 'La moneda es requerida'),
  exchangeRate: z.number().min(0.0001, 'El tipo de cambio debe ser mayor a 0'),
  notes: z.string().optional().or(z.literal('')),
  items: z.array(itemSchema).min(1, 'Se requiere al menos 1 línea'),
});

type FormData = z.infer<typeof formSchema>;

export function ReceivableInvoiceForm() {
  const { data: clients = [] } = useClients();
  const { data: currencies = [] } = useCurrencies();
  const createMutation = useCreateReceivableInvoice();
  const validateNitMutation = useValidateFiscalData();

  const today = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today,
      dueDate: '',
      clientId: '',
      currencyId: '',
      exchangeRate: 1,
      notes: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedClientId = watch('clientId');

  const selectedClient = clients.find((c) => c.id === watchedClientId);

  // Calculate totals
  const lineCalculations = watchedItems.map((item) => {
    const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    const taxAmount = subtotal * 0.12;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  });

  const totalSubtotal = lineCalculations.reduce((sum, l) => sum + l.subtotal, 0);
  const totalTax = lineCalculations.reduce((sum, l) => sum + l.taxAmount, 0);
  const totalAmount = lineCalculations.reduce((sum, l) => sum + l.total, 0);

  const handleValidateNit = async () => {
    if (!selectedClient?.nit) return;
    try {
      await validateNitMutation.mutateAsync(selectedClient.nit);
    } catch {
      // Error handled by mutation state
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync({
        date: data.date,
        dueDate: data.dueDate || undefined,
        clientId: data.clientId,
        currencyId: data.currencyId,
        exchangeRate: data.exchangeRate,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });

      setTimeout(() => {
        window.location.href = '/admin/accounting/receivable';
      }, 500);
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
            onClick={() => (window.location.href = '/admin/accounting/receivable')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nueva Factura por Cobrar</h1>
            <p className="text-muted-foreground">
              Completa la información de la nueva factura
            </p>
          </div>
        </div>
      </div>

      {createMutation.isSuccess && (
        <Alert severity="success">
          Factura creada correctamente! Redirigiendo...
        </Alert>
      )}

      {createMutation.error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Error al crear la factura'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos del cliente y la factura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.clientId} required>
                      <InputLabel>Cliente</InputLabel>
                      <Select
                        {...field}
                        label="Cliente"
                        onChange={(e) => {
                          field.onChange(e);
                          validateNitMutation.reset();
                        }}
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.nit} - {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>

              {selectedClient && (
                <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3 p-3 rounded-md bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm"><strong>NIT:</strong> {selectedClient.nit}</p>
                    <p className="text-sm"><strong>Nombre:</strong> {selectedClient.name}</p>
                    {selectedClient.address && (
                      <p className="text-sm"><strong>Dirección:</strong> {selectedClient.address}</p>
                    )}
                  </div>
                  <Tooltip title="Validar NIT en SAT" arrow>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleValidateNit}
                      disabled={validateNitMutation.isPending}
                      startIcon={
                        validateNitMutation.isPending ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Search className="size-4" />
                        )
                      }
                    >
                      Validar NIT
                    </Button>
                  </Tooltip>
                </div>
              )}

              {validateNitMutation.isSuccess && validateNitMutation.data && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <Alert severity="success">
                    NIT válido: {validateNitMutation.data.fiscalName}
                  </Alert>
                </div>
              )}

              {validateNitMutation.error && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <Alert severity="warning">
                    {validateNitMutation.error instanceof Error
                      ? validateNitMutation.error.message
                      : 'No se pudo validar el NIT'}
                  </Alert>
                </div>
              )}

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha"
                    type="date"
                    error={!!errors.date}
                    helperText={errors?.date?.message}
                    variant="outlined"
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />

              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de Vencimiento"
                    type="date"
                    error={!!errors.dueDate}
                    helperText={errors?.dueDate?.message}
                    variant="outlined"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />

              <Controller
                name="currencyId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.currencyId} required>
                    <InputLabel>Moneda</InputLabel>
                    <Select {...field} label="Moneda">
                      {currencies.map((currency) => (
                        <MenuItem key={currency.id} value={currency.id}>
                          {currency.code} - {currency.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="exchangeRate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo de Cambio"
                    type="number"
                    error={!!errors.exchangeRate}
                    helperText={errors?.exchangeRate?.message}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    slotProps={{ htmlInput: { min: 0.0001, step: 0.0001 } }}
                  />
                )}
              />

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas"
                    placeholder="Notas adicionales..."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={1}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detalle de la Factura</CardTitle>
                <CardDescription>Agrega los productos o servicios</CardDescription>
              </div>
              <Button
                variant="outlined"
                startIcon={<Plus className="size-4" />}
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                size="small"
              >
                Agregar Línea
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.items?.message && (
              <Alert severity="error" className="mb-4">
                {errors.items.message}
              </Alert>
            )}

            <div className="overflow-x-auto">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '12%' }} align="right">Cantidad</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">Precio Unit.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '13%' }} align="right">Subtotal</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '13%' }} align="right">IVA (12%)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '13%' }} align="right">Total</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '5%' }} align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`items.${index}.description`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              fullWidth
                              placeholder="Descripción..."
                              error={!!errors.items?.[index]?.description}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              type="number"
                              fullWidth
                              error={!!errors.items?.[index]?.quantity}
                              onChange={(e) => f.onChange(Number(e.target.value))}
                              slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`items.${index}.unitPrice`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              type="number"
                              fullWidth
                              error={!!errors.items?.[index]?.unitPrice}
                              onChange={(e) => f.onChange(Number(e.target.value))}
                              slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-sm">{currencyFormat(lineCalculations[index]?.subtotal ?? 0)}</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-sm">{currencyFormat(lineCalculations[index]?.taxAmount ?? 0)}</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-sm font-semibold">{currencyFormat(lineCalculations[index]?.total ?? 0)}</span>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar línea" arrow>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => remove(index)}
                              disabled={fields.length <= 1}
                            >
                              <Trash2 className="size-4" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <div className="flex justify-between py-2 rounded px-2 bg-primary/10">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg">{currencyFormat(totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/admin/accounting/receivable')}
              disabled={isSubmitting || createMutation.isPending}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || createMutation.isPending}
              startIcon={
                createMutation.isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Save className="size-4" />
                )
              }
              size="large"
            >
              {createMutation.isPending ? 'Guardando...' : 'Crear Factura'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
