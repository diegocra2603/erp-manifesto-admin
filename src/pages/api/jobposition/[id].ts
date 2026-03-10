/**
 * ============================================
 * API ENDPOINT - JOB POSITION BY ID
 * ============================================
 * Server-side endpoint for getting, updating, and deleting a job position by ID (JSON)
 */

import type { APIRoute } from 'astro';
import { URL_API } from 'astro:env/server';
import type { JobPosition, ApiErrorResponse } from '@/lib/api-types';

const API_URL = URL_API.replace('localhost', '127.0.0.1');

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Invalid request',
          status: 400,
          errors: {
            'Request.Invalid': ['ID del puesto de trabajo es requerido'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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

    const response = await fetch(`${API_URL}/api/JobPosition/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
      },
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

    if (!response.ok) {
      return new Response(JSON.stringify(data ?? { title: `Error ${response.status}`, status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const jobPosition: JobPosition = data;

    return new Response(JSON.stringify(jobPosition), {
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Invalid request',
          status: 400,
          errors: {
            'Request.Invalid': ['ID del puesto de trabajo es requerido'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${API_URL}/api/JobPosition/${id}`, {
      method: 'PUT',
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

    if (!response.ok) {
      return new Response(JSON.stringify(data ?? { title: `Error ${response.status}`, status: response.status }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const jobPosition: JobPosition = data ?? {};

    return new Response(JSON.stringify(jobPosition), {
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

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Invalid request',
          status: 400,
          errors: {
            'Request.Invalid': ['ID del puesto de trabajo es requerido'],
          },
          traceId: crypto.randomUUID(),
        } as ApiErrorResponse),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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

    const response = await fetch(`${API_URL}/api/JobPosition/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = null;
      const contentType = response.headers.get('content-type');
      const text = await response.text();

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
