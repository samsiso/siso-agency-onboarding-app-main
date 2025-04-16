
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InstagramLead {
  id: string;
  username: string;
  followers_count: number | null;
  following_count: number | null;
  posts_count: number | null;
  full_name: string | null;
  status: string | null;
  created_at: string;
  profile_url: string | null;
  bio: string | null;
}

export const useInstagramLeads = (limit: number = 10) => {
  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['instagram-leads', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as InstagramLead[];
    },
  });

  return { leads, isLoading, error, refetch };
};
