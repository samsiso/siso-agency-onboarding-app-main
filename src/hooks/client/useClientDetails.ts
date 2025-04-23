
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsClient } from './useIsClient';
import { ClientData } from '@/types/client.types';

/**
 * Hook to fetch client details for the current user
 */
export function useClientDetails() {
  const { isClient, clientId, loading: clientCheckLoading } = useIsClient();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!isClient || !clientId) {
        setClientData(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch client details from the client_onboarding table
        const { data, error } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('id', clientId)
          .single();

        if (error) {
          console.error('Error fetching client data:', error);
          setError(new Error(error.message));
          setClientData(null);
        } else {
          setClientData(data as ClientData);
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching client data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setClientData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!clientCheckLoading) {
      fetchClientData();
    }
  }, [isClient, clientId, clientCheckLoading]);

  return {
    clientData,
    loading: loading || clientCheckLoading,
    error
  };
}
