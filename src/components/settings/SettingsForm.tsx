/**
 * ============================================
 * SETTINGS FORM COMPONENT
 * ============================================
 * Formulario de configuración del sistema con edición inline
 */

import { useState } from 'react';
import type { SystemSetting } from '@/lib/api-types';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { AlertCircle, Save, Edit, X } from 'lucide-react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const SETTING_LABELS: Record<string, string> = {
  Country: 'País',
  Currency: 'Moneda',
  CurrencySymbol: 'Símbolo de Moneda',
  ExchangeRateUSD: 'Tasa de Cambio USD',
  TaxPercentage: 'Porcentaje de Impuesto (IVA)',
  IsISRWithholder: 'Es Retenedor de ISR',
  IsQuarterlyISRAgent: 'Es Agente Trimestral de ISR',
  Timezone: 'Zona Horaria',
};

function getSettingLabel(key: string): string {
  return SETTING_LABELS[key] ?? key;
}

export function SettingsForm() {
  const { data: settings = [], isLoading, error, refetch } = useSystemSettings();
  const updateMutation = useUpdateSystemSetting();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEditClick = (setting: SystemSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value);
    setSuccessMessage('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSave = async (setting: SystemSetting) => {
    try {
      await updateMutation.mutateAsync({
        id: setting.id,
        data: { id: setting.id, value: editValue },
      });
      setEditingId(null);
      setEditValue('');
      setSuccessMessage(`"${getSettingLabel(setting.key)}" actualizado correctamente.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Error handled by mutation state
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Administra los parámetros generales del sistema
        </p>
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
          {error instanceof Error ? error.message : 'Error al cargar la configuración'}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      {updateMutation.error && (
        <Alert severity="error">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Error al actualizar la configuración'}
        </Alert>
      )}

      {!error && (
        <Card>
          <CardHeader>
            <CardTitle>Parámetros Generales</CardTitle>
            <CardDescription>
              Configuraciones del sistema que afectan el comportamiento general de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {settings.map((setting) => {
                const isEditing = editingId === setting.id;

                return (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {getSettingLabel(setting.key)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {setting.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isEditing ? (
                        <>
                          <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ width: 200 }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(setting);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <Tooltip title="Guardar" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleSave(setting)}
                              disabled={updateMutation.isPending}
                            >
                              <Save className="size-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar" arrow>
                            <IconButton
                              size="small"
                              onClick={handleCancelEdit}
                            >
                              <X className="size-4" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-mono bg-muted px-3 py-1.5 rounded-md text-foreground">
                            {setting.value}
                          </span>
                          <Tooltip title="Editar" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(setting)}
                            >
                              <Edit className="size-4" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {settings.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No hay configuraciones disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
