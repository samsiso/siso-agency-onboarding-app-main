
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectsEmptyState } from '@/components/projects/ProjectsEmptyState';

interface Plan {
  id: string;
  app_name: string;
  company_name: string | null;
  username: string;
  estimated_cost: number;
  estimated_days: number;
  features: string[];
  status: string;
  created_at: string;
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  
  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        if (!user) return;
        
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error fetching projects',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, [user, toast]);
  
  const filteredProjects = projects.filter(project => 
    project.app_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateNew = () => {
    navigate('/plan-builder');
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-siso-text" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-black/30 border-siso-text/10 focus-visible:ring-siso-orange/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-black/30 border border-siso-text/10 rounded-lg p-6 h-32" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectsEmptyState onCreateNew={handleCreateNew} />
      )}
    </div>
  );
}
