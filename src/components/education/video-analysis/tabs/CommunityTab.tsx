
import { VideoAnalysis } from '../types/analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface CommunityTabProps {
  analysis: VideoAnalysis;
  onTimeClick: (timestamp: string) => void;
}

export function CommunityTab({ analysis, onTimeClick }: CommunityTabProps) {
  return (
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
                      onClick={() => onTimeClick(insight.timestamp!)}
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
  );
}
