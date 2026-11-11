
export interface User {
  id: string;
  email: string;
  name: string; 
  is_active: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string; 
  phone: string | null; 
  owner_id: string;
  created_at: string;
}

export type OpportunityStatus = 
  | 'prospeccao' 
  | 'qualificacao' 
  | 'proposta' 
  | 'ganho' 
  | 'perdido';

export interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: OpportunityStatus;
  client_id: string;
  owner_id: string;
  created_at: string;
}

export interface ApiError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}