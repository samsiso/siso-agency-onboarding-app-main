import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Timeline } from '@/components/ui/timeline';
import { KanbanProvider } from '@/components/ui/kanban';
import { TasksList } from '@/components/projects/TasksList';
import { ProjectHeader } from './details/ProjectHeader';
import { DevelopmentProgress } from './details/DevelopmentProgress';
import { ProjectActions } from './details/ProjectActions';
import { ProjectNavigation } from './details/ProjectNavigation';
import { ProjectStatsCards } from './details/ProjectStatsCards';
import { PriorityTasksSection } from './details/PriorityTasksSection';
import { ViewModeSwitcher } from '@/components/admin/clients/ViewModeSwitcher';
import { useState } from 'react';
import { Pill, PillAvatar, PillAvatarGroup, PillIndicator } from '@/components/ui/pill';

interface ProjectDetailsProps {
  projectId?: string;
}

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

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { data: project, isLoading } = useProjects();
  const [tasksViewMode, setTasksViewMode] = useState<"table" | "cards">("cards");

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
  ];

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

      <ProjectStatsCards />
      
      <PriorityTasksSection />

      <Tabs defaultValue="overview" className="w-full">
        <ProjectNavigation />

        <TabsContent value="overview">
          <div className="space-y-8">
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
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold">Project Tasks</h2>
              <ViewModeSwitcher viewMode={tasksViewMode} setViewMode={setTasksViewMode} />
            </div>
            <TasksList viewMode={tasksViewMode} />
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
              
              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-siso-text/10">
                    <div className="flex items-center gap-4">
                      <PillAvatar
                        src={member.avatar}
                        fallback={member.name.split(' ').map(n => n[0]).join('')}
                        className="h-10 w-10"
                      />
                      <div>
                        <h3 className="font-medium text-white">{member.name}</h3>
                        <p className="text-sm text-siso-text">{member.role}</p>
                      </div>
                    </div>
                    
                    <Pill variant="secondary" className="bg-black/30">
                      <PillIndicator 
                        variant={member.status === 'active' ? 'success' : member.status === 'away' ? 'warning' : 'error'} 
                        pulse={member.status === 'active'}
                      />
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Pill>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Pill className="bg-black/30">
                  <PillAvatarGroup>
                    {teamMembers.map((member) => (
                      <PillAvatar
                        key={member.name}
                        src={member.avatar}
                        fallback={member.name.split(' ').map(n => n[0]).join('')}
                      />
                    ))}
                  </PillAvatarGroup>
                  {teamMembers.length} Active Team Members
                </Pill>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
