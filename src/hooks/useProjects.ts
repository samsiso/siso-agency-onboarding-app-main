
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';

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
  const { user } = useAuthSession();

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('Fetching projects data');
      
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*');

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error fetching projects',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      if (!plans || plans.length === 0) {
        console.log('No projects found');
        return null;
      }

      console.log('Raw plans data:', plans);

      // Transform plans into Project format
      const projects = plans.map(plan => ({
        id: plan.id,
        name: plan.app_name || 'Unnamed Project',
        description: plan.description || '',
        logo: plan.logo,
        status: plan.status || 'pending',
        created_at: plan.created_at
      }));

      console.log('Transformed projects:', projects);
      return projects[0]; // For now, return the first project
    },
    enabled: !!user
  });
}
