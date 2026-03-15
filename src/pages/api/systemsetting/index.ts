/**
 * ============================================
 * API ENDPOINT - SYSTEM SETTINGS LIST
 * ============================================
 * Server-side endpoint for listing system settings (JSON)
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { SystemSetting, ApiErrorResponse } from '@/lib/api-types';

const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Unauthorized',
          status: 401,
          errors: {
            'Auth.Missing': ['Token de autenticación requerido'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_URL}/api/SystemSetting`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const settings: SystemSetting[] = data;

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
        title: 'Error de servidor',
        status: 500,
        errors: {
          'Server.Error': ['Error al conectar con el servidor'],
        },
        traceId: crypto.randomUUID(),
      } as ApiErrorResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
