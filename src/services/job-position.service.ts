/**
 * ============================================
 * JOB POSITION SERVICE
 * ============================================
 * API calls for Job Position
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type {
  JobPosition,
  JobPositionCreateRequest,
  JobPositionUpdateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/jobposition';

/**
 * Get all job positions
 */
export async function getJobPositions() {
  return get<JobPosition[]>(ENDPOINT);
}

/**
 * Get a single job position by ID
 */
export async function getJobPositionById(id: string) {
  return get<JobPosition>(`${ENDPOINT}/${id}`);
}

/**
 * Create a new job position
 */
export async function createJobPosition(data: JobPositionCreateRequest) {
  return post<JobPosition>(ENDPOINT, data);
}

/**
 * Update an existing job position
 */
export async function updateJobPosition(id: string, data: JobPositionUpdateRequest) {
  return put<JobPosition>(`${ENDPOINT}/${id}`, data);
}

/**
 * Delete a job position
 */
export async function deleteJobPosition(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
