
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Component, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectDirectoryCard } from '@/components/projects/ProjectDirectoryCard';
import { ActiveTasksView } from '@/components/projects/ActiveTasksView';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const demoProjects = [
  {
    id: '1',
    name: 'Ubahcryp',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=ubahcryp&backgroundColor=0ea5e9',
  }
];

export default function ProjectsAndTasksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const isTasksView = location.pathname === '/projects/tasks';

  const handleCreateNew = () => {
    navigate('/plan-builder');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/home" 
                className="inline-flex items-center gap-1.5 text-siso-text hover:text-white"
              >
                <Home size={16} strokeWidth={2} aria-hidden="true" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/projects" 
                className="inline-flex items-center gap-1.5 text-siso-text hover:text-white"
              >
                <Component size={16} strokeWidth={2} aria-hidden="true" />
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            {(isTasksView || selectedProject) && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">
                    {isTasksView ? "Active Tasks" : "Project Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
              {isTasksView ? "Active Tasks" : "Projects & Tasks"}
            </h1>
            <p className="text-siso-text">
              {isTasksView 
                ? "View and manage tasks across all your projects"
                : "Manage your application projects and related tasks in one place"
              }
            </p>
          </div>
          
          {!isTasksView && (
            <Button 
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 flex items-center gap-2 mt-4 md:mt-0"
            >
              <PlusCircle size={16} />
              New Project
            </Button>
          )}
        </div>

        {isTasksView ? (
          <ActiveTasksView />
        ) : (
          <div className="space-y-8">
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

            <div className="text-center p-8 bg-black/30 border border-siso-text/10 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Discover More Projects
              </h3>
              <p className="text-siso-text mb-4">
                Explore other successful projects in our community leaderboard
              </p>
              <Button
                onClick={() => navigate('/leaderboard')}
                variant="outline"
                className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
