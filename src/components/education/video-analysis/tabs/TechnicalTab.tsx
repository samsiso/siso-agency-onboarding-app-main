
import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Code2, CheckCircle } from 'lucide-react';

interface TechnicalTabProps {
  analysis: VideoAnalysis;
  onTimeClick: (timestamp: string) => void;
}

export function TechnicalTab({ analysis, onTimeClick }: TechnicalTabProps) {
  return (
    <div className="space-y-6">
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
                      onClick={() => onTimeClick(segment.timestamp)}
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
    </div>
  );
}
