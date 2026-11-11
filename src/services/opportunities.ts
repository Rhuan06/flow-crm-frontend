import { apiFetch } from './api';
import { Opportunity, OpportunityStatus } from '@/types';

export interface CreateOpportunityData {
  title: string;
  description?: string | null;
  value: number;
  status: OpportunityStatus;
  client_id: string;
}

export interface UpdateOpportunityData {
  title?: string;
  description?: string | null;
  value?: number;
  status?: OpportunityStatus;
  client_id?: string;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  return apiFetch<Opportunity[]>('/opportunities');
}

export async function createOpportunity(
  data: CreateOpportunityData
): Promise<Opportunity> {
  return apiFetch<Opportunity>('/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus
): Promise<Opportunity> {
  return apiFetch<Opportunity>(`/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function updateOpportunity(
  id: string,
  data: UpdateOpportunityData
): Promise<Opportunity> {
  return apiFetch<Opportunity>(`/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOpportunity(id: string): Promise<void> {
  return apiFetch<void>(`/opportunities/${id}`, {
    method: 'DELETE',
  });
}