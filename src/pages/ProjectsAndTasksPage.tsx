
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Component, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectDirectoryCard } from '@/components/projects/ProjectDirectoryCard';
import { ActiveTasksView } from '@/components/projects/ActiveTasksView';
import { useProjects } from '@/hooks/useProjects';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';

export default function ProjectsAndTasksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { data: projects, isLoading, error } = useProjects();
  
  const isTasksView = location.pathname === '/projects/tasks';

  const handleCreateNew = () => {
    navigate('/plan-builder');
  };

  if (error) {
    toast({
      title: "Error loading projects",
      description: "There was a problem loading your projects. Please try again.",
      variant: "destructive"
    });
  }

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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 animate-pulse bg-black/20 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects?.map(project => (
                    <ProjectDirectoryCard
                      key={project.id}
                      name={project.name}
                      logo={project.logo}
                      description={project.description}
                      onSelect={() => navigate(`/plan/${project.id}`)}
                    />
                  ))}
                  <ProjectDirectoryCard />
                </div>
              )}
            </Card>

            <div className="text-center p-8 bg-black/30 border border-siso-text/10 rounded-lg animate-fade-in">
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
