
import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';

interface VisualTabProps {
  analysis: VideoAnalysis;
  onTimeClick: (timestamp: string) => void;
}

export function VisualTab({ analysis, onTimeClick }: VisualTabProps) {
  return (
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
                onClick={() => onTimeClick(aid.timestamp)}
              >
                Jump to
              </Button>
            </div>
            <p className="text-sm text-gray-600">{aid.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
