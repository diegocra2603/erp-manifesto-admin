/**
 * ============================================
 * API ENDPOINT - RESET PASSWORD BY ADMIN
 * ============================================
 * Server-side endpoint for resetting a user's password by admin (JSON)
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { ApiErrorResponse } from '@/lib/api-types';

const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const POST: APIRoute = async ({ request }) => {
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

    const body = await request.json();
    console.log('[POST /api/User/reset-password-by-admin] Body:', JSON.stringify(body));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${API_URL}/api/User/reset-password-by-admin`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = null;
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      console.log('[POST /api/User/reset-password-by-admin] Response:', response.status, text);

      if (text && contentType?.includes('application/json')) {
        try {
          errorData = JSON.parse(text);
        } catch {
          // not valid JSON
        }
      }

      return new Response(JSON.stringify(errorData ?? { title: `Error ${response.status}`, status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[POST /api/User/reset-password-by-admin] Response:', response.status, 'OK');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al conectar con el servidor';
    return new Response(
      JSON.stringify({
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
        title: 'Error de servidor',
        status: 500,
        errors: {
          'Server.Error': [message],
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
