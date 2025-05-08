
import { Helmet } from 'react-helmet';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { TimelineSection } from '@/components/projects/details/TimelineSection';
import { TimelineHeader } from '@/components/projects/details/timeline/TimelineHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Project Timeline | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-semibold text-white">Project Timeline</h1>
          </div>
        </div>
        
        <TimelineHeader />
        <TimelineSection />
      </div>
    </DashboardLayout>
  );
}
