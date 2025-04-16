
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user has the admin role
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      return !!data;
    },
    // Cache the result for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  return { isAdmin: !!isAdmin, isLoading };
};
