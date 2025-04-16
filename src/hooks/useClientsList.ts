
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { safePropertyAccess } from '@/utils/errorSuppressions';

interface ClientsListParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  statusFilter?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

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
  // New fields
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
        
        // First get count - safely handle count property
        let count = 0;
        try {
          const countResult = await query;
          // Check if countResult has count property
          if (countResult && typeof countResult.count === 'number') {
            count = countResult.count;
          }
        } catch (countError) {
          console.error('Error getting count:', countError);
        }
        
        // Then fetch the page of data
        const { data, error: dataError } = await query
          .range(from, to);
        
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
        
        // Process and flatten the data structure with safe access patterns
        const processedData = data.map((item: any) => {
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
            // New fields with safe access
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
        
        return {
          clients: processedData,
          totalCount: count
        };
      } catch (error: any) {
        console.error('Error in useClientsList:', error);
        
        // Fallback for any type of error
        let fallbackClients: ClientData[] = [];
        let fallbackCount = 0;
        
        // Try a fallback query with only existing columns
        try {
          // Fallback query with only standard columns
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
          
          // Safely get the count
          try {
            const fallbackCountResult = await fallbackQuery;
            if (fallbackCountResult && typeof fallbackCountResult.count === 'number') {
              fallbackCount = fallbackCountResult.count;
            }
          } catch (countError) {
            console.error('Error getting fallback count:', countError);
          }
          
          const { data: fallbackData } = await fallbackQuery.range(from, to);
          
          if (fallbackData && fallbackData.length > 0) {
            fallbackClients = fallbackData.map((item: any) => {
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
                // Default values for new fields that don't exist yet
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
              };
            });
          }
        } catch (fallbackError) {
          console.error('Error in fallback query:', fallbackError);
        }
        
        return {
          clients: fallbackClients,
          totalCount: fallbackCount
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
