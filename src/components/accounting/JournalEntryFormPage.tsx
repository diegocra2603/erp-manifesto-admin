/**
 * ============================================
 * JOURNAL ENTRY FORM PAGE COMPONENT
 * ============================================
 * Formulario para crear partidas contables con lineas dinamicas
 */

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useAccountingPeriods } from '@/hooks/useAccountingPeriods';
import { useAccountCatalogs } from '@/hooks/useAccountCatalogs';
import { useCreateJournalEntry } from '@/hooks/useJournalEntries';
import type { AccountCatalog } from '@/lib/api-types';
import { currencyFormat } from '@/lib/currency';
import { AlertCircle, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
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

const lineSchema = z.object({
  accountId: z.string().min(1, 'La cuenta es requerida'),
  description: z.string().min(1, 'La descripcion es requerida'),
  debit: z.number().min(0, 'El debe no puede ser negativo'),
  credit: z.number().min(0, 'El haber no puede ser negativo'),
});

const formSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  description: z.string().min(1, 'La descripcion es requerida').max(500, 'Maximo 500 caracteres'),
  entryType: z.number().min(1, 'El tipo es requerido'),
  periodId: z.string().min(1, 'El periodo es requerido'),
  currencyId: z.string().min(1, 'La moneda es requerida'),
  exchangeRate: z.number().min(0.0001, 'El tipo de cambio debe ser mayor a 0'),
  lines: z.array(lineSchema).min(2, 'Se requieren al menos 2 lineas'),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Flatten the account catalog tree to get only accounts that accept movements
 */
function flattenAccounts(accounts: AccountCatalog[]): AccountCatalog[] {
  const result: AccountCatalog[] = [];
  function traverse(items: AccountCatalog[]) {
    for (const item of items) {
      if (item.acceptsMovements) {
        result.push(item);
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }
  traverse(accounts);
  return result;
}

export function JournalEntryFormPage() {
  const { data: currencies = [] } = useCurrencies();
  const { data: periods = [] } = useAccountingPeriods();
  const { data: accountTree = [] } = useAccountCatalogs();
  const createMutation = useCreateJournalEntry();

  const movableAccounts = flattenAccounts(accountTree);

  const today = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today,
      description: '',
      entryType: 1,
      periodId: '',
      currencyId: '',
      exchangeRate: 1,
      lines: [
        { accountId: '', description: '', debit: 0, credit: 0 },
        { accountId: '', description: '', debit: 0, credit: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const watchedLines = watch('lines');

  const totalDebit = watchedLines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = watchedLines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01;

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync({
        date: data.date,
        description: data.description,
        entryType: data.entryType,
        periodId: data.periodId,
        currencyId: data.currencyId,
        exchangeRate: data.exchangeRate,
        lines: data.lines.map((line) => ({
          accountId: line.accountId,
          description: line.description,
          debit: Number(line.debit),
          credit: Number(line.credit),
        })),
      });

      setTimeout(() => {
        window.location.href = '/admin/accounting/journal-entries';
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
            onClick={() => (window.location.href = '/admin/accounting/journal-entries')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nueva Partida Contable</h1>
            <p className="text-muted-foreground">
              Completa la informacion de la nueva partida contable
            </p>
          </div>
        </div>
      </div>

      {createMutation.isSuccess && (
        <Alert severity="success">
          Partida creada correctamente! Redirigiendo...
        </Alert>
      )}

      {createMutation.error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Error al crear la partida'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top section - Header info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion General</CardTitle>
            <CardDescription>Datos generales de la partida contable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />

              <Controller
                name="entryType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.entryType} required>
                    <InputLabel>Tipo de Partida</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Partida"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value={1}>Diario</MenuItem>
                      <MenuItem value={2}>Ajuste</MenuItem>
                      <MenuItem value={3}>Cierre</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="periodId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.periodId} required>
                    <InputLabel>Periodo Contable</InputLabel>
                    <Select {...field} label="Periodo Contable">
                      {periods.map((period) => (
                        <MenuItem key={period.id} value={period.id}>
                          {period.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    slotProps={{
                      htmlInput: { min: 0.0001, step: 0.0001 },
                    }}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripcion"
                    placeholder="Descripcion de la partida..."
                    error={!!errors.description}
                    helperText={errors?.description?.message}
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={1}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lines section */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lineas de la Partida</CardTitle>
                <CardDescription>Agrega las cuentas con sus montos de debe y haber</CardDescription>
              </div>
              <Button
                variant="outlined"
                startIcon={<Plus className="size-4" />}
                onClick={() => append({ accountId: '', description: '', debit: 0, credit: 0 })}
                size="small"
              >
                Agregar Linea
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.lines?.message && (
              <Alert severity="error" className="mb-4">
                {errors.lines.message}
              </Alert>
            )}

            <div className="overflow-x-auto">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Cuenta</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Descripcion</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '18%' }} align="right">Debe</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '18%' }} align="right">Haber</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '9%' }} align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`lines.${index}.accountId`}
                          control={control}
                          render={({ field: f }) => (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.lines?.[index]?.accountId}
                            >
                              <Select
                                {...f}
                                displayEmpty
                                renderValue={(value) => {
                                  if (!value) return <span className="text-gray-400">Seleccionar cuenta...</span>;
                                  const account = movableAccounts.find((a) => a.id === value);
                                  return account ? `${account.accountCode} - ${account.name}` : value;
                                }}
                              >
                                {movableAccounts.map((account) => (
                                  <MenuItem key={account.id} value={account.id}>
                                    {account.accountCode} - {account.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`lines.${index}.description`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              fullWidth
                              placeholder="Descripcion..."
                              error={!!errors.lines?.[index]?.description}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`lines.${index}.debit`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              type="number"
                              fullWidth
                              error={!!errors.lines?.[index]?.debit}
                              onChange={(e) => f.onChange(Number(e.target.value))}
                              slotProps={{
                                htmlInput: { min: 0, step: 0.01 },
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Controller
                          name={`lines.${index}.credit`}
                          control={control}
                          render={({ field: f }) => (
                            <TextField
                              {...f}
                              size="small"
                              type="number"
                              fullWidth
                              error={!!errors.lines?.[index]?.credit}
                              onChange={(e) => f.onChange(Number(e.target.value))}
                              slotProps={{
                                htmlInput: { min: 0, step: 0.01 },
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar linea" arrow>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => remove(index)}
                              disabled={fields.length <= 2}
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
                  <span className="font-semibold">Total Debe:</span>
                  <span className="font-semibold">{currencyFormat(totalDebit)}</span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-semibold">Total Haber:</span>
                  <span className="font-semibold">{currencyFormat(totalCredit)}</span>
                </div>
                <div
                  className={`flex justify-between py-2 rounded px-2 ${
                    isBalanced
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  <span className="font-bold">Diferencia:</span>
                  <span className="font-bold">{currencyFormat(difference)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/admin/accounting/journal-entries')}
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
              {createMutation.isPending ? 'Guardando...' : 'Crear Partida'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
