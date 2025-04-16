
import { useQuery } from '@tanstack/react-query';
import { checkIsAdmin } from '@/utils/supabaseHelpers';

export const useAdminCheck = () => {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      return await checkIsAdmin();
    },
    // Cache the result for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  return { isAdmin: !!isAdmin, isLoading };
};
