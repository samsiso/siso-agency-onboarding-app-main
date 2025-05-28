import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface ProjectTask {
  title: string;
  due_date: string;
}

interface EnhancedProject extends Plan {
  completion_percentage: number;
  due_date: string;
  tasks: ProjectTask[];
  logo?: string;
}

export function ProjectsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Hardcoded UbahCrypt project
  const ubahCryptProject: EnhancedProject = {
    id: "ubah-123",
    app_name: "UbahCrypt",
    company_name: "SISO AGENCY",
    username: "admin",
    estimated_cost: 12500,
    estimated_days: 45,
    features: ["Crypto Exchange", "NFT Marketplace", "Token Management", "Wallet Integration"],
    status: "in_progress",
    created_at: new Date().toISOString(),
    completion_percentage: 65,
    due_date: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    tasks: [
      {
        title: "Review Smart Contract",
        due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      },
      {
        title: "Approve UI Designs",
        due_date: new Date().toISOString(), // Today
      },
      {
        title: "Test Token Distribution",
        due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      }
    ],
    logo: "/images/siso-logo.svg"
  };
  
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
        
        // Simulate loading
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error fetching projects',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    }
    
    fetchProjects();
  }, [user, toast]);

  const handleCreateNew = () => {
    navigate('/projects/new');
  };
  
  const showProject = !searchQuery || 
    ubahCryptProject.app_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ubahCryptProject.company_name && ubahCryptProject.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-siso-text" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-black/30 border-siso-text/10 focus-visible:ring-siso-orange/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleCreateNew} 
          className="bg-siso-orange hover:bg-siso-orange/80 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse bg-black/30 border border-siso-text/10 rounded-lg p-6 h-64" />
        </div>
      ) : !showProject ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-siso-text mb-6">Try a different search term or create a new project.</p>
          <Button 
            onClick={handleCreateNew} 
            className="bg-siso-orange hover:bg-siso-orange/80 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <ProjectCard key={ubahCryptProject.id} project={ubahCryptProject} />
          
          <div className="mt-8 border-t border-siso-text/10 pt-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Ready to build something new?</h3>
              <p className="text-siso-text mb-6 max-w-md mx-auto">
                Create a new project and our SISO Assistant will help you bring your ideas to life.
              </p>
              <Button 
                onClick={handleCreateNew} 
                className="bg-siso-orange hover:bg-siso-orange/80 text-white"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
