/**
 * ============================================
 * INVOICE SERVICE
 * ============================================
 * API calls for Invoices (Receivable & Payable)
 */

import { get, post, del, fetchApi } from '@/lib/fetch-api';
import type { Invoice, CreateReceivableInvoiceRequest, CreatePayableInvoiceRequest } from '@/lib/api-types';
import { appConfig } from '@/config';

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

export async function uploadContingency() {
  return post<{ uploaded: number; failed: number; details: string[] }>(`${ENDPOINT}/contingency/upload`, {});
}

export async function deleteInvoice(id: string) {
  return del(`${ENDPOINT}/${id}`);
}

export async function getInvoicePdfUrl(id: string): Promise<{ url: string; fileName: string }> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(appConfig.auth.storageKeys.token)
    : null;

  const response = await fetch(`${ENDPOINT}/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo obtener el PDF`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const disposition = response.headers.get('content-disposition');
  const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const fileName = fileNameMatch?.[1] ?? `Factura-${id}.pdf`;

  return { url, fileName };
}

export function downloadFromBlobUrl(url: string, fileName: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
