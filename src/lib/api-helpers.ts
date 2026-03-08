/**
 * ============================================
 * API HELPERS
 * ============================================
 * Helper functions for API error handling
 */

import type { ApiErrorResponse } from './api-types';

/**
 * Parse API error response and return user-friendly message
 */
export function parseApiError(error: ApiErrorResponse): string {
  // If there are validation errors, return the first one
  if (error.errors && Object.keys(error.errors).length > 0) {
    const firstErrorKey = Object.keys(error.errors)[0];
    const firstError = error.errors[firstErrorKey][0];
    return firstError || error.title;
  }

  // Return the title if no specific errors
  return error.title || 'Error en la solicitud';
}

/**
 * Get all validation errors as an array
 */
export function getAllApiErrors(error: ApiErrorResponse): string[] {
  if (!error.errors) {
    return [error.title || 'Error en la solicitud'];
  }

  const allErrors: string[] = [];
  Object.values(error.errors).forEach((errorArray) => {
    allErrors.push(...errorArray);
  });

  return allErrors;
}

/**
 * Check if response is an API error
 */
export function isApiError(data: any): data is ApiErrorResponse {
  return (
    data &&
    typeof data === 'object' &&
    'status' in data &&
    'title' in data &&
    'traceId' in data
  );
}

/**
 * Format API error for logging
 */
export function formatApiErrorForLog(error: ApiErrorResponse): string {
  const errors = getAllApiErrors(error);
  return `[${error.status}] ${error.title}\nErrors: ${errors.join(', ')}\nTraceId: ${error.traceId}`;
}
