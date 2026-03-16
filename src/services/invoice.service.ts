/**
 * ============================================
 * INVOICE SERVICE
 * ============================================
 * API calls for Invoices (Receivable & Payable)
 */

import { get, post, del } from '@/lib/fetch-api';
import type { Invoice, CreateReceivableInvoiceRequest, CreatePayableInvoiceRequest } from '@/lib/api-types';

const ENDPOINT = '/api/invoice';

export async function getReceivableInvoices() {
  return get<Invoice[]>(`${ENDPOINT}/receivable`);
}

export async function getPayableInvoices() {
  return get<Invoice[]>(`${ENDPOINT}/payable`);
}

export async function getInvoiceById(id: string) {
  return get<Invoice>(`${ENDPOINT}/${id}`);
}

export async function createReceivableInvoice(data: CreateReceivableInvoiceRequest) {
  return post<Invoice>(`${ENDPOINT}/receivable`, data);
}

export async function createPayableInvoice(data: CreatePayableInvoiceRequest) {
  return post<Invoice>(`${ENDPOINT}/payable`, data);
}

export async function emitInvoice(id: string) {
  return post<Invoice>(`${ENDPOINT}/${id}/emit`, {});
}

export async function voidInvoice(id: string) {
  return post<Invoice>(`${ENDPOINT}/${id}/void`, {});
}

export async function deleteInvoice(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
