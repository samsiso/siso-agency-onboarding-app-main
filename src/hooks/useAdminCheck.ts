
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkIsAdmin } from '@/utils/supabaseHelpers';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const [isAuthStateReady, setIsAuthStateReady] = useState(false);
  const authStateSubscription = useRef<{ unsubscribe: () => void } | null>(null);

  // Setup auth state change listener
  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(() => {
      setIsAuthStateReady(true);
    });

    // Setup listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setIsAuthStateReady(true);
    });

    authStateSubscription.current = subscription;

    return () => {
      if (authStateSubscription.current) {
        authStateSubscription.current.unsubscribe();
      }
    };
  }, []);

  // Only run the query when auth state is ready
  const { data: isAdmin, isLoading, refetch } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      console.log('Executing admin check query function');
      return await checkIsAdmin();
    },
    // Don't run until auth state is ready
    enabled: isAuthStateReady,
    // Cache the result for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Retry failed checks 
    retry: 2,
    // Handle errors using meta for latest @tanstack/react-query version
    meta: {
      errorHandler: (error: Error) => {
        console.error('Admin check query error:', error);
      }
    }
  });

  // Force refetch on specific events or conditions
  const forceRefresh = () => {
    refetch();
  };

  return { 
    isAdmin: !!isAdmin, 
    isLoading: !isAuthStateReady || isLoading,
    refreshAdminStatus: forceRefresh
  };
};
