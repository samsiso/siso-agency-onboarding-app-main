
import { Helmet } from 'react-helmet';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { TimelineSection } from '@/components/projects/details/TimelineSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Project Timeline | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-black/30 border-siso-text/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-6 w-6 text-purple-400" />
              <CardTitle className="text-2xl font-semibold">Project Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Track your project's progress with key milestones, deliverables, and deadlines.
            </p>
          </CardContent>
        </Card>
        
        <TimelineSection />
      </div>
    </DashboardLayout>
  );
}
