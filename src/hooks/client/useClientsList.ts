
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientsListParams, ClientsListResponse, ClientData } from '@/types/client.types';

export type { ClientData, ClientsListParams } from '@/types/client.types';

export const useClientsList = ({
  page = 1,
  pageSize = 10,
  searchQuery = '',
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: ClientsListParams = {}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clients-list', page, pageSize, searchQuery, statusFilter, sortColumn, sortDirection],
    queryFn: async () => {
      try {
        // Build the query
        let query = supabase
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
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
        
        // First get count
        const countResult = await query;
        const count = countResult.count || 0;
        
        // Then fetch the page of data
        const { data, error: dataError } = await query.range(from, to);
        
        if (dataError) {
          console.error('Error fetching clients data:', dataError);
          throw dataError;
        }
        
        if (!data || data.length === 0) {
          return {
            clients: [],
            totalCount: 0
          };
        }
        
        // Process the data to get the clientData format with proper names
        const processedData: ClientData[] = data.map(item => ({
          id: item.id,
          full_name: item.contact_name || 'Unknown Client',
          email: item.email || null,
          business_name: item.company_name || null,
          phone: item.phone || null,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${(item.contact_name || 'Client').substring(0, 2)}`,
          status: item.status || 'pending',
          current_step: item.current_step || 1,
          total_steps: item.total_steps || 5,
          completed_steps: item.completed_steps || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          website_url: item.website_url || null,
          professional_role: item.professional_role || null,
          bio: item.bio || null,
          project_name: item.project_name || null,
          company_niche: item.company_niche || null,
          development_url: item.development_url || item.website_url || null,
          mvp_build_status: item.mvp_build_status || null,
          notion_plan_url: item.notion_plan_url || null,
          payment_status: item.payment_status || null,
          estimated_price: item.estimated_price || null,
          initial_contact_date: item.initial_contact_date || item.created_at || null,
          start_date: item.start_date || null,
          estimated_completion_date: item.estimated_completion_date || null,
          client_contact: item.client_contact || null,
          purchase_history: item.purchase_history || null,
          next_steps: item.next_steps || null,
          key_research: item.key_research || null,
          referral_source: item.referral_source || null,
          industry: item.industry || null,
          last_contacted_date: item.last_contacted_date || null,
          assigned_to: item.assigned_to || null,
          priority: item.priority || null,
          todos: item.todos || []
        }));
        
        console.log('Processed client data:', processedData);
        
        return {
          clients: processedData,
          totalCount: count
        };
      } catch (error: any) {
        console.error('Error in useClientsList:', error);
        
        // Return empty data when there's an error
        return {
          clients: [],
          totalCount: 0
        };
      }
    },
  });

  return {
    clients: data?.clients || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch
  };
};
