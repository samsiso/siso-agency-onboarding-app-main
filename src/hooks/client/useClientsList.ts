
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientData, ClientsListParams, ClientsListResponse, TodoItem } from '@/types/client.types';
import { useAdminCheck } from '@/hooks/useAdminCheck';

/**
 * Hook to fetch a list of all clients (admin only)
 */
export function useClientsList(params: ClientsListParams = {}): ClientsListResponse & { 
  isLoading: boolean;
  refetch: () => Promise<void>;
} {
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

  const fetchClients = async (): Promise<void> => {
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
      
      if (statusFilter && statusFilter !== 'all') {
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
        // Process data to match ClientData type
        const processedClients: ClientData[] = data.map(item => {
          // Parse todos if they exist
          let parsedTodos: TodoItem[] = [];
          if (item.todos) {
            try {
              // Ensure todos is properly formatted as TodoItem[]
              parsedTodos = Array.isArray(item.todos) 
                ? item.todos.map((todo: any) => ({
                    id: todo.id || crypto.randomUUID(),
                    text: todo.text || '',
                    completed: Boolean(todo.completed),
                    priority: todo.priority || 'medium',
                    due_date: todo.due_date,
                    related_to: todo.related_to,
                    assigned_to: todo.assigned_to,
                  }))
                : [];
            } catch (err) {
              console.warn('Error parsing todos for client:', item.id, err);
              parsedTodos = [];
            }
          }

          // Cast the database result to ClientData with proper type mapping
          return {
            id: item.id,
            full_name: item.contact_name || 'Unknown',
            email: null,
            business_name: item.company_name || null,
            phone: null,
            avatar_url: null,
            status: item.status,
            current_step: item.current_step,
            total_steps: item.total_steps,
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
            initial_contact_date: null,
            start_date: null,
            estimated_completion_date: null,
            todos: parsedTodos,
            next_steps: null,
            key_research: null,
            priority: null
          } as ClientData;
        });

        setClients(processedClients);
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

  useEffect(() => {
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
    isLoading: loading || adminCheckLoading,
    error,
    refetch: fetchClients
  };
}
