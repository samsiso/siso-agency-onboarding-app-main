
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { safeSupabase, safeCast } from '@/utils/supabaseHelpers';

interface VideoAnalysisProps {
  videoId: string;
}

export function VideoAnalysis({ videoId }: VideoAnalysisProps) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['video-analysis', videoId],
    queryFn: async () => {
      const { data, error } = await safeSupabase
        .from('video_summaries')
        .select('*')
        .eq('video_id', videoId)
        .maybeSingle();
      
      if (error) throw error;
      return safeCast(data);
    },
  });

  if (isLoading) {
    return <div>Loading analysis...</div>;
  }

  if (!analysis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="text-siso-text">No analysis available for this video yet.</p>
        </Card>
      </div>
    );
  }

  // Safely access key_points with optional chaining
  const keyPoints = analysis?.key_points || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-siso-text-bold">Sentiment Analysis</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Sentiment</span>
            <span>85%</span>
          </div>
          <Progress value={85} />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-siso-text-bold">Content Breakdown</h3>
        <div className="space-y-4">
          {keyPoints.map((point: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-siso-orange">{index + 1}.</span>
              <p className="text-sm text-siso-text">{point}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
