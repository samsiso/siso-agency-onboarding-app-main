
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

interface AddLeadPayload {
  username: string;
}

export const useInstagramLeads = (limit: number = 10) => {
  const queryClient = useQueryClient();
  
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

  const addLead = useMutation({
    mutationFn: async (payload: AddLeadPayload) => {
      const { data, error } = await supabase
        .from('instagram_leads')
        .insert([{ username: payload.username, status: 'new' }])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['instagram-leads'] });
    },
  });

  return { leads, isLoading, error, refetch, addLead };
};
