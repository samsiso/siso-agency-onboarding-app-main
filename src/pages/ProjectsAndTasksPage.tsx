
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectDirectoryCard } from '@/components/projects/ProjectDirectoryCard';
import { ActiveTasksView } from '@/components/projects/ActiveTasksView';

const demoProjects = [
  {
    id: '1',
    name: 'Food Delivery App',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=1',
  },
  {
    id: '2',
    name: 'E-commerce Platform',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=2',
  }
];

export default function ProjectsAndTasksPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleCreateNew = () => {
    navigate('/plan-builder');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
              Projects & Tasks
            </h1>
            <p className="text-siso-text">
              Manage your application projects and related tasks in one place
            </p>
          </div>
          
          <Button 
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 flex items-center gap-2 mt-4 md:mt-0"
          >
            <PlusCircle size={16} />
            New Project
          </Button>
        </div>

        {selectedProject ? (
          <ActiveTasksView />
        ) : (
          <Card className="p-6 bg-black/30 border border-siso-text/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoProjects.map(project => (
                <ProjectDirectoryCard
                  key={project.id}
                  name={project.name}
                  logo={project.logo}
                  onSelect={() => setSelectedProject(project.id)}
                />
              ))}
              <ProjectDirectoryCard />
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
