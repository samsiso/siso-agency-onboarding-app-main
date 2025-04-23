
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
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('Fetching Ubahcrypt project data for user:', user.id);
      
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('app_name', 'Ubahcrypt')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error fetching project',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Raw plan data:', plans);

      // Transform plans into Project format
      const projects = plans.map(plan => ({
        id: plan.id,
        name: plan.app_name || 'Unnamed Project',
        description: plan.description || 'Building a secure and innovative cryptocurrency platform',
        logo: plan.logo,
        status: plan.status || 'pending',
        created_at: plan.created_at
      }));

      console.log('Transformed project:', projects);
      return projects;
    },
    enabled: !!user
  });
}
