
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
      } catch (error: any) {
        console.error('Error in useClientDetails:', error);
        
        // If the error is about missing columns, we'll return a default object
        if (error.message && error.message.includes("column") && error.message.includes("does not exist")) {
          console.log("Missing columns detected, returning fallback data");
          
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
                id: basicData.id,
                status: basicData.status,
                current_step: basicData.current_step,
                total_steps: basicData.total_steps,
                completed_steps: basicData.completed_steps || [],
                created_at: basicData.created_at,
                updated_at: basicData.updated_at,
                full_name: safePropertyAccess(basicData.profiles, 'full_name', 'Unknown'),
                email: safePropertyAccess(basicData.profiles, 'email', null),
                business_name: safePropertyAccess(basicData.profiles, 'business_name', null),
                avatar_url: safePropertyAccess(basicData.profiles, 'avatar_url', null),
                phone: safePropertyAccess(basicData.profiles, 'phone', null),
                website_url: safePropertyAccess(basicData.profiles, 'website_url', null),
                professional_role: safePropertyAccess(basicData.profiles, 'professional_role', null),
                bio: safePropertyAccess(basicData.profiles, 'bio', null),
                // Default values for new fields
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
              } as ClientData;
            }
          } catch (fallbackError) {
            console.error('Error fetching fallback data:', fallbackError);
          }
          
          // If we can't get the basic data either, return a default object
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
          } as ClientData;
        }
        
        // For other errors, rethrow
        throw error;
      }
    },
    enabled: !!clientId,
  });

  return { client, isLoading, error };
};
