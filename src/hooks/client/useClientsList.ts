
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
        
        // Process the data to get the clientData format
        const processedData: ClientData[] = data.map(item => ({
          id: item.id,
          full_name: item.contact_name || 'Unknown',
          email: null, // Not available in the current dataset
          business_name: item.company_name || null,
          phone: null, // Not available in the current dataset
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${(item.contact_name || 'Client').substring(0, 2)}`,
          status: item.status || 'pending',
          current_step: item.current_step || 1,
          total_steps: item.total_steps || 5,
          completed_steps: item.completed_steps || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
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
