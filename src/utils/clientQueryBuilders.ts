
import { supabase } from '@/integrations/supabase/client';
import { ClientData, ClientsListParams } from '@/types/client.types';
import { safeSupabase } from './supabaseHelpers';

/**
 * Builds a Supabase query for fetching client data based on provided parameters
 */
export const buildClientListQuery = ({ 
  searchQuery = '', 
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: Partial<ClientsListParams>) => {
  
  let query = safeSupabase
    .from('client_onboarding')
    .select('*', { count: 'exact' });
  
  // Apply text search
  if (searchQuery) {
    query = query.or(`
      contact_name.ilike.%${searchQuery}%,
      company_name.ilike.%${searchQuery}%,
      website_url.ilike.%${searchQuery}%,
      company_niche.ilike.%${searchQuery}%,
      project_name.ilike.%${searchQuery}%
    `);
  }
  
  // Apply status filter
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  // Apply sorting
  if (sortColumn && sortDirection) {
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
  }
  
  return query;
};

/**
 * Processes raw client data from the database into the required ClientData format
 */
export const processClientData = (data: any[]): ClientData[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => {
    if (!item) return {} as ClientData;
    
    return {
      id: item.id || '',
      full_name: item.contact_name || 'Unknown',
      email: null, // Not available in the current dataset
      business_name: item.company_name || null,
      phone: null, // Not available in the current dataset
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${(item.contact_name || 'Client').substring(0, 2)}`,
      status: item.status || 'pending',
      current_step: item.current_step || 1,
      total_steps: item.total_steps || 5,
      completed_steps: item.completed_steps || [],
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      website_url: item.website_url || null,
      professional_role: null, // Not available in the current dataset
      bio: null, // Not available in the current dataset
      project_name: item.project_name || null,
      company_niche: item.company_niche || null,
      development_url: item.website_url || null,
      mvp_build_status: null, // Not available in the current dataset
      notion_plan_url: null, // Not available in the current dataset
      payment_status: null, // Not available in the current dataset
      estimated_price: null, // Not available in the current dataset
      initial_contact_date: item.created_at || null,
      start_date: null, // Not available in the current dataset
      estimated_completion_date: null // Not available in the current dataset
    };
  });
};
