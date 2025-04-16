
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
        
        // If there's an error, log it and return the default client data
        if (error) {
          console.error('Error fetching client details:', error);
          return createDefaultClientData(clientId);
        }
        
        // Only proceed if data exists and is not an error
        if (data) {
          // Safely extract profile data with a default empty object
          const profileData = data.profiles || {};
          
          // Safely process the data to get a flattened structure
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
            full_name: safePropertyAccess(profileData, 'full_name', 'Unknown'),
            email: safePropertyAccess(profileData, 'email', null),
            business_name: safePropertyAccess(profileData, 'business_name', null),
            avatar_url: safePropertyAccess(profileData, 'avatar_url', null),
            phone: safePropertyAccess(profileData, 'phone', null),
            // Additional fields for the detailed view
            website_url: safePropertyAccess(profileData, 'website_url', null),
            professional_role: safePropertyAccess(profileData, 'professional_role', null),
            bio: safePropertyAccess(profileData, 'bio', null),
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

// Helper function to create a default client data object with minimal required fields
function createDefaultClientData(clientId: string): ClientData {
  return {
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
}
