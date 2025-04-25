
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProjectHeader } from './details/ProjectHeader';
import { ProjectCardNavigation } from './details/ProjectCardNavigation';
import { ProjectStatsCards } from './details/ProjectStatsCards';
import { ProjectOverviewCards } from './details/ProjectOverviewCards';
import { DevelopmentProgress } from './details/DevelopmentProgress';
import { ProjectActions } from './details/ProjectActions';
import { TeamSection } from './details/TeamSection';
import { WireframeSection } from './details/WireframeSection';
import { ColorPickerSection } from './details/ColorPickerSection';
import { FinancialSummarySection } from './details/FinancialSummarySection';
import { FeatureRequestsSection } from './details/FeatureRequestsSection';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { ResearchSection } from './details/ResearchSection';
import { AppPlanSection } from './details/AppPlanSection';
import { APIsSection } from './details/APIsSection';
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { TimelineSection } from './details/TimelineSection';

export function ProjectDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProjects();
  const [tasksViewMode, setTasksViewMode] = useState<"table" | "cards">("cards");

  // Get the current tab from the URL
  const currentTab = location.pathname.split('/').pop() || 'overview';
  
  // Redirect to overview tab if on base URL
  useEffect(() => {
    if (location.pathname === `/projects/${id}`) {
      navigate(`/projects/${id}/overview`, { replace: true });
    }
  }, [location.pathname, id, navigate]);

  const teamMembers = [
    {
      name: "Sarah Designer",
      role: "UI/UX Designer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SD",
      status: "active"
    },
    {
      name: "John Developer",
      role: "Smart Contract Developer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
      status: "offline"
    },
    {
      name: "Mike Writer",
      role: "Technical Writer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MW",
      status: "away"
    }
  ] as const;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground">The requested project could not be found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <ProjectHeader 
        name={project.name}
        description={project.description}
        status={project.status}
        created_at={project.created_at}
      />

      <ProjectCardNavigation projectId={id || ''} />
      
      <Tabs value={currentTab} className="w-full">
        <TabsContent value="overview">
          <div className="space-y-8">
            <ProjectStatsCards />
            <ProjectOverviewCards projectId={id || ''} />
            <DevelopmentProgress />
            <ProjectActions />
          </div>
        </TabsContent>

        <TabsContent value="app-plan">
          <AppPlanSection />
        </TabsContent>

        <TabsContent value="features">
          <FeatureRequestsSection />
        </TabsContent>

        <TabsContent value="active-tasks">
          <ActiveTasksSection />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineSection />
        </TabsContent>

        <TabsContent value="wireframe">
          <WireframeSection />
        </TabsContent>

        <TabsContent value="colors">
          <ColorPickerSection />
        </TabsContent>

        <TabsContent value="apis">
          <APIsSection />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialSummarySection />
        </TabsContent>

        <TabsContent value="research">
          <ResearchSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
