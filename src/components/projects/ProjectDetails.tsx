
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ListTodo, Timeline, Wallet, FileText, LayoutDashboard, Palette } from 'lucide-react';
import { ProjectHeader } from './details/ProjectHeader';
import { ProjectStatsCards } from './details/ProjectStatsCards';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { ProjectTimeline } from './details/ProjectTimeline';
import { FinancialSummarySection } from './details/FinancialSummarySection';
import { FeatureRequestsSection } from './details/FeatureRequestsSection';
import { WireframeSection } from './details/WireframeSection';
import { ColorPickerSection } from './details/ColorPickerSection';
import { useParams } from 'react-router-dom';

export function ProjectDetails() {
  const { id } = useParams();
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
      <ProjectHeader 
        name={project.name}
        description={project.description}
        status={project.status}
        created_at={project.created_at}
      />
      
      <ProjectStatsCards />
      
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="active-tasks" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Active Tasks</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ActiveTasksSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="timeline" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <Timeline className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Project Timeline</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ProjectTimeline />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="financial" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Financial Summary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <FinancialSummarySection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Feature Requests</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <FeatureRequestsSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="wireframe" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Wireframe Elements</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <WireframeSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className="border-0">
          <AccordionTrigger className="bg-black/30 hover:bg-black/40 rounded-lg px-6 py-4 transition-all">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#9b87f5]" />
              <span className="font-semibold">Color Pickers</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <ColorPickerSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
