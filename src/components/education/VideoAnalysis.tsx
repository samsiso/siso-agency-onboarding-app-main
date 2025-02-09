
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoAnalysis as VideoAnalysisType } from './types/analysis';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

// Import tab components
import { OverviewTab } from './video-analysis/tabs/OverviewTab';
import { TimelineTab } from './video-analysis/tabs/TimelineTab';
import { TechnicalTab } from './video-analysis/tabs/TechnicalTab';
import { LearningTab } from './video-analysis/tabs/LearningTab';
import { ResourcesTab } from './video-analysis/tabs/ResourcesTab';
import { PracticeTab } from './video-analysis/tabs/PracticeTab';
import { CommunityTab } from './video-analysis/tabs/CommunityTab';
import { VisualTab } from './video-analysis/tabs/VisualTab';

interface VideoAnalysisProps {
  videoId: string;
}

export function VideoAnalysis({ videoId }: VideoAnalysisProps) {
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['video-analysis', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_analysis')
        .select('*')
        .eq('video_id', videoId)
        .maybeSingle();
      
      if (error) throw error;
      return data as VideoAnalysisType;
    },
  });

  const handleTimeClick = (timestamp: string) => {
    setSelectedTimestamp(timestamp);
    // This will be implemented to jump to specific timestamps in the video
    console.log('Jumping to timestamp:', timestamp);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Card className="p-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6">
        <Card className="p-6">
          <p className="text-gray-500">AI analysis will be available for this video soon.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab analysis={analysis} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <TimelineTab 
            analysis={analysis}
            selectedTimestamp={selectedTimestamp}
            onTimeClick={handleTimeClick}
          />
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <TechnicalTab analysis={analysis} onTimeClick={handleTimeClick} />
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <LearningTab analysis={analysis} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourcesTab analysis={analysis} />
        </TabsContent>

        <TabsContent value="practice" className="mt-6">
          <PracticeTab analysis={analysis} />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <CommunityTab analysis={analysis} onTimeClick={handleTimeClick} />
        </TabsContent>

        <TabsContent value="visual" className="mt-6">
          <VisualTab analysis={analysis} onTimeClick={handleTimeClick} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
