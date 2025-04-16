
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  email: string;
  business_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: string;
  current_step: number;
  total_steps: number;
  completed_steps: string[];
  created_at: string;
  updated_at: string;
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
        query = query.or(`profiles.full_name.ilike.%${searchQuery}%,profiles.email.ilike.%${searchQuery}%`);
      }
      
      // First get count of all matching records
      const { count, error: countError } = await query.count();
      
      if (countError) {
        console.error('Error fetching clients count:', countError);
        throw countError;
      }
      
      // Then fetch the page of data
      const { data, error: dataError } = await query
        .range(from, to);
      
      if (dataError) {
        console.error('Error fetching clients data:', dataError);
        throw dataError;
      }
      
      // Process and flatten the data structure
      const processedData = data.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        status: item.status,
        current_step: item.current_step,
        total_steps: item.total_steps,
        completed_steps: item.completed_steps || [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        full_name: item.profiles?.full_name || 'Unknown',
        email: item.profiles?.email || null,
        business_name: item.profiles?.business_name || null,
        avatar_url: item.profiles?.avatar_url || null,
        phone: item.profiles?.phone || null,
      }));
      
      return {
        clients: processedData,
        totalCount: count || 0
      };
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
