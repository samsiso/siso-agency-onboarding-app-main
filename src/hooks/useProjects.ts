
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  status: string;
  created_at: string;
}

export function useProjects() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects data...');
      
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error fetching projects',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Raw plans data:', plans);

      // Transform plans into Project format
      const projects = plans.map(plan => {
        return {
          id: plan.id,
          name: plan.app_name || 'Unnamed Project',
          description: plan.description || 'No description available',
          logo: plan.logo,
          status: plan.status || 'pending',
          created_at: plan.created_at
        };
      });

      console.log('Transformed projects:', projects);
      return projects;
    }
  });
}
