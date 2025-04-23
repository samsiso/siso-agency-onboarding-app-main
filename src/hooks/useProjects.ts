
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  status: string;
  created_at: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      // Transform plans into Project format
      const projects = plans.map(plan => ({
        id: plan.id,
        name: plan.app_name || '',
        description: plan.description,
        logo: plan.logo,
        status: plan.status || 'pending',
        created_at: plan.created_at
      }));

      return projects;
    }
  });
}
