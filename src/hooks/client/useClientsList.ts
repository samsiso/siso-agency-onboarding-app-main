
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientsListParams, ClientsListResponse, ClientData, TodoItem } from '@/types/client.types';

export type { ClientData, ClientsListParams } from '@/types/client.types';

export const useClientsList = ({
  searchQuery = '',
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: Partial<ClientsListParams> = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clients-list', searchQuery, statusFilter, sortColumn, sortDirection],
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
        
        // Get all data at once
        const { data: allData, error: dataError, count } = await query;
        
        if (dataError) {
          console.error('Error fetching clients data:', dataError);
          throw dataError;
        }
        
        if (!allData || allData.length === 0) {
          return {
            clients: [],
            totalCount: 0
          };
        }
        
        // Process all data
        const processedData: ClientData[] = allData.map(item => {
          const contactName = item.contact_name || 'Client';
          const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contactName.substring(0, 2))}`;
          
          const defaultTodos: TodoItem[] = [];
          
          return {
            id: item.id,
            full_name: item.contact_name || 'Unknown Client',
            email: null,
            business_name: item.company_name || null,
            phone: null,
            avatar_url: avatarUrl,
            status: item.status || 'pending',
            current_step: item.current_step || 1,
            total_steps: item.total_steps || 5,
            completed_steps: item.completed_steps || [],
            created_at: item.created_at,
            updated_at: item.updated_at,
            website_url: item.website_url || null,
            professional_role: null,
            bio: null,
            project_name: item.project_name || null,
            company_niche: item.company_niche || null,
            development_url: null,
            mvp_build_status: null,
            notion_plan_url: null,
            payment_status: null,
            estimated_price: null,
            initial_contact_date: item.created_at || null,
            start_date: null,
            estimated_completion_date: null,
            client_contact: null,
            purchase_history: null,
            next_steps: null,
            key_research: null,
            referral_source: null,
            industry: null,
            last_contacted_date: null,
            assigned_to: null,
            priority: null,
            todos: defaultTodos
          };
        });
        
        return {
          clients: processedData,
          totalCount: count || processedData.length
        };
      } catch (error: any) {
        console.error('Error in useClientsList:', error);
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
