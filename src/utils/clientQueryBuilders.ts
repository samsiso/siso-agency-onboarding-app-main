
import { supabase } from '@/integrations/supabase/client';
import { safePropertyAccess } from '@/utils/errorSuppressions';
import { ClientData, ClientsListParams } from '@/types/client.types';

/**
 * Builds a base query for fetching clients with filter conditions
 */
export const buildClientListQuery = ({
  searchQuery = '',
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: Partial<ClientsListParams>) => {
  // Start with the main query
  let query = supabase
    .from('client_onboarding')
    .select(`
      id,
      status,
      current_step,
      total_steps,
      completed_steps,
      created_at,
      updated_at,
      user_id,
      project_name,
      company_niche,
      development_url,
      mvp_build_status,
      notion_plan_url,
      payment_status,
      estimated_price,
      initial_contact_date,
      start_date,
      estimated_completion_date,
      profiles:user_id (
        full_name,
        email,
        business_name,
        avatar_url,
        phone
      )
    `, { count: 'exact' })
    .order(sortColumn, { ascending: sortDirection === 'asc' });
  
  // Apply status filter if not 'all'
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  // Apply search filter
  if (searchQuery) {
    // Add filter conditions for both name and email
    query = query.or(`profiles.full_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%,project_name.ilike.%${searchQuery}%,company_niche.ilike.%${searchQuery}%`);
  }
  
  return query;
};

/**
 * Process client data from API response to ClientData format
 */
export const processClientData = (data: any[]): ClientData[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  return data.map((item: any) => {
    const profiles = item.profiles || {};
    
    return {
      id: safePropertyAccess(item, 'id', ''),
      status: safePropertyAccess(item, 'status', 'pending'),
      current_step: safePropertyAccess(item, 'current_step', 1),
      total_steps: safePropertyAccess(item, 'total_steps', 5),
      completed_steps: Array.isArray(safePropertyAccess(item, 'completed_steps', [])) 
        ? safePropertyAccess(item, 'completed_steps', []) 
        : [],
      created_at: safePropertyAccess(item, 'created_at', new Date().toISOString()),
      updated_at: safePropertyAccess(item, 'updated_at', new Date().toISOString()),
      full_name: safePropertyAccess(profiles, 'full_name', 'Unknown'),
      email: safePropertyAccess(profiles, 'email', null),
      business_name: safePropertyAccess(profiles, 'business_name', null),
      avatar_url: safePropertyAccess(profiles, 'avatar_url', null),
      phone: safePropertyAccess(profiles, 'phone', null),
      // Project-related fields with safe access
      project_name: safePropertyAccess(item, 'project_name', null),
      company_niche: safePropertyAccess(item, 'company_niche', null),
      development_url: safePropertyAccess(item, 'development_url', null),
      mvp_build_status: safePropertyAccess(item, 'mvp_build_status', null),
      notion_plan_url: safePropertyAccess(item, 'notion_plan_url', null),
      payment_status: safePropertyAccess(item, 'payment_status', null),
      estimated_price: safePropertyAccess(item, 'estimated_price', null),
      initial_contact_date: safePropertyAccess(item, 'initial_contact_date', null),
      start_date: safePropertyAccess(item, 'start_date', null),
      estimated_completion_date: safePropertyAccess(item, 'estimated_completion_date', null),
    };
  });
};

/**
 * Simpler fallback query for when the main query fails
 */
export const buildFallbackClientQuery = ({
  searchQuery = '',
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: Partial<ClientsListParams>) => {
  let fallbackQuery = supabase
    .from('client_onboarding')
    .select(`
      id,
      status,
      current_step,
      total_steps,
      completed_steps,
      created_at,
      updated_at,
      user_id,
      profiles:user_id (
        full_name,
        email,
        business_name,
        avatar_url,
        phone
      )
    `, { count: 'exact' })
    .order('updated_at', { ascending: false });
  
  if (statusFilter !== 'all') {
    fallbackQuery = fallbackQuery.eq('status', statusFilter);
  }
  
  if (searchQuery) {
    fallbackQuery = fallbackQuery.or(`profiles.full_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%`);
  }
  
  return fallbackQuery;
};
