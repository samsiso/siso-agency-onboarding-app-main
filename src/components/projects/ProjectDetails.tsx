
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Timeline } from '@/components/ui/timeline';
import { ProjectHeader } from './details/ProjectHeader';
import { DevelopmentProgress } from './details/DevelopmentProgress';
import { ProjectActions } from './details/ProjectActions';
import { ProjectStatsCards } from './details/ProjectStatsCards';
import { PriorityTasksSection } from './details/PriorityTasksSection';
import { TeamSection } from './details/TeamSection';
import { ProjectCardNavigation } from './details/ProjectCardNavigation';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { FinancialSummarySection } from './details/FinancialSummarySection';
import { FeatureRequestsSection } from './details/FeatureRequestsSection';
import { WireframeSection } from './details/WireframeSection';
import { ColorPickerSection } from './details/ColorPickerSection';
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const milestones = [
  {
    title: "Project Initialization",
    content: (
      <div className="bg-black/20 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Initial Setup & Planning</h3>
        <ul className="list-disc list-inside space-y-2 text-siso-text">
          <li>Project requirements gathering</li>
          <li>Technical architecture design</li>
          <li>Development environment setup</li>
          <li>Team roles assignment</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Smart Contract Development",
    content: (
      <div className="bg-black/20 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Core Contract Features</h3>
        <ul className="list-disc list-inside space-y-2 text-siso-text">
          <li>Token contract implementation</li>
          <li>Security measures integration</li>
          <li>Testing framework setup</li>
          <li>Audit preparation</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Frontend Development",
    content: (
      <div className="bg-black/20 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">User Interface</h3>
        <ul className="list-disc list-inside space-y-2 text-siso-text">
          <li>Wallet integration</li>
          <li>Transaction interface</li>
          <li>Dashboard development</li>
          <li>Analytics visualization</li>
        </ul>
      </div>
    ),
  },
];

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
            <PriorityTasksSection />
            <DevelopmentProgress />
            <ProjectActions />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <Timeline data={milestones} />
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="space-y-8">
            <ActiveTasksSection />
            <FinancialSummarySection />
            <FeatureRequestsSection />
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-8">
            <TeamSection teamMembers={teamMembers} />
            <WireframeSection />
            <ColorPickerSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
