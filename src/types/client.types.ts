
export interface ClientData {
  id: string;
  full_name: string;
  email: string | null;
  business_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
  current_step: number;
  total_steps: number;
  completed_steps: string[];
  created_at: string;
  updated_at: string;
  website_url?: string | null;
  professional_role?: string | null;
  bio?: string | null;
  // Project-related fields
  project_name?: string | null;
  company_niche?: string | null;
  development_url?: string | null;
  mvp_build_status?: string | null;
  notion_plan_url?: string | null;
  payment_status?: string | null;
  estimated_price?: number | null;
  initial_contact_date?: string | null;
  start_date?: string | null;
  estimated_completion_date?: string | null;
}

export interface ClientsListParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  statusFilter?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ClientsListResponse {
  clients: ClientData[];
  totalCount: number;
}

export interface ClientColumnPreference {
  key: string;
  visible: boolean;
}

export interface ClientViewPreference {
  columns: ClientColumnPreference[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  pageSize: number;
}
