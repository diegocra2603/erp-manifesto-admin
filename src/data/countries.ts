export interface Country {
  code: string;
  enumValue: string;
  dialCode: string;
  flag: string;
  name: string;
  format: string;
  maxDigits: number;
  showInHeader: boolean;
}

export const COUNTRIES: Country[] = [
  { code: 'GT',  enumValue: 'GT',  dialCode: '+502', flag: '/assets/flags/gt.svg', name: 'Guatemala',      format: 'xxxx-xxxx',       maxDigits: 8,  showInHeader: true },
  { code: 'SV',  enumValue: 'SV',  dialCode: '+503', flag: '/assets/flags/sv.svg', name: 'El Salvador',    format: 'xxxx-xxxx',       maxDigits: 8,  showInHeader: true },
  { code: 'US',  enumValue: 'USA', dialCode: '+1',   flag: '/assets/flags/us.svg', name: 'Estados Unidos', format: '(xxx) xxx-xxxx', maxDigits: 10, showInHeader: true },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
