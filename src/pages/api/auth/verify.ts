/**
 * ============================================
 * API ENDPOINT - VERIFY TOKEN
 * ============================================
 * Server-side endpoint to verify authentication token
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { LoginResponse, ApiErrorResponse } from '@/lib/api-types';

// Use IPv4 explicitly to avoid IPv6 connection issues
const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Unauthorized',
          status: 401,
          errors: {
            'Auth.Missing': ['Token de autenticación no proporcionado'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Call backend API to verify token with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_URL}/api/Auth/login-with-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': '*/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    // If error, return it
    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Success - return the verification response
    const verifyResponse: LoginResponse = data;
    console.log('[GET /api/auth/verify] Token verified successfully');

    return new Response(JSON.stringify(verifyResponse), {
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
      : 'Error al verificar el token';

    console.error(`[GET /api/auth/verify] ${isTimeout ? 'Timeout' : 'Error'}:`, error);

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
