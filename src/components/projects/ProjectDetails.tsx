
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatters';
import { Bitcoin, Code, Server, GitBranch } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProjectDetailsProps {
  projectId?: string;
}

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

      {/* Development Progress */}
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
