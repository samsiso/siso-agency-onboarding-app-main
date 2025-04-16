
import { useQuery } from '@tanstack/react-query';
import { ClientData } from '@/types/client.types';
import { processClientData } from '@/utils/clientQueryBuilders';
import { safeSupabase } from '@/utils/supabaseHelpers';

export const useClientDetails = (clientId: string | null) => {
  const { data, isLoading, error } = useQuery({
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
        return null;
      }
    },
    enabled: !!clientId
  });
  
  return {
    client: data as ClientData | null,
    isLoading,
    error
  };
};
