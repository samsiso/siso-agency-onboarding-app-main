import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineTabProps {
  analysis: VideoAnalysis;
  selectedTimestamp: string | null;
  onTimeClick: (timestamp: string) => void;
}

interface TimelineMarkerProps {
  timestamp: string;
  type: string;
  isActive: boolean;
}

const TimelineMarker = ({ timestamp, type, isActive }: TimelineMarkerProps) => (
  <button
    onClick={() => {}}
    className={cn(
      "h-4 w-4 rounded-full border-2",
      isActive ? "bg-primary border-primary" : "bg-background border-muted-foreground",
      "hover:border-primary transition-colors"
    )}
    title={`${type} at ${timestamp}`}
  />
);

export function TimelineTab({ analysis, selectedTimestamp, onTimeClick }: TimelineTabProps) {
  return (
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
                  onClick={() => onTimeClick(item.timestamp)}
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
  );
}
