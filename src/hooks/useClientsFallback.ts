
import { supabase } from '@/integrations/supabase/client';
import { ClientData, ClientsListParams, ClientsListResponse } from '@/types/client.types';
import { buildFallbackClientQuery, processClientData } from '@/utils/clientQueryBuilders';

/**
 * Fallback mechanism for when the main clients query fails
 */
export const fetchClientsFallback = async (
  params: ClientsListParams,
  from: number,
  to: number
): Promise<ClientsListResponse> => {
  try {
    const { page, pageSize, searchQuery, statusFilter } = params;
    
    // Build fallback query with only basic fields
    let fallbackQuery = buildFallbackClientQuery({ searchQuery, statusFilter });
    
    // Safely get the count
    let fallbackCount = 0;
    try {
      const fallbackCountResult = await fallbackQuery;
      if (fallbackCountResult && typeof fallbackCountResult.count === 'number') {
        fallbackCount = fallbackCountResult.count;
      }
    } catch (countError) {
      console.error('Error getting fallback count:', countError);
    }
    
    // Get the data with pagination
    const { data: fallbackData } = await fallbackQuery.range(from, to);
    
    if (!fallbackData || fallbackData.length === 0) {
      return {
        clients: [],
        totalCount: 0
      };
    }
    
    // Process the data with default values for missing fields
    const processedClients = fallbackData.map((item: any) => {
      const profiles = item.profiles || {};
      
      return {
        id: item.id || '',
        status: item.status || 'pending',
        current_step: item.current_step || 1,
        total_steps: item.total_steps || 5,
        completed_steps: Array.isArray(item.completed_steps) ? item.completed_steps : [],
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        full_name: profiles?.full_name || 'Unknown',
        email: profiles?.email || null,
        business_name: profiles?.business_name || null,
        avatar_url: profiles?.avatar_url || null,
        phone: profiles?.phone || null,
        // Default values for project-related fields
        project_name: null,
        company_niche: null,
        development_url: null,
        mvp_build_status: null,
        notion_plan_url: null,
        payment_status: null,
        estimated_price: null,
        initial_contact_date: null,
        start_date: null,
        estimated_completion_date: null,
      } as ClientData;
    });
    
    return {
      clients: processedClients,
      totalCount: fallbackCount
    };
  } catch (error) {
    console.error('Error in fallback query:', error);
    return {
      clients: [],
      totalCount: 0
    };
  }
};
