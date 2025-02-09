
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoAnalysis as VideoAnalysisType } from './types/analysis';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Code2, 
  BookOpen, 
  Link2, 
  BarChart3, 
  Play,
  CheckCircle,
  BookMarked,
  ExternalLink
} from 'lucide-react';

interface VideoAnalysisProps {
  videoId: string;
}

export function VideoAnalysis({ videoId }: VideoAnalysisProps) {
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

  const handleTimeClick = (timestamp: string) => {
    // This will be implemented to jump to specific timestamps in the video
    console.log('Jumping to timestamp:', timestamp);
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="chapters" className="hidden lg:block">Chapters</TabsTrigger>
          <TabsTrigger value="visual" className="hidden lg:block">Visual Aids</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Estimated Time</h3>
            </div>
            <p className="text-2xl font-bold mb-2">{analysis.estimated_completion_time} minutes</p>
            <p className="text-sm text-gray-500">Recommended viewing time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Complexity Analysis</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Technical Complexity</span>
                  <span>{Math.round(analysis.complexity_score * 100)}%</span>
                </div>
                <Progress value={analysis.complexity_score * 100} />
              </div>
              <p className="text-sm text-gray-500">Difficulty Level: {analysis.difficulty_level}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Technologies & Prerequisites</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Technologies Mentioned</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologies_mentioned.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <ul className="space-y-2">
                  {analysis.prerequisites.map((prereq) => (
                    <li key={prereq} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {analysis.code_segments.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Code Segments</h3>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {analysis.code_segments.map((segment, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{segment.language}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTimeClick(segment.timestamp)}
                        >
                          {segment.timestamp}
                        </Button>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code>{segment.snippet_preview}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Learning Outcomes</h3>
            </div>
            <ul className="space-y-3">
              {analysis.learning_outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Key Concepts</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.key_concepts.map((concept, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {concept}
                </span>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">External Resources</h3>
            </div>
            <div className="space-y-4">
              {analysis.external_resources.map((resource, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{resource.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Video Chapters</h3>
            </div>
            <div className="space-y-4">
              {analysis.chapters.map((chapter, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{chapter.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTimeClick(chapter.timestamp)}
                    >
                      {chapter.timestamp}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{chapter.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Visual Elements</h3>
            </div>
            <div className="space-y-4">
              {analysis.visual_aids.map((aid, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{aid.type}</span>
                      <span className="text-sm text-gray-500">({aid.timestamp})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTimeClick(aid.timestamp)}
                    >
                      Jump to
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{aid.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
