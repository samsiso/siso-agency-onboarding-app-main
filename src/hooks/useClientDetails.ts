
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
          status: safePropertyAccess(data, 'status', 'pending'),
          current_step: safePropertyAccess(data, 'current_step', 1),
          total_steps: safePropertyAccess(data, 'total_steps', 5),
          completed_steps: Array.isArray(safePropertyAccess(data, 'completed_steps', [])) 
            ? safePropertyAccess(data, 'completed_steps', []) 
            : [],
          created_at: safePropertyAccess(data, 'created_at', new Date().toISOString()),
          updated_at: safePropertyAccess(data, 'updated_at', new Date().toISOString()),
          full_name: safePropertyAccess(data.profiles, 'full_name', 'Unknown'),
          email: safePropertyAccess(data.profiles, 'email', null),
          business_name: safePropertyAccess(data.profiles, 'business_name', null),
          avatar_url: safePropertyAccess(data.profiles, 'avatar_url', null),
          phone: safePropertyAccess(data.profiles, 'phone', null),
          // Additional fields for the detailed view
          website_url: safePropertyAccess(data.profiles, 'website_url', null),
          professional_role: safePropertyAccess(data.profiles, 'professional_role', null),
          bio: safePropertyAccess(data.profiles, 'bio', null),
          // New fields - safely access or provide defaults
          project_name: safePropertyAccess(data, 'project_name', null),
          company_niche: safePropertyAccess(data, 'company_niche', null),
          development_url: safePropertyAccess(data, 'development_url', null),
          mvp_build_status: safePropertyAccess(data, 'mvp_build_status', null),
          notion_plan_url: safePropertyAccess(data, 'notion_plan_url', null),
          payment_status: safePropertyAccess(data, 'payment_status', null),
          estimated_price: safePropertyAccess(data, 'estimated_price', null),
          initial_contact_date: safePropertyAccess(data, 'initial_contact_date', null),
          start_date: safePropertyAccess(data, 'start_date', null),
          estimated_completion_date: safePropertyAccess(data, 'estimated_completion_date', null),
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
          const { data: basicData, error: basicError } = await supabase
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
            
          if (basicError) {
            console.error('Error fetching fallback data:', basicError);
            return fallbackClient;
          }

          if (basicData) {
            // Return data with only the columns that exist
            return {
              ...fallbackClient,
              id: safePropertyAccess(basicData, 'id', clientId),
              status: safePropertyAccess(basicData, 'status', 'pending'),
              current_step: safePropertyAccess(basicData, 'current_step', 1),
              total_steps: safePropertyAccess(basicData, 'total_steps', 5),
              completed_steps: Array.isArray(safePropertyAccess(basicData, 'completed_steps', [])) 
                ? safePropertyAccess(basicData, 'completed_steps', []) 
                : [],
              created_at: safePropertyAccess(basicData, 'created_at', new Date().toISOString()),
              updated_at: safePropertyAccess(basicData, 'updated_at', new Date().toISOString()),
              full_name: safePropertyAccess(basicData, 'profiles.full_name', 'Unknown'),
              email: safePropertyAccess(basicData, 'profiles.email', null),
              business_name: safePropertyAccess(basicData, 'profiles.business_name', null),
              avatar_url: safePropertyAccess(basicData, 'profiles.avatar_url', null),
              phone: safePropertyAccess(basicData, 'profiles.phone', null),
              website_url: safePropertyAccess(basicData, 'profiles.website_url', null),
              professional_role: safePropertyAccess(basicData, 'profiles.professional_role', null),
              bio: safePropertyAccess(basicData, 'profiles.bio', null),
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
