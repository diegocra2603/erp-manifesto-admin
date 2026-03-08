/**
 * ============================================
 * PHONE INPUT COMPONENT
 * ============================================
 * Reusable phone input with country code selector (flag + code),
 * display format: xxxx-xxxx, value format: +502xxxxxxxx
 *
 * Usage with react-hook-form Controller:
 *   <Controller
 *     name="phoneNumber"
 *     control={control}
 *     render={({ field, fieldState }) => (
 *       <PhoneInput
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         error={!!fieldState.error}
 *         helperText={fieldState.error?.message}
 *       />
 *     )}
 *   />
 *
 * The value stored is always the raw backend format: "+502xxxxxxxx"
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ButtonBase from '@mui/material/ButtonBase';
import { ChevronDown } from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/data/countries';

// Ordenar por dialCode más largo primero para matching correcto
const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

/**
 * Given a raw backend value like "+50212345678", parse country + local digits.
 */
function parseValue(value: string): { country: Country; digits: string } {
  if (!value) return { country: DEFAULT_COUNTRY, digits: '' };

  for (const c of SORTED_COUNTRIES) {
    if (value.startsWith(c.dialCode)) {
      const digits = value.slice(c.dialCode.length).replace(/\D/g, '');
      return { country: c, digits };
    }
  }

  // fallback: strip non-digits
  const digits = value.replace(/\D/g, '');
  return { country: DEFAULT_COUNTRY, digits };
}

/**
 * Format digits with the country mask.
 * "12345678" → "1234-5678"
 */
function formatDisplay(digits: string, country: Country): string {
  const { format } = country;
  let result = '';
  let digitIdx = 0;

  for (let i = 0; i < format.length && digitIdx < digits.length; i++) {
    if (format[i] === 'x') {
      result += digits[digitIdx];
      digitIdx++;
    } else {
      result += format[i];
    }
  }

  return result;
}

/**
 * Build backend value: "+502" + raw digits
 */
function toBackendValue(digits: string, country: Country): string {
  if (!digits) return '';
  return `${country.dialCode}${digits}`;
}

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export function PhoneInput({
  value = '',
  onChange,
  onBlur,
  error,
  helperText,
  label = 'Teléfono',
  required,
  disabled,
  fullWidth = true,
  placeholder,
}: PhoneInputProps) {
  const parsed = parseValue(value);
  const [selectedCountry, setSelectedCountry] = useState<Country>(parsed.country);
  const [displayValue, setDisplayValue] = useState(() => formatDisplay(parsed.digits, parsed.country));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from external value changes (e.g. form reset, edit mode load)
  // Also normalize the value to always include the country dial code
  useEffect(() => {
    const { country, digits } = parseValue(value);
    setSelectedCountry(country);
    setDisplayValue(formatDisplay(digits, country));

    // If the value has digits but is missing the dial code prefix, normalize it
    if (digits && value && !COUNTRIES.some((c) => value.startsWith(c.dialCode))) {
      onChange?.(toBackendValue(digits, country));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const emitChange = useCallback(
    (digits: string, country: Country) => {
      onChange?.(toBackendValue(digits, country));
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const clamped = raw.slice(0, selectedCountry.maxDigits);
    const formatted = formatDisplay(clamped, selectedCountry);
    setDisplayValue(formatted);
    emitChange(clamped, selectedCountry);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setAnchorEl(null);

    // Re-clamp digits to new country's max
    const currentDigits = displayValue.replace(/\D/g, '').slice(0, country.maxDigits);
    const formatted = formatDisplay(currentDigits, country);
    setDisplayValue(formatted);
    emitChange(currentDigits, country);

    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key)) return;

    // Allow Ctrl/Cmd + A, C, V, X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

    // Block non-digit keys
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const open = Boolean(anchorEl);

  const dynamicPlaceholder = placeholder || formatDisplay('0'.repeat(selectedCountry.maxDigits), selectedCountry);

  return (
    <>
      <TextField
        inputRef={inputRef}
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        label={label}
        placeholder={dynamicPlaceholder}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <ButtonBase
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  disabled={disabled}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    borderRadius: 1,
                    px: 0.75,
                    py: 0.25,
                    mr: 0.5,
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: '1.25rem', 
                      lineHeight: 1,
                      display: 'inline-block',
                      minWidth: '1.5rem',
                      textAlign: 'center'
                    }}
                  >
                    <img src={selectedCountry.flag} alt={selectedCountry.name} className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground" style={{ color: 'var(--color-foreground)' }}>{selectedCountry.dialCode}</span>
                  <ChevronDown className="size-3 text-muted-foreground" style={{ color: 'var(--color-muted-foreground)' }} />
                </ButtonBase>
              </InputAdornment>
            ),
          },
          htmlInput: {
            inputMode: 'tel' as const,
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: { 
            sx: { 
              minWidth: 220, 
              mt: 0.5,
              bgcolor: 'background.paper',
              color: 'text.primary',
            } 
          },
        }}
      >
        <List dense disablePadding>
          {COUNTRIES.map((country) => (
            <ListItemButton
              key={country.code}
              selected={country.code === selectedCountry.code}
              onClick={() => handleCountrySelect(country)}
              sx={{ 
                px: 2, 
                py: 1,
                color: 'text.primary',
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                },
              }}
            >
              <span 
                style={{ 
                  fontSize: '1.25rem', 
                  lineHeight: 1,
                  display: 'inline-block',
                  minWidth: '1.5rem',
                  textAlign: 'center',
                  marginRight: '0.75rem'
                }}
              >
                <img src={country.flag} alt={country.name} className="size-4" />
              </span>
              <ListItemText
                primary={country.name}
                secondary={country.dialCode}
                primaryTypographyProps={{ 
                  fontSize: 14, 
                  fontWeight: 500,
                  color: 'text.primary',
                }}
                secondaryTypographyProps={{ 
                  fontSize: 13,
                  color: 'text.secondary',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
