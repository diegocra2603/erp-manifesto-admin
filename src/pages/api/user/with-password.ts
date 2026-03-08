/**
 * ============================================
 * API ENDPOINT - CREATE USER WITH PASSWORD
 * ============================================
 * Server-side endpoint for creating a user with password (JSON)
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { User, ApiErrorResponse } from '@/lib/api-types';

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
    console.log('[POST /api/User/with-password] Body:', JSON.stringify(body));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${API_URL}/api/User/with-password`, {
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

    let data = null;
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (text && contentType?.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch {
        // not valid JSON
      }
    }
    console.log('[POST /api/User/with-password] Response:', response.status, text);

    if (!response.ok) {
      return new Response(JSON.stringify(data ?? { title: `Error ${response.status}`, status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user: User = data ?? {};

    return new Response(JSON.stringify(user), {
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
