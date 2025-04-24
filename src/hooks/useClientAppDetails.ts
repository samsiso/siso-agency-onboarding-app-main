
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlanData, PlanDataType } from '@/hooks/usePlanData';
import { useClientDetails } from '@/hooks/client/useClientDetails';
import { ClientData } from '@/types/client.types';

interface ClientAppDetailsResult {
  appData: PlanDataType | null;
  clientData: ClientData | null;
  loading: boolean;
  error: Error | null;
}

export function useClientAppDetails(clientId?: string | null): ClientAppDetailsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  
  // Use existing hooks to fetch data
  const { clientData, loading: clientLoading } = useClientDetails(clientId);
  const { planData, loading: planLoading, error: planError } = usePlanData(username);

  // Find the username from client data for plans lookup
  useEffect(() => {
    const fetchUsername = async () => {
      if (!clientId) return;
      
      try {
        // Try to find a corresponding plan by looking up the client ID
        const { data, error } = await supabase
          .from('client_user_links')
          .select('user_id')
          .eq('client_id', clientId)
          .single();
          
        if (error) {
          console.error('Error fetching user link:', error);
          return;
        }
        
        if (data?.user_id) {
          // Now get the profile for this user
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user_id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Use client business name as username for plan lookup
          if (clientData?.business_name) {
            // Convert business name to lowercase and remove spaces for username format
            const formattedUsername = clientData.business_name.toLowerCase().replace(/\s+/g, '-');
            setUsername(formattedUsername);
          } else {
            // Fallback to a default
            setUsername('client-app');
          }
        }
      } catch (err) {
        console.error('Error in fetchUsername:', err);
        // Convert string error to Error object
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    if (clientData && !username) {
      fetchUsername();
    }
  }, [clientId, clientData, username]);

  // Combine loading states
  useEffect(() => {
    setLoading(clientLoading || planLoading || !username);
    
    if (planError) {
      setError(planError);
    }
  }, [clientLoading, planLoading, username, planError]);

  return {
    appData: planData,
    clientData,
    loading,
    error
  };
}
