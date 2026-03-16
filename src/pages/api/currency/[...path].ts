/**
 * ============================================
 * API ENDPOINT - CURRENCY BY ID & SUB-RESOURCES
 * ============================================
 * Handles: GET/PUT/DELETE /api/currency/:id
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { ApiErrorResponse } from '@/lib/api-types';

const API_URL = URL_API.replace('localhost', '127.0.0.1');

function unauthorizedResponse() {
  return new Response(JSON.stringify({ type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1', title: 'Unauthorized', status: 401, errors: { 'Auth.Missing': ['Token de autenticación requerido'] }, traceId: crypto.randomUUID() } as ApiErrorResponse), { status: 401, headers: { 'Content-Type': 'application/json' } });
}

function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : 'Error al conectar con el servidor';
  return new Response(JSON.stringify({ type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1', title: 'Error de servidor', status: 500, errors: { 'Server.Error': [message] }, traceId: crypto.randomUUID() } as ApiErrorResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
}

async function proxyRequest(method: string, backendPath: string, authHeader: string, body?: unknown) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const headers: Record<string, string> = { 'Authorization': authHeader, 'Accept': '*/*' };
  if (body) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_URL}/api/Currency/${backendPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
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

  if (response.status === 204) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(data ?? {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    return await proxyRequest('GET', params.path!, authHeader);
  } catch (err) { return errorResponse(err); }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    const body = await request.json();
    return await proxyRequest('PUT', params.path!, authHeader, body);
  } catch (err) { return errorResponse(err); }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return unauthorizedResponse();
    return await proxyRequest('DELETE', params.path!, authHeader);
  } catch (err) { return errorResponse(err); }
};
