
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientData } from './useClientsList';

export const useClientDetails = (clientId: string) => {
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client-details', clientId],
    queryFn: async () => {
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
      
      if (error) throw error;
      
      // Process the data to get a flattened structure
      const clientData: ClientData = {
        id: data.id,
        user_id: data.user_id,
        status: data.status,
        current_step: data.current_step,
        total_steps: data.total_steps,
        completed_steps: data.completed_steps || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        full_name: data.profiles?.full_name || 'Unknown',
        email: data.profiles?.email || null,
        business_name: data.profiles?.business_name || null,
        avatar_url: data.profiles?.avatar_url || null,
        phone: data.profiles?.phone || null,
        // Add these additional fields for the detailed view
        website_url: data.profiles?.website_url || null,
        professional_role: data.profiles?.professional_role || null,
        bio: data.profiles?.bio || null,
      };
      
      return clientData;
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};
