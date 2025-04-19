
import React from 'react';
import { cn } from '@/lib/utils';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimelineRulerProps {
  currentHour: number;
}

export function TimelineRuler({ currentHour }: TimelineRulerProps) {
  const { handleDrop, handleDragOver, isDragging } = useTaskDragDrop();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const isMobile = useIsMobile();
  const hourHeight = isMobile ? 60 : 80;

  const handleTimeSlotDrop = (e: React.DragEvent, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + (hour * hourHeight);
    handleDrop(e, offsetY);
  };

  // For touch devices, add a higher touch target area
  const touchAreaStyles = isMobile ? {
    position: 'relative' as const,
    zIndex: 20
  } : {};

  return (
    <div 
      className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 border-r border-gray-200 bg-background/80 backdrop-blur z-10"
      style={touchAreaStyles}
    >
      <div className={`h-[1440px] sm:h-[1920px]`}>
        {timeSlots.map((hour) => (
          <div
            key={hour}
            onDragOver={handleDragOver}
            onDrop={(e) => handleTimeSlotDrop(e, hour)}
            className={cn(
              "flex items-center justify-center text-xs sm:text-sm transition-colors relative",
              hour === currentHour && "bg-purple-100/10 font-bold",
              isDragging && "hover:bg-purple-100/5"
            )}
            style={{
              height: `${hourHeight}px`,
              touchAction: 'manipulation'
            }}
          >
            {`${hour.toString().padStart(2, '0')}:00`}
            {isDragging && (
              <div className="absolute inset-0 border-2 border-purple-500/20 border-dashed pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
