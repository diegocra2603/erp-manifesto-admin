/**
 * ============================================
 * JOURNAL ENTRY SERVICE
 * ============================================
 * API calls for Journal Entries
 */

import { get, post, del } from '@/lib/fetch-api';
import type {
  JournalEntry,
  JournalEntryCreateRequest,
} from '@/lib/api-types';

const ENDPOINT = '/api/journalentry';

export async function getJournalEntries() {
  return get<JournalEntry[]>(ENDPOINT);
}

export async function getJournalEntryById(id: string) {
  return get<JournalEntry>(`${ENDPOINT}/${id}`);
}

export async function createJournalEntry(data: JournalEntryCreateRequest) {
  return post<JournalEntry>(ENDPOINT, data);
}

export async function approveJournalEntry(id: string) {
  return post<JournalEntry>(`${ENDPOINT}/${id}/approve`);
}

export async function voidJournalEntry(id: string) {
  return post<JournalEntry>(`${ENDPOINT}/${id}/void`);
}

export async function deleteJournalEntry(id: string) {
  return del(`${ENDPOINT}/${id}`);
}
