
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientData, ClientsListParams, ClientsListResponse } from '@/types/client.types';
import { useAdminCheck } from '@/hooks/useAdminCheck';

/**
 * Hook to fetch a list of all clients (admin only)
 */
export function useClientsList(params: ClientsListParams = {}) {
  const { isAdmin, isLoading: adminCheckLoading } = useAdminCheck();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    searchQuery = '',
    statusFilter = '',
    sortColumn = 'updated_at',
    sortDirection = 'desc',
    page = 1,
    pageSize = 10
  } = params;

  useEffect(() => {
    const fetchClients = async () => {
      if (!isAdmin) {
        setClients([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from('client_onboarding')
          .select('*', { count: 'exact' });
        
        // Apply filters
        if (searchQuery) {
          query = query.or(`company_name.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%`);
        }
        
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // Apply sorting and pagination
        query = query
          .order(sortColumn, { ascending: sortDirection === 'asc' })
          .range(from, to);
        
        const { data, error, count } = await query;
        
        if (error) {
          console.error('Error fetching clients:', error);
          setError(new Error(error.message));
          setClients([]);
          setTotalCount(0);
        } else {
          setClients(data as ClientData[]);
          setTotalCount(count || 0);
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching clients:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setClients([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (!adminCheckLoading) {
      fetchClients();
    }
  }, [
    isAdmin, 
    adminCheckLoading, 
    searchQuery, 
    statusFilter, 
    sortColumn, 
    sortDirection, 
    page, 
    pageSize
  ]);

  return {
    clients,
    totalCount,
    loading: loading || adminCheckLoading,
    error
  } as ClientsListResponse;
}
