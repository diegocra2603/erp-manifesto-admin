/**
 * ============================================
 * USER FORM PAGE COMPONENT
 * ============================================
 * Formulario para crear y editar usuarios (JSON)
 * Diseño con tabs: Información General | Acceso y Seguridad
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useCreateUser, useCreateUserWithPassword, useUpdateUser } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import {
  AlertCircle,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  UserCog,
  ShieldCheck,
  Mail,
  BadgeCheck,
  Hash,
  Store,
  Key,
} from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PhoneInput } from '@/components/ui/PhoneInput';

const baseSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  code: z.string().min(1, 'El código es requerido').max(50, 'Máximo 50 caracteres'),
  phoneNumber: z.string().min(1, 'El teléfono es requerido').max(20, 'Máximo 20 caracteres'),
  roleId: z.string().min(1, 'El rol es requerido'),
  storeId: z.string().optional(),
  neoNetToken: z.string().optional(),
});

const createWithPasswordSchema = baseSchema
  .merge(
    z.object({
      password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: z.string().min(1, 'Confirma la contraseña'),
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type BaseFormData = z.infer<typeof baseSchema>;

interface PasswordFields {
  password: string;
  confirmPassword: string;
}

interface UserFormPageProps {
  userId?: string;
}

export function UserFormPage({ userId }: UserFormPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [assignPassword, setAssignPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditMode = !!userId;

  const { data: user, isLoading: isLoadingUser } = useUser(userId);
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const createMutation = useCreateUser();
  const createWithPasswordMutation = useCreateUserWithPassword();
  const updateMutation = useUpdateUser();

  const currentSchema = !isEditMode && assignPassword ? createWithPasswordSchema : baseSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BaseFormData & Partial<PasswordFields>>({
    mode: 'onChange',
    resolver: zodResolver(currentSchema as any),
    defaultValues: {
      email: '',
      name: '',
      code: '',
      phoneNumber: '',
      roleId: '',
      storeId: '',
      neoNetToken: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: user.name,
        code: user.code,
        phoneNumber: user.phoneNumber,
        roleId: user.role?.id ?? '',
        storeId: user.storeId || '',
        neoNetToken: user.neoNetToken || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: BaseFormData & Partial<PasswordFields>) => {
    try {
      const storeId = data.storeId || undefined;
      const neoNetToken = data.neoNetToken || undefined;

      if (isEditMode && userId) {
        await updateMutation.mutateAsync({
          id: userId,
          data: {
            email: data.email,
            name: data.name,
            code: data.code,
            phoneNumber: data.phoneNumber,
            roleId: data.roleId,
            storeId,
            neoNetToken,
          },
        });
      } else if (assignPassword && data.password && data.confirmPassword) {
        await createWithPasswordMutation.mutateAsync({
          email: data.email,
          name: data.name,
          code: data.code,
          phoneNumber: data.phoneNumber,
          roleId: data.roleId,
          password: data.password,
          confirmPassword: data.confirmPassword,
          storeId,
          neoNetToken,
        });
      } else {
        await createMutation.mutateAsync({
          email: data.email,
          name: data.name,
          code: data.code,
          phoneNumber: data.phoneNumber,
          roleId: data.roleId,
          storeId,
          neoNetToken,
        });
      }

      setTimeout(() => {
        window.location.href = '/admin/users';
      }, 500);
    } catch {
      // Error handled by mutation state
    }
  };

  const error = createMutation.error || createWithPasswordMutation.error || updateMutation.error;
  const success =
    createMutation.isSuccess || createWithPasswordMutation.isSuccess || updateMutation.isSuccess;
  const isPending =
    createMutation.isPending || createWithPasswordMutation.isPending || updateMutation.isPending;

  const hasPasswordErrors = !!(errors.password || errors.confirmPassword);

  if (isLoadingUser && isEditMode) {
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
            onClick={() => (window.location.href = '/admin/users')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Modifica la información del usuario'
                : 'Completa la información del nuevo usuario'}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <Alert severity="success">
          ¡Usuario {isEditMode ? 'actualizado' : 'creado'} correctamente! Redirigiendo...
        </Alert>
      )}

      {error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />}>
          {error instanceof Error ? error.message : 'Error al guardar el usuario'}
        </Alert>
      )}

      {/* Form with Tabs */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ px: 2 }}
            >
              <Tab
                icon={<UserCog className="size-4" />}
                iconPosition="start"
                label="Información General"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              />
              {!isEditMode && (
                <Tab
                  icon={<ShieldCheck className="size-4" />}
                  iconPosition="start"
                  label={
                    <span className="flex items-center gap-2">
                      Acceso y Seguridad
                      {hasPasswordErrors && (
                        <span className="size-2 rounded-full bg-red-500" />
                      )}
                    </span>
                  }
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                />
              )}
            </Tabs>
          </Box>

          {/* Tab 1: Información General */}
          <div role="tabpanel" hidden={activeTab !== 0}>
            {activeTab === 0 && (
              <CardContent className="pt-6">
                {/* Datos Personales */}
                <div className="mb-8">
                  <h3 className="mb-1 text-base font-semibold text-foreground">Datos Personales</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Información básica de identificación del usuario
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nombre completo"
                          placeholder="Ej: Juan Pérez"
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
                      name="code"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Código"
                          placeholder="Ej: USR001"
                          error={!!errors.code}
                          helperText={errors?.code?.message}
                          variant="outlined"
                          required
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Hash className="size-4 text-muted-foreground" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Contacto */}
                <div className="mb-8">
                  <h3 className="mb-1 text-base font-semibold text-foreground">Contacto</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Información de contacto del usuario
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          placeholder="usuario@ejemplo.com"
                          error={!!errors.email}
                          helperText={errors?.email?.message}
                          variant="outlined"
                          required
                          fullWidth
                          type="email"
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

                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={!!errors.phoneNumber}
                          helperText={errors?.phoneNumber?.message}
                          required
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Rol */}
                <div className="mb-8">
                  <h3 className="mb-1 text-base font-semibold text-foreground">Rol del Sistema</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Define los permisos y accesos del usuario
                  </p>
                  <div className="max-w-sm">
                    <Controller
                      name="roleId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Rol"
                          error={!!errors.roleId}
                          helperText={errors?.roleId?.message}
                          variant="outlined"
                          required
                          fullWidth
                          select
                          disabled={isLoadingRoles}
                        >
                          {isLoadingRoles ? (
                            <MenuItem value="" disabled>
                              Cargando roles...
                            </MenuItem>
                          ) : (
                            roles.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                {role.name}
                              </MenuItem>
                            ))
                          )}
                        </TextField>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </div>

          {/* Tab 2: Acceso y Seguridad (solo en modo crear) */}
          {!isEditMode && (
            <div role="tabpanel" hidden={activeTab !== 1}>
              {activeTab === 1 && (
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h3 className="mb-1 text-base font-semibold text-foreground">Contraseña</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Elige si deseas asignar una contraseña manualmente o enviarla por correo
                    </p>

                    <Card className="border-dashed bg-muted/30 p-5">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={assignPassword}
                            onChange={(e) => setAssignPassword(e.target.checked)}
                          />
                        }
                        label={
                          <div>
                            <span className="font-medium">Asignar contraseña manualmente</span>
                            <p className="text-sm text-muted-foreground">
                              {assignPassword
                                ? 'Define una contraseña para que el usuario ingrese directamente'
                                : 'Se enviará un correo al usuario para que establezca su contraseña'}
                            </p>
                          </div>
                        }
                        sx={{ alignItems: 'flex-start', ml: 0, '& .MuiSwitch-root': { mt: 0.5 } }}
                      />
                    </Card>
                  </div>

                  {assignPassword && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Contraseña"
                            placeholder="Mínimo 6 caracteres"
                            error={!!errors.password}
                            helperText={errors?.password?.message}
                            variant="outlined"
                            required
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                      size="small"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="size-4" />
                                      ) : (
                                        <Eye className="size-4" />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        )}
                      />

                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Confirmar contraseña"
                            placeholder="Repite la contraseña"
                            error={!!errors.confirmPassword}
                            helperText={errors?.confirmPassword?.message}
                            variant="outlined"
                            required
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      edge="end"
                                      size="small"
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="size-4" />
                                      ) : (
                                        <Eye className="size-4" />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              )}
            </div>
          )}

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/admin/users')}
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
                  ? 'Actualizar Usuario'
                  : 'Crear Usuario'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
