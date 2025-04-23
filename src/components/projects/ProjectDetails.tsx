import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatters';
import { Bitcoin, Code, Server, GitBranch, FileText, Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timeline } from '@/components/ui/timeline';
import { KanbanProvider } from '@/components/ui/kanban';
import { TasksList } from '@/components/projects/TasksList';

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
      {/* Project Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-4 ring-[#9b87f5]/20">
          <Bitcoin size={64} className="text-white" />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-siso-text">
                Created on {formatDate(project.created_at || '', 'long')}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-base px-4 py-1 bg-[#9b87f5]/20 text-[#9b87f5]"
            >
              {project.status}
            </Badge>
          </div>
          
          {project.description && (
            <p className="text-siso-text text-lg leading-relaxed max-w-3xl mb-6">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-8">
            {/* Development Progress Section */}
            <Card className="p-8 bg-black/30 border-siso-text/10">
              <h2 className="text-2xl font-semibold mb-6">Development Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-siso-text">
                    <Code size={20} />
                    <span className="text-lg">Smart Contract</span>
                  </div>
                  <Progress value={80} className="h-3" indicatorClassName="bg-[#9b87f5]" />
                  <p className="text-sm text-siso-text">Contract development and testing</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-siso-text">
                    <Server size={20} />
                    <span className="text-lg">Backend Integration</span>
                  </div>
                  <Progress value={65} className="h-3" indicatorClassName="bg-[#9b87f5]" />
                  <p className="text-sm text-siso-text">API and service integration</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-siso-text">
                    <GitBranch size={20} />
                    <span className="text-lg">Testing & Validation</span>
                  </div>
                  <Progress value={45} className="h-3" indicatorClassName="bg-[#9b87f5]" />
                  <p className="text-sm text-siso-text">Security and performance testing</p>
                </div>
              </div>
            </Card>

            {/* Project Documentation */}
            <Card className="p-8 bg-black/30 border-siso-text/10">
              <h2 className="text-2xl font-semibold mb-6">Project Documentation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Technical Resources</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>Smart Contract Specification</span>
                    </li>
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>API Documentation</span>
                    </li>
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>Development Guidelines</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Project Resources</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>Wireframes</span>
                    </li>
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>Design Assets</span>
                    </li>
                    <li className="flex items-center gap-2 text-siso-text">
                      <FileText className="h-4 w-4" />
                      <span>Architecture Diagrams</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <Timeline data={milestones} />
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <TasksList />
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="p-8 bg-black/30 border-siso-text/10">
            <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Designer",
                  role: "UI/UX Designer",
                  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SD"
                },
                {
                  name: "John Developer",
                  role: "Smart Contract Developer",
                  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD"
                },
                {
                  name: "Mike Writer",
                  role: "Technical Writer",
                  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MW"
                }
              ].map((member) => (
                <Card key={member.name} className="p-6 bg-black/20 border-siso-text/10">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-white">{member.name}</h3>
                      <p className="text-sm text-siso-text">{member.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          variant="outline"
          className="border-[#9b87f5]/30 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        >
          View Documentation
        </Button>
        <Button 
          className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:opacity-90"
        >
          Project Dashboard
        </Button>
      </div>
    </div>
  );
}
