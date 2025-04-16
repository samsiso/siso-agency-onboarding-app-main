
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
          `)
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
        
        // First get count of all matching records
        const countResult = await query.count();
        
        if (countResult.error) {
          console.error('Error fetching clients count:', countResult.error);
          throw countResult.error;
        }
        
        const count = countResult.count || 0;
        
        // Then fetch the page of data
        const { data, error: dataError } = await query
          .range(from, to);
        
        if (dataError) {
          console.error('Error fetching clients data:', dataError);
          throw dataError;
        }
        
        if (!data) {
          return {
            clients: [],
            totalCount: 0
          };
        }
        
        // Process and flatten the data structure
        const processedData = data.map((item) => ({
          id: item.id,
          status: item.status,
          current_step: item.current_step,
          total_steps: item.total_steps,
          completed_steps: item.completed_steps || [],
          created_at: item.created_at,
          updated_at: item.updated_at,
          full_name: safePropertyAccess(item.profiles, 'full_name', 'Unknown'),
          email: safePropertyAccess(item.profiles, 'email', null),
          business_name: safePropertyAccess(item.profiles, 'business_name', null),
          avatar_url: safePropertyAccess(item.profiles, 'avatar_url', null),
          phone: safePropertyAccess(item.profiles, 'phone', null),
          // New fields
          project_name: item.project_name || null,
          company_niche: item.company_niche || null,
          development_url: item.development_url || null,
          mvp_build_status: item.mvp_build_status || null,
          notion_plan_url: item.notion_plan_url || null,
          payment_status: item.payment_status || null,
          estimated_price: item.estimated_price || null,
          initial_contact_date: item.initial_contact_date || null,
          start_date: item.start_date || null,
          estimated_completion_date: item.estimated_completion_date || null,
        }));
        
        return {
          clients: processedData,
          totalCount: count
        };
      } catch (error: any) {
        console.error('Error in useClientsList:', error);
        
        // If the error is about missing columns, we'll try a fallback query with only existing columns
        if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
          console.log("Missing columns detected, using fallback query");
          
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
              `)
              .order('updated_at', { ascending: false });
            
            if (statusFilter !== 'all') {
              fallbackQuery = fallbackQuery.eq('status', statusFilter);
            }
            
            if (searchQuery) {
              fallbackQuery = fallbackQuery.or(`profiles.full_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%`);
            }
            
            const fallbackCountResult = await fallbackQuery.count();
            const fallbackCount = fallbackCountResult.count || 0;
            
            const { data: fallbackData } = await fallbackQuery.range(from, to);
            
            if (fallbackData && fallbackData.length > 0) {
              const fallbackProcessedData = fallbackData.map((item) => ({
                id: item.id,
                status: item.status,
                current_step: item.current_step,
                total_steps: item.total_steps,
                completed_steps: item.completed_steps || [],
                created_at: item.created_at,
                updated_at: item.updated_at,
                full_name: safePropertyAccess(item.profiles, 'full_name', 'Unknown'),
                email: safePropertyAccess(item.profiles, 'email', null),
                business_name: safePropertyAccess(item.profiles, 'business_name', null),
                avatar_url: safePropertyAccess(item.profiles, 'avatar_url', null),
                phone: safePropertyAccess(item.profiles, 'phone', null),
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
              } as ClientData));
              
              return {
                clients: fallbackProcessedData,
                totalCount: fallbackCount
              };
            }
          } catch (fallbackError) {
            console.error('Error in fallback query:', fallbackError);
          }
        }
        
        // If all else fails, return empty array
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
