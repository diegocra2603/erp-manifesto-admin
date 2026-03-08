/**
 * ============================================
 * API ENDPOINT - LOGIN
 * ============================================
 * Server-side endpoint for user authentication
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { LoginRequest, LoginResponse, ApiErrorResponse } from '@/lib/api-types';

// Use IPv4 explicitly to avoid IPv6 connection issues
const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    let body: LoginRequest;

    try {
      body = await request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Invalid request body',
          status: 400,
          errors: {
            'Request.Invalid': ['El cuerpo de la solicitud no es un JSON válido'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate required fields
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Validation error',
          status: 400,
          errors: {
            'Request.Invalid': ['Email y contraseña son requeridos'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('[POST /api/auth/login] Body:', JSON.stringify(body));

    // Call backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('[POST /api/auth/login] Response:', response.status, JSON.stringify(data));

    // If error, return it
    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Success - return the login response
    const loginResponse: LoginResponse = data;

    return new Response(JSON.stringify(loginResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === 'AbortError';
    const status = isTimeout ? 504 : 500;
    const message = isTimeout
      ? 'El servidor backend no respondió a tiempo'
      : 'Error al conectar con el servidor';

    console.error(`[POST /api/auth/login] ${isTimeout ? 'Timeout' : 'Error'}:`, error);

    return new Response(
      JSON.stringify({
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
        title: isTimeout ? 'Gateway Timeout' : 'Error de servidor',
        status,
        errors: {
          'Server.Error': [message],
        },
        traceId: crypto.randomUUID(),
      } as ApiErrorResponse),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
