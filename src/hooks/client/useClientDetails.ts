
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientData } from '@/types/client.types';
import { createDefaultClientData, processClientDetail } from '@/utils/clientDataProcessors';

export const useClientDetails = (clientId: string) => {
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client-details', clientId],
    queryFn: async () => {
      try {
        // Fetch client data
        const { data, error } = await supabase
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
              phone,
              website_url,
              professional_role,
              bio
            )
          `)
          .eq('id', clientId)
          .single();
        
        // If there's an error, log it and return the default client data
        if (error) {
          console.error('Error fetching client details:', error);
          return createDefaultClientData(clientId);
        }
        
        // Only proceed if data exists and is not an error
        if (data) {
          return processClientDetail(data, clientId);
        }
        
        // If we get here, either there was an error or data is invalid
        return createDefaultClientData(clientId);
      } catch (error: any) {
        console.error('Error in useClientDetails:', error);
        // Return fallback object for any errors
        return createDefaultClientData(clientId);
      }
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};
