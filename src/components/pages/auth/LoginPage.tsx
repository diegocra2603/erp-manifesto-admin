/**
 * ============================================
 * LOGIN PAGE WRAPPER
 * ============================================
 * Wrapper component that provides contexts to LoginForm (Fuse pattern)
 */

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoginForm } from '@/components/auth/LoginForm';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

/**
 * Contenido del login; debe vivir dentro de ThemeProvider para que useTheme()
 * reciba el tema correcto (dark/light) inyectado por el contexto.
 */
function LoginPageContent() {
  const theme = useTheme();
  const logoSrc =
    theme.palette.mode === 'dark'
      ? '/assets/logo/logo-manifesto-blanco.svg'
      : '/assets/logo/logo-manifesto-negro.svg';

  return (
    <Box
      className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8"
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Paper
        className="w-full max-w-md p-8 sm:p-12"
        sx={{
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <Box className="mb-8 flex flex-col items-center">
          <Box
            component="img"
            src={logoSrc}
            alt="Manifesto Logo"
            className="size-48 min-h-48 min-w-48 shrink-0 object-contain"
            
          />
          <Typography
            variant="h4"
            component="h1"
            className="text-center font-bold"
            sx={{ color: 'text.primary' }}
          >
            Iniciar sesión
          </Typography>
          <Typography
            variant="body2"
            className="mt-2 text-center"
            sx={{ color: 'text.secondary' }}
          >
            Ingresa tus credenciales para continuar
          </Typography>
        </Box>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <Typography
          variant="caption"
          className="mt-12 block text-center"
          sx={{ color: 'text.secondary', mt: 6 }}
        >
          &copy; {new Date().getFullYear()} Manifesto. Todos los derechos reservados.
        </Typography>
      </Paper>
    </Box>
  );
}

export function LoginPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginPageContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
