/**
 * ============================================
 * JOB POSITION FORM PAGE COMPONENT
 * ============================================
 * Formulario para crear y editar puestos de trabajo
 */

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useJobPosition, useCreateJobPosition, useUpdateJobPosition } from '@/hooks/useJobPositions';
import {
  AlertCircle,
  ArrowLeft,
  Save,
  BadgeCheck,
  FileText,
  DollarSign,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { Card, CardContent } from '@/components/ui/Card';
import { getCurrencySymbol } from '@/lib/currency';

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
  hourlyCost: z.coerce.number().min(0, 'El costo por hora debe ser mayor o igual a 0'),
});

type FormData = z.infer<typeof formSchema>;

interface JobPositionFormPageProps {
  jobPositionId?: string;
}

export function JobPositionFormPage({ jobPositionId }: JobPositionFormPageProps) {
  const isEditMode = !!jobPositionId;

  const { data: jobPosition, isLoading: isLoadingJobPosition } = useJobPosition(jobPositionId);
  const createMutation = useCreateJobPosition();
  const updateMutation = useUpdateJobPosition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      hourlyCost: 0,
    },
  });

  useEffect(() => {
    if (jobPosition) {
      reset({
        name: jobPosition.name,
        description: jobPosition.description,
        hourlyCost: jobPosition.hourlyCost,
      });
    }
  }, [jobPosition, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && jobPositionId) {
        await updateMutation.mutateAsync({
          id: jobPositionId,
          data: {
            id: jobPositionId,
            name: data.name,
            description: data.description,
            hourlyCost: data.hourlyCost,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          hourlyCost: data.hourlyCost,
        });
      }

      setTimeout(() => {
        window.location.href = '/admin/job-positions';
      }, 500);
    } catch {
      // Error handled by mutation state
    }
  };

  const error = createMutation.error || updateMutation.error;
  const success = createMutation.isSuccess || updateMutation.isSuccess;
  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoadingJobPosition && isEditMode) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <CircularProgress />
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
            onClick={() => (window.location.href = '/admin/job-positions')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Editar Puesto de Trabajo' : 'Nuevo Puesto de Trabajo'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Modifica la información del puesto de trabajo'
                : 'Completa la información del nuevo puesto de trabajo'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <Alert severity="success">
          ¡Puesto de trabajo {isEditMode ? 'actualizado' : 'creado'} correctamente! Redirigiendo...
        </Alert>
      )}

      {error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {error instanceof Error ? error.message : 'Error al guardar el puesto de trabajo'}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-8">
              <h3 className="mb-1 text-base font-semibold text-foreground">Información del Puesto</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Datos básicos del puesto de trabajo
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      placeholder="Ej: Cocinero"
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
                  name="hourlyCost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Costo por Hora"
                      placeholder="0.00"
                      error={!!errors.hourlyCost}
                      helperText={errors?.hourlyCost?.message}
                      variant="outlined"
                      required
                      fullWidth
                      type="number"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              {getCurrencySymbol()}
                            </InputAdornment>
                          ),
                        },
                        htmlInput: {
                          min: 0,
                          step: 0.01,
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    placeholder="Describe las responsabilidades del puesto..."
                    error={!!errors.description}
                    helperText={errors?.description?.message}
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <FileText className="size-4 text-muted-foreground" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </div>
          </CardContent>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/admin/job-positions')}
              disabled={isSubmitting || isPending}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={16} />
                ) : (
                  <Save className="size-4" />
                )
              }
              size="large"
            >
              {isPending
                ? 'Guardando...'
                : isEditMode
                  ? 'Actualizar Puesto'
                  : 'Crear Puesto'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
