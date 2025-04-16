
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
          // Instead of trying to access properties on an error object,
          // return a fallback object that matches the expected structure
          return getFallbackClientData(clientId);
        }
        
        // Only process data if it exists and is not an error
        if (data && !('code' in data)) {
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
        return getFallbackClientData(clientId);
      } catch (error: any) {
        console.error('Error in useClientDetails:', error);
        // Return fallback object for any errors
        return getFallbackClientData(clientId);
      }
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};

// Helper function to create a fallback client data object
function getFallbackClientData(clientId: string): ClientData {
  try {
    // For critical errors, try to get just the basic profile data
    // This is a fallback query that might work even if the main one fails
    return supabase
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
          phone
        )
      `)
      .eq('id', clientId)
      .single()
      .then(({ data }) => {
        if (data) {
          const profileData = data.profiles || {};
          
          return {
            id: data.id || clientId,
            status: data.status || 'pending',
            current_step: data.current_step || 1,
            total_steps: data.total_steps || 5,
            completed_steps: Array.isArray(data.completed_steps) ? data.completed_steps : [],
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            full_name: profileData?.full_name || 'Unknown',
            email: profileData?.email || null,
            business_name: profileData?.business_name || null,
            avatar_url: profileData?.avatar_url || null,
            phone: profileData?.phone || null,
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
        
        // Return a minimal fallback object if nothing else works
        return createDefaultClientData(clientId);
      })
      .catch(() => {
        // Return default client data if even the fallback query fails
        return createDefaultClientData(clientId);
      });
  } catch {
    // Return default client data if anything goes wrong
    return createDefaultClientData(clientId);
  }
}

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
