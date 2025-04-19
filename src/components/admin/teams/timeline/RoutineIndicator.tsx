
import React from 'react';
import { Coffee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RoutineIndicatorProps {
  type: 'morning' | 'evening';
  position: number;
  status: 'pending' | 'completed';
  shouldShow: boolean;
  onClick: () => void;
}

export function RoutineIndicator({ type, position, status, shouldShow, onClick }: RoutineIndicatorProps) {
  const isMorning = type === 'morning';
  
  return (
    <div 
      className={cn(
        "absolute left-0 right-0 flex items-center gap-2 z-10",
        status === 'completed' ? "opacity-30" : "opacity-100"
      )}
      style={{ top: `${position}px` }}
    >
      <div className={cn(
        "border-t-2 border-dashed flex-1",
        isMorning ? "border-green-500" : "border-purple-500"
      )} />
      <Button 
        variant="outline" 
        size="sm"
        className={cn(
          "absolute right-2 -top-3",
          isMorning 
            ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
            : "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100",
          shouldShow ? "animate-pulse" : ""
        )}
        onClick={onClick}
      >
        {isMorning ? (
          <Coffee className="h-4 w-4 mr-1" />
        ) : (
          <Sparkles className="h-4 w-4 mr-1" />
        )}
        {isMorning 
          ? status === 'completed' ? "Morning Routine Done" : "Start Morning Routine"
          : status === 'completed' ? "Checked Out" : "Check Out"
        }
      </Button>
    </div>
  );
}
