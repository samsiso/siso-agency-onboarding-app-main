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
  ExternalLink,
  Brain,
  Activity,
  Users,
  Lightbulb,
  Layout,
  BookmarkPlus
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
    setSelectedTimestamp(timestamp);
    // This will be implemented to jump to specific timestamps in the video
    console.log('Jumping to timestamp:', timestamp);
  };

  const TimelineMarker = ({ timestamp, type, isActive }: { timestamp: string; type: string; isActive: boolean }) => (
    <button
      onClick={() => handleTimeClick(timestamp)}
      className={cn(
        "h-4 w-4 rounded-full border-2",
        isActive ? "bg-primary border-primary" : "bg-background border-muted-foreground",
        "hover:border-primary transition-colors"
      )}
      title={`${type} at ${timestamp}`}
    />
  );

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

        <TabsContent value="timeline" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Content Timeline</h3>
            </div>
            <div className="relative">
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2" />
              <div className="relative flex justify-between items-center">
                {analysis.content_timeline.map((item, index) => (
                  <TimelineMarker
                    key={index}
                    timestamp={item.timestamp}
                    type={item.type}
                    isActive={item.timestamp === selectedTimestamp}
                  />
                ))}
              </div>
            </div>
            <ScrollArea className="h-[400px] mt-6">
              <div className="space-y-4">
                {analysis.content_timeline.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg transition-colors",
                      item.timestamp === selectedTimestamp ? "bg-primary/5" : "bg-gray-50"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTimeClick(item.timestamp)}
                      >
                        {item.timestamp}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
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

            {analysis.code_quality_metrics && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Code Quality Insights</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Quality</span>
                      <span>{analysis.code_quality_metrics.overall_score}%</span>
                    </div>
                    <Progress value={analysis.code_quality_metrics.overall_score} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Best Practices</h4>
                    <ul className="space-y-2">
                      {analysis.code_quality_metrics.best_practices.map((practice, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
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

        <TabsContent value="practice" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Practice Exercises</h3>
            </div>
            <div className="space-y-4">
              {analysis.practice_exercises.map((exercise, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">{exercise.title}</h4>
                      <span className="text-sm text-gray-500">{exercise.type} • {exercise.difficulty}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Start Exercise
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Community Insights</h3>
            </div>
            <div className="space-y-4">
              {analysis.community_insights.map((insight, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{insight.type}</span>
                        {insight.timestamp && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTimeClick(insight.timestamp!)}
                          >
                            {insight.timestamp}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{insight.content}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button variant="ghost" size="sm">
                        ▲
                      </Button>
                      <span className="text-sm font-medium">{insight.votes}</span>
                      <Button variant="ghost" size="sm">
                        ▼
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Visual Elements</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {analysis.visual_aids.map((aid, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  {aid.preview_url && (
                    <div className="mb-3 rounded overflow-hidden">
                      <img
                        src={aid.preview_url}
                        alt={aid.description}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
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
