
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimelineGridProps {
  hourHeight: number;
}

export function TimelineGrid({ hourHeight }: TimelineGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isMobile = useIsMobile();

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ 
        height: hourHeight * 24,
      }}
    >
      {hours.map(hour => (
        <div 
          key={hour}
          className={cn(
            "absolute left-0 right-0 border-t border-gray-200/30",
            hour % 4 === 0 ? "border-gray-200/50" : "border-gray-200/30"
          )}
          style={{ 
            top: `${hour * hourHeight}px`,
            height: `${hourHeight}px`,
          }}
        >
          {/* Quarter-hour markers */}
          {[1, 2, 3].map(quarter => (
            <div 
              key={quarter}
              className="absolute left-0 right-0 border-t border-dashed border-gray-200/20"
              style={{ top: `${(hourHeight / 4) * quarter}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
