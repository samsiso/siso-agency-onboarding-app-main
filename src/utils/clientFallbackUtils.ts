
import { ClientData, ClientsListParams, ClientsListResponse } from '@/types/client.types';
import { safeSupabase } from './supabaseHelpers';

/**
 * Fallback function to fetch clients data using an alternative approach
 * This is used when the primary query builder fails
 */
export const fetchClientsFallback = async (
  params: ClientsListParams,
  from: number,
  to: number
): Promise<ClientsListResponse> => {
  try {
    // Attempt to fetch data directly from the client_onboarding table without complex filtering
    const { data, error, count } = await safeSupabase
      .from('client_onboarding')
      .select('*', { count: 'exact' })
      .order(params.sortColumn || 'updated_at', { 
        ascending: params.sortDirection === 'asc' 
      })
      .range(from, to);
    
    if (error) {
      console.error('Error in fallback client fetch:', error);
      return { clients: [], totalCount: 0 };
    }

    if (!data || !Array.isArray(data)) {
      console.error('No data returned or invalid data format');
      return { clients: [], totalCount: 0 };
    }
    
    // Map the data to the expected format
    const clients: ClientData[] = data.map(item => ({
      id: item.id || '',
      full_name: item.contact_name || 'Unknown',
      email: null,
      business_name: item.company_name || null,
      phone: null,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${(item.contact_name || 'Client').substring(0, 2)}`,
      status: item.status || 'pending',
      current_step: item.current_step || 1,
      total_steps: item.total_steps || 5,
      completed_steps: item.completed_steps || [],
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      website_url: item.website_url || null,
      professional_role: null,
      bio: null,
      project_name: item.project_name || null,
      company_niche: item.company_niche || null,
      development_url: item.website_url || null,
      mvp_build_status: null,
      notion_plan_url: null,
      payment_status: null,
      estimated_price: null,
      initial_contact_date: item.created_at || null,
      start_date: null,
      estimated_completion_date: null
    }));
    
    return {
      clients,
      totalCount: count || clients.length
    };
    
  } catch (fallbackError) {
    console.error('Fallback client fetch also failed:', fallbackError);
    
    // Return empty data as last resort
    return {
      clients: [],
      totalCount: 0
    };
  }
};
