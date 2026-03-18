// Currency
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isFunctional: boolean;
  decimalPlaces: number;
}

export interface CurrencyCreateRequest {
  code: string;
  name: string;
  symbol: string;
  isFunctional: boolean;
  decimalPlaces: number;
}

export interface CurrencyUpdateRequest {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isFunctional: boolean;
  decimalPlaces: number;
}

// Exchange Rate
export interface ExchangeRate {
  id: string;
  currencyId: string;
  currencyCode: string;
  currencyName: string;
  date: string;
  buyRate: number;
  sellRate: number;
  source: string;
}

export interface ExchangeRateCreateRequest {
  currencyId: string;
  date: string;
  buyRate: number;
  sellRate: number;
  source: string;
}

export interface ExchangeRateUpdateRequest {
  id: string;
  buyRate: number;
  sellRate: number;
  source: string;
}

// Account Catalog
export interface AccountCatalog {
  id: string;
  accountCode: string;
  name: string;
  accountType: number;
  accountTypeName: string;
  nature: number;
  natureName: string;
  parentId: string | null;
  parentName: string | null;
  level: number;
  acceptsMovements: boolean;
  children: AccountCatalog[];
}

export interface AccountCatalogCreateRequest {
  accountCode: string;
  name: string;
  accountType: number;
  nature: number;
  parentId: string | null;
  level: number;
  acceptsMovements: boolean;
}

export interface AccountCatalogUpdateRequest {
  id: string;
  accountCode: string;
  name: string;
  accountType: number;
  nature: number;
  parentId: string | null;
  level: number;
  acceptsMovements: boolean;
}

// Accounting Period
export interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: number;
  statusName: string;
}

export interface AccountingPeriodCreateRequest {
  name: string;
  startDate: string;
  endDate: string;
}

export interface AccountingPeriodUpdateRequest {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// Journal Entry
export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  debitFunctional: number;
  creditFunctional: number;
  lineOrder: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: number;
  date: string;
  description: string;
  entryType: number;
  entryTypeName: string;
  status: number;
  statusName: string;
  periodId: string;
  periodName: string;
  currencyId: string;
  currencyCode: string;
  exchangeRate: number;
  totalDebit: number;
  totalCredit: number;
  totalDebitFunctional: number;
  totalCreditFunctional: number;
  isBalanced: boolean;
  lines: JournalEntryLine[];
}

export interface JournalEntryLineCreateRequest {
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntryCreateRequest {
  date: string;
  description: string;
  entryType: number;
  periodId: string;
  currencyId: string;
  exchangeRate: number;
  lines: JournalEntryLineCreateRequest[];
}

// Tax Configuration
export interface TaxConfiguration {
  id: string;
  name: string;
  percentage: number;
  taxType: number;
  taxTypeName: string;
  debitAccountId: string;
  debitAccountName: string;
  creditAccountId: string;
  creditAccountName: string;
}

export interface TaxConfigurationCreateRequest {
  name: string;
  percentage: number;
  taxType: number;
  debitAccountId: string;
  creditAccountId: string;
}

export interface TaxConfigurationUpdateRequest {
  id: string;
  name: string;
  percentage: number;
  taxType: number;
  debitAccountId: string;
  creditAccountId: string;
}

// Client
export interface Client {
  id: string;
  name: string;
  legalName: string | null;
  nit: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
}

export interface ClientCreateRequest {
  name: string;
  legalName?: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ClientUpdateRequest {
  id: string;
  name: string;
  legalName?: string;
  nit?: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Supplier
export interface Supplier {
  id: string;
  nit: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
}

export interface SupplierCreateRequest {
  nit: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface SupplierUpdateRequest {
  id: string;
  nit: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Invoice
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  lineOrder: number;
}

export interface Invoice {
  id: string;
  invoiceType: number;
  invoiceTypeName: string;
  status: number;
  statusName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  clientId: string | null;
  clientName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  nit: string;
  name: string;
  address: string | null;
  currencyId: string;
  currencyCode: string;
  exchangeRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  journalEntryId: string | null;
  fiscalSerie: string | null;
  fiscalNumero: string | null;
  fiscalAutorizacion: string | null;
  originalInvoiceId: string | null;
  originalInvoiceNumber: string | null;
  originalFiscalSerie: string | null;
  originalFiscalNumero: string | null;
  items: InvoiceItem[];
}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateReceivableInvoiceRequest {
  date: string;
  dueDate?: string;
  clientId: string;
  currencyId: string;
  exchangeRate: number;
  notes?: string;
  items: CreateInvoiceItemRequest[];
}

export interface CreateCreditNoteRequest {
  date: string;
  notes?: string;
  items: CreateInvoiceItemRequest[];
}

export interface CreatePayableInvoiceRequest {
  date: string;
  dueDate?: string;
  supplierId: string;
  currencyId: string;
  exchangeRate: number;
  fiscalSerie?: string;
  fiscalNumero?: string;
  fiscalAutorizacion?: string;
  notes?: string;
  items: CreateInvoiceItemRequest[];
}

// Fiscal Data validation
export interface FiscalData {
  fiscalCode: string;
  fiscalName: string;
}
