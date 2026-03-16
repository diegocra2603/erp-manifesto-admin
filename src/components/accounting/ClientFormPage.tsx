/**
 * ============================================
 * CLIENT FORM PAGE COMPONENT
 * ============================================
 * Formulario para crear y editar clientes
 */

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { useValidateFiscalData } from '@/hooks/useFiscalData';
import { AlertCircle, ArrowLeft, Save, BadgeCheck, FileText, Search, MapPin, Phone, Mail } from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import { Card, CardContent } from '@/components/ui/Card';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(500, 'Máximo 500 caracteres'),
  legalName: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  nit: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
  address: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  phone: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface ClientFormPageProps {
  clientId?: string;
}

export function ClientFormPage({ clientId }: ClientFormPageProps) {
  const isEditMode = !!clientId;

  const { data: client, isLoading: isLoadingClient } = useClient(clientId);
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const validateNitMutation = useValidateFiscalData();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      legalName: '',
      nit: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        legalName: client.legalName ?? '',
        nit: client.nit ?? '',
        address: client.address ?? '',
        phone: client.phone ?? '',
        email: client.email ?? '',
      });
    }
  }, [client, reset]);

  const handleValidateNit = async () => {
    const nit = getValues('nit');
    if (!nit) return;
    try {
      const result = await validateNitMutation.mutateAsync(nit);
      if (result?.fiscalName) {
        setValue('legalName', result.fiscalName, { shouldValidate: true });
      }
    } catch {
      // Error handled by mutation state
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        legalName: data.legalName || undefined,
        nit: data.nit || undefined,
        address: data.address || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
      };

      if (isEditMode && clientId) {
        await updateMutation.mutateAsync({
          id: clientId,
          data: {
            id: clientId,
            ...payload,
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setTimeout(() => {
        window.location.href = '/admin/accounting/clients';
      }, 500);
    } catch {
      // Error handled by mutation state
    }
  };

  const error = createMutation.error || updateMutation.error;
  const success = createMutation.isSuccess || updateMutation.isSuccess;
  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoadingClient && isEditMode) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft className="size-4" />}
            onClick={() => (window.location.href = '/admin/accounting/clients')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Modifica la información del cliente'
                : 'Completa la información del nuevo cliente'}
            </p>
          </div>
        </div>
      </div>

      {success && (
        <Alert severity="success">
          ¡Cliente {isEditMode ? 'actualizado' : 'creado'} correctamente! Redirigiendo...
        </Alert>
      )}

      {error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {error instanceof Error ? error.message : 'Error al guardar el cliente'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6">
            {/* Información del Cliente */}
            <div className="mb-8">
              <h3 className="mb-1 text-base font-semibold text-foreground">Información del Cliente</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Datos básicos del cliente
              </p>
              <div className="grid gap-5 sm:grid-cols-1">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      placeholder="Nombre del cliente"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      variant="outlined"
                      required
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeCheck className="size-4 text-muted-foreground" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="legalName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre Legal"
                      placeholder="Nombre legal / fiscal del cliente"
                      error={!!errors.legalName}
                      helperText={errors?.legalName?.message}
                      variant="outlined"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <FileText className="size-4 text-muted-foreground" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Datos Fiscales */}
            <div className="mb-8">
              <h3 className="mb-1 text-base font-semibold text-foreground">Datos Fiscales</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Información fiscal del cliente (opcional)
              </p>
              <div className="grid gap-5 sm:grid-cols-1">
                <div className="flex gap-2 items-start">
                  <Controller
                    name="nit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="NIT"
                        placeholder="Ej: 1234567-8"
                        error={!!errors.nit}
                        helperText={errors?.nit?.message}
                        variant="outlined"
                        fullWidth
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search className="size-4 text-muted-foreground" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />
                  <Tooltip title="Validar NIT en SAT" arrow>
                    <Button
                      variant="outlined"
                      onClick={handleValidateNit}
                      disabled={validateNitMutation.isPending}
                      sx={{ minWidth: 'auto', px: 2, mt: '1px', height: 56 }}
                      size="large"
                    >
                      {validateNitMutation.isPending ? (
                        <CircularProgress size={20} />
                      ) : (
                        'Validar NIT'
                      )}
                    </Button>
                  </Tooltip>
                </div>

                {validateNitMutation.isSuccess && validateNitMutation.data && (
                  <Alert severity="success">
                    NIT válido: {validateNitMutation.data.fiscalName}
                  </Alert>
                )}

                {validateNitMutation.error && (
                  <Alert severity="warning">
                    {validateNitMutation.error instanceof Error
                      ? validateNitMutation.error.message
                      : 'No se pudo validar el NIT'}
                  </Alert>
                )}
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="mb-1 text-base font-semibold text-foreground">Información de Contacto</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Datos de contacto del cliente
              </p>
              <div className="grid gap-5 sm:grid-cols-1">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dirección"
                      placeholder="Dirección del cliente"
                      error={!!errors.address}
                      helperText={errors?.address?.message}
                      variant="outlined"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapPin className="size-4 text-muted-foreground" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Teléfono"
                      placeholder="Ej: 5555-1234"
                      error={!!errors.phone}
                      helperText={errors?.phone?.message}
                      variant="outlined"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone className="size-4 text-muted-foreground" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      placeholder="cliente@ejemplo.com"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant="outlined"
                      fullWidth
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail className="size-4 text-muted-foreground" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/admin/accounting/clients')}
              disabled={isSubmitting || isPending}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : <Save className="size-4" />}
              size="large"
            >
              {isPending ? 'Guardando...' : isEditMode ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
