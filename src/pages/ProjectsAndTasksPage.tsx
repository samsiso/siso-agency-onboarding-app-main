import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Component, ExternalLink, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectDirectoryCard } from '@/components/projects/ProjectDirectoryCard';
import { ActiveTasksView } from '@/components/projects/ActiveTasksView';
import { useProjects } from '@/hooks/useProjects';
import { useAuthSession } from '@/hooks/useAuthSession';
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
  const { user, loading: authLoading } = useAuthSession();
  const { data: projects, isLoading, error, refetch } = useProjects();
  
  const isTasksView = location.pathname === '/projects/tasks';

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No authenticated user, redirecting to auth');
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your projects",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const handleCreateNew = () => {
    navigate('/plan-builder');
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </AppLayout>
    );
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
            {(isTasksView) && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">
                    Active Tasks
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
              {isTasksView ? "Active Tasks" : "Project Overview"}
            </h1>
            <p className="text-siso-text">
              {isTasksView 
                ? "View and manage tasks across your project"
                : "Manage your Ubahcrypt blockchain application development"
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
                <div className="animate-pulse space-y-8">
                  <div className="h-64 bg-black/20 rounded-lg" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-siso-orange mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Failed to Load Project
                  </h3>
                  <p className="text-siso-text mb-4 max-w-md">
                    {error instanceof Error ? error.message : 'There was an error loading your project'}
                  </p>
                  <Button 
                    onClick={() => refetch()}
                    className="bg-siso-orange hover:bg-siso-orange/80"
                  >
                    Retry
                  </Button>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-6">
                  <ProjectDirectoryCard
                    key={projects[0].id}
                    name={projects[0].name}
                    logo={projects[0].logo}
                    description={projects[0].description}
                    created_at={projects[0].created_at}
                    status={projects[0].status}
                    onSelect={() => navigate(`/plan/${projects[0].id}`)}
                  />
                </div>
              ) : (
                <div>
                  <ProjectDirectoryCard />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
