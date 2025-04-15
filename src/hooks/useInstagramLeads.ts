
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type InstagramLead = {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_private?: boolean;
  is_verified?: boolean;
  profile_url?: string;
  status: 'new' | 'contacted' | 'responded' | 'qualified' | 'converted' | 'rejected';
};

export const useInstagramLeads = () => {
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['instagram-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch Instagram leads');
        throw error;
      }

      return data as InstagramLead[];
    },
  });

  const addLead = useMutation({
    mutationFn: async (newLead: Pick<InstagramLead, 'username'>) => {
      const { data, error } = await supabase
        .from('instagram_leads')
        .insert([{ username: newLead.username }])
        .select()
        .single();

      if (error) {
        toast.error('Failed to add Instagram lead');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagram-leads'] });
      toast.success('Instagram lead added successfully');
    },
  });

  return {
    leads,
    isLoading,
    addLead,
  };
};
