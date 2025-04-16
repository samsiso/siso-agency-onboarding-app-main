
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientData } from './useClientsList';
import { safePropertyAccess } from '@/utils/errorSuppressions';

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
            phone,
            website_url,
            professional_role,
            bio
          )
        `)
        .eq('id', clientId)
        .single();
      
      if (error) {
        console.error('Error fetching client details:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Client not found');
      }
      
      // Process the data to get a flattened structure
      const clientData: ClientData = {
        id: data.id,
        status: data.status,
        current_step: data.current_step,
        total_steps: data.total_steps,
        completed_steps: data.completed_steps || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        full_name: safePropertyAccess(data.profiles, 'full_name', 'Unknown'),
        email: safePropertyAccess(data.profiles, 'email', null),
        business_name: safePropertyAccess(data.profiles, 'business_name', null),
        avatar_url: safePropertyAccess(data.profiles, 'avatar_url', null),
        phone: safePropertyAccess(data.profiles, 'phone', null),
        // Additional fields for the detailed view
        website_url: safePropertyAccess(data.profiles, 'website_url', null),
        professional_role: safePropertyAccess(data.profiles, 'professional_role', null),
        bio: safePropertyAccess(data.profiles, 'bio', null),
        // New fields
        project_name: data.project_name || null,
        company_niche: data.company_niche || null,
        development_url: data.development_url || null,
        mvp_build_status: data.mvp_build_status || null,
        notion_plan_url: data.notion_plan_url || null,
        payment_status: data.payment_status || null,
        estimated_price: data.estimated_price || null,
        initial_contact_date: data.initial_contact_date || null,
        start_date: data.start_date || null,
        estimated_completion_date: data.estimated_completion_date || null,
      };
      
      return clientData;
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};
