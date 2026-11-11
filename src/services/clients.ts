import { apiFetch } from './api';
import { Client } from '@/types';

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string | null;
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string | null;
}

export async function getClients(): Promise<Client[]> {
  return apiFetch<Client[]>('/clients');
}

export async function createClient(
  data: CreateClientData
): Promise<Client> {
  return apiFetch<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClient(
  id: string,
  data: UpdateClientData
): Promise<Client> {
  return apiFetch<Client>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id: string): Promise<void> {
  return apiFetch<void>(`/clients/${id}`, {
    method: 'DELETE',
  });
}