
import React from 'react';
import { cn } from '@/lib/utils';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';

interface TimelineRulerProps {
  currentHour: number;
}

export function TimelineRuler({ currentHour }: TimelineRulerProps) {
  const { handleDrop, handleDragOver, isDragging } = useTaskDragDrop();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200 bg-background z-10">
      {timeSlots.map((hour) => (
        <div
          key={hour}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, hour)}
          className={cn(
            "h-20 flex items-center justify-center text-sm transition-colors relative",
            hour === currentHour && "bg-purple-100/10 font-bold",
            isDragging && "hover:bg-purple-100/5"
          )}
        >
          {`${hour.toString().padStart(2, '0')}:00`}
        </div>
      ))}
    </div>
  );
}
