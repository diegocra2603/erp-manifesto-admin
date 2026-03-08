/**
 * ============================================
 * CURRENCY HELPERS
 * ============================================
 * Formato de números según tipo de moneda (por defecto QTZ/GTQ)
 */

export enum CurrencyType {
  USD = 'USD',
  QTZ = 'QTZ',
}

const CURRENCY_CONFIG: Record<
  CurrencyType,
  { locale: string; currency: string }
> = {
  [CurrencyType.USD]: {
    locale: 'en-US',
    currency: 'USD',
  },
  [CurrencyType.QTZ]: {
    locale: 'es-GT',
    currency: 'GTQ',
  },
};

/**
 * Formatea un número como moneda según el tipo indicado.
 * Por defecto usa QTZ (Quetzal guatemalteco, es-GT).
 */
export function currencyFormat(
  value: number,
  currencyType: CurrencyType = CurrencyType.QTZ
): string {
  const config = CURRENCY_CONFIG[currencyType];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Devuelve el símbolo de la moneda para usar como prefijo en inputs.
 * Por defecto QTZ (Quetzal: "Q").
 */
export function getCurrencySymbol(
  currencyType: CurrencyType = CurrencyType.QTZ
): string {
  const config = CURRENCY_CONFIG[currencyType];
  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const parts = formatter.formatToParts(0);
  const symbol = parts.find((p) => p.type === 'currency');
  return symbol?.value ?? (currencyType === CurrencyType.QTZ ? 'Q' : '$');
}
