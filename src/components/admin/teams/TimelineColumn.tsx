
import React from 'react';
import { Task } from '@/types/task.types';
import { format } from 'date-fns';
import { TaskCard } from './TaskCard';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TimelineColumn({ tasks }: { tasks: Task[] }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const { currentTime, timelineRef, getCurrentWindow } = useTimeWindow();
  const { handleDrop, handleDragOver, isDragging } = useTaskDragDrop();

  const { windowStart, windowEnd } = getCurrentWindow();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  // Safely format the time, with a fallback if date is invalid
  const currentTimeString = (() => {
    try {
      return format(currentTime, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  })();

  const scrollUp = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: -80, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: 80, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[600px] flex">
      {/* Time ruler */}
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

      {/* Scroll buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 top-2 z-20"
        onClick={scrollUp}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 bottom-2 z-20"
        onClick={scrollDown}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Tasks container */}
      <div 
        ref={timelineRef}
        className="ml-16 relative flex-1 overflow-y-auto hide-scrollbar"
        style={{
          height: '600px',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Current time indicator */}
        {currentTime && !isNaN(currentTime.getTime()) && (
          <div 
            className="absolute left-0 right-0 flex items-center gap-2 z-10 transition-all duration-1000"
            style={{
              top: `${((currentHour * 60 + currentMinute) / (24 * 60)) * (24 * 80)}px`,
            }}
          >
            <div className="border-t-2 border-red-500 flex-1" />
            <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
            <div className="absolute -left-20 -top-3 flex items-center gap-1 text-xs font-medium text-red-500">
              <Clock className="h-3 w-3" />
              {currentTimeString}
            </div>
          </div>
        )}

        {/* Visible window indicator */}
        <div 
          className="absolute left-0 right-0 bg-purple-50/5 border-y border-purple-500/20"
          style={{
            top: `${(windowStart / 24) * (24 * 80)}px`,
            height: `${((windowEnd - windowStart) / 24) * (24 * 80)}px`,
          }}
        />

        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            currentHour={currentHour}
          />
        ))}
      </div>
    </div>
  );
}
