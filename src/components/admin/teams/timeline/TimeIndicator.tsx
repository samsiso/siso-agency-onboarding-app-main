
import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TimeIndicatorProps {
  currentTime: Date;
  position: number;
}

export function TimeIndicator({ currentTime, position }: TimeIndicatorProps) {
  const currentTimeString = format(currentTime, 'HH:mm');

  return (
    <div 
      className="absolute left-0 right-0 flex items-center gap-2 z-10 transition-all duration-1000"
      style={{ top: `${position}px` }}
    >
      <div className="border-t-2 border-red-500 flex-1" />
      <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
      <div className="absolute -left-20 -top-3 flex items-center gap-1 text-xs font-medium text-red-500">
        <Clock className="h-3 w-3" />
        {currentTimeString}
      </div>
    </div>
  );
}
