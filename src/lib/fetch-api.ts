/**
 * ============================================
 * FETCH API HELPER
 * ============================================
 * Centralized API client with automatic token management
 */

import { appConfig } from '@/config';
import type { ApiErrorResponse } from './api-types';
import { isApiError, parseApiError } from './api-helpers';

// Base URL for API requests (empty string for same-origin requests)
const BASE_URL = '';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Get the authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(appConfig.auth.storageKeys.token);
}

/**
 * Centralized fetch wrapper that automatically adds auth token
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; response: Response }> {
  const { skipAuth = false, headers = {}, ...restOptions } = options;

  // Build headers
  const requestHeaders: HeadersInit = { ...headers };

  // Add auth token if not skipped
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add Content-Type if not provided and not FormData
  if (!requestHeaders['Content-Type'] && !(restOptions.body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // Try to parse JSON response
    let data = null;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          // ignore parse error, data stays null
        }
      }
    }

    // Check if response is an error
    if (!response.ok) {
      const errorMessage = isApiError(data)
        ? parseApiError(data)
        : `Error ${response.status}: ${response.statusText}`;

      return {
        data: null,
        error: errorMessage,
        response,
      };
    }

    return {
      data: data as T,
      error: null,
      response,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';

    return {
      data: null,
      error: errorMessage,
      response: new Response(null, { status: 0 }),
    };
  }
}

/**
 * GET request helper
 */
export async function get<T = any>(endpoint: string, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
) {
  const requestOptions: FetchOptions = {
    ...options,
    method: 'POST',
  };

  // Handle body serialization
  if (body) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  return fetchApi<T>(endpoint, requestOptions);
}

/**
 * PUT request helper
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
) {
  const requestOptions: FetchOptions = {
    ...options,
    method: 'PUT',
  };

  // Handle body serialization
  if (body) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  return fetchApi<T>(endpoint, requestOptions);
}

/**
 * DELETE request helper
 */
export async function del<T = any>(endpoint: string, options: FetchOptions = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * PATCH request helper
 */
export async function patch<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
) {
  const requestOptions: FetchOptions = {
    ...options,
    method: 'PATCH',
  };

  // Handle body serialization
  if (body) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  return fetchApi<T>(endpoint, requestOptions);
}
