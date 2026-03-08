/**
 * ============================================
 * PHONE HELPERS
 * ============================================
 * Formato y parseo de números de teléfono con código de país
 */

import { COUNTRIES } from '@/data/countries';

// Ordenar por dialCode más largo primero para evitar que "+1" haga match antes que "+502"/"+503"
const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);

/**
 * Formatea un número de teléfono para mostrar.
 *
 * Entrada: "+50212345678" o "12345678"
 * Salida:  "<flag> +502 1234-5678"
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) return '—';

  for (const country of SORTED_COUNTRIES) {
    if (value.startsWith(country.dialCode)) {
      const digits = value.slice(country.dialCode.length).replace(/\D/g, '');
      const formatted = applyMask(digits, country.format);
      return `<span style="display: inline-block; vertical-align: center; margin-right: 0.5rem;"><img src="${country.flag}" alt="${country.name}" className="size-4" /></span> ${country.dialCode} ${formatted}`;
    }
  }

  // Sin código de país reconocido, devolver tal cual
  return value;
}

/**
 * Versión corta sin bandera: "+502 1234-5678"
 */
export function formatPhoneShort(value: string | null | undefined): string {
  if (!value) return '—';

  for (const country of SORTED_COUNTRIES) {
    if (value.startsWith(country.dialCode)) {
      const digits = value.slice(country.dialCode.length).replace(/\D/g, '');
      const formatted = applyMask(digits, country.format);
      return `${country.dialCode} ${formatted}`;
    }
  }

  return value;
}

function applyMask(digits: string, mask: string): string {
  let result = '';
  let digitIdx = 0;

  for (let i = 0; i < mask.length && digitIdx < digits.length; i++) {
    if (mask[i] === 'x') {
      result += digits[digitIdx];
      digitIdx++;
    } else {
      result += mask[i];
    }
  }

  return result;
}
