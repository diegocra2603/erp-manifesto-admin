/**
 * ============================================
 * LOGIN FORM COMPONENT
 * ============================================
 * Login form with React Hook Form, Zod validation and Material UI (Fuse pattern)
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { appConfig } from '@/config';
import { AlertCircle } from 'lucide-react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    const result = await login(data.email, data.password);

    if (result.success) {
      // Redirect to dashboard
      window.location.href = appConfig.routes.private.dashboard;
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form
      name="loginForm"
      noValidate
      className="flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" icon={<AlertCircle className="size-5" />} className="mb-8">
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-8"
            label="Correo Electrónico"
            autoFocus
            type="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
            required
            fullWidth
            autoComplete="email"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Password Field */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-8"
            label="Contraseña"
            type="password"
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
            autoComplete="current-password"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        className="mt-8 w-full"
        aria-label="Iniciar sesión"
        disabled={isSubmitting}
        type="submit"
        size="large"
        sx={{ mt: 2, py: 1.5 }}
      >
        Iniciar Sesión
      </Button>
    </form>
  );
}
