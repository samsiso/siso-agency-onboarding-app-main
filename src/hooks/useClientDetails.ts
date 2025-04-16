
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientData } from './useClientsList';
import { safePropertyAccess } from '@/utils/errorSuppressions';

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
        
        // Safely process the data to get a flattened structure
        // Using default values for all fields to handle missing columns
        const clientData: ClientData = {
          id: data.id || clientId,
          status: data.status || 'pending',
          current_step: data.current_step || 1,
          total_steps: data.total_steps || 5,
          completed_steps: Array.isArray(data.completed_steps) ? data.completed_steps : [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          full_name: data.profiles?.full_name || 'Unknown',
          email: data.profiles?.email || null,
          business_name: data.profiles?.business_name || null,
          avatar_url: data.profiles?.avatar_url || null,
          phone: data.profiles?.phone || null,
          // Additional fields for the detailed view
          website_url: data.profiles?.website_url || null,
          professional_role: data.profiles?.professional_role || null,
          bio: data.profiles?.bio || null,
          // New fields - safely access or provide defaults
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
      } catch (error: any) {
        console.error('Error in useClientDetails:', error);
        
        // Provide a fallback object regardless of error type
        // This ensures the UI won't break even if the columns don't exist yet
        const fallbackClient: ClientData = {
          id: clientId,
          status: 'pending',
          current_step: 1,
          total_steps: 5,
          completed_steps: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          full_name: 'Unknown',
          email: null,
          business_name: null,
          avatar_url: null,
          phone: null,
          website_url: null,
          professional_role: null,
          bio: null,
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
        
        // Try to get basic data if possible
        try {
          const { data: basicData } = await supabase
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
            
          if (basicData) {
            // Return data with only the columns that exist
            return {
              ...fallbackClient,
              id: basicData.id || clientId,
              status: basicData.status || 'pending',
              current_step: basicData.current_step || 1,
              total_steps: basicData.total_steps || 5,
              completed_steps: Array.isArray(basicData.completed_steps) ? basicData.completed_steps : [],
              created_at: basicData.created_at || new Date().toISOString(),
              updated_at: basicData.updated_at || new Date().toISOString(),
              full_name: basicData.profiles?.full_name || 'Unknown',
              email: basicData.profiles?.email || null,
              business_name: basicData.profiles?.business_name || null,
              avatar_url: basicData.profiles?.avatar_url || null,
              phone: basicData.profiles?.phone || null,
              website_url: basicData.profiles?.website_url || null,
              professional_role: basicData.profiles?.professional_role || null,
              bio: basicData.profiles?.bio || null,
            };
          }
        } catch (fallbackError) {
          console.error('Error fetching fallback data:', fallbackError);
        }
        
        return fallbackClient;
      }
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};
