/**
 * ============================================
 * API ENDPOINT - FISCAL DATA
 * ============================================
 * Handles: GET /api/fiscaldata/validate/:nit
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { ApiErrorResponse } from '@/lib/api-types';

const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1', title: 'Unauthorized', status: 401, errors: { 'Auth.Missing': ['Token de autenticación requerido'] }, traceId: crypto.randomUUID() } as ApiErrorResponse), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${API_URL}/api/FiscalData/${params.path}`, {
      method: 'GET',
      headers: { 'Authorization': authHeader, 'Accept': '*/*' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let data = null;
    const text = await response.text();
    if (text && response.headers.get('content-type')?.includes('application/json')) {
      try { data = JSON.parse(text); } catch {}
    }

    if (!response.ok) {
      return new Response(JSON.stringify(data ?? { title: `Error ${response.status}`, status: response.status }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(data ?? {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1', title: 'Error de servidor', status: 500, errors: { 'Server.Error': ['Error al conectar con el servidor'] }, traceId: crypto.randomUUID() } as ApiErrorResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
