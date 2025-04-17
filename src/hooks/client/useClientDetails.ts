
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientData, TodoItem } from '@/types/client.types';
import { processClientData } from '@/utils/clientQueryBuilders';
import { safeSupabase } from '@/utils/supabaseHelpers';

export const useClientDetails = (clientId: string | null) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client-details', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      try {
        const { data, error } = await safeSupabase
          .from('client_onboarding')
          .select('*')
          .eq('id', clientId)
          .single();
        
        if (error) {
          console.error('Error fetching client details:', error);
          throw error;
        }
        
        if (!data) {
          return null;
        }
        
        // Process the client data
        const [processedClient] = processClientData([data]);
        return processedClient;
        
      } catch (error: any) {
        console.error('Error in useClientDetails:', error);
        throw error; // Let the error propagate for better debugging
      }
    },
    enabled: !!clientId,
    retry: 1 // Only retry once to avoid excessive requests
  });
  
  const updateClientMutation = useMutation({
    mutationFn: async (updateData: Partial<ClientData>) => {
      if (!clientId) throw new Error('No client ID provided');
      
      const { data, error } = await safeSupabase
        .from('client_onboarding')
        .update({ 
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the client details query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['client-details', clientId] });
    }
  });
  
  const updateTodosMutation = useMutation({
    mutationFn: async (todos: TodoItem[]) => {
      if (!clientId) throw new Error('No client ID provided');
      
      const { data, error } = await safeSupabase
        .from('client_onboarding')
        .update({ 
          todos,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the client details query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['client-details', clientId] });
    }
  });
  
  return {
    client: data as ClientData | null,
    isLoading,
    error,
    refetch,
    updateClient: updateClientMutation.mutate,
    updateTodos: updateTodosMutation.mutate,
    isUpdating: updateClientMutation.isPending || updateTodosMutation.isPending
  };
};
