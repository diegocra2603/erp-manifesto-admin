/**
 * ============================================
 * CLIENT SERVICE
 * ============================================
 * API calls for Clients
 */

import { get, post, put, del } from '@/lib/fetch-api';
import type { Client, ClientCreateRequest, ClientUpdateRequest } from '@/lib/api-types';

const ENDPOINT = '/api/client';

export async function getClients() {
  return get<Client[]>(ENDPOINT);
}

export async function getClientById(id: string) {
  return get<Client>(`${ENDPOINT}/${id}`);
}

export async function createClient(data: ClientCreateRequest) {
  return post<Client>(ENDPOINT, data);
}

export async function updateClient(id: string, data: ClientUpdateRequest) {
  return put<Client>(`${ENDPOINT}/${id}`, data);
}

export async function deleteClient(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
